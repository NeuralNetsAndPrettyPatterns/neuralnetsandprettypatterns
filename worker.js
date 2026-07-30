export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p === "/api/contact") {
      return handleContactPost(request, env);
    }

    // CYOA poll results
    if (p === "/api/cyoa/results") {
      return handleCyoaResults(request, env);
    }

    // CYOA ballot submission
    if (p === "/api/cyoa/vote") {
      return handleCyoaVote(request, env);
    }

    // Mantra Sync leaderboard
    if (p === "/api/mantra-sync/leaderboard") {
      return handleMantraLeaderboard(request, env);
    }

    // Mantra Sync completed score submission
    if (p === "/api/mantra-sync/score") {
      return handleMantraScore(request, env);
    }

    // Mantra Sync mantra bank from Cloudflare KV
    if (p === "/games/mantra-sync/mantra-bank.json") {
      return handleMantraBank(request, env);
    }

    // Mantra Sync D1 connectivity test
    if (p === "/api/mantra-sync/test-db") {
      try {
        const result = await env.mantrasync
          .prepare(
            "SELECT COUNT(*) AS score_count FROM mantra_scores"
          )
          .first();

        return Response.json({
          ok: true,
          database: "mantrasyncboard",
          score_count: result?.score_count ?? 0
        });
      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: String(error)
          },
          { status: 500 }
        );
      }
    }

    const MAIN_REPO_BASE =
      "https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main";

    const LEGACY_DDS_BASE =
      "https://neuralnetsandprettypatterns.github.io/deepdreamstate";

    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8"
    };

    function fileType(path) {
      const lastSlash = path.lastIndexOf("/");
      const lastDot = path.lastIndexOf(".");

      if (lastDot <= lastSlash) return null;

      const ext = path.slice(lastDot).toLowerCase();
      return contentTypes[ext] || null;
    }

    function imgType(path) {
      const lastSlash = path.lastIndexOf("/");
      const lastDot = path.lastIndexOf(".");

      if (lastDot <= lastSlash) return null;

      const ext = path.slice(lastDot).toLowerCase();

      const imageTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml"
      };

      return imageTypes[ext] || null;
    }

    function mainRepoUrl(repoPath) {
      return `${MAIN_REPO_BASE}${repoPath}`;
    }

    async function serveHtml(repoPath, noStore = false) {
      const res = await fetch(mainRepoUrl(repoPath));

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
          ...(noStore ? { "cache-control": "no-store" } : {})
        }
      });
    }

    async function serveAsset(
      repoPath,
      ct,
      cache = "public, max-age=86400"
    ) {
      const res = await fetch(mainRepoUrl(repoPath));

      return new Response(res.body, {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": ct,
          "cache-control": cache
        }
      });
    }

    function mainRepoPathForRequest(path) {
      if (path.endsWith("/")) return `${path}index.html`;
      if (fileType(path)) return path;
      return `${path}/index.html`;
    }

    async function legacyDeepDreamStateProxy(path, requestUrl) {
      const githubPath = path.replace("/deepdreamstate", "");
      const proxyUrl =
        `${LEGACY_DDS_BASE}${githubPath}${requestUrl.search}`;

      const response = await fetch(proxyUrl);
      const contentType =
        response.headers.get("content-type") || "";

      if (
        contentType.includes("text/html") ||
        contentType.includes("javascript")
      ) {
        let text = await response.text();

        text = text.replaceAll(
          "https://neuralnetsandprettypatterns.github.io/deepdreamstate",
          "https://neuralnetsandprettypatterns.com/deepdreamstate"
        );

        return new Response(text, {
          status: response.status,
          headers: {
            "content-type": contentType
          }
        });
      }

      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    }

    async function serveMigratedDeepDreamStatePathWithFallback(
      path,
      requestUrl
    ) {
      const repoPath = mainRepoPathForRequest(path);
      const migratedRes = await fetch(mainRepoUrl(repoPath));

      if (migratedRes.ok) {
        const ct =
          fileType(repoPath) || "text/html; charset=utf-8";

        return new Response(migratedRes.body, {
          status: migratedRes.status,
          headers: {
            "content-type": ct,
            "cache-control": "no-store"
          }
        });
      }

      return legacyDeepDreamStateProxy(path, requestUrl);
    }

    // Root
    if (p === "/" || p === "/index.html") {
      return serveHtml("/index.html");
    }

    // Contact
    if (
      p === "/contact" ||
      p === "/contact/" ||
      p === "/contact/index.html"
    ) {
      return serveHtml("/contact/index.html", true);
    }

    // Games hub
    if (
      p === "/games" ||
      p === "/games/" ||
      p === "/games/index.html"
    ) {
      return serveHtml(
        "/games/index.html",
        true
      );
    }


    // Neuralverse CYOA
    if (
      p === "/games/cyoa" ||
      p === "/games/cyoa/" ||
      p === "/games/cyoa/index.html"
    ) {
      return serveHtml(
        "/games/cyoa/index.html",
        true
      );
    }


    // Sitri Lab Safety Orientation
    if (
      p === "/games/sitrilabsafety" ||
      p === "/games/sitrilabsafety/" ||
      p === "/games/sitrilabsafety/index.html"
    ) {
      return serveHtml(
        "/games/sitrilabsafety/index.html",
        true
      );
    }


    // Sitri Dream Team Drills
    if (
      p === "/games/sitricharacters" ||
      p === "/games/sitricharacters/" ||
      p === "/games/sitricharacters/index.html"
    ) {
      return serveHtml(
        "/games/sitricharacters/index.html",
        true
      );
    }

    // Mantra Sync game page
    if (
      p === "/games/mantra-sync" ||
      p === "/games/mantra-sync/" ||
      p === "/games/mantra-sync/index.html"
    ) {
      return serveHtml(
        "/games/mantra-sync/index.html",
        true
      );
    }

    // Sitemap
    if (p === "/sitemap.xml") {
      const res = await fetch(mainRepoUrl("/sitemap.xml"));

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/xml; charset=utf-8"
        }
      });
    }

    // Root JS
    if (p === "/show-data.js") {
      const res = await fetch(mainRepoUrl("/show-data.js"));

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // Shared site-wide nav buttons (used by the home page and other
    // pages that render their nav from JSON instead of hardcoding it)
    if (p === "/nav-buttons.json") {
      return serveAsset(
        "/nav-buttons.json",
        "application/json; charset=utf-8",
        "no-store"
      );
    }

    // Deep Dream State migrated arc pages and assets
    // New main repo file wins when present.
    // Missing main repo file falls back to the legacy Deep Dream State site.
    // This must run before the generic image handler so migrated arc images can use fallback too.
    if (
      p === "/deepdreamstate/arcs/chthonic" ||
      p.startsWith("/deepdreamstate/arcs/chthonic/") ||
      p === "/deepdreamstate/arcs/incognitoh" ||
      p.startsWith("/deepdreamstate/arcs/incognitoh/") ||
      p === "/deepdreamstate/arcs/sitri" ||
      p.startsWith("/deepdreamstate/arcs/sitri/") ||
      p === "/deepdreamstate/arcs/vale-four" ||
      p.startsWith("/deepdreamstate/arcs/vale-four/")
    ) {
      return serveMigratedDeepDreamStatePathWithFallback(
        p,
        url
      );
    }

    // Images anywhere else in the site
    {
      const ct = imgType(p);

      if (ct) {
        return serveAsset(p, ct);
      }
    }

    // The Pink Room
    if (
      p === "/the-pink-room" ||
      p === "/the-pink-room/"
    ) {
      return serveHtml("/the-pink-room/index.html");
    }

    if (
      p === "/the-pink-room/weekly-events" ||
      p === "/the-pink-room/weekly-events/"
    ) {
      return serveHtml(
        "/the-pink-room/weekly-events/index.html",
        true
      );
    }

    if (
      p === "/the-pink-room/weekly-events/events-data.js"
    ) {
      const res = await fetch(
        mainRepoUrl(
          "/the-pink-room/weekly-events/events-data.js"
        )
      );

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // Deep Drop Party
    if (
      p === "/deep-drop-party" ||
      p === "/deep-drop-party/"
    ) {
      return serveHtml("/deep-drop-party/index.html");
    }

    if (
      p === "/deep-drop-party/now" ||
      p === "/deep-drop-party/now/"
    ) {
      return serveHtml(
        "/deep-drop-party/now/index.html"
      );
    }

    if (
      p === "/deep-drop-party/faq" ||
      p === "/deep-drop-party/faq/"
    ) {
      return serveHtml(
        "/deep-drop-party/faq/index.html"
      );
    }

    if (
      p === "/deep-drop-party/episodes" ||
      p === "/deep-drop-party/episodes/"
    ) {
      return serveHtml(
        "/deep-drop-party/episodes/index.html"
      );
    }

    if (
      p === "/deep-drop-party/testpage" ||
      p === "/deep-drop-party/testpage/"
    ) {
      return serveHtml(
        "/deep-drop-party/testpage/index.html",
        true
      );
    }

    // Scripts
    if (
      p === "/scripts" ||
      p === "/scripts/"
    ) {
      return serveHtml("/scripts/index.html", true);
    }

    if (p === "/scripts/scripts.json") {
      const res = await fetch(
        mainRepoUrl("/scripts/scripts.json")
      );

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // Neuralpedia assets and pages
    if (p.startsWith("/neuralpedia/")) {
      const ct = fileType(p);

      if (ct && !p.endsWith(".html")) {
        const res = await fetch(mainRepoUrl(p));

        if (!res.ok) {
          return new Response("Not found", {
            status: 404
          });
        }

        return new Response(res.body, {
          status: res.status,
          headers: {
            "content-type": ct,
            "cache-control": "public, max-age=3600"
          }
        });
      }

      if (
        p === "/neuralpedia" ||
        p === "/neuralpedia/"
      ) {
        return serveHtml(
          "/neuralpedia/index.html"
        );
      }

      const path = p.endsWith("/") ? p : p + "/";
      const res = await fetch(
        mainRepoUrl(`${path}index.html`)
      );

      if (res.ok) {
        return new Response(await res.text(), {
          headers: {
            "content-type": "text/html; charset=utf-8"
          }
        });
      }

      return new Response("Not found", {
        status: 404
      });
    }

    if (
      p === "/neuralpedia" ||
      p === "/neuralpedia/"
    ) {
      return serveHtml("/neuralpedia/index.html");
    }

    // Shared Deep Dream State navigation
    if (p === "/deepdreamstate/navigation.json") {
      return serveAsset(
        "/deepdreamstate/navigation.json",
        "application/json; charset=utf-8",
        "no-store"
      );
    }

    if (p === "/deepdreamstate/navigation.js") {
      return serveAsset(
        "/deepdreamstate/navigation.js",
        "application/javascript; charset=utf-8",
        "no-store"
      );
    }

    // Deep Dream State cast page
    if (
      p === "/deepdreamstate/cast" ||
      p === "/deepdreamstate/cast/" ||
      p === "/deepdreamstate/cast/index.html"
    ) {
      return serveHtml(
        "/deepdreamstate/cast/index.html",
        true
      );
    }

    // Deep Dream State cast data
    if (p === "/deepdreamstate/cast.json") {
      return serveAsset(
        "/deepdreamstate/cast.json",
        "application/json; charset=utf-8",
        "no-store"
      );
    }

    // Deep Dream State glossary
    if (
      p === "/deepdreamstate/glossary" ||
      p === "/deepdreamstate/glossary/"
    ) {
      return serveHtml(
        "/deepdreamstate/glossary/index.html",
        true
      );
    }

    if (
      p === "/deepdreamstate/glossary/glossary.json"
    ) {
      const res = await fetch(
        mainRepoUrl(
          "/deepdreamstate/glossary/glossary.json"
        )
      );

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    if (
      p === "/deepdreamstate/glossary/appearances.json"
    ) {
      const res = await fetch(
        mainRepoUrl(
          "/deepdreamstate/glossary/appearances.json"
        )
      );

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // Deep Dream State arcs index
    if (
      p === "/deepdreamstate/arcs" ||
      p === "/deepdreamstate/arcs/"
    ) {
      return serveHtml(
        "/deepdreamstate/arcs/index.html",
        true
      );
    }

    // Deep Dream State home
    if (
      p === "/deepdreamstate" ||
      p === "/deepdreamstate/"
    ) {
      return serveHtml(
        "/deepdreamstate/index.html",
        true
      );
    }

    // Deep Dream State legacy catch-all
    // Anything not carved out above still proxies to the old Deep Dream State GitHub Pages site.
    if (p.startsWith("/deepdreamstate")) {
      return legacyDeepDreamStateProxy(p, url);
    }

    // 404
    return new Response("Not found", {
      status: 404
    });
  }
};

// Recipient fallback is in the Worker, not in contact/index.html.
// Override either value with Worker environment variables if needed.
const CONTACT_TO_FALLBACK =
  "deepdreamstates@gmail.com";

const CONTACT_FROM_FALLBACK =
  "Deep Dream State Contact <contact@neuralnetsandprettypatterns.com>";

const CONTACT_CATEGORY_LABELS = {
  "voice-auditions": "Voice auditions",
  "collabs-active-creators": "Collabs (active creators)",
  "patreon-questions": "Patreon questions",
  "press-inquiries": "Press inquiries",
  "project-inquiries": "Project inquiries",
  "other": "Other"
};

async function handleContactPost(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: contactCorsHeaders(request)
    });
  }

  if (request.method !== "POST") {
    return contactResponse(
      request,
      {
        ok: false,
        error: "Method not allowed."
      },
      405,
      {
        Allow: "POST"
      }
    );
  }

  if (!env || !env.RESEND_API_KEY) {
    return contactResponse(
      request,
      {
        ok: false,
        error:
          "Contact form is not configured: RESEND_API_KEY is missing."
      },
      500
    );
  }

  const contactTo =
    env.CONTACT_TO || CONTACT_TO_FALLBACK;

  const contactFrom =
    env.CONTACT_FROM || CONTACT_FROM_FALLBACK;

  let fields;

  try {
    fields = await readContactFields(request);
  } catch (err) {
    return contactResponse(
      request,
      {
        ok: false,
        error: "Could not read form submission."
      },
      400
    );
  }

  const validationError =
    validateContactFields(fields);

  if (validationError) {
    return contactResponse(
      request,
      {
        ok: false,
        error: validationError
      },
      400
    );
  }

  const categoryLabel =
    CONTACT_CATEGORY_LABELS[fields.category];

  const subject =
    `[NNPP Contact] ${categoryLabel}`;

  const textBody =
    buildContactTextBody(
      fields,
      categoryLabel,
      request
    );

  const htmlBody =
    buildContactHtmlBody(
      fields,
      categoryLabel,
      request
    );

  const resendPayload = {
    from: contactFrom,
    to: [contactTo],
    reply_to: fields.email,
    subject,
    text: textBody,
    html: htmlBody
  };

  const resendResponse = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        "Authorization":
          `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(resendPayload)
    }
  );

  if (!resendResponse.ok) {
    let detail = "";

    try {
      detail = JSON.stringify(
        await resendResponse.json()
      );
    } catch (err) {
      detail = await resendResponse.text();
    }

    console.error(
      "Resend contact email failed:",
      resendResponse.status,
      detail
    );

    return contactResponse(
      request,
      {
        ok: false,
        error: "Message could not be sent."
      },
      502
    );
  }

  return contactResponse(
    request,
    {
      ok: true,
      message: "Message sent."
    },
    200
  );
}

async function readContactFields(request) {
  const contentType =
    request.headers.get("content-type") || "";

  const fields = {};

  if (
    contentType.includes("application/json")
  ) {
    const json = await request.json();

    Object.entries(json || {}).forEach(
      ([key, value]) => {
        fields[key] = normalizeField(value);
      }
    );

    return fields;
  }

  if (
    contentType.includes(
      "application/x-www-form-urlencoded"
    ) ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();

    for (const [key, value] of formData.entries()) {
      fields[key] = normalizeField(value);
    }

    return fields;
  }

  throw new Error("Unsupported content type");
}

function normalizeField(value) {
  if (typeof value !== "string") return "";

  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function validateContactFields(fields) {
  if (fields.company_url) {
    return "Message could not be sent.";
  }

  if (
    fields.form_name &&
    fields.form_name !==
      "deep-dream-state-contact"
  ) {
    return "Invalid form submission.";
  }

  if (!hasLength(fields.name, 2, 120)) {
    return "Please enter your name.";
  }

  if (!isValidEmail(fields.email)) {
    return "Please enter a valid reply email.";
  }

  if (
    !CONTACT_CATEGORY_LABELS[fields.category]
  ) {
    return "Please choose a subject category.";
  }

  if (!hasLength(fields.message, 10, 4000)) {
    return (
      "Please enter a message between " +
      "10 and 4000 characters."
    );
  }

  const maxLengths = {
    performer_name: 140,
    demo_link: 500,
    voice_notes: 300,
    audition_links: 500,
    creator_name: 160,
    creator_platform: 500,
    collab_idea: 1500,
    patreon_name: 160,
    patreon_topic: 120,
    outlet: 180,
    press_deadline: 120,
    press_request: 1500,
    project: 120,
    project_link: 500,
    other_subject: 180
  };

  for (
    const [key, max] of
    Object.entries(maxLengths)
  ) {
    if ((fields[key] || "").length > max) {
      return "One of the form fields is too long.";
    }
  }

  for (
    const urlKey of
    ["demo_link", "project_link"]
  ) {
    const value = fields[urlKey];

    if (value && !isProbablyUrl(value)) {
      return (
        "Please enter valid URLs where " +
        "URLs are requested."
      );
    }
  }

  return "";
}

function hasLength(value, min, max) {
  const text = String(value || "").trim();

  return (
    text.length >= min &&
    text.length <= max
  );
}

function isValidEmail(value) {
  const email =
    String(value || "").trim();

  if (email.length > 254) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function isProbablyUrl(value) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch (err) {
    return false;
  }
}

function buildContactTextBody(
  fields,
  categoryLabel,
  request
) {
  const lines = [
    "New Neural Nets and Pretty Patterns contact form submission",
    "",
    `Category: ${categoryLabel}`,
    `Name: ${fields.name}`,
    `Reply Email: ${fields.email}`,
    "",
    "Category Details:",
    ...categoryDetailLines(fields),
    "",
    "Message:",
    fields.message,
    "",
    "Technical:",
    `Submitted from: ${
      request.headers.get("referer") ||
      "unknown"
    }`,
    `User agent: ${
      request.headers.get("user-agent") ||
      "unknown"
    }`
  ];

  return lines
    .filter(
      line =>
        line !== null &&
        line !== undefined
    )
    .join("\n");
}

function buildContactHtmlBody(
  fields,
  categoryLabel,
  request
) {
  const details = categoryDetailLines(fields)
    .filter(Boolean)
    .map(line => {
      const index = line.indexOf(":");

      if (index === -1) {
        return `<p>${escapeHtml(line)}</p>`;
      }

      const label = line.slice(0, index);
      const value =
        line.slice(index + 1).trim();

      return (
        `<p><strong>${escapeHtml(label)}:</strong> ` +
        `${linkifyIfUrl(value)}</p>`
      );
    })
    .join("");

  return `<!doctype html>
<html>
<body style="font-family: Georgia, serif; line-height: 1.5; color: #111;">
  <h2>New Neural Nets and Pretty Patterns contact form submission</h2>
  <p><strong>Category:</strong> ${escapeHtml(categoryLabel)}</p>
  <p><strong>Name:</strong> ${escapeHtml(fields.name)}</p>
  <p><strong>Reply Email:</strong> ${escapeHtml(fields.email)}</p>

  <h3>Category Details</h3>
  ${details || "<p>No extra category details supplied.</p>"}

  <h3>Message</h3>
  <div style="white-space: pre-wrap; padding: 12px; border-left: 3px solid #999; background: #f7f7f7;">${escapeHtml(fields.message)}</div>

  <h3>Technical</h3>
  <p><strong>Submitted from:</strong> ${escapeHtml(request.headers.get("referer") || "unknown")}</p>
  <p><strong>User agent:</strong> ${escapeHtml(request.headers.get("user-agent") || "unknown")}</p>
</body>
</html>`;
}

function categoryDetailLines(fields) {
  switch (fields.category) {
    case "voice-auditions":
      return compactLines([
        fieldLine(
          "Performer name",
          fields.performer_name
        ),
        fieldLine(
          "Demo link",
          fields.demo_link
        ),
        fieldLine(
          "Voice / range notes",
          fields.voice_notes
        ),
        fieldLine(
          "Relevant links",
          fields.audition_links
        )
      ]);

    case "collabs-active-creators":
      return compactLines([
        fieldLine(
          "Creator / project name",
          fields.creator_name
        ),
        fieldLine(
          "Platform / links",
          fields.creator_platform
        ),
        fieldLine(
          "Collab idea",
          fields.collab_idea
        )
      ]);

    case "patreon-questions":
      return compactLines([
        fieldLine(
          "Patreon username",
          fields.patreon_name
        ),
        fieldLine(
          "Patreon topic",
          fields.patreon_topic
        )
      ]);

    case "press-inquiries":
      return compactLines([
        fieldLine(
          "Outlet / publication",
          fields.outlet
        ),
        fieldLine(
          "Deadline",
          fields.press_deadline
        ),
        fieldLine(
          "Press request",
          fields.press_request
        )
      ]);

    case "project-inquiries":
      return compactLines([
        fieldLine(
          "Project",
          fields.project
        ),
        fieldLine(
          "Relevant link",
          fields.project_link
        )
      ]);

    case "other":
      return compactLines([
        fieldLine(
          "Short subject",
          fields.other_subject
        )
      ]);

    default:
      return [];
  }
}

function fieldLine(label, value) {
  const text =
    String(value || "").trim();

  return text
    ? `${label}: ${text}`
    : "";
}

function compactLines(lines) {
  return lines.filter(Boolean);
}

function linkifyIfUrl(value) {
  const safe = escapeHtml(value);

  if (!isProbablyUrl(value)) {
    return safe;
  }

  return `<a href="${safe}">${safe}</a>`;
}

function escapeHtml(value) {
  return String(value || "").replace(
    /[&<>"']/g,
    ch =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[ch]
  );
}

function contactCorsHeaders(request) {
  const origin =
    request.headers.get("origin") || "";

  const allowedOrigins = new Set([
    "https://neuralnetsandprettypatterns.com",
    "https://www.neuralnetsandprettypatterns.com"
  ]);

  const headers = {
    "Access-Control-Allow-Methods":
      "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Accept",
    "Vary": "Origin"
  };

  if (allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] =
      origin;
  }

  return headers;
}

function contactResponse(
  request,
  body,
  status = 200,
  extraHeaders = {}
) {
  const accept =
    request.headers.get("accept") || "";

  if (accept.includes("application/json")) {
    return new Response(
      JSON.stringify(body),
      {
        status,
        headers: {
          "Content-Type":
            "application/json; charset=utf-8",
          ...contactCorsHeaders(request),
          ...extraHeaders
        }
      }
    );
  }

  const title = body.ok
    ? "Message sent"
    : "Message not sent";

  const message = body.ok
    ? "Message sent. Thank you."
    : (
        body.error ||
        "Message could not be sent."
      );

  return new Response(
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <p><a href="/contact/">Back to contact</a></p>
  </main>
</body>
</html>`,
    {
      status,
      headers: {
        "Content-Type":
          "text/html; charset=utf-8",
        ...contactCorsHeaders(request),
        ...extraHeaders
      }
    }
  );
}

/* =========================================================
   MANTRA SYNC MANTRA BANK
   ========================================================= */

async function handleMantraBank(request, env) {
  if (request.method !== "GET") {
    return mantraJsonResponse(
      {
        ok: false,
        error: "Method not allowed."
      },
      405,
      {
        "Allow": "GET"
      }
    );
  }

  if (!env || !env.mantradata) {
    return mantraJsonResponse(
      {
        ok: false,
        error: "Mantra bank is not configured."
      },
      500
    );
  }

  try {
    const data =
      await env.mantradata.get("mantra-bank");

    if (!data) {
      return mantraJsonResponse(
        {
          ok: false,
          error: "Mantra bank not found."
        },
        404
      );
    }

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error(
      "Mantra Sync KV read failed:",
      error
    );

    return mantraJsonResponse(
      {
        ok: false,
        error: "Mantra bank could not be loaded."
      },
      500
    );
  }
}

/* =========================================================
   MANTRA SYNC LEADERBOARD
   ========================================================= */

async function handleMantraLeaderboard(request, env) {
  if (request.method !== "GET") {
    return mantraJsonResponse(
      {
        ok: false,
        error: "Method not allowed."
      },
      405,
      {
        "Allow": "GET"
      }
    );
  }

  if (!env || !env.mantrasync) {
    return mantraJsonResponse(
      {
        ok: false,
        error: "Mantra Sync database is not configured."
      },
      500
    );
  }

  try {
    const [
      goldStar,
      starSpeedrun,
      flawlessVictory
    ] = await Promise.all([
      env.mantrasync
        .prepare(
          `SELECT
             player_name,
             total_score
           FROM mantra_scores
           ORDER BY
             total_score DESC,
             created_at ASC,
             id ASC
           LIMIT 1`
        )
        .first(),

      env.mantrasync
        .prepare(
          `SELECT
             player_name,
             accuracy,
             duration_ms
           FROM mantra_scores
           WHERE
             accuracy = 100
             AND duration_ms IS NOT NULL
             AND duration_ms > 0
           ORDER BY
             duration_ms ASC,
             created_at DESC,
             id DESC
           LIMIT 1`
        )
        .first(),

      env.mantrasync
        .prepare(
          `SELECT
             player_name,
             best_block
           FROM mantra_scores
           WHERE best_block = 30
           ORDER BY
             created_at DESC,
             id DESC
           LIMIT 1`
        )
        .first()
    ]);

    const starSpeedrunResult = starSpeedrun
      ? {
          player_name: starSpeedrun.player_name,
          accuracy: Number(starSpeedrun.accuracy),
          duration_ms: Number(starSpeedrun.duration_ms)
        }
      : null;

    const flawlessVictoryResult = flawlessVictory
      ? {
          player_name: flawlessVictory.player_name,
          best_block: Number(flawlessVictory.best_block)
        }
      : null;

    return mantraJsonResponse({
      ok: true,
      leaderboard: {
        gold_star: goldStar
          ? {
              player_name: goldStar.player_name,
              total_score: Number(
                goldStar.total_score
              )
            }
          : null,

        star_speedrun: starSpeedrunResult,
        flawless_victory: flawlessVictoryResult,

        // Temporary aliases keep the current page working
        // until its labels/rendering are updated.
        star_quality: starSpeedrunResult,
        play_of_the_game: flawlessVictoryResult
      }
    });
  } catch (error) {
    console.error(
      "Mantra Sync leaderboard read failed:",
      error
    );

    return mantraJsonResponse(
      {
        ok: false,
        error: "Leaderboard could not be loaded."
      },
      500
    );
  }
}

async function handleMantraScore(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Allow": "POST, OPTIONS",
        "Access-Control-Allow-Methods":
          "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type",
        "Cache-Control": "no-store"
      }
    });
  }

  if (request.method !== "POST") {
    return mantraJsonResponse(
      {
        ok: false,
        error: "Method not allowed."
      },
      405,
      {
        "Allow": "POST, OPTIONS"
      }
    );
  }

  if (!env || !env.mantrasync) {
    return mantraJsonResponse(
      {
        ok: false,
        error: "Mantra Sync database is not configured."
      },
      500
    );
  }

  const contentType =
    request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return mantraJsonResponse(
      {
        ok: false,
        error: "Score submission must be JSON."
      },
      415
    );
  }

  let score;

  try {
    score = await request.json();
  } catch (error) {
    return mantraJsonResponse(
      {
        ok: false,
        error: "Could not read score submission."
      },
      400
    );
  }

  const validation =
    validateMantraScore(score);

  if (!validation.ok) {
    return mantraJsonResponse(
      {
        ok: false,
        error: validation.error
      },
      400
    );
  }

  const {
    playerName,
    totalScore,
    repetitions,
    bestBlock,
    mode,
    theme,
    earlyExit,
    durationMs
  } = validation.value;

  // Each repetition is worth a maximum of 3 points:
  // 2 for the fill-in-the-blank phase and 1 for
  // successfully retyping the complete mantra.
  const rawAccuracy =
    repetitions > 0
      ? (
          totalScore /
          (repetitions * 3)
        ) * 100
      : 0;

  const cappedAccuracy =
    earlyExit
      ? Math.min(rawAccuracy, 80)
      : rawAccuracy;

  const accuracy =
    Math.round(cappedAccuracy * 10) / 10;

  try {
    const result = await env.mantrasync
      .prepare(
        `INSERT INTO mantra_scores (
           player_name,
           total_score,
           repetitions,
           accuracy,
           best_block,
           mode,
           theme,
           duration_ms
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        playerName,
        totalScore,
        repetitions,
        accuracy,
        bestBlock,
        mode,
        theme,
        durationMs
      )
      .run();

    return mantraJsonResponse(
      {
        ok: true,
        message: "Score logged.",
        score: {
          player_name: playerName,
          total_score: totalScore,
          repetitions,
          accuracy,
          best_block: bestBlock,
          mode,
          theme,
          duration_ms: durationMs
        },
        id:
          result?.meta?.last_row_id ?? null
      },
      201
    );
  } catch (error) {
    console.error(
      "Mantra Sync score write failed:",
      error
    );

    return mantraJsonResponse(
      {
        ok: false,
        error: "Score could not be logged."
      },
      500
    );
  }
}

function validateMantraScore(score) {
  if (
    !score ||
    typeof score !== "object" ||
    Array.isArray(score)
  ) {
    return {
      ok: false,
      error: "Invalid score submission."
    };
  }

  const playerName =
    String(score.player_name || "")
      .replace(/\s+/g, " ")
      .trim();

  const theme =
    String(score.theme || "")
      .replace(/\s+/g, " ")
      .trim();

  const mode =
    String(score.mode || "")
      .trim()
      .toLowerCase();

  const totalScore =
    Number(score.total_score);

  const repetitions =
    Number(score.repetitions);

  const bestBlock =
    Number(score.best_block);

  const earlyExit =
    score.early_exit === true;

  const durationMs =
    score.duration_ms === undefined ||
    score.duration_ms === null
      ? null
      : Number(score.duration_ms);

  if (!playerName) {
    return {
      ok: false,
      error:
        "Game name is required."
    };
  }

  if (!Number.isInteger(repetitions) || repetitions < 0) {
    return {
      ok: false,
      error:
        "Repetitions must be a non-negative integer."
    };
  }

  if (
    !earlyExit &&
    (
      repetitions < 10 ||
      repetitions % 10 !== 0
    )
  ) {
    return {
      ok: false,
      error:
        "Normal score submissions must use a positive multiple of 10 repetitions."
    };
  }

  if (
    !Number.isInteger(totalScore) ||
    totalScore < 0 ||
    totalScore > repetitions * 3
  ) {
    return {
      ok: false,
      error:
        "Total score is outside the valid range."
    };
  }

  if (
    !Number.isInteger(bestBlock) ||
    bestBlock < 0 ||
    bestBlock > 300 ||
    bestBlock > totalScore
  ) {
    return {
      ok: false,
      error:
        "Best block is outside the valid range."
    };
  }

  if (
    durationMs !== null &&
    (
      !Number.isInteger(durationMs) ||
      durationMs <= 0
    )
  ) {
    return {
      ok: false,
      error:
        "Duration must be a positive integer number of milliseconds."
    };
  }

  if (
    mode !== "timed" &&
    mode !== "untimed"
  ) {
    return {
      ok: false,
      error:
        "Mode must be timed or untimed."
    };
  }

  if (
    theme.length < 1 ||
    theme.length > 80
  ) {
    return {
      ok: false,
      error:
        "Theme must be between 1 and 80 characters."
    };
  }

  return {
    ok: true,
    value: {
      playerName,
      totalScore,
      repetitions,
      bestBlock,
      mode,
      theme,
      earlyExit,
      durationMs
    }
  };
}

function mantraJsonResponse(
  body,
  status = 200,
  extraHeaders = {}
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...extraHeaders
      }
    }
  );
}

/* =========================================================
   NEURALVERSE CYOA
   ========================================================= */

async function handleCyoaResults(request, env) {
  if (request.method !== "GET") {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "Method not allowed."
      },
      405,
      {
        "Allow": "GET"
      }
    );
  }

  if (!env || !env.CYOA_DB) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "CYOA database is not configured."
      },
      500
    );
  }

  const url = new URL(request.url);
  const pollId = normalizeCyoaPollId(
    url.searchParams.get("poll")
  );

  if (!pollId) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "A valid poll id is required."
      },
      400
    );
  }

  try {
    const poll = await loadCyoaPoll(
      env.CYOA_DB,
      pollId
    );

    if (!poll) {
      return cyoaJsonResponse(
        {
          ok: false,
          error: "Poll not found."
        },
        404
      );
    }

    return cyoaJsonResponse({
      ok: true,
      poll
    });
  } catch (error) {
    console.error(
      "CYOA results read failed:",
      error
    );

    return cyoaJsonResponse(
      {
        ok: false,
        error: "Poll results could not be loaded."
      },
      500
    );
  }
}

async function handleCyoaVote(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Allow": "POST, OPTIONS",
        "Access-Control-Allow-Methods":
          "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Accept",
        "Cache-Control": "no-store"
      }
    });
  }

  if (request.method !== "POST") {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "Method not allowed."
      },
      405,
      {
        "Allow": "POST, OPTIONS"
      }
    );
  }

  if (!env || !env.CYOA_DB) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "CYOA database is not configured."
      },
      500
    );
  }

  if (!isAllowedCyoaOrigin(request)) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "Vote origin is not allowed."
      },
      403
    );
  }

  const contentType =
    request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "Vote submission must be JSON."
      },
      415
    );
  }

  let submission;

  try {
    submission = await request.json();
  } catch (error) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "Could not read vote submission."
      },
      400
    );
  }

  const basicValidation =
    validateCyoaSubmissionShape(submission);

  if (!basicValidation.ok) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: basicValidation.error
      },
      400
    );
  }

  const {
    pollId,
    voterId,
    answers
  } = basicValidation.value;

  try {
    const poll = await loadCyoaPoll(
      env.CYOA_DB,
      pollId
    );

    if (!poll) {
      return cyoaJsonResponse(
        {
          ok: false,
          error: "Poll not found."
        },
        404
      );
    }

    if (!poll.is_open) {
      return cyoaJsonResponse(
        {
          ok: false,
          error: "Voting is closed for this poll."
        },
        409
      );
    }

    const answerValidation =
      validateCyoaAnswers(poll, answers);

    if (!answerValidation.ok) {
      return cyoaJsonResponse(
        {
          ok: false,
          error: answerValidation.error
        },
        400
      );
    }

    const voterHash = await hashCyoaVoter(
      pollId,
      voterId
    );

    await env.CYOA_DB
      .prepare(
        `INSERT INTO ballots (
           poll_id,
           voter_hash,
           created_at,
           updated_at
         )
         VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (poll_id, voter_hash)
         DO UPDATE SET
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        pollId,
        voterHash
      )
      .run();

    const ballot = await env.CYOA_DB
      .prepare(
        `SELECT id
         FROM ballots
         WHERE poll_id = ?
           AND voter_hash = ?
         LIMIT 1`
      )
      .bind(
        pollId,
        voterHash
      )
      .first();

    if (!ballot || !ballot.id) {
      throw new Error(
        "Ballot could not be created or found."
      );
    }

    const ballotId = Number(ballot.id);
    const statements = [
      env.CYOA_DB
        .prepare(
          `DELETE FROM ballot_answers
           WHERE ballot_id = ?`
        )
        .bind(ballotId)
    ];

    answerValidation.answers.forEach(
      function (answer) {
        statements.push(
          env.CYOA_DB
            .prepare(
              `INSERT INTO ballot_answers (
                 ballot_id,
                 question_id,
                 option_id,
                 created_at,
                 updated_at
               )
               VALUES (
                 ?, ?, ?,
                 CURRENT_TIMESTAMP,
                 CURRENT_TIMESTAMP
               )`
            )
            .bind(
              ballotId,
              answer.questionId,
              answer.optionId
            )
        );
      }
    );

    await env.CYOA_DB.batch(statements);

    const updatedPoll = await loadCyoaPoll(
      env.CYOA_DB,
      pollId
    );

    return cyoaJsonResponse(
      {
        ok: true,
        message: "Your ballot has been saved.",
        poll: updatedPoll
      },
      200
    );
  } catch (error) {
    console.error(
      "CYOA vote write failed:",
      error
    );

    return cyoaJsonResponse(
      {
        ok: false,
        error: "Vote could not be saved."
      },
      500
    );
  }
}

async function loadCyoaPoll(database, pollId) {
  const pollRow = await database
    .prepare(
      `SELECT
         id,
         title,
         description,
         image_path,
         published_at,
         is_open
       FROM polls
       WHERE id = ?
       LIMIT 1`
    )
    .bind(pollId)
    .first();

  if (!pollRow) {
    return null;
  }

  const optionQuery = await database
    .prepare(
      `SELECT
         q.id AS question_id,
         q.prompt AS question_prompt,
         q.sort_order AS question_order,
         o.id AS option_id,
         o.label AS option_label,
         o.sort_order AS option_order,
         COUNT(ba.ballot_id) AS votes
       FROM questions q
       JOIN options o
         ON o.question_id = q.id
       LEFT JOIN ballot_answers ba
         ON ba.question_id = q.id
        AND ba.option_id = o.id
       WHERE q.poll_id = ?
       GROUP BY
         q.id,
         q.prompt,
         q.sort_order,
         o.id,
         o.label,
         o.sort_order
       ORDER BY
         q.sort_order ASC,
         o.sort_order ASC`
    )
    .bind(pollId)
    .all();

  const ballotCount = await database
    .prepare(
      `SELECT COUNT(*) AS total_ballots
       FROM ballots
       WHERE poll_id = ?`
    )
    .bind(pollId)
    .first();

  const questionMap = new Map();
  const rows =
    optionQuery && Array.isArray(optionQuery.results)
      ? optionQuery.results
      : [];

  rows.forEach(function (row) {
    const questionId = String(row.question_id);

    if (!questionMap.has(questionId)) {
      questionMap.set(questionId, {
        question_id: questionId,
        prompt: String(row.question_prompt || ""),
        sort_order: Number(row.question_order || 0),
        total_votes: 0,
        options: []
      });
    }

    const question = questionMap.get(questionId);
    const votes = Number(row.votes || 0);

    question.total_votes += votes;
    question.options.push({
      option_id: String(row.option_id),
      label: String(row.option_label || ""),
      sort_order: Number(row.option_order || 0),
      votes,
      percentage: 0
    });
  });

  const results = Array.from(
    questionMap.values()
  ).map(function (question) {
    question.options = question.options.map(
      function (option) {
        const percentage =
          question.total_votes > 0
            ? (
                option.votes /
                question.total_votes
              ) * 100
            : 0;

        return {
          ...option,
          percentage:
            Math.round(percentage * 10) / 10
        };
      }
    );

    return question;
  });

  return {
    id: String(pollRow.id),
    title: String(pollRow.title || ""),
    description: String(
      pollRow.description || ""
    ),
    image_path:
      pollRow.image_path === null
        ? null
        : String(pollRow.image_path),
    published_at: String(
      pollRow.published_at || ""
    ),
    is_open: Number(pollRow.is_open) === 1,
    total_ballots: Number(
      ballotCount?.total_ballots || 0
    ),
    results
  };
}

function validateCyoaSubmissionShape(submission) {
  if (
    !submission ||
    typeof submission !== "object" ||
    Array.isArray(submission)
  ) {
    return {
      ok: false,
      error: "Invalid vote submission."
    };
  }

  const pollId = normalizeCyoaPollId(
    submission.poll_id
  );

  const voterId = String(
    submission.voter_id || ""
  ).trim();

  const answers = submission.answers;

  if (!pollId) {
    return {
      ok: false,
      error: "A valid poll id is required."
    };
  }

  if (
    voterId.length < 12 ||
    voterId.length > 200
  ) {
    return {
      ok: false,
      error: "A valid browser voter id is required."
    };
  }

  if (
    !answers ||
    typeof answers !== "object" ||
    Array.isArray(answers)
  ) {
    return {
      ok: false,
      error: "Answers must be supplied as an object."
    };
  }

  return {
    ok: true,
    value: {
      pollId,
      voterId,
      answers
    }
  };
}

function validateCyoaAnswers(poll, answers) {
  const questions =
    poll && Array.isArray(poll.results)
      ? poll.results
      : [];

  const suppliedQuestionIds =
    Object.keys(answers);

  if (
    suppliedQuestionIds.length !==
    questions.length
  ) {
    return {
      ok: false,
      error: "Choose one answer for each question."
    };
  }

  const normalizedAnswers = [];

  for (const question of questions) {
    const questionId = question.question_id;
    const optionId = String(
      answers[questionId] || ""
    ).trim();

    if (!optionId) {
      return {
        ok: false,
        error: "Choose one answer for each question."
      };
    }

    const validOption = question.options.some(
      function (option) {
        return option.option_id === optionId;
      }
    );

    if (!validOption) {
      return {
        ok: false,
        error:
          "One of the selected options is invalid."
      };
    }

    normalizedAnswers.push({
      questionId,
      optionId
    });
  }

  const validQuestionIds = new Set(
    questions.map(function (question) {
      return question.question_id;
    })
  );

  const hasUnknownQuestion =
    suppliedQuestionIds.some(
      function (questionId) {
        return !validQuestionIds.has(questionId);
      }
    );

  if (hasUnknownQuestion) {
    return {
      ok: false,
      error: "One of the submitted questions is invalid."
    };
  }

  return {
    ok: true,
    answers: normalizedAnswers
  };
}

function normalizeCyoaPollId(value) {
  const pollId = String(value || "")
    .trim()
    .toLowerCase();

  return /^[a-z0-9][a-z0-9-]{0,79}$/.test(
    pollId
  )
    ? pollId
    : "";
}

function isAllowedCyoaOrigin(request) {
  const origin =
    request.headers.get("origin") || "";

  if (!origin) {
    return true;
  }

  try {
    return origin === new URL(request.url).origin;
  } catch (error) {
    return false;
  }
}

async function hashCyoaVoter(
  pollId,
  voterId
) {
  const input = new TextEncoder().encode(
    `${pollId}:${voterId}`
  );

  const digest = await crypto.subtle.digest(
    "SHA-256",
    input
  );

  return Array.from(
    new Uint8Array(digest)
  )
    .map(function (byte) {
      return byte
        .toString(16)
        .padStart(2, "0");
    })
    .join("");
}

function cyoaJsonResponse(
  body,
  status = 200,
  extraHeaders = {}
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...extraHeaders
      }
    }
  );
}

