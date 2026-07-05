export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p === "/api/contact") {
      return handleContactPost(request, env);
    }

    const MAIN_REPO_BASE =
      "https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main";

    const LEGACY_DDS_BASE =
      "https://neuralnetsandprettypatterns.github.io/deepdreamstate";

    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".jpg":  "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png":  "image/png",
      ".gif":  "image/gif",
      ".webp": "image/webp",
      ".svg":  "image/svg+xml",
      ".css":  "text/css; charset=utf-8",
      ".js":   "application/javascript; charset=utf-8",
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
        ".jpg":  "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png":  "image/png",
        ".gif":  "image/gif",
        ".webp": "image/webp",
        ".svg":  "image/svg+xml"
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

    async function serveAsset(repoPath, ct, cache = "public, max-age=86400") {
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
      const proxyUrl = `${LEGACY_DDS_BASE}${githubPath}${requestUrl.search}`;
      const response = await fetch(proxyUrl);
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("text/html") || contentType.includes("javascript")) {
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

    async function serveMigratedDeepDreamStatePathWithFallback(path, requestUrl) {
      const repoPath = mainRepoPathForRequest(path);
      const migratedRes = await fetch(mainRepoUrl(repoPath));

      if (migratedRes.ok) {
        const ct = fileType(repoPath) || "text/html; charset=utf-8";

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
    if (p === "/contact" || p === "/contact/" || p === "/contact/index.html") {
      return serveHtml("/contact/index.html", true);
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
      p.startsWith("/deepdreamstate/arcs/sitri/")
    ) {
      return serveMigratedDeepDreamStatePathWithFallback(p, url);
    }

    // Images anywhere else in the site
    {
      const ct = imgType(p);
      if (ct) return serveAsset(p, ct);
    }

    // The Pink Room
    if (p === "/the-pink-room" || p === "/the-pink-room/") {
      return serveHtml("/the-pink-room/index.html");
    }

    if (p === "/the-pink-room/weekly-events" || p === "/the-pink-room/weekly-events/") {
      return serveHtml("/the-pink-room/weekly-events/index.html", true);
    }

    if (p === "/the-pink-room/weekly-events/events-data.js") {
      const res = await fetch(mainRepoUrl("/the-pink-room/weekly-events/events-data.js"));

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // Deep Drop Party
    if (p === "/deep-drop-party" || p === "/deep-drop-party/") {
      return serveHtml("/deep-drop-party/index.html");
    }

    if (p === "/deep-drop-party/now" || p === "/deep-drop-party/now/") {
      return serveHtml("/deep-drop-party/now/index.html");
    }

    if (p === "/deep-drop-party/faq" || p === "/deep-drop-party/faq/") {
      return serveHtml("/deep-drop-party/faq/index.html");
    }

    if (p === "/deep-drop-party/episodes" || p === "/deep-drop-party/episodes/") {
      return serveHtml("/deep-drop-party/episodes/index.html");
    }

    if (p === "/deep-drop-party/testpage" || p === "/deep-drop-party/testpage/") {
      return serveHtml("/deep-drop-party/testpage/index.html", true);
    }

    // Scripts
    if (p === "/scripts" || p === "/scripts/") {
      return serveHtml("/scripts/index.html", true);
    }

    if (p === "/scripts/scripts.json") {
      const res = await fetch(mainRepoUrl("/scripts/scripts.json"));

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
          return new Response("Not found", { status: 404 });
        }

        return new Response(res.body, {
          status: res.status,
          headers: {
            "content-type": ct,
            "cache-control": "public, max-age=3600"
          }
        });
      }

      if (p === "/neuralpedia" || p === "/neuralpedia/") {
        return serveHtml("/neuralpedia/index.html");
      }

      const path = p.endsWith("/") ? p : p + "/";
      const res = await fetch(mainRepoUrl(`${path}index.html`));

      if (res.ok) {
        return new Response(await res.text(), {
          headers: {
            "content-type": "text/html; charset=utf-8"
          }
        });
      }

      return new Response("Not found", { status: 404 });
    }

    if (p === "/neuralpedia" || p === "/neuralpedia/") {
      return serveHtml("/neuralpedia/index.html");
    }

    // Deep Dream State glossary
    if (p === "/deepdreamstate/glossary" || p === "/deepdreamstate/glossary/") {
      return serveHtml("/deepdreamstate/glossary/index.html", true);
    }

    if (p === "/deepdreamstate/glossary/glossary.json") {
      const res = await fetch(mainRepoUrl("/deepdreamstate/glossary/glossary.json"));

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    if (p === "/deepdreamstate/glossary/appearances.json") {
      const res = await fetch(mainRepoUrl("/deepdreamstate/glossary/appearances.json"));

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // Deep Dream State arcs index
    if (p === "/deepdreamstate/arcs" || p === "/deepdreamstate/arcs/") {
      return serveHtml("/deepdreamstate/arcs/index.html", true);
    }

    // Deep Dream State home
    if (p === "/deepdreamstate" || p === "/deepdreamstate/") {
      return serveHtml("/deepdreamstate/index.html", true);
    }

    // Deep Dream State legacy catch-all
    // Anything not carved out above still proxies to the old Deep Dream State GitHub Pages site.
    if (p.startsWith("/deepdreamstate")) {
      return legacyDeepDreamStateProxy(p, url);
    }

    // 404
    return new Response("Not found", { status: 404 });
  }
};

// Recipient fallback is in the Worker, not in contact/index.html.
// Override either value with Worker environment variables if needed.
const CONTACT_TO_FALLBACK = "deepdreamstates@gmail.com";
const CONTACT_FROM_FALLBACK = "Deep Dream State Contact <contact@neuralnetsandprettypatterns.com>";

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
      { ok: false, error: "Method not allowed." },
      405,
      { Allow: "POST" }
    );
  }

  if (!env || !env.RESEND_API_KEY) {
    return contactResponse(request, { ok: false, error: "Contact form is not configured: RESEND_API_KEY is missing." }, 500);
  }

  const contactTo = env.CONTACT_TO || CONTACT_TO_FALLBACK;
  const contactFrom = env.CONTACT_FROM || CONTACT_FROM_FALLBACK;

  let fields;
  try {
    fields = await readContactFields(request);
  } catch (err) {
    return contactResponse(request, { ok: false, error: "Could not read form submission." }, 400);
  }

  const validationError = validateContactFields(fields);
  if (validationError) {
    return contactResponse(request, { ok: false, error: validationError }, 400);
  }

  const categoryLabel = CONTACT_CATEGORY_LABELS[fields.category];
  const subject = `[NNPP Contact] ${categoryLabel}`;
  const textBody = buildContactTextBody(fields, categoryLabel, request);
  const htmlBody = buildContactHtmlBody(fields, categoryLabel, request);

  const resendPayload = {
    from: contactFrom,
    to: [contactTo],
    reply_to: fields.email,
    subject,
    text: textBody,
    html: htmlBody
  };

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resendPayload)
  });

  if (!resendResponse.ok) {
    let detail = "";
    try {
      detail = JSON.stringify(await resendResponse.json());
    } catch (err) {
      detail = await resendResponse.text();
    }

    console.error("Resend contact email failed:", resendResponse.status, detail);
    return contactResponse(request, { ok: false, error: "Message could not be sent." }, 502);
  }

  return contactResponse(request, { ok: true, message: "Message sent." }, 200);
}

async function readContactFields(request) {
  const contentType = request.headers.get("content-type") || "";
  const fields = {};

  if (contentType.includes("application/json")) {
    const json = await request.json();
    Object.entries(json || {}).forEach(([key, value]) => {
      fields[key] = normalizeField(value);
    });
    return fields;
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
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
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function validateContactFields(fields) {
  if (fields.company_url) return "Message could not be sent.";

  if (fields.form_name && fields.form_name !== "deep-dream-state-contact") {
    return "Invalid form submission.";
  }

  if (!hasLength(fields.name, 2, 120)) {
    return "Please enter your name.";
  }

  if (!isValidEmail(fields.email)) {
    return "Please enter a valid reply email.";
  }

  if (!CONTACT_CATEGORY_LABELS[fields.category]) {
    return "Please choose a subject category.";
  }

  if (!hasLength(fields.message, 10, 4000)) {
    return "Please enter a message between 10 and 4000 characters.";
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

  for (const [key, max] of Object.entries(maxLengths)) {
    if ((fields[key] || "").length > max) {
      return "One of the form fields is too long.";
    }
  }

  for (const urlKey of ["demo_link", "project_link"]) {
    const value = fields[urlKey];
    if (value && !isProbablyUrl(value)) {
      return "Please enter valid URLs where URLs are requested.";
    }
  }

  return "";
}

function hasLength(value, min, max) {
  const text = String(value || "").trim();
  return text.length >= min && text.length <= max;
}

function isValidEmail(value) {
  const email = String(value || "").trim();
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isProbablyUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (err) {
    return false;
  }
}

function buildContactTextBody(fields, categoryLabel, request) {
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
    `Submitted from: ${request.headers.get("referer") || "unknown"}`,
    `User agent: ${request.headers.get("user-agent") || "unknown"}`
  ];

  return lines.filter(line => line !== null && line !== undefined).join("\n");
}

function buildContactHtmlBody(fields, categoryLabel, request) {
  const details = categoryDetailLines(fields)
    .filter(Boolean)
    .map(line => {
      const index = line.indexOf(":");
      if (index === -1) return `<p>${escapeHtml(line)}</p>`;
      const label = line.slice(0, index);
      const value = line.slice(index + 1).trim();
      return `<p><strong>${escapeHtml(label)}:</strong> ${linkifyIfUrl(value)}</p>`;
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
        fieldLine("Performer name", fields.performer_name),
        fieldLine("Demo link", fields.demo_link),
        fieldLine("Voice / range notes", fields.voice_notes),
        fieldLine("Relevant links", fields.audition_links)
      ]);

    case "collabs-active-creators":
      return compactLines([
        fieldLine("Creator / project name", fields.creator_name),
        fieldLine("Platform / links", fields.creator_platform),
        fieldLine("Collab idea", fields.collab_idea)
      ]);

    case "patreon-questions":
      return compactLines([
        fieldLine("Patreon username", fields.patreon_name),
        fieldLine("Patreon topic", fields.patreon_topic)
      ]);

    case "press-inquiries":
      return compactLines([
        fieldLine("Outlet / publication", fields.outlet),
        fieldLine("Deadline", fields.press_deadline),
        fieldLine("Press request", fields.press_request)
      ]);

    case "project-inquiries":
      return compactLines([
        fieldLine("Project", fields.project),
        fieldLine("Relevant link", fields.project_link)
      ]);

    case "other":
      return compactLines([
        fieldLine("Short subject", fields.other_subject)
      ]);

    default:
      return [];
  }
}

function fieldLine(label, value) {
  const text = String(value || "").trim();
  return text ? `${label}: ${text}` : "";
}

function compactLines(lines) {
  return lines.filter(Boolean);
}

function linkifyIfUrl(value) {
  const safe = escapeHtml(value);
  if (!isProbablyUrl(value)) return safe;
  return `<a href="${safe}">${safe}</a>`;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

function contactCorsHeaders(request) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = new Set([
    "https://neuralnetsandprettypatterns.com",
    "https://www.neuralnetsandprettypatterns.com"
  ]);

  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Vary": "Origin"
  };

  if (allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function contactResponse(request, body, status = 200, extraHeaders = {}) {
  const accept = request.headers.get("accept") || "";

  if (accept.includes("application/json")) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...contactCorsHeaders(request),
        ...extraHeaders
      }
    });
  }

  const title = body.ok ? "Message sent" : "Message not sent";
  const message = body.ok ? "Message sent. Thank you." : (body.error || "Message could not be sent.");

  return new Response(`<!doctype html>
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
</html>`, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...contactCorsHeaders(request),
      ...extraHeaders
    }
  });
}
