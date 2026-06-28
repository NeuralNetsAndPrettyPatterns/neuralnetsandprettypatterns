export default {
  async fetch(request) {
    const url = new URL(request.url);
    const p = url.pathname;

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

    // Images anywhere in the site
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

    // Deep Dream State Arc One: The Chthonic
    // Temporary migration bridge.
    // New main repo page wins when present.
    // Missing main repo page falls back to the legacy Deep Dream State site.
    if (
      p === "/deepdreamstate/arcs/chthonic" ||
      p.startsWith("/deepdreamstate/arcs/chthonic/")
    ) {
      return serveMigratedDeepDreamStatePathWithFallback(p, url);
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
