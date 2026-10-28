/**
 * High-fidelity deterministic fallback event plan generator.
 * Provides resilient, structured event blueprints when the Gemini API is unreachable,
 * rate-limited, or running in an unconfigured offline environment.
 */

/**
 * Generates a complete, structured event plan matching the Gemini schema.
 *
 * @param {Object} [params={}] - User input constraints
 * @param {string} [params.eventType='Celebration'] - Event classification
 * @param {number|string} [params.budget=5000] - Total planned budget
 * @param {string} [params.currency='USD'] - ISO 4217 Currency Code
 * @param {number|string} [params.guestCount=50] - Headcount estimate
 * @param {string} [params.locationType='Grand Banquet & Garden'] - Venue type
 * @param {string} [params.theme='Royal Elegance & Warm Glow'] - Aesthetic vibe
 * @param {string} [params.desiredExperience='Intimate & Heartfelt'] - Guest atmosphere
 * @param {string[]} [params.mustHaves] - Essential priorities
 * @param {string[]} [params.accessibility] - Dietary & accessibility accommodations
 * @param {string[]} [params.culturalPreferences] - Cultural & ceremonial traditions
 * @param {string} [params.notes] - Special coordinator notes
 * @returns {Object} Structured event plan conforming to dashboard specifications
 */
export function getFallbackEventPlan(params = {}) {
  const eventType = params.eventType || 'Celebration';
  const total = Number(params.budget) > 0 ? Number(params.budget) : 5000;
  const guests = Number(params.guestCount) > 0 ? Number(params.guestCount) : 50;
  const location = params.locationType || 'Grand Banquet & Garden';
  const theme = params.theme || 'Royal Elegance & Warm Glow';
  const experience = params.desiredExperience || 'Intimate & Heartfelt';
  const mustHaves = Array.isArray(params.mustHaves) && params.mustHaves.length > 0
    ? params.mustHaves.join(', ')
    : 'Professional Photography, Interactive Photo Booth';
  const accessibility = Array.isArray(params.accessibility) && params.accessibility.length > 0
    ? params.accessibility.join(', ')
    : 'Wheelchair / Step-Free Access';
  const cultural = Array.isArray(params.culturalPreferences) && params.culturalPreferences.length > 0
    ? params.culturalPreferences.join(', ')
    : 'Traditional Ceremonial Rituals';

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
      description: `A thoughtfully orchestrated ${eventType.toLowerCase()} accommodating ${guests} guests at ${location}. Curated for a ${experience.toLowerCase()} atmosphere with ${theme.toLowerCase()} styling. Prioritizing: ${mustHaves}. Honoring: ${cultural}. Inclusivity guaranteed via: ${accessibility}.`,
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

