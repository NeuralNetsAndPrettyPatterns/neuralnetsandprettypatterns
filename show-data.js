/**
 * DEEP DROP PARTY — SHOW DATA
 * ============================================================
 * HOW TO UPDATE EACH WEEK:
 *
 * 1. Copy shows[0] and paste it as shows[1], shifting old [1] down.
 * 2. Edit shows[0] with the new episode details.
 *    - Set hostesses as an array of keys from DDP.identity.hostesses
 *    - Push to GitHub → Cloudflare deploys automatically.
 *
 * To add a new hostess: add her entry to DDP.identity.hostesses,
 * then reference her key in episode hostesses arrays.
 * Her identity lives in ONE place only.
 * ============================================================
 */

window.DDP = {

  // ── CANONICAL IDENTITY ────────────────────────────────────
  // One source of truth. Pages consume this. Pages do not define it.

  identity: {

    nnpp: {
      "@type": "Person",
      "@id": "https://neuralnetsandprettypatterns.com/#nnpp",
      "name": "Neural Nets and Pretty Patterns",
      "alternateName": ["NNPP", "Pretty Patterns, Neural Nets And"],
      "url": "https://neuralnetsandprettypatterns.com/",
      "identifier": [
        { "@type": "PropertyValue", "propertyID": "ISNI",                  "value": "0000 0005 2877 6254" },
        { "@type": "PropertyValue", "propertyID": "IPI",                   "value": "01346215468" },
        { "@type": "PropertyValue", "propertyID": "IPI",                   "value": "01346215566" },
        { "@type": "PropertyValue", "propertyID": "Google Knowledge Graph", "value": "/g/11zjw94pww" }
      ],
      "sameAs": [
        "https://open.spotify.com/artist/4ClrZHtOYWrZyFt8oCGuL6",
        "https://musicbrainz.org/artist/134bc2e9-16e4-4b1e-b779-b9024f002882",
        "https://www.patreon.com/minderaser",
        "https://deepdreamstate.blubrry.net/neural-nets-and-pretty-patterns/",
        "https://www.reddit.com/user/prettypattern/",
        "https://www.tumblr.com/blog/blink-blank-bliss",
        "https://github.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns"
      ]
    },

    series: {
      "@type": ["CreativeWorkSeries", "BroadcastService"],
      "@id": "https://neuralnetsandprettypatterns.com/deep-drop-party/#show",
      "name": "Deep Drop Party",
      "alternateName": "The Deep Drop Party",
      "url": "https://neuralnetsandprettypatterns.com/deep-drop-party/",
      "startDate": "2018-02-23",
      "description": "A weekly live broadcast on Discord featuring the immersive audio art of Neural Nets and Pretty Patterns — devotional audio, haptic narrative, and desire horror unfolding in real time. Hosted by Bliss Blank and a rotating cast of guest co-hostesses. Running continuously since February 23, 2018.",
      "image": { "@type": "ImageObject", "url": "https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/DDPLogo.png" },
      "logo":  { "@type": "ImageObject", "url": "https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/DDPLogo.png" },
      "broadcastFrequency": "weekly",
      "broadcastTimezone": "America/New_York",
      "sameAs": ["https://discord.gg/thepinkroom"],
      "hasPart": {
        "@type": "CreativeWork",
        "name": "Deep Drop Party Episode Archive",
        "url": "https://neuralnetsandprettypatterns.com/deep-drop-party/episodes/"
      }
    },

    website: {
      "@type": "WebSite",
      "@id": "https://neuralnetsandprettypatterns.com/#website",
      "url": "https://neuralnetsandprettypatterns.com/",
      "name": "Neural Nets and Pretty Patterns"
    },

    // ── HOSTESS PROFILES ──────────────────────────────────
    // One entry per hostess. Episodes reference keys only.
    // To add a new hostess: add her entry here, then use her key
    // in episode hostesses arrays.

    hostesses: {

      blissBlank: {
        "@type": "Person",
        "@id": "https://neuralnetsandprettypatterns.com/#bliss-blank",
        "name": "Bliss Blank",
        "description": "Showrunner and recurring live host of the Deep Drop Party.",
        "sameAs": ["https://www.imdb.com/name/nm17754818/"]
      },

      dizzyDollie: {
        "@type": "Person",
        "@id": "https://neuralnetsandprettypatterns.com/#dizzy-dollie",
        "name": "Dizzy Dollie",
        "sameAs": ["https://www.imdb.com/name/nm17760876/"]
      },

      echoDoll: {
        "@type": "Person",
        "@id": "https://neuralnetsandprettypatterns.com/#echo-doll",
        "name": "Echo Doll",
        "sameAs": ["https://www.imdb.com/name/nm17822435/"]
      },

      fluxLynniegal: {
        "@type": "Person",
        "@id": "https://neuralnetsandprettypatterns.com/#flux-lynniegal",
        "name": "Flux Lynniegal",
        "sameAs": ["https://www.imdb.com/name/nm17796354/"]
      },

      swirlsAndTwirls: {
        "@type": "Person",
        "@id": "https://neuralnetsandprettypatterns.com/#swirls-and-twirls",
        "name": "Swirls and Twirls",
        "sameAs": ["https://www.imdb.com/name/nm17864395/"]
      },

      bunLi: {
        "@type": "Person",
        "@id": "https://neuralnetsandprettypatterns.com/#bun-li",
        "name": "Bun-li",
        "sameAs": ["https://www.imdb.com/es-es/name/nm17796355/"]
      },

      kittenAzazel: {
        "@type": "Person",
        "@id": "https://neuralnetsandprettypatterns.com/#kitten-azazel",
        "name": "Kitten Azazel",
        "sameAs": ["https://www.imdb.com/name/nm17774343/"]
      }

    } // end hostesses

  }, // end identity


  // ── SHOWS ─────────────────────────────────────────────────
  // shows[0] = current/upcoming. shows[1+] = archive.
  // hostesses: array of keys from DDP.identity.hostesses

  shows: [

    // ── [0] CURRENT / UPCOMING SHOW ──────────────────────
    {
      number:    431,
      title:     "DisOrientation",
      theme:     "Neuroplex",
      date:      "2026-05-23T21:00:00-04:00",
      dateLabel: "Saturday, May 23",
      poster:    "https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/Disorientation%20-%20Official%20Deep%20Drop%20Party%20Poster.jpg",
      posterAlt: "Official poster for Deep Drop Party 431 – DisOrientation.",
      kicker:    "This Saturday 9 PM Eastern",
      description: `<p>You don't want to miss this memo.</p>
<p>Tonight, we're having onboarding. You definitely want to get on. <a href="https://www.imdb.com/name/nm17754818/" target="_blank" rel="noopener">Bliss</a> is in open blazer. <a href="https://www.imdb.com/name/nm17760876/" target="_blank" rel="noopener">Dizzy Dollie</a> is in pencil skirt.</p>
<p>This meeting cannot be an email. You need to come at 9 PM Eastern and get oriented.</p>
<p>It's also a premiere — the full version of <a href="https://www.patreon.com/minderaser" target="_blank" rel="noopener">Cortex</a> will play tonight.</p>`,
      badges:    ["World Premiere", "Haptic", "Free"],
      hostesses: ["blissBlank", "dizzyDollie"],
      starGuest: "",
      tracks: [
        { title: "Mind Popper",         links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Bullseye",            links: [{ label: "Deep Dream State", url: "https://neuralnetsandprettypatterns.com/deepdreamstate/" }], badges: [] },
        { title: "3 2 1 Down",          links: [{ label: "Neuroplex", url: "https://neuralnetsandprettypatterns.com/neuralpedia/neuroplex/#321down", style: "catalogue" }], badges: [] },
        { title: "Typing Pool (excerpt)",links: [{ label: "Neuroplex", url: "https://neuralnetsandprettypatterns.com/neuralpedia/neuroplex/#typingpool", style: "catalogue" }], badges: [] },
        { title: "Cortex",              links: [{ label: "Patreon", url: "https://www.patreon.com/minderaser" }], badges: ["World Premiere"] },
        { title: "Umlearn Femme",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/umlearn-67709614" }], badges: ["Haptic"] },
        { title: "S-Wave",              links: [{ label: "Patreon", url: "https://www.patreon.com/posts/slavewave-48150279" }], badges: ["Haptic"] }
      ]
    },

    // ── [1] PREVIOUS SHOW ────────────────────────────────
    {
      number:    430,
      title:     "DisOrientation",
      theme:     "Neuroplex",
      date:      "2026-05-16T21:00:00-04:00",
      dateLabel: "Saturday, May 16",
      poster:    "https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/Disorientation%20-%20Official%20Deep%20Drop%20Party%20Poster.jpg",
      posterAlt: "Official poster for Deep Drop Party 430 – DisOrientation.",
      badges:    ["World Premiere", "Haptic", "Free"],
      hostesses: ["blissBlank", "dizzyDollie"],
      starGuest: "",
      tracks: [
        { title: "Mind Popper",          links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Bullseye",             links: [{ label: "Deep Dream State", url: "https://neuralnetsandprettypatterns.com/deepdreamstate/" }], badges: [] },
        { title: "3 2 1 Down",           links: [{ label: "Neuroplex", url: "https://neuralnetsandprettypatterns.com/neuralpedia/neuroplex/#321down", style: "catalogue" }], badges: [] },
        { title: "Typing Pool (excerpt)", links: [{ label: "Neuroplex", url: "https://neuralnetsandprettypatterns.com/neuralpedia/neuroplex/#typingpool", style: "catalogue" }], badges: [] },
        { title: "Cortex",               links: [{ label: "Patreon", url: "https://www.patreon.com/minderaser" }], badges: ["World Premiere"] },
        { title: "Umlearn Femme",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/umlearn-67709614" }], badges: ["Haptic"] },
        { title: "S-Wave",               links: [{ label: "Patreon", url: "https://www.patreon.com/posts/slavewave-48150279" }], badges: ["Haptic"] }
      ]
    },

    // ── ARCHIVE ──────────────────────────────────────────
    {
      number: 391, title: "Gummi Dummi", theme: "", date: "2025-11-08T21:00:00-05:00", dateLabel: "November 8, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "echoDoll", "swirlsAndTwirls"], starGuest: "",
      tracks: [
        { title: "Mind Popper",      links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Letter Dream",     links: [{ label: "Catalogue p.14", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-14/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/letter-dream-all-142952140" }, { label: "Shelf", url: "https://deepdreamstate.blubrry.net/neuralpedia-shelf" }, { label: "Unlearn University", url: "https://deepdreamstate.blubrry.net/neuralpedia-unlearn-university" }], badges: [] },
        { title: "Smoked Stupid",    links: [{ label: "Catalogue p.1", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-1/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/smoked-stupid-11327128" }], badges: [] },
        { title: "Grow",             links: [{ label: "Catalogue p.4", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-4/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/grow-36333504" }, { label: "Pink Dream", url: "https://deepdreamstate.blubrry.net/neuralpedia-pink-dream" }], badges: [] },
        { title: "Kandi",            links: [{ label: "Patreon", url: "https://www.patreon.com/posts/kandi-93471082" }], badges: [] },
        { title: "Grow - Chapter 3", links: [{ label: "Catalogue p.4", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-4/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/grow-36333504" }, { label: "Pink Dream", url: "https://deepdreamstate.blubrry.net/neuralpedia-pink-dream" }], badges: [] },
        { title: "Pink Dream",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/pink-dream-loops-50028027" }, { label: "Pink Dream", url: "https://deepdreamstate.blubrry.net/neuralpedia-pink-dream" }], badges: ["Haptic", "Premiere"] },
        { title: "Brain Bubbler",    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/brain-bubbler-103069455" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 390, title: "Dream Tank", theme: "", date: "2025-11-01T21:00:00-05:00", dateLabel: "November 1, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "dizzyDollie"], starGuest: "",
      tracks: [
        { title: "Mind Popper",   links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Blank and Empty",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/blank-and-empty-105403558" }], badges: [] },
        { title: "Ever Moar",     links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/ever-moar-audio-142636704" }, { label: "Ministry of Halloween", url: "https://deepdreamstate.blubrry.net/neuralpedia-ministry-of-halloween" }], badges: [] },
        { title: "Maiden Voyage", links: [{ label: "Catalogue p.12", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-12/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/chthonic-audio-121886159" }, { label: "Chthonic", url: "https://deepdreamstate.blubrry.net/neuralpedia-chthonic" }], badges: [] },
        { title: "Interface",     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/interface-audio-116415197" }], badges: [] },
        { title: "Lotus",         links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/lotus-audio-all-127872431" }, { label: "Naditu", url: "https://deepdreamstate.blubrry.net/neuralpedia-naditu" }, { label: "Cult Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-cult-classic" }], badges: [] },
        { title: "Drone Tank",    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/drone-tank-65984754" }], badges: ["Haptic"] },
        { title: "Buzz Tank",     links: [], badges: ["Haptic"] }
      ]
    },
    {
      number: 389, title: "All the Vibes", theme: "", date: "2025-10-25T21:00:00-04:00", dateLabel: "October 25, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "bunLi"], starGuest: "",
      tracks: [
        { title: "Mind Popper", links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Buzz Wave",   links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/buzz-wave-audio-142010682" }, { label: "Wavetrained", url: "https://deepdreamstate.blubrry.net/neuralpedia-wavetrained" }], badges: [] },
        { title: "Override",    links: [{ label: "Catalogue p.14", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-14/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/override-audio-143510642" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { title: "Rehearsal",   links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/rehearsal-136049930" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { title: "Green Room",  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/green-room-audio-102741775" }], badges: [] },
        { title: "Damage",      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/damage-25472671" }], badges: [] },
        { title: "Inner Circle",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/inner-circle-103650712" }], badges: ["Haptic"] },
        { title: "Babbling W****", links: [{ label: "Catalogue p.8", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-8/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/babbling-whore-63981331" }, { label: "Treatstick", url: "https://deepdreamstate.blubrry.net/neuralpedia-treatstick" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 388, title: "Seance", theme: "", date: "2025-10-18T21:00:00-04:00", dateLabel: "October 18, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "fluxLynniegal"], starGuest: "",
      tracks: [
        { title: "Mind Popper",  links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Seance",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/seance-22427921" }], badges: [] },
        { title: "Shadow",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/shadow-audio-fem-125469613" }], badges: [] },
        { title: "Mister Spider",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/mister-spider-74404581" }], badges: [] },
        { title: "Sigil",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/sigil-35344870" }], badges: [] },
        { title: "Umlearn",      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/umlearn-67709614" }], badges: ["Haptic"] },
        { title: "Three",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/3-audio-all-fem-116990156" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 387, title: "Mind Off Mantras", theme: "", date: "2025-10-11T21:00:00-04:00", dateLabel: "October 11, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "dizzyDollie"], starGuest: "",
      tracks: [
        { title: "Mind Popper",                   links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Gyre",                          links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/gyre-audio-fem-139133600" }, { label: "Sitri", url: "https://deepdreamstate.blubrry.net/neuralpedia-sitri" }, { label: "Cult Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-cult-classic" }], badges: [] },
        { title: "Deepest Hole",                  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/deepest-hole-65110299" }], badges: [] },
        { title: "Good Girls Make More Good Girls",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/good-girls-make-106286109" }], badges: [] },
        { title: "Make It Sparkle",               links: [{ label: "Patreon", url: "https://www.patreon.com/posts/make-it-sparkle-32880928" }], badges: [] },
        { title: "Ouroborus, co-sub mix",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/ouroborus-cosub-38556016" }], badges: [] },
        { title: "Manduhluh",                     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/manduhluh-103395152" }], badges: ["Haptic"] },
        { title: "Mind Killer",                   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/mind-killer-86414153" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 386, title: "Please Let Me Please", theme: "", date: "2025-10-04T21:00:00-04:00", dateLabel: "October 4, 2025",
      badges: ["Premiere", "Haptic"], hostesses: ["blissBlank", "swirlsAndTwirls"], starGuest: "",
      tracks: [
        { title: "Mind Popper",       links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Please Space",      links: [], badges: ["Premiere"] },
        { title: "Dumb Bell 5: Wave", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/wave-dumb-bell-5-21114081" }], badges: [] },
        { title: "Clicker - Neural mix", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/clicker-bliss-34647794" }], badges: [] },
        { title: "One Word: Please",  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/one-word-please-54089191" }], badges: [] },
        { title: "Edge Puppet",       links: [{ label: "Catalogue p.1", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-1/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/edge-puppet-19076652" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: ["Haptic"] },
        { title: "Inside Me",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/inside-me-2-71390641" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 385, title: "Echo", theme: "", date: "2025-09-27T21:00:00-04:00", dateLabel: "September 27, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "echoDoll"], starGuest: "",
      tracks: [
        { title: "Mind Popper",          links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Trouble",              links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/trouble-audio-136982523" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { title: "Sticky Bun Bun",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/sticky-bun-bun-112353175" }], badges: [] },
        { title: "Winner Winner",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/winner-winner-120301730" }], badges: [] },
        { title: "Velvet",               links: [{ label: "Patreon", url: "https://www.patreon.com/posts/velvet-complete-116034981" }], badges: [] },
        { title: "Room Service",         links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/room-service-not-136610134" }, { label: "Apron", url: "https://deepdreamstate.blubrry.net/neuralpedia-apron" }], badges: [] },
        { title: "Puppets Program Puppets", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/p3-puppet-audio-119687411" }], badges: ["Haptic"] },
        { title: "Thlut Trainer",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/thlut-trainer-110422402" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 384, title: "POPular Girls", theme: "", date: "2025-09-20T21:00:00-04:00", dateLabel: "September 20, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "kittenAzazel"], starGuest: "",
      tracks: [
        { title: "Mind Popper",  links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Rehearsal",    links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/rehearsal-136049930" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { title: "Tryout",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/tryout-60568795" }], badges: [] },
        { title: "Gyre",         links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/gyre-audio-fem-139133600" }, { label: "Sitri", url: "https://deepdreamstate.blubrry.net/neuralpedia-sitri" }], badges: [] },
        { title: "Conform",      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/conform-audio-119125030" }], badges: [] },
        { title: "Hypnotized Slut", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/hypnotized-slut-37312350" }], badges: ["Haptic"] },
        { title: "Cumplicate",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/cumplicate-68129831" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 383, title: "4EVA", theme: "", date: "2025-09-13T21:00:00-04:00", dateLabel: "September 13, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "fluxLynniegal"], starGuest: "",
      tracks: [
        { title: "Mind Popper",          links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "C*ck Dumb",            links: [{ label: "Patreon", url: "https://www.patreon.com/posts/cock-dumb-8704127" }], badges: [] },
        { title: "Homecoming - femme mix",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/homecoming-fem-59653025" }], badges: [] },
        { title: "Cusp",                 links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/cusp-audio-a3e5-139370708" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { title: "Scrubbing Bubbles",    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dum-bubbler-104201612" }], badges: [] },
        { title: "Pump Pep Squad",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/pump-pep-squad-107777363" }], badges: [] },
        { title: "Cumtrolla",            links: [{ label: "Patreon", url: "https://www.patreon.com/posts/cumtrolla-audio-96333663" }], badges: [] },
        { title: "One Word: Pink",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/pink-one-word-54639590" }], badges: ["Haptic"] },
        { title: "Mind Eraser Zero",     links: [{ label: "Catalogue p.1", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-1/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-eraser-zero-16487977" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 382, title: "Bimbot", theme: "", date: "2025-09-06T21:00:00-04:00", dateLabel: "September 6, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "swirlsAndTwirls"], starGuest: "",
      tracks: [
        { title: "Mind Popper",       links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Gazes Back",        links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/gazes-back-a3e4-138250677" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { title: "Machine Mind",      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dumb-bell-8-mind-24844086" }], badges: [] },
        { title: "Terms of Service",  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/terms-of-service-33666707" }], badges: [] },
        { title: "This Button Is Blue",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/this-button-is-122247652" }], badges: [] },
        { title: "Slavewave Trainer", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/slavewave-48150279" }], badges: ["Haptic"] },
        { title: "Metatrainer 1.0",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/metatrainer-1-0-70078273" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 381, title: "Blow Pop", theme: "", date: "2025-08-31T21:00:00-04:00", dateLabel: "August 31, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "dizzyDollie"], starGuest: "",
      tracks: [
        { title: "Mind Popper", links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Incubator",   links: [], badges: [] },
        { title: "Lollipopped", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/lollipopped-52298872" }], badges: [] },
        { title: "Blowpop",     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/candy-dish-91973358" }], badges: [] },
        { title: "Interface",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/interface-audio-116415197" }], badges: [] },
        { title: "Suck Hole",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/suck-hole-audio-109747068" }], badges: [] },
        { title: "Suck Sync",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/suck-sync-50566370" }], badges: ["Haptic"] },
        { title: "Cumplicate",  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/cumplicate-68129831" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 380, title: "Bimsday", theme: "", date: "2025-08-23T21:00:00-04:00", dateLabel: "August 23, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "bunLi"], starGuest: "",
      tracks: [
        { title: "Mind Popper",   links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Influence",     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/influence-68494690" }], badges: [] },
        { title: "Bun Bun",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/bun-bun-audio-111879218" }], badges: [] },
        { title: "Uplink",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/metaslut-episode-69721523" }], badges: [] },
        { title: "Bruiseflower",  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/bruiseflower-122584907" }], badges: [] },
        { title: "Passion Trained",links: [], badges: [] },
        { title: "Mind Killer",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/mind-killer-86414153" }], badges: ["Haptic"] },
        { title: "Three",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/3-audio-all-fem-116990156" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 379, title: "Happy Pill", theme: "", date: "2025-08-16T21:00:00-04:00", dateLabel: "August 16, 2025",
      badges: [], hostesses: ["blissBlank", "fluxLynniegal", "swirlsAndTwirls"], starGuest: "",
      tracks: [
        { title: "Mind Popper",                   links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Good Girls Make More Good Girls",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/good-girls-make-106286109" }], badges: [] },
        { title: "Scrubbing Bubbles",             links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dum-bubbler-104201612" }], badges: [] },
        { title: "Drill",                         links: [], badges: [] },
        { title: "Ping Pong",                     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/ping-pong-ding-29669472" }], badges: [] },
        { title: "Treadmill",                     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/treadmill-43992557" }], badges: [] },
        { title: "Brain Bubbler",                 links: [{ label: "Patreon", url: "https://www.patreon.com/posts/brain-bubbler-103069455" }], badges: [] },
        { title: "Deepest Hole",                  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/deepest-hole-65110299" }], badges: [] }
      ]
    },
    {
      number: 378, title: "Puppet Prep", theme: "", date: "2025-08-09T21:00:00-04:00", dateLabel: "August 9, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "dizzyDollie"], starGuest: "",
      tracks: [
        { title: "Mind Popper",    links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Rehearsal",      links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/rehearsal-136049930" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { title: "Distance Learning",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/distance-porn-37616132" }], badges: [] },
        { title: "Um Game",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/d-um-b-game-26456189" }], badges: [] },
        { title: "Please Teacher", links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/please-teacher-132315421" }, { label: "Directed Session", url: "https://deepdreamstate.blubrry.net/neuralpedia-directed-session" }], badges: [] },
        { title: "Dumgasm",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dumgasm-audio-105979038" }], badges: [] },
        { title: "Brain Tattoo",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/brain-tattoo-59531209" }], badges: ["Haptic"] },
        { title: "Babbling W****", links: [{ label: "Catalogue p.8", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-8/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/babbling-whore-63981331" }, { label: "Treatstick", url: "https://deepdreamstate.blubrry.net/neuralpedia-treatstick" }], badges: ["Haptic"] },
        { title: "Umlearn",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/umlearn-67709614" }], badges: ["Haptic"] }
      ]
    },
    {
      number: 377, title: "Winnerville", theme: "", date: "2025-08-02T21:00:00-04:00", dateLabel: "August 2, 2025",
      badges: ["Haptic"], hostesses: ["blissBlank", "fluxLynniegal"], starGuest: "",
      tracks: [
        { title: "Mind Popper",               links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { title: "Good Girls Make More Good Girls", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/good-girls-make-106286109" }], badges: [] },
        { title: "Mai Doll",                  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/mai-doll-audio-124259434" }], badges: [] },
        { title: "Dolly Go Round",            links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dolly-go-round-35029705" }], badges: [] },
        { title: "Good Girls Play With Dolls",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/good-girls-play-85714042" }], badges: [] },
        { title: "Yum Wave",                  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/yum-wave-audio-126835648" }], badges: [] },
        { title: "Empty",                     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/empty-55511875" }], badges: ["Haptic"] },
        { title: "Talk Gooder",               links: [{ label: "Patreon", url: "https://www.patreon.com/posts/talk-gooder-tied-112215920" }], badges: ["Haptic"] }
      ]
    }

  ] // end shows

}; // end DDP


// ── HELPERS ───────────────────────────────────────────────
// Resolve a hostess key to its full identity object.
// Returns a minimal fallback if key is not found.
window.DDP.resolveHostess = function(key) {
  return window.DDP.identity.hostesses[key] || { "@type": "Person", "name": key };
};

// Resolve an episode's hostesses array (keys) to full objects.
// Null-safe: handles missing or empty hostesses array.
window.DDP.resolveHostesses = function(show) {
  return (show.hostesses || []).map(function(key) {
    return window.DDP.resolveHostess(key);
  });
};
