// ============================================================
// WEEKLY EVENTS — SHOW DATA
// ============================================================
// HOW TO UPDATE:
//
// Each event type has a `current` object and an `archive` array.
// To update a week:
// 1. Copy current{} into archive[0], shifting old [0] to [1], etc.
// 2. Edit current{} with the new event.
// 3. Push. That's it.
//
// Past events auto-archive by date order — no page rebuilds needed.
// ============================================================

window.NNPP = {

  creator: {
    name: "Neural Nets and Pretty Patterns",
    url: "https://neuralnetsandprettypatterns.com/",
    isni: "0000 0005 2877 6254",
    ipi: ["01346215566", "01346215468"],
    links: [
      { label: "ISNI",        url: "https://isni.org/isni/0000000528776254" },
      { label: "Twitter",     url: "https://x.com/MCNeuralNets" },
      { label: "Reddit",      url: "https://www.reddit.com/user/prettypattern/" },
      { label: "Patreon",     url: "https://www.patreon.com/minderaser" },
      { label: "MusicBrainz", url: "https://musicbrainz.org/artist/134bc2e9-16e4-4b1e-b779-b9024f002882" },
      { label: "IMDb",        url: "https://www.imdb.com/name/nm17755189/" }
    ]
  },

  events: [

    // ── NEURALVERSE DAY (Wednesday) ──────────────────────────
    {
      id: "neuralverse-day",
      type: "Neuralverse Day",
      day: "Wednesday",
      time: "10 PM EST",
      tagline: "A new standalone track, every week.",
      description: "Every Wednesday at 10 PM, the Pink Room premieres a new track from the Neuralverse — anthology-style, standalone, and free. These aren't part of the Deep Dream State audio drama. They're their own thing: desire horror, immersive audio, and whatever formal experiment is running that week. The show goes when twenty people show up, so your attendance is a gift to the community as well.",
      links: [
        { label: "Deep Dream State", url: "https://www.imdb.com/title/tt38590860/" }
      ],

      current: {
        title: "Brane Day",
        date: "2026-06-03T22:00:00-04:00",
        dateLabel: "Wednesday, June 3",
        series: "Back Office",
        seriesNote: "The Back Office series explores different occupations through the Neuralverse lens — corporate training videos that take a dramatic turn into desire horror.",
        seriesEntries: [
          { title: "Influencer",              url: "https://musicbrainz.org/release/5667d929-4b0d-40f2-a28b-ee2a9803fa35" },
          { title: "Barista",                 url: "https://musicbrainz.org/release/c87142af-a2c9-4c13-8403-a3cc3c788745" },
          { title: "Retrofuturist Secretary", url: "https://musicbrainz.org/release/946613c3-3f38-480c-a370-420a6cca4f89" }
        ],
        description: "Brane Day is about the next level of gym training. The trainer is also the trained. Built on electroclash EDM — it's a delight and a descent.",
        performers: [
          { name: "Neural Nets and Pretty Patterns", url: "https://neuralnetsandprettypatterns.com/", isPrimary: true },
          { name: "Tinsel", discordHandle: "tinse1town", discordId: "505807512394530836" }
        ],
        badges: [
          { label: "World Premiere", cls: "badge-premiere" },
          { label: "Back Office",    cls: "badge-series" },
          { label: "Free",           cls: "badge-free" }
        ]
      },

      archive: []
    },

    // ── DEEP DREAM DAY (Thursday) ────────────────────────────
    {
      id: "deep-dream-day",
      type: "Deep Dream Day",
      day: "Thursday",
      time: "10 PM EST",
      tagline: "Advance episodes of the Deep Dream State, before the paywall.",
      description: "Every Thursday at 10 PM, the Pink Room plays an advance episode of the Deep Dream State audio drama — before it goes anywhere else. The Discord server offers exclusive access to NNPP and the cast for questions. You won't get this window again.",
      links: [
        { label: "Deep Dream State", url: "https://neuralnetsandprettypatterns.com/deepdreamstate/" },
        { label: "IMDb",             url: "https://www.imdb.com/title/tt38590860/" }
      ],

      current: {
        title: "Quimtessence",
        date: "2026-06-04T22:00:00-04:00",
        dateLabel: "Thursday, June 4",
        episode: "Global Episode 39 · A4C4E2",
        series: "The Snarecraft Cycle",
        seriesNote: "The Snarecraft Cycle is set inside a high fantasy Assistive Reality Game. Sorceresses. A hunt pack of feral women. Midstream, if you're lucky.",
        description: "Quimtessence is the newest unreleased episode of the Deep Dream State. You don't want to miss this one.",
        performers: [
          { name: "Neural Nets and Pretty Patterns", url: "https://neuralnetsandprettypatterns.com/", isPrimary: true }
        ],
        badges: [
          { label: "Advance Episode", cls: "badge-premiere" },
          { label: "Snarecraft Cycle", cls: "badge-series" },
          { label: "Free",            cls: "badge-free" }
        ]
      },

      archive: []
    },

    // ── FILE FRIDAY ──────────────────────────────────────────
    {
      id: "file-friday",
      type: "File Friday",
      day: "Friday",
      time: "11 PM EST",
      tagline: "One track. Deep focus. Every Friday.",
      description: "File Friday is a curated weekly experience built around a single track from the Neuralverse. Hosted by Syndi Rella, it's a tight, focused listen — one file, one room, all the way through.",
      links: [
        { label: "Syndi Rella · IMDb", url: "https://www.imdb.com/name/nm17765752/" },
        { label: "Pink Room FAQ",      url: "https://neuralnetsandprettypatterns.com/the-pink-room/#faq" }
      ],

      current: {
        title: null,
        date: "2026-06-05T23:00:00-04:00",
        dateLabel: "Friday, June 5",
        description: null,
        performers: [
          { name: "Neural Nets and Pretty Patterns", url: "https://neuralnetsandprettypatterns.com/", isPrimary: true },
          { name: "Syndi Rella", url: "https://www.imdb.com/name/nm17765752/", role: "Host" }
        ],
        badges: [
          { label: "Free", cls: "badge-free" }
        ]
      },

      archive: []
    },

    // ── DEEP DROP PARTY (Saturday) ───────────────────────────
    {
      id: "deep-drop-party",
      type: "Deep Drop Party",
      day: "Saturday",
      time: "9 PM EST",
      tagline: "The flagship event. Every Saturday since 2018.",
      description: "The Deep Drop Party is the longest-running continuous broadcast show on Discord. Three hours of prestige audio, hosted by Bliss Blank and a rotating cast of co-hostesses. Haptic integration in the final tracks. Running every Saturday without interruption since February 23, 2018.",
      links: [
        { label: "Deep Drop Party", url: "https://neuralnetsandprettypatterns.com/deep-drop-party/" },
        { label: "Episode Archive", url: "https://neuralnetsandprettypatterns.com/deep-drop-party/episodes/" },
        { label: "Disboard",        url: "https://disboard.org/server/515165427337265162" }
      ],
      externalPage: "https://neuralnetsandprettypatterns.com/deep-drop-party/",

      current: {
        title: null,
        date: null,
        dateLabel: "Every Saturday",
        description: "Current show details on the Deep Drop Party page.",
        performers: [
          { name: "Neural Nets and Pretty Patterns", url: "https://neuralnetsandprettypatterns.com/", isPrimary: true },
          { name: "Bliss Blank", url: "https://www.imdb.com/name/nm17754818/", role: "Host" }
        ],
        badges: [
          { label: "Flagship",  cls: "badge-premiere" },
          { label: "Haptic",    cls: "badge-haptic" },
          { label: "Free",      cls: "badge-free" }
        ]
      },

      archive: []
    }

  ] // end events

}; // end NNPP
