// ============================================================
// DEEP DROP PARTY — SHOW DATA
// ============================================================
// HOW TO UPDATE EACH WEEK:
//
// 1. Copy shows[0] down to shows[1], shifting old [1] to [2], etc.
// 2. Edit shows[0] with the new episode.
// 3. Push. That's it.
//
// poster: URL string, or null for placeholder
// hostesses: array of { name, url } objects
// tracks: array of { pos, title, links: [{ label, url, style }], badges }
// ============================================================

window.DDP = {

  shows: [

    // ── [0] CURRENT SHOW ─────────────────────────────────────
    {
      number:      433,
      title:       "B.O.I.N.G. Convention",
      titleText:   "B.O.I.N.G. Convention",
      theme:       "Agents of B.O.I.N.G.",
      themeLabel:  "Theme",
      date:        "2026-06-06T21:00:00-04:00",
      dateLabel:   "Saturday, June 6",
      kicker:      "Saturday, June 6 · 9 PM Eastern",
      poster:      "https://neuralnetsandprettypatterns.com/boingagents.gif",
      posterAlt:   "Official poster for Deep Drop Party 433 - B.O.I.N.G. Convention.",
      description: [
        "The Deep Drop Party is more than audio experiments.  It's more than celebrating the longest running active spicy audio drama.",
        "Drama, yes.  Giggles, yes.  But we have INTRIGUE.",
        "You've heard of SHIELD and SWORD and MKU and VILE.  But have you ever met the agents of B.O.I.N.G. ?",
        "You can tonight.  They're having their convention in the Pink Room, with a sign up booth for you.",
        "You'll know them by their new anthem, which slips from their company issued headphones.  They call it <a href=\"https://musicbrainz.org/release/ace27780-b355-4f9c-973c-997271824c69\" target=\"_blank\" rel=\"noopener\">Brane Day</a> (<a href=\"https://www.patreon.com/posts/160091309\" target=\"_blank\" rel=\"noopener\">Patreon</a>).",
        "It's your Brane Day too.",
        "You just have to find your way there.  Pipp and Syndirella and Bliss Blank already have.  They're waiting for you.",
        "9 pm EST, discord.gg/thepinkroom"
      ],
      badges: [
        { label: "Free", cls: "badge-free" }
      ],
      hostesses: [
        { name: "Bliss Blank",  url: "https://www.tumblr.com/blink-blank-bliss" },
        { name: "Syndirella",   url: null },
        { name: "Pipp",         url: null }
      ],
      tracks: []
    },

    // ── [1] PREVIOUS SHOW ────────────────────────────────────
    {
      number:      432,
      title:       "Puppet Strings",
      titleText:   "Puppet Strings",
      theme:       "Dolls and the Dreams That Make Them Dance",
      themeLabel:  "Theme",
      date:        "2026-05-30T21:00:00-04:00",
      dateLabel:   "Saturday, May 30",
      kicker:      "Previous Show - Aired Saturday, May 30 · 9 PM Eastern",
      poster:      "https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/puppetstringsdeepdrop.png",
      posterAlt:   "Official poster for Deep Drop Party 432 - Puppet Strings.",
      description: [
        "The Deep Drop Party is the longest running broadcast show on Discord. It's been running uninterrupted weekly since 2018.",
        "With a resume like that, you have to ask. \"Who's pulling the strings?\"",
        "I mean, actually. You HAVE to ask. You have to be there tonight, at 9 PM EST. It's a rule.*",
        "You have to hear three hours of prestige audio. These tracks revolve around dolls and the dreams that make them dance. You have to pull Bliss Blank and Dizzy Dollie's puppet strings and hear what they say. You have to play the specialized Neuralverse ARG, Mind Libs. You have to hear a secret Premiere of a DDS-derived track.",
        "If you're very lucky, you might get fitted for a puppet string of your own. Come early and get the strings while supplies last.",
        "* This is a joke. DDP attendance is, in actuality, entirely voluntary. We would love it if you attended, though!",
        "** The Deep Drop Party is a joint production of Bliss Blank &amp; Neural Nets and Pretty Patterns, hosted on the Pink Room Discord Server."
      ],
      badges: [
        { label: "World Premiere", cls: "badge-premiere" },
        { label: "ARG",            cls: "badge-premiere" },
        { label: "Free",           cls: "badge-free" }
      ],
      hostesses: [
        { name: "Bliss Blank",  url: "https://www.tumblr.com/blink-blank-bliss" },
        { name: "Dizzy Dollie", url: "https://www.imdb.com/name/nm17760876/" }
      ],
      tracks: []
    },

    // ── [2+] ARCHIVE ─────────────────────────────────────────
    {
      number: 431, title: "QT&amp;A", titleText: "QT&A",
      theme: "Anonymous AMA", themeLabel: "Format",
      date: "2026-05-23T21:00:00-04:00", dateLabel: "Saturday, May 23",
      poster: null, posterAlt: null,
      description: [
        "The AMA is a time honored tradition of our great internet. Like most things, it works a little different in the Neuralverse. This one's for the QTs.",
        "We've set up so you can anonymously ask the hostesses questions before each track, about the track. They choose the question, but they have to answer honestly.",
        "Come to the premiere QT&amp;A. If this one works out, just wait until we rework Truth and Dare."
      ],
      badges: [
        { label: "Premiere Format", cls: "badge-premiere" },
        { label: "Anonymous AMA",  cls: "badge-ama" },
        { label: "Free",           cls: "badge-free" }
      ],
      hostesses: [
        { name: "Pandamoanium", url: "https://www.imdb.com/name/nm18291392/" },
        { name: "Bliss Blank",  url: "https://www.imdb.com/name/nm17754818/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",    links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-53618332" }], badges: [] },
        { pos: "02", title: "Interrogate",    links: [{ label: "Catalogue p.2", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-2/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/interrogation-19589803" }], badges: [] },
        { pos: "03", title: "Purpose",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/purpose-audio-155472761" }], badges: [] },
        { pos: "04", title: "Sinker",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/sinker-audio-152650657" }], badges: [] },
        { pos: "05", title: "Hook it Harder", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/hook-it-harder-154127312" }], badges: [] },
        { pos: "06", title: "Lollipopped",    links: [{ label: "Catalogue p.6", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-6/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/lollipopped-52298872" }], badges: [] },
        { pos: "07", title: "Display Loop",   links: [{ label: "Catalogue p.1", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-1/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/display-loop-11317620" }], badges: [] },
        { pos: "08", title: "Bounce",         links: [{ label: "Catalogue p.1", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-1/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/bounce-16643761" }], badges: [] },
        { pos: "09", title: "Plug &amp; Play",links: [{ label: "Catalogue p.3", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-3/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/plug-and-play-28678257" }], badges: [] },
        { pos: "10", title: "Make it Sparkle",links: [{ label: "Catalogue p.4", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-4/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/make-it-sparkle-32880928" }], badges: [] }
      ]
    },
    {
      number: 430, title: "DisOrientation", titleText: "DisOrientation",
      theme: "Neuroplex", themeLabel: "Theme",
      date: "2026-05-16T21:00:00-04:00", dateLabel: "May 16, 2026",
      poster: "https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/Disorientation%20-%20Official%20Deep%20Drop%20Party%20Poster.jpg",
      posterAlt: "Official poster for Deep Drop Party 430 - DisOrientation. A vintage typewriter on a hot pink background with the NNPP watermark shows a page reading Deep Drop Party DisOrientation.",
      description: [
        "You don't want to miss this memo.",
        "Tonight, we're having onboarding. You definitely want to get on. <a href=\"https://www.imdb.com/name/nm17754818/\" target=\"_blank\" rel=\"noopener\">Bliss</a> is in open blazer. <a href=\"https://www.imdb.com/name/nm17760876/\" target=\"_blank\" rel=\"noopener\">Dizzy Dollie</a> is in pencil skirt.",
        "This meeting cannot be an email. You need to come at 9 PM Eastern and get oriented.",
        "It's also a premiere - the full version of <a href=\"https://www.patreon.com/minderaser\" target=\"_blank\" rel=\"noopener\">Cortex</a> played tonight."
      ],
      badges: [
        { label: "World Premiere", cls: "badge-premiere" },
        { label: "Haptic",         cls: "badge-haptic" },
        { label: "Free",           cls: "badge-free" }
      ],
      hostesses: [
        { name: "Bliss Blank",  url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Dizzy Dollie", url: "https://www.imdb.com/name/nm17760876/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",          links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }], badges: [] },
        { pos: "02", title: "Bullseye",             links: [{ label: "Deep Dream State", url: "https://neuralnetsandprettypatterns.com/deepdreamstate/" }], badges: [] },
        { pos: "03", title: "3 2 1 Down",           links: [{ label: "Neuroplex", url: "https://neuralnetsandprettypatterns.com/neuralpedia/neuroplex/#321down", style: "catalogue" }], badges: [] },
        { pos: "04", title: "Typing Pool (excerpt)",links: [{ label: "Neuroplex", url: "https://neuralnetsandprettypatterns.com/neuralpedia/neuroplex/#typingpool", style: "catalogue" }], badges: [] },
        { pos: "05", title: "Cortex",               links: [{ label: "Patreon", url: "https://www.patreon.com/minderaser" }], badges: [{ label: "World Premiere", cls: "badge-premiere" }] },
        { pos: "06", title: "Umlearn Femme",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/umlearn-67709614" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "07", title: "S-Wave",               links: [{ label: "Patreon", url: "https://www.patreon.com/posts/slavewave-48150279" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 391, title: "Gummi Dummi", titleText: "Gummi Dummi",
      date: "2025-11-08T21:00:00-05:00", dateLabel: "November 8, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",       url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Echo Doll",         url: "https://www.imdb.com/name/nm17822435/" },
        { name: "Swirls and Twirls", url: "https://www.imdb.com/name/nm17864395/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",      links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Letter Dream",     links: [{ label: "Catalogue p.14", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-14/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/letter-dream-all-142952140" }, { label: "Shelf", url: "https://deepdreamstate.blubrry.net/neuralpedia-shelf" }, { label: "Unlearn University", url: "https://deepdreamstate.blubrry.net/neuralpedia-unlearn-university" }], badges: [] },
        { pos: "03", title: "Smoked Stupid",    links: [{ label: "Catalogue p.1",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-1/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/smoked-stupid-11327128" }], badges: [] },
        { pos: "04", title: "Grow",             links: [{ label: "Catalogue p.4",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-4/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/grow-36333504" }, { label: "Pink Dream", url: "https://deepdreamstate.blubrry.net/neuralpedia-pink-dream" }], badges: [] },
        { pos: "05", title: "Kandi",            links: [{ label: "Patreon", url: "https://www.patreon.com/posts/kandi-93471082" }], badges: [] },
        { pos: "06", title: "Grow - Chapter 3", links: [{ label: "Catalogue p.4",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-4/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/grow-36333504" }, { label: "Pink Dream", url: "https://deepdreamstate.blubrry.net/neuralpedia-pink-dream" }], badges: [] },
        { pos: "07", title: "Pink Dream",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/pink-dream-loops-50028027" }, { label: "Pink Dream", url: "https://deepdreamstate.blubrry.net/neuralpedia-pink-dream" }], badges: [{ label: "Haptic", cls: "badge-haptic" }, { label: "Premiere", cls: "badge-premiere" }] },
        { pos: "08", title: "Brain Bubbler",    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/brain-bubbler-103069455" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 390, title: "Dream Tank", titleText: "Dream Tank",
      date: "2025-11-01T21:00:00-05:00", dateLabel: "November 1, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",  url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Dizzy Dollie", url: "https://www.imdb.com/name/nm17760876/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",    links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Blank and Empty",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/blank-and-empty-105403558" }], badges: [] },
        { pos: "03", title: "Ever Moar",      links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/ever-moar-audio-142636704" }, { label: "Ministry of Halloween", url: "https://deepdreamstate.blubrry.net/neuralpedia-ministry-of-halloween" }], badges: [] },
        { pos: "04", title: "Maiden Voyage",  links: [{ label: "Catalogue p.12", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-12/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/chthonic-audio-121886159" }, { label: "Chthonic", url: "https://deepdreamstate.blubrry.net/neuralpedia-chthonic" }], badges: [] },
        { pos: "05", title: "Interface",      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/interface-audio-116415197" }], badges: [] },
        { pos: "06", title: "Lotus",          links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/lotus-audio-all-127872431" }, { label: "Naditu", url: "https://deepdreamstate.blubrry.net/neuralpedia-naditu" }, { label: "Cult Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-cult-classic" }], badges: [] },
        { pos: "07", title: "Drone Tank",     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/drone-tank-65984754" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "08", title: "Buzz Tank",      links: [], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 389, title: "All the Vibes", titleText: "All the Vibes",
      date: "2025-10-25T21:00:00-04:00", dateLabel: "October 25, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank", url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Bun-li",      url: "https://www.imdb.com/es-es/name/nm17796355/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",     links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Buzz Wave",       links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/buzz-wave-audio-142010682" }, { label: "Wavetrained", url: "https://deepdreamstate.blubrry.net/neuralpedia-wavetrained" }], badges: [] },
        { pos: "03", title: "Override",        links: [{ label: "Catalogue p.14", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-14/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/override-audio-143510642" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { pos: "04", title: "Rehearsal",       links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/rehearsal-136049930" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { pos: "05", title: "Green Room",      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/green-room-audio-102741775" }], badges: [] },
        { pos: "06", title: "Damage",          links: [{ label: "Patreon", url: "https://www.patreon.com/posts/damage-25472671" }], badges: [] },
        { pos: "07", title: "Inner Circle",    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/inner-circle-103650712" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "08", title: "Babbling W****",  links: [{ label: "Catalogue p.8",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-8/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/babbling-whore-63981331" }, { label: "Treatstick", url: "https://deepdreamstate.blubrry.net/neuralpedia-treatstick" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 388, title: "Seance", titleText: "Seance",
      date: "2025-10-18T21:00:00-04:00", dateLabel: "October 18, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",   url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Flux Lynniegal",url: "https://www.imdb.com/name/nm17796354/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",   links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Seance",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/seance-22427921" }], badges: [] },
        { pos: "03", title: "Shadow",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/shadow-audio-fem-125469613" }], badges: [] },
        { pos: "04", title: "Mister Spider", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/mister-spider-74404581" }], badges: [] },
        { pos: "05", title: "Sigil",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/sigil-35344870" }], badges: [] },
        { pos: "06", title: "Umlearn",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/umlearn-67709614" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "07", title: "Three",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/3-audio-all-fem-116990156" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 387, title: "Mind Off Mantras", titleText: "Mind Off Mantras",
      date: "2025-10-11T21:00:00-04:00", dateLabel: "October 11, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",  url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Dizzy Dollie", url: "https://www.imdb.com/name/nm17760876/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",                    links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Gyre",                           links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/gyre-audio-fem-139133600" }, { label: "Sitri", url: "https://deepdreamstate.blubrry.net/neuralpedia-sitri" }, { label: "Cult Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-cult-classic" }], badges: [] },
        { pos: "03", title: "Deepest Hole",                   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/deepest-hole-65110299" }], badges: [] },
        { pos: "04", title: "Good Girls Make More Good Girls", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/good-girls-make-106286109" }], badges: [] },
        { pos: "05", title: "Make It Sparkle",                links: [{ label: "Patreon", url: "https://www.patreon.com/posts/make-it-sparkle-32880928" }], badges: [] },
        { pos: "06", title: "Ouroborus, co-sub mix",          links: [{ label: "Patreon", url: "https://www.patreon.com/posts/ouroborus-cosub-38556016" }], badges: [] },
        { pos: "07", title: "Manduhluh",                      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/manduhluh-103395152" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "08", title: "Mind Killer",                    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/mind-killer-86414153" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 386, title: "Please Let Me Please", titleText: "Please Let Me Please",
      date: "2025-10-04T21:00:00-04:00", dateLabel: "October 4, 2025",
      poster: null, badges: [{ label: "Premiere", cls: "badge-premiere" }, { label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",       url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Swirls and Twirls", url: "https://www.imdb.com/name/nm17864395/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",        links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Please Space",       links: [], badges: [{ label: "Premiere", cls: "badge-premiere" }] },
        { pos: "03", title: "Dumb Bell 5: Wave",  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/wave-dumb-bell-5-21114081" }], badges: [] },
        { pos: "04", title: "Clicker - Neural mix",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/clicker-bliss-34647794" }], badges: [] },
        { pos: "05", title: "One Word: Please",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/one-word-please-54089191" }], badges: [] },
        { pos: "06", title: "Edge Puppet",        links: [{ label: "Catalogue p.1", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-1/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/edge-puppet-19076652" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "07", title: "Inside Me",          links: [{ label: "Patreon", url: "https://www.patreon.com/posts/inside-me-2-71390641" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 385, title: "Echo", titleText: "Echo",
      date: "2025-09-27T21:00:00-04:00", dateLabel: "September 27, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank", url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Echo Doll",   url: "https://www.imdb.com/name/nm17822435/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",           links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Trouble",               links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/trouble-audio-136982523" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { pos: "03", title: "Sticky Bun Bun",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/sticky-bun-bun-112353175" }], badges: [] },
        { pos: "04", title: "Winner Winner",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/winner-winner-120301730" }], badges: [] },
        { pos: "05", title: "Velvet",                links: [{ label: "Patreon", url: "https://www.patreon.com/posts/velvet-complete-116034981" }], badges: [] },
        { pos: "06", title: "Room Service",          links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/room-service-not-136610134" }, { label: "Apron", url: "https://deepdreamstate.blubrry.net/neuralpedia-apron" }], badges: [] },
        { pos: "07", title: "Puppets Program Puppets",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/p3-puppet-audio-119687411" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "08", title: "Thlut Trainer",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/thlut-trainer-110422402" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 384, title: "POPular Girls", titleText: "POPular Girls",
      date: "2025-09-20T21:00:00-04:00", dateLabel: "September 20, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",   url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Kitten Azazel", url: "https://www.imdb.com/name/nm17774343/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",     links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Rehearsal",       links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/rehearsal-136049930" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { pos: "03", title: "Tryout",          links: [{ label: "Patreon", url: "https://www.patreon.com/posts/tryout-60568795" }], badges: [] },
        { pos: "04", title: "Gyre",            links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/gyre-audio-fem-139133600" }, { label: "Sitri", url: "https://deepdreamstate.blubrry.net/neuralpedia-sitri" }], badges: [] },
        { pos: "05", title: "Conform",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/conform-audio-119125030" }], badges: [] },
        { pos: "06", title: "Hypnotized Slut", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/hypnotized-slut-37312350" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "07", title: "Cumplicate",      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/cumplicate-68129831" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 383, title: "4EVA", titleText: "4EVA",
      date: "2025-09-13T21:00:00-04:00", dateLabel: "September 13, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",   url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Flux Lynniegal",url: "https://www.imdb.com/name/nm17796354/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",           links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "C*ck Dumb",             links: [{ label: "Patreon", url: "https://www.patreon.com/posts/cock-dumb-8704127" }], badges: [] },
        { pos: "03", title: "Homecoming - femme mix", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/homecoming-fem-59653025" }], badges: [] },
        { pos: "04", title: "Cusp",                  links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/cusp-audio-a3e5-139370708" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { pos: "05", title: "Scrubbing Bubbles",     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dum-bubbler-104201612" }], badges: [] },
        { pos: "06", title: "Pump Pep Squad",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/pump-pep-squad-107777363" }], badges: [] },
        { pos: "07", title: "Cumtrolla",             links: [{ label: "Patreon", url: "https://www.patreon.com/posts/cumtrolla-audio-96333663" }], badges: [] },
        { pos: "08", title: "One Word: Pink",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/pink-one-word-54639590" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "09", title: "Mind Eraser Zero",      links: [{ label: "Catalogue p.1", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-1/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-eraser-zero-16487977" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 382, title: "Bimbot", titleText: "Bimbot",
      date: "2025-09-06T21:00:00-04:00", dateLabel: "September 6, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",       url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Swirls and Twirls", url: "https://www.imdb.com/name/nm17864395/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",        links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Gazes Back",         links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/gazes-back-a3e4-138250677" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { pos: "03", title: "Machine Mind",       links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dumb-bell-8-mind-24844086" }], badges: [] },
        { pos: "04", title: "Terms of Service",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/terms-of-service-33666707" }], badges: [] },
        { pos: "05", title: "This Button Is Blue",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/this-button-is-122247652" }], badges: [] },
        { pos: "06", title: "Slavewave Trainer",  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/slavewave-48150279" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "07", title: "Metatrainer 1.0",    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/metatrainer-1-0-70078273" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 381, title: "Blow Pop", titleText: "Blow Pop",
      date: "2025-08-31T21:00:00-04:00", dateLabel: "August 31, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",  url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Dizzy Dollie", url: "https://www.imdb.com/name/nm17760876/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper", links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Incubator",   links: [], badges: [] },
        { pos: "03", title: "Lollipopped", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/lollipopped-52298872" }], badges: [] },
        { pos: "04", title: "Blowpop",     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/candy-dish-91973358" }], badges: [] },
        { pos: "05", title: "Interface",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/interface-audio-116415197" }], badges: [] },
        { pos: "06", title: "Suck Hole",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/suck-hole-audio-109747068" }], badges: [] },
        { pos: "07", title: "Suck Sync",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/suck-sync-50566370" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "08", title: "Cumplicate",  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/cumplicate-68129831" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 380, title: "Bimsday", titleText: "Bimsday",
      date: "2025-08-23T21:00:00-04:00", dateLabel: "August 23, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank", url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Bun-li",      url: "https://www.imdb.com/es-es/name/nm17796355/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",    links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Influence",      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/influence-68494690" }], badges: [] },
        { pos: "03", title: "Bun Bun",        links: [{ label: "Patreon", url: "https://www.patreon.com/posts/bun-bun-audio-111879218" }], badges: [] },
        { pos: "04", title: "Uplink",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/metaslut-episode-69721523" }], badges: [] },
        { pos: "05", title: "Bruiseflower",   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/bruiseflower-122584907" }], badges: [] },
        { pos: "06", title: "Passion Trained",links: [], badges: [] },
        { pos: "07", title: "Mind Killer",    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/mind-killer-86414153" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "08", title: "Three",          links: [{ label: "Patreon", url: "https://www.patreon.com/posts/3-audio-all-fem-116990156" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 379, title: "Happy Pill", titleText: "Happy Pill",
      date: "2025-08-16T21:00:00-04:00", dateLabel: "August 16, 2025",
      poster: null, badges: [],
      hostesses: [
        { name: "Bliss Blank",       url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Flux Lynniegal",    url: "https://www.imdb.com/name/nm17796354/" },
        { name: "Swirls and Twirls", url: "https://www.imdb.com/name/nm17864395/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",                    links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Good Girls Make More Good Girls", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/good-girls-make-106286109" }], badges: [] },
        { pos: "03", title: "Scrubbing Bubbles",              links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dum-bubbler-104201612" }], badges: [] },
        { pos: "04", title: "Drill",                          links: [], badges: [] },
        { pos: "05", title: "Ping Pong",                      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/ping-pong-ding-29669472" }], badges: [] },
        { pos: "06", title: "Treadmill",                      links: [{ label: "Patreon", url: "https://www.patreon.com/posts/treadmill-43992557" }], badges: [] },
        { pos: "07", title: "Brain Bubbler",                  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/brain-bubbler-103069455" }], badges: [] },
        { pos: "08", title: "Deepest Hole",                   links: [{ label: "Patreon", url: "https://www.patreon.com/posts/deepest-hole-65110299" }], badges: [] }
      ]
    },
    {
      number: 378, title: "Puppet Prep", titleText: "Puppet Prep",
      date: "2025-08-09T21:00:00-04:00", dateLabel: "August 9, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",  url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Dizzy Dollie", url: "https://www.imdb.com/name/nm17760876/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",     links: [{ label: "Catalogue p.7",  url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/",  style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Rehearsal",       links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/rehearsal-136049930" }, { label: "Deep Dream State", url: "https://deepdreamstate.blubrry.net/neuralpedia-deep-dream-state" }], badges: [] },
        { pos: "03", title: "Distance Learning",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/distance-porn-37616132" }], badges: [] },
        { pos: "04", title: "Um Game",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/d-um-b-game-26456189" }], badges: [] },
        { pos: "05", title: "Please Teacher",  links: [{ label: "Catalogue p.13", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-13/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/please-teacher-132315421" }, { label: "Directed Session", url: "https://deepdreamstate.blubrry.net/neuralpedia-directed-session" }], badges: [] },
        { pos: "06", title: "Dumgasm",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dumgasm-audio-105979038" }], badges: [] },
        { pos: "07", title: "Brain Tattoo",    links: [{ label: "Patreon", url: "https://www.patreon.com/posts/brain-tattoo-59531209" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "08", title: "Babbling W****",  links: [{ label: "Catalogue p.8", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-8/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/babbling-whore-63981331" }, { label: "Treatstick", url: "https://deepdreamstate.blubrry.net/neuralpedia-treatstick" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "09", title: "Umlearn",         links: [{ label: "Patreon", url: "https://www.patreon.com/posts/umlearn-67709614" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    },
    {
      number: 377, title: "Winnerville", titleText: "Winnerville",
      date: "2025-08-02T21:00:00-04:00", dateLabel: "August 2, 2025",
      poster: null, badges: [{ label: "Haptic", cls: "badge-haptic" }],
      hostesses: [
        { name: "Bliss Blank",   url: "https://www.imdb.com/name/nm17754818/" },
        { name: "Flux Lynniegal",url: "https://www.imdb.com/name/nm17796354/" }
      ],
      tracks: [
        { pos: "01", title: "Mind Popper",               links: [{ label: "Catalogue p.7", url: "https://neuralnetsandprettypatterns.com/neuralpedia/chronology/page-7/", style: "catalogue" }, { label: "Patreon", url: "https://www.patreon.com/posts/mind-popper-8700710" }, { label: "Classic", url: "https://deepdreamstate.blubrry.net/neuralpedia-classic" }], badges: [] },
        { pos: "02", title: "Good Girls Make More Good Girls", links: [{ label: "Patreon", url: "https://www.patreon.com/posts/good-girls-make-106286109" }], badges: [] },
        { pos: "03", title: "Mai Doll",                  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/mai-doll-audio-124259434" }], badges: [] },
        { pos: "04", title: "Dolly Go Round",            links: [{ label: "Patreon", url: "https://www.patreon.com/posts/dolly-go-round-35029705" }], badges: [] },
        { pos: "05", title: "Good Girls Play With Dolls",links: [{ label: "Patreon", url: "https://www.patreon.com/posts/good-girls-play-85714042" }], badges: [] },
        { pos: "06", title: "Yum Wave",                  links: [{ label: "Patreon", url: "https://www.patreon.com/posts/yum-wave-audio-126835648" }], badges: [] },
        { pos: "07", title: "Empty",                     links: [{ label: "Patreon", url: "https://www.patreon.com/posts/empty-55511875" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] },
        { pos: "08", title: "Talk Gooder",               links: [{ label: "Patreon", url: "https://www.patreon.com/posts/talk-gooder-tied-112215920" }], badges: [{ label: "Haptic", cls: "badge-haptic" }] }
      ]
    }

  ] // end shows

}; // end DDP
