import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackEventPlan } from './fallbackPlan';

/**
 * Access Gemini API Key from Vite environment variables.
 * Never hardcode secrets in source code.
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Builds the comprehensive structured prompt for the Gemini 1.5 model.
 *
 * @param {Object} params - User constraints
 * @returns {string} Prompt string
 */
function buildGeminiPrompt(params) {
  return `Generate a comprehensive, structured event plan with the following constraints:
- Event Type: ${params.eventType || 'Celebration'}
- Total Budget: ${params.budget || 5000} ${params.currency || 'USD'}
- Guest Count: ${params.guestCount || 50} guests
- Location Type: ${params.locationType || 'Indoor / Flexible'}
- Target Date: ${params.targetDate || 'Upcoming in 3 months'}
- Desired Experience & Atmosphere: ${params.desiredExperience || 'Intimate & Heartfelt'}
- Theme / Preferences: ${params.theme || 'Elegant and memorable'}
- Non-Negotiable Must-Haves: ${Array.isArray(params.mustHaves) ? params.mustHaves.join(', ') : 'Professional Photography'}
- Accessibility & Dietary Needs: ${Array.isArray(params.accessibility) ? params.accessibility.join(', ') : 'Wheelchair / Step-Free Access'}
- Cultural Customs: ${Array.isArray(params.culturalPreferences) ? params.culturalPreferences.join(', ') : 'Traditional Ceremonial Rituals'}
- Special Notes: ${params.notes || 'None'}

The JSON output MUST adhere strictly to this schema:
{
  "summary": {
    "title": "Descriptive Event Name",
    "eventType": "${params.eventType || 'Celebration'}",
    "theme": "Creative theme summary",
    "description": "2-3 sentence evocative event vision",
    "estimatedGuests": ${Number(params.guestCount) || 50},
    "locationType": "${params.locationType || 'Indoor / Flexible'}",
    "colorPalette": ["#Hex1", "#Hex2", "#Hex3", "#Hex4"]
  },
  "budget": {
    "totalBudget": ${Number(params.budget) || 5000},
    "currency": "${params.currency || 'USD'}",
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
 * If the API key is not provided or the request fails, seamlessly falls back to static deterministic data.
 *
 * @param {Object} params - Event specifications
 * @param {string} params.eventType - e.g. "Wedding", "Birthday", "Anniversary", "Community Gathering"
 * @param {number|string} params.budget - Total available budget
 * @param {number|string} params.guestCount - Anticipated number of guests
 * @param {string} [params.targetDate] - Target date string
 * @param {string} [params.locationType] - e.g. "Indoor Banquet", "Outdoor Garden", "Beachfront"
 * @param {string} [params.theme] - Theme preference or special notes
 * @param {string} [params.desiredExperience] - Atmosphere preference
 * @param {string[]} [params.mustHaves] - Non-negotiable elements
 * @param {string[]} [params.accessibility] - Dietary and physical accommodations
 * @param {string[]} [params.culturalPreferences] - Cultural and ceremonial traditions
 * @param {string} [params.notes] - Custom requirements
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
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini API execution error, switching to fallback state:', error);
    return getFallbackEventPlan(params);
  }
}

// Re-export fallback generator for standalone and test usage
export { getFallbackEventPlan };
