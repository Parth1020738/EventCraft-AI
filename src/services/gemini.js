import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Access Gemini API Key from Vite environment variables.
 * Never hardcode secrets in source code.
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

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
 * @returns {Promise<Object>} Structured event plan object
 */
export async function generateEventPlan(params) {
  if (!apiKey || !genAI) {
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

    const prompt = `Generate a comprehensive, structured event plan with the following constraints:
- Event Type: ${params.eventType || 'Celebration'}
- Total Budget: ${params.budget || 5000} USD
- Guest Count: ${params.guestCount || 50} guests
- Location Type: ${params.locationType || 'Indoor / Flexible'}
- Target Date: ${params.targetDate || 'Upcoming in 3 months'}
- Theme / Preferences: ${params.theme || 'Elegant and memorable'}

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

/**
 * Deterministic fallback event plan generator.
 * Provides high-fidelity, structured event data in case of missing keys, rate limits, or network errors.
 *
 * @param {Object} params
 * @returns {Object} Structured event plan matching the Gemini output schema
 */
export function getFallbackEventPlan(params = {}) {
  const eventType = params.eventType || 'Celebration';
  const total = Number(params.budget) > 0 ? Number(params.budget) : 5000;
  const guests = Number(params.guestCount) > 0 ? Number(params.guestCount) : 50;
  const location = params.locationType || 'Grand Banquet & Garden';
  const theme = params.theme || 'Royal Elegance & Warm Glow';

  const venueAmount = Math.round(total * 0.30);
  const cateringAmount = Math.round(total * 0.35);
  const decorAmount = Math.round(total * 0.15);
  const entertainmentAmount = Math.round(total * 0.12);
  const contingencyAmount = total - (venueAmount + cateringAmount + decorAmount + entertainmentAmount);

  return {
    summary: {
      title: `${eventType} Spectacular`,
      eventType,
      theme,
      description: `A thoughtfully orchestrated ${eventType.toLowerCase()} accommodating ${guests} guests at ${location}, designed around vibrant warmth, curated gastronomy, and unforgettable moments.`,
      estimatedGuests: guests,
      locationType: location,
      colorPalette: ['#4F46E5', '#7C3AED', '#F59E0B', '#FAFAFA'],
    },
    budget: {
      totalBudget: total,
      currency: params.currency || 'USD',
      allocations: [
        {
          category: 'Venue & Facilities',
          allocatedAmount: venueAmount,
          percentage: 30,
          notes: `Booking deposit, indoor/outdoor access, security, and cleanup for ${guests} guests.`,
        },
        {
          category: 'Catering & Beverages',
          allocatedAmount: cateringAmount,
          percentage: 35,
          notes: `Multi-course dinner, artisanal mocktails/cocktails, desserts, and staffing.`,
        },
        {
          category: 'Decor & Ambiance',
          allocatedAmount: decorAmount,
          percentage: 15,
          notes: `Festive lighting, bespoke floral centerpieces, entrance archway, and customized signage.`,
        },
        {
          category: 'Entertainment & Photography',
          allocatedAmount: entertainmentAmount,
          percentage: 12,
          notes: `Professional photographer, high-energy sound system/DJ, and photo booth setup.`,
        },
        {
          category: 'Logistics & Contingency',
          allocatedAmount: contingencyAmount,
          percentage: 8,
          notes: `Invitations, personalized party favors, audiovisual rental, and emergency buffer.`,
        },
      ],
    },
    timeline: {
      phases: [
        {
          phaseName: 'Phase 1: Concept & Core Bookings (8-12 Weeks Out)',
          targetPeriod: 'Weeks 1-4',
          milestones: [
            {
              title: 'Lock In Venue Date & Sign Contract',
              description: 'Confirm booking hours, insurance requirements, and access window.',
              dueTime: 'Week 2',
            },
            {
              title: 'Finalize Guest List & Dispatch Save-the-Dates',
              description: `Collect physical and digital addresses for ${guests} attendees.`,
              dueTime: 'Week 3',
            },
            {
              title: 'Secure Primary Vendors',
              description: 'Interview and place deposits for caterer and main photographer.',
              dueTime: 'Week 4',
            },
          ],
        },
        {
          phaseName: 'Phase 2: Aesthetics & Logistics (4-6 Weeks Out)',
          targetPeriod: 'Weeks 5-8',
          milestones: [
            {
              title: 'Catering Menu Tasting & Beverage Selection',
              description: 'Select appetizers, main courses, and dietary preference options.',
              dueTime: 'Week 6',
            },
            {
              title: 'Apparel & Decor Finalization',
              description: 'Finalize color swatches, floral arrangements, and rental furniture.',
              dueTime: 'Week 7',
            },
            {
              title: 'Send Official Invitations & Launch RSVP Tracker',
              description: 'Set RSVP deadline to 3 weeks before the event.',
              dueTime: 'Week 8',
            },
          ],
        },
        {
          phaseName: 'Phase 3: Final Countdown & Day-Of Coordination',
          targetPeriod: 'Final 2 Weeks',
          milestones: [
            {
              title: 'Vendor Run-Through & Delivery Schedule',
              description: 'Distribute minute-by-minute itinerary to venue manager and vendor team.',
              dueTime: 'Day -3',
            },
            {
              title: 'Welcome Rehearsal & Setup Walkthrough',
              description: 'Inspect lighting, sound check, and table seating assignments.',
              dueTime: 'Day -1',
            },
            {
              title: 'Celebration Day Execution',
              description: 'Coordinate guest arrivals, toast transitions, and evening celebration.',
              dueTime: 'Event Day',
            },
          ],
        },
      ],
    },
    checklist: [
      {
        id: 'task-1',
        task: 'Reserve and pay venue deposit',
        category: 'Venue',
        priority: 'High',
        estimatedCost: venueAmount,
        status: 'To Do',
      },
      {
        id: 'task-2',
        task: 'Book caterer and finalize guest count pricing',
        category: 'Catering',
        priority: 'High',
        estimatedCost: cateringAmount,
        status: 'To Do',
      },
      {
        id: 'task-3',
        task: 'Hire professional photographer and videographer',
        category: 'Media',
        priority: 'High',
        estimatedCost: Math.round(entertainmentAmount * 0.6),
        status: 'To Do',
      },
      {
        id: 'task-4',
        task: 'Order floral arrangements and lighting package',
        category: 'Decor',
        priority: 'Medium',
        estimatedCost: decorAmount,
        status: 'To Do',
      },
      {
        id: 'task-5',
        task: 'Design and print personalized event signage & favors',
        category: 'Logistics',
        priority: 'Medium',
        estimatedCost: Math.round(contingencyAmount * 0.5),
        status: 'To Do',
      },
      {
        id: 'task-6',
        task: 'Book DJ / Live performer and prepare signature playlist',
        category: 'Entertainment',
        priority: 'Medium',
        estimatedCost: Math.round(entertainmentAmount * 0.4),
        status: 'To Do',
      },
      {
        id: 'task-7',
        task: 'Prepare emergency day-of kit and vendor contact sheets',
        category: 'Logistics',
        priority: 'Low',
        estimatedCost: 50,
        status: 'To Do',
      },
    ],
    creativeIdeas: {
      themeSuggestions: [
        'Enchanted Evening with warm fairy lights and velvet accents',
        'Modern Minimalist with monochrome geometry and lush greenery',
        'Sunset Glow with terracotta, amber, and brass centerpieces',
      ],
      decorIdeas: [
        'Illuminated geometric entryway arch with personalized greeting signage',
        'Floating candle displays on mirrored table runners',
        'Interactive polaroid guestbook station with metallic pens',
      ],
      invitationPhrasing: [
        `"Together with great joy, we invite you to join us in celebrating ${eventType}."`,
        `"An evening of laughter, music, and celebration awaits. Save our date!"`,
      ],
      entertainmentSuggestions: [
        'Curated acoustic set during cocktail hour followed by a dynamic DJ set',
        'Live caricature artist or custom portrait sketcher for guests',
        'Sunset group toast with synchronized ambient lighting change',
      ],
    },
  };
}
