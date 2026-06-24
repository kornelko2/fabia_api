// Catalog of pre-rendered SEO landing pages. Each entry becomes a static route
// (`/<slug>`) that vite-ssg renders to its own HTML file with a unique title,
// description, H1 and a statically-computed answer.
//
// To add a page: append an entry here. No other file needs to change.

// Škoda Fabia 1.2 HTP reference specs — one Fabia equals this much of each type.
// Keep in sync with the Worker backend (the source of truth).
export const REFERENCES = {
  area: 6.587,       // m²
  length: 4.002,     // m
  weight: 1035,      // kg
  price: 16500,      // EUR
  width: 1.646,      // m
  height: 1.441,     // m
  power: 64,         // HP
  consumption: 5.9   // L/100km
}

// value is expressed in the REFERENCES unit for `type` (m², m, kg, EUR…), so the
// static answer is simply round(value / REFERENCES[type]).
export const pages = [
  {
    slug: 'hectare-in-skoda-fabias',
    type: 'area',
    value: 10000,
    example: '1 hectare',
    h1: 'How many Škoda Fabias fit in a hectare?',
    title: 'How Many Škoda Fabias Fit in a Hectare? · Fabia Converter',
    description: 'A hectare is 10,000 m². See exactly how many Škoda Fabias it takes to cover one — with the math and a live converter for any other size.',
    intro: 'A hectare (10,000 m²) is hard to picture — but parked Škoda Fabias are not. Each Fabia 1.2 HTP covers about 6.587 m² of ground, so a whole hectare swallows a small sea of them.'
  },
  {
    slug: 'football-field-in-skoda-fabias',
    type: 'area',
    value: 7140,
    example: '7140 m²',
    h1: 'How many Škoda Fabias fit on a football field?',
    title: 'How Many Škoda Fabias Fit on a Football Pitch? · Fabia Converter',
    description: 'A standard football pitch is about 7,140 m². Find out how many Škoda Fabias would cover it, plus a converter for any area you like.',
    intro: 'A full-size football pitch (about 105 × 68 m, ≈7,140 m²) is the classic "how big is that?" yardstick. Measured in parked Škoda Fabias, the answer is surprisingly large.'
  },
  {
    slug: 'tennis-court-in-skoda-fabias',
    type: 'area',
    value: 261,
    example: '261 m²',
    h1: 'How many Škoda Fabias cover a tennis court?',
    title: 'How Many Škoda Fabias Cover a Tennis Court? · Fabia Converter',
    description: 'A doubles tennis court is about 261 m². See how many Škoda Fabias it takes to cover one — with the calculation and a live converter.',
    intro: 'A doubles tennis court measures 23.77 × 10.97 m (≈261 m²). It is just the right size to make "in Škoda Fabias" feel tangible.'
  },
  {
    slug: 'eiffel-tower-in-skoda-fabias',
    type: 'length',
    value: 330,
    example: '330 meters',
    h1: 'How many Škoda Fabias tall is the Eiffel Tower?',
    title: 'How Many Škoda Fabias Tall Is the Eiffel Tower? · Fabia Converter',
    description: 'The Eiffel Tower is 330 m tall. Stack Škoda Fabias bumper to bumper and see how many you would need to match it.',
    intro: 'The Eiffel Tower stands 330 m tall. Each Škoda Fabia is 4.002 m long, so stacking them nose-to-tail gives a satisfying, very climbable number.'
  },
  {
    slug: 'olympic-pool-in-skoda-fabias',
    type: 'length',
    value: 50,
    example: '50 meters',
    h1: 'How many Škoda Fabias long is an Olympic pool?',
    title: 'How Many Škoda Fabias Long Is an Olympic Pool? · Fabia Converter',
    description: 'An Olympic swimming pool is 50 m long. See how many Škoda Fabias laid end to end it takes to span one.',
    intro: 'An Olympic pool is exactly 50 m long. Line up Škoda Fabias end to end and you can measure your laps in Fabias instead of metres.'
  },
  {
    slug: 'kilometer-in-skoda-fabias',
    type: 'length',
    value: 1000,
    example: '1 km',
    h1: 'How many Škoda Fabias make a kilometer?',
    title: 'How Many Škoda Fabias Make a Kilometer? · Fabia Converter',
    description: 'One kilometer is 1,000 m. See how many Škoda Fabias parked bumper to bumper it takes to stretch a full kilometer.',
    intro: 'A kilometer is 1,000 m. Parked bumper to bumper, Škoda Fabias turn that abstract distance into a number you can actually picture.'
  },
  {
    slug: 'elephant-in-skoda-fabias',
    type: 'weight',
    value: 5000,
    example: '5000 kg',
    h1: 'How many Škoda Fabias weigh as much as an elephant?',
    title: 'How Many Škoda Fabias Weigh as Much as an Elephant? · Fabia Converter',
    description: 'An African elephant weighs about 5,000 kg. See how many Škoda Fabias it takes to match it on the scales.',
    intro: 'A large African elephant tips the scales at around 5,000 kg. A Škoda Fabia 1.2 HTP weighs 1,035 kg, so the comparison is closer than you might think.'
  },
  {
    slug: 'blue-whale-in-skoda-fabias',
    type: 'weight',
    value: 150000,
    example: '150000 kg',
    h1: 'How many Škoda Fabias weigh as much as a blue whale?',
    title: 'How Many Škoda Fabias Weigh as Much as a Blue Whale? · Fabia Converter',
    description: 'A blue whale can weigh 150,000 kg. Find out how many Škoda Fabias it would take to balance the largest animal on Earth.',
    intro: 'The blue whale — the largest animal that has ever lived — can weigh 150,000 kg. Measured in Škoda Fabias, its sheer mass finally becomes graspable.'
  }
]
