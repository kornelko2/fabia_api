// Catalog of pre-rendered SEO landing pages. Each entry becomes one static route
// per locale (`/<slug>` for English, `/cs/<slug>` for Czech) that vite-ssg
// renders to its own HTML file with locale-specific title/description/H1/content.
//
// To add a page: append an entry with `en` and `cs` content.
// To add a locale: extend LOCALES + each page's `locales`.

// Locales that get pre-rendered landing pages. 'en' is the default (no prefix).
export const LOCALES = ['en', 'cs']
export const DEFAULT_LOCALE = 'en'

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

// Path for a page slug in a given locale. English lives at the root; other
// locales are prefixed (e.g. /cs/...).
export function pagePath(slug, locale) {
  return locale === DEFAULT_LOCALE ? `/${slug}` : `/${locale}/${slug}`
}

// value is expressed in the REFERENCES unit for `type`, so the static answer is
// round(value / REFERENCES[type]). `example` is the input prefilled into the
// converter (kept in a form the parser handles reliably).
export const pages = [
  {
    type: 'area',
    value: 10000,
    locales: {
      en: {
        slug: 'hectare-in-skoda-fabias',
        example: '1 hectare',
        h1: 'How many Škoda Fabias fit in a hectare?',
        title: 'How Many Škoda Fabias Fit in a Hectare? · Fabia Converter',
        description: 'A hectare is 10,000 m². See exactly how many Škoda Fabias it takes to cover one — with the math and a live converter for any other size.',
        intro: 'A hectare (10,000 m²) is hard to picture — but parked Škoda Fabias are not. Each Fabia 1.2 HTP covers about 6.587 m² of ground, so a whole hectare swallows a small sea of them.'
      },
      cs: {
        slug: 'hektar-ve-skoda-fabiich',
        example: '10000 m²',
        h1: 'Kolik vozů Škoda Fabia se vejde na hektar?',
        title: 'Kolik Škoda Fabií se vejde na hektar? · Převodník Fabia',
        description: 'Hektar má 10 000 m². Zjistěte, kolik vozů Škoda Fabia ho pokryje — s výpočtem i živým převodníkem pro libovolnou plochu.',
        intro: 'Hektar (10 000 m²) si těžko představíte — zaparkované Škody Fabia ano. Každá Fabia 1.2 HTP zabere zhruba 6,587 m², takže celý hektar jich pojme úctyhodné množství.'
      }
    }
  },
  {
    type: 'area',
    value: 7140,
    locales: {
      en: {
        slug: 'football-field-in-skoda-fabias',
        example: '7140 m²',
        h1: 'How many Škoda Fabias fit on a football field?',
        title: 'How Many Škoda Fabias Fit on a Football Pitch? · Fabia',
        description: 'A standard football pitch is about 7,140 m². Find out how many Škoda Fabias would cover it, plus a converter for any area you like.',
        intro: 'A full-size football pitch (about 105 × 68 m, ≈7,140 m²) is the classic "how big is that?" yardstick. Measured in parked Škoda Fabias, the answer is surprisingly large.'
      },
      cs: {
        slug: 'fotbalove-hriste-ve-skoda-fabiich',
        example: '7140 m²',
        h1: 'Kolik vozů Škoda Fabia se vejde na fotbalové hřiště?',
        title: 'Kolik Škoda Fabií se vejde na fotbalové hřiště? · Fabia',
        description: 'Fotbalové hřiště má asi 7 140 m². Podívejte se, kolik vozů Škoda Fabia by ho pokrylo, plus převodník pro jakoukoli plochu.',
        intro: 'Plnohodnotné fotbalové hřiště (zhruba 105 × 68 m, ≈ 7 140 m²) je klasické měřítko velikosti. Vyjádřeno v zaparkovaných Škodách Fabia je výsledek překvapivě velký.'
      }
    }
  },
  {
    type: 'area',
    value: 261,
    locales: {
      en: {
        slug: 'tennis-court-in-skoda-fabias',
        example: '261 m²',
        h1: 'How many Škoda Fabias cover a tennis court?',
        title: 'How Many Škoda Fabias Cover a Tennis Court? · Fabia',
        description: 'A doubles tennis court is about 261 m². See how many Škoda Fabias it takes to cover one — with the calculation and a live converter.',
        intro: 'A doubles tennis court measures 23.77 × 10.97 m (≈261 m²). It is just the right size to make "in Škoda Fabias" feel tangible.'
      },
      cs: {
        slug: 'tenisovy-kurt-ve-skoda-fabiich',
        example: '261 m²',
        h1: 'Kolik vozů Škoda Fabia pokryje tenisový kurt?',
        title: 'Kolik Škoda Fabií pokryje tenisový kurt? · Fabia',
        description: 'Čtyřhrový tenisový kurt má asi 261 m². Zjistěte, kolik vozů Škoda Fabia je potřeba k jeho pokrytí — s výpočtem a živým převodníkem.',
        intro: 'Čtyřhrový tenisový kurt měří 23,77 × 10,97 m (≈ 261 m²). Je akorát tak velký, aby srovnání „ve Škodách Fabia“ bylo názorné.'
      }
    }
  },
  {
    type: 'length',
    value: 330,
    locales: {
      en: {
        slug: 'eiffel-tower-in-skoda-fabias',
        example: '330 meters',
        h1: 'How many Škoda Fabias tall is the Eiffel Tower?',
        title: 'How Many Škoda Fabias Tall Is the Eiffel Tower? · Fabia',
        description: 'The Eiffel Tower is 330 m tall. Stack Škoda Fabias bumper to bumper and see how many you would need to match it.',
        intro: 'The Eiffel Tower stands 330 m tall. Each Škoda Fabia is 4.002 m long, so stacking them nose-to-tail gives a satisfying, very climbable number.'
      },
      cs: {
        slug: 'eiffelova-vez-ve-skoda-fabiich',
        example: '330 m',
        h1: 'Kolik vozů Škoda Fabia měří Eiffelova věž?',
        title: 'Kolik Škoda Fabií měří Eiffelova věž? · Převodník Fabia',
        description: 'Eiffelova věž je vysoká 330 m. Naskládejte Škody Fabia za sebe a zjistěte, kolik jich potřebujete, abyste se jí vyrovnali.',
        intro: 'Eiffelova věž měří 330 m. Každá Škoda Fabia je 4,002 m dlouhá, takže když je naskládáte nárazník na nárazník, dostanete pěkné, dobře zapamatovatelné číslo.'
      }
    }
  },
  {
    type: 'length',
    value: 50,
    locales: {
      en: {
        slug: 'olympic-pool-in-skoda-fabias',
        example: '50 meters',
        h1: 'How many Škoda Fabias long is an Olympic pool?',
        title: 'How Many Škoda Fabias Long Is an Olympic Pool? · Fabia',
        description: 'An Olympic swimming pool is 50 m long. See how many Škoda Fabias laid end to end it takes to span one.',
        intro: 'An Olympic pool is exactly 50 m long. Line up Škoda Fabias end to end and you can measure your laps in Fabias instead of metres.'
      },
      cs: {
        slug: 'olympijsky-bazen-ve-skoda-fabiich',
        example: '50 m',
        h1: 'Kolik vozů Škoda Fabia měří olympijský bazén?',
        title: 'Kolik Škoda Fabií měří olympijský bazén? · Fabia',
        description: 'Olympijský bazén je dlouhý 50 m. Zjistěte, kolik vozů Škoda Fabia za sebou je potřeba k jeho překlenutí.',
        intro: 'Olympijský bazén je přesně 50 m dlouhý. Postavte Škody Fabia za sebe a své délky můžete měřit ve Fabiích místo v metrech.'
      }
    }
  },
  {
    type: 'length',
    value: 1000,
    locales: {
      en: {
        slug: 'kilometer-in-skoda-fabias',
        example: '1 km',
        h1: 'How many Škoda Fabias make a kilometer?',
        title: 'How Many Škoda Fabias Make a Kilometer? · Fabia',
        description: 'One kilometer is 1,000 m. See how many Škoda Fabias parked bumper to bumper it takes to stretch a full kilometer.',
        intro: 'A kilometer is 1,000 m. Parked bumper to bumper, Škoda Fabias turn that abstract distance into a number you can actually picture.'
      },
      cs: {
        slug: 'kilometr-ve-skoda-fabiich',
        example: '1 km',
        h1: 'Kolik vozů Škoda Fabia je jeden kilometr?',
        title: 'Kolik Škoda Fabií je jeden kilometr? · Převodník Fabia',
        description: 'Jeden kilometr je 1 000 m. Zjistěte, kolik vozů Škoda Fabia zaparkovaných za sebou se na kilometr vejde.',
        intro: 'Kilometr je 1 000 m. Zaparkované nárazník na nárazník promění Škody Fabia tuto abstraktní vzdálenost v číslo, které si dokážete představit.'
      }
    }
  },
  {
    type: 'weight',
    value: 5000,
    locales: {
      en: {
        slug: 'elephant-in-skoda-fabias',
        example: '5000 kg',
        h1: 'How many Škoda Fabias weigh as much as an elephant?',
        title: 'How Many Škoda Fabias Weigh as Much as an Elephant? · Fabia',
        description: 'An African elephant weighs about 5,000 kg. See how many Škoda Fabias it takes to match it on the scales.',
        intro: 'A large African elephant tips the scales at around 5,000 kg. A Škoda Fabia 1.2 HTP weighs 1,035 kg, so the comparison is closer than you might think.'
      },
      cs: {
        slug: 'slon-ve-skoda-fabiich',
        example: '5000 kg',
        h1: 'Kolik vozů Škoda Fabia váží jako slon?',
        title: 'Kolik Škoda Fabií váží jako slon? · Převodník Fabia',
        description: 'Africký slon váží asi 5 000 kg. Zjistěte, kolik vozů Škoda Fabia je potřeba, aby se mu na vahách vyrovnaly.',
        intro: 'Velký africký slon váží kolem 5 000 kg. Škoda Fabia 1.2 HTP váží 1 035 kg, takže srovnání je bližší, než byste čekali.'
      }
    }
  },
  {
    type: 'weight',
    value: 150000,
    locales: {
      en: {
        slug: 'blue-whale-in-skoda-fabias',
        example: '150000 kg',
        h1: 'How many Škoda Fabias weigh as much as a blue whale?',
        title: 'How Many Škoda Fabias Weigh as Much as a Blue Whale? · Fabia',
        description: 'A blue whale can weigh 150,000 kg. Find out how many Škoda Fabias it would take to balance the largest animal on Earth.',
        intro: 'The blue whale — the largest animal that has ever lived — can weigh 150,000 kg. Measured in Škoda Fabias, its sheer mass finally becomes graspable.'
      },
      cs: {
        slug: 'plejtvak-ve-skoda-fabiich',
        example: '150000 kg',
        h1: 'Kolik vozů Škoda Fabia váží jako plejtvák obrovský?',
        title: 'Kolik Škoda Fabií váží jako plejtvák obrovský? · Fabia',
        description: 'Plejtvák obrovský může vážit 150 000 kg. Zjistěte, kolik vozů Škoda Fabia by vyvážilo největší zvíře na Zemi.',
        intro: 'Plejtvák obrovský — největší zvíře, jaké kdy žilo — může vážit 150 000 kg. Vyjádřeno ve Škodách Fabia se jeho obrovská hmotnost konečně stává představitelnou.'
      }
    }
  }
]
