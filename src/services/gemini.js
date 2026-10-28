import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackEventPlan } from './fallbackPlan';
import { sanitizePromptInput, isValidPlanStructure } from '../utils/sanitizers';

/**
 * Access Gemini API Key from Vite environment variables.
 * Never hardcode secrets in source code.
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Builds the comprehensive structured prompt for the Gemini 1.5 model.
 * All inputs are strictly sanitized to prevent prompt injection or JSON format corruption.
 *
 * @param {Object} params - User constraints
 * @returns {string} Prompt string
 */
function buildGeminiPrompt(params) {
  const safeEventType = sanitizePromptInput(params.eventType, 50) || 'Celebration';
  const safeCurrency = sanitizePromptInput(params.currency, 10) || 'USD';
  const safeLocation = sanitizePromptInput(params.locationType, 80) || 'Indoor / Flexible';
  const safeDate = sanitizePromptInput(params.targetDate, 30) || 'Upcoming in 3 months';
  const safeExperience = sanitizePromptInput(params.desiredExperience, 80) || 'Intimate & Heartfelt';
  const safeTheme = sanitizePromptInput(params.theme, 120) || 'Elegant and memorable';
  const safeNotes = sanitizePromptInput(params.notes, 300) || 'None';
  const safeGuests = Math.max(1, Math.min(100000, Number(params.guestCount) || 50));
  const safeBudget = Math.max(100, Number(params.budget) || 5000);

  const safeMustHaves = Array.isArray(params.mustHaves)
    ? params.mustHaves.map((m) => sanitizePromptInput(m, 50)).join(', ')
    : 'Professional Photography';

  const safeAccessibility = Array.isArray(params.accessibility)
    ? params.accessibility.map((a) => sanitizePromptInput(a, 50)).join(', ')
    : 'Wheelchair / Step-Free Access';

  const safeCultural = Array.isArray(params.culturalPreferences)
    ? params.culturalPreferences.map((c) => sanitizePromptInput(c, 50)).join(', ')
    : 'Traditional Ceremonial Rituals';

  return `Generate a comprehensive, structured event plan with the following constraints:
- Event Type: ${safeEventType}
- Total Budget: ${safeBudget} ${safeCurrency}
- Guest Count: ${safeGuests} guests
- Location Type: ${safeLocation}
- Target Date: ${safeDate}
- Desired Experience & Atmosphere: ${safeExperience}
- Theme / Preferences: ${safeTheme}
- Non-Negotiable Must-Haves: ${safeMustHaves}
- Accessibility & Dietary Needs: ${safeAccessibility}
- Cultural Customs: ${safeCultural}
- Special Notes: ${safeNotes}

The JSON output MUST adhere strictly to this schema:
{
  "summary": {
    "title": "Descriptive Event Name",
    "eventType": "${safeEventType}",
    "theme": "Creative theme summary",
    "description": "2-3 sentence evocative event vision",
    "estimatedGuests": ${safeGuests},
    "locationType": "${safeLocation}",
    "colorPalette": ["#Hex1", "#Hex2", "#Hex3", "#Hex4"]
  },
  "budget": {
    "totalBudget": ${safeBudget},
    "currency": "${safeCurrency}",
    "allocations": [
      {
        "category": "Venue & Facilities",
        "allocatedAmount": 0,
        "percentage": 30,
        "notes": "Specific recommendations"
      },
      {
        "category": "Catering & Beverages",
        "allocatedAmount": 0,
        "percentage": 35,
        "notes": "Food and beverage guidance"
      },
      {
        "category": "Decor & Ambiance",
        "allocatedAmount": 0,
        "percentage": 15,
        "notes": "Floral, lighting, and stage setup"
      },
      {
        "category": "Entertainment & Photography",
        "allocatedAmount": 0,
        "percentage": 12,
        "notes": "DJ/Band, photographer, audio/visual"
      },
      {
        "category": "Logistics & Contingency",
        "allocatedAmount": 0,
        "percentage": 8,
        "notes": "Invitations, favors, emergency fund"
      }
    ]
  },
  "timeline": {
    "phases": [
      {
        "phaseName": "Phase 1: Concept & Booking (2-3 Months Out)",
        "targetPeriod": "Weeks 1-4",
        "milestones": [
          { "title": "Milestone title", "description": "Details", "dueTime": "Week 2" }
        ]
      },
      {
        "phaseName": "Phase 2: Vendor Finalization (1 Month Out)",
        "targetPeriod": "Weeks 5-8",
        "milestones": [
          { "title": "Milestone title", "description": "Details", "dueTime": "Week 6" }
        ]
      },
      {
        "phaseName": "Phase 3: Final Countdown & Day-Of",
        "targetPeriod": "Event Week",
        "milestones": [
          { "title": "Milestone title", "description": "Details", "dueTime": "Event Day" }
        ]
      }
    ]
  },
  "checklist": [
    {
      "id": "task-1",
      "task": "Task description",
      "category": "Venue",
      "priority": "High",
      "estimatedCost": 0,
      "status": "To Do"
    }
  ],
  "creativeIdeas": {
    "themeSuggestions": ["Idea 1", "Idea 2"],
    "decorIdeas": ["Decor 1", "Decor 2"],
    "invitationPhrasing": ["Formal line", "Casual line"],
    "entertainmentSuggestions": ["Activity 1", "Activity 2"]
  }
}`;
}

/**
 * Generates an end-to-end event plan using Google Gemini API with structured JSON output.
 * If the API key is not provided, the request fails, or the response structure is invalid,
 * it seamlessly falls back to deterministic blueprint data.
 *
 * @param {Object} params - Event specifications
 * @returns {Promise<Object>} Structured event plan object
 */
export async function generateEventPlan(params) {
  if (!API_KEY || !genAI) {
    console.warn('VITE_GEMINI_API_KEY is not configured. Utilizing high-fidelity fallback event plan.');
    return getFallbackEventPlan(params);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
      systemInstruction: `You are EventCraft AI, an expert event planner and financial coordinator.
Produce a comprehensive, tailored event plan conforming strictly to the required JSON schema.
Ensure all budget numbers are realistic and sum up accurately to the total budget provided.
Ensure timelines are logical and checklist items actionable. Output pure JSON only.`,
    });

    const prompt = buildGeminiPrompt(params);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean possible markdown code fences if present
    const cleanedText = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsedPlan = JSON.parse(cleanedText);

    if (!isValidPlanStructure(parsedPlan)) {
      console.warn('Gemini response failed structural verification; falling back to resilient blueprint.');
      return getFallbackEventPlan(params);
    }

    return parsedPlan;
  } catch (error) {
    console.error('Gemini API execution error, switching to fallback state:', error);
    return getFallbackEventPlan(params);
  }
}

// Re-export fallback generator for standalone and test usage
export { getFallbackEventPlan };
