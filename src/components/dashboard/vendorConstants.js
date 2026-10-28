/**
 * Vendor coordination constants, quoting questionnaires, and filter definitions.
 */

export const VENDOR_VERIFICATION_QUESTIONS = {
  Venue: [
    'What are the overtime fees per additional hour past curfew?',
    'Is setup/teardown time included within the rental window?',
    'Are outside caterers permitted, or is there an exclusive preferred vendor list?',
    'What are the indoor backup arrangements in case of adverse weather?',
  ],
  Catering: [
    'Are servers, bar staff, dinnerware, and linens included in this estimate?',
    'What is the strict cutoff date for final head count lock?',
    'Can special dietary plates (celiac, vegan, halal) be accommodated at no extra fee?',
    'What is the leftover food handling and packing policy?',
  ],
  Media: [
    'How many hours of physical on-site coverage are guaranteed?',
    'What is the guaranteed turnaround timeline for digital edits and highlight reels?',
    'Do you carry backup camera bodies and dual SD-card redundancy on site?',
    'Are full-resolution RAW photos included in the licensing rights?',
  ],
  Decor: [
    'Does your quote include on-site delivery, styling, and midnight strike/teardown?',
    'Are open taper candles or cold-spark pyro allowed at this venue?',
    'Who is liable if floral rental stands or geometric arches are damaged?',
  ],
  Entertainment: [
    'Do you provide your own PA system, wireless mics, and ambient lighting?',
    'Will you act as the official Master of Ceremonies (MC) for guest announcements?',
    'When is the deadline to submit custom "Must-Play" and "Do-Not-Play" song lists?',
  ],
  Logistics: [
    'What is the payment milestone breakdown and cancellation refund policy?',
    'Are delivery vehicle parking permits or loading dock reservations needed?',
    'Is day-of event liability insurance required by the property manager?',
  ],
};

export const PRIORITY_FILTERS = ['ALL', 'High', 'Medium', 'Low'];
export const STATUS_FILTERS = ['ALL', 'To Do', 'In Progress', 'Completed'];
