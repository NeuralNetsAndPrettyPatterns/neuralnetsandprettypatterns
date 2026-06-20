export default {
  async fetch(request) {
    const url = new URL(request.url);
    const p = url.pathname;

    const contentTypes = {
      ".jpg":  "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png":  "image/png",
      ".gif":  "image/gif",
      ".webp": "image/webp",
      ".svg":  "image/svg+xml",
      ".css":  "text/css; charset=utf-8",
      ".js":   "application/javascript; charset=utf-8"
    };

    function imgType(path) {
      const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
      return contentTypes[ext] || null;
    }

    async function serveHtml(repoPath, noStore = false) {
      const res = await fetch(`https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main${repoPath}`);
      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
          ...(noStore ? { "cache-control": "no-store" } : {})
        }
      });
    }

    async function serveAsset(repoPath, ct, cache = "public, max-age=86400") {
      const res = await fetch(`https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main${repoPath}`);
      return new Response(res.body, {
        status: res.ok ? 200 : 404,
        headers: { "content-type": ct, "cache-control": cache }
      });
    }

    // ── Root
    if (p === "/" || p === "/index.html") return serveHtml("/index.html");

    // ── Sitemap
    if (p === "/sitemap.xml") {
      const res = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/sitemap.xml");
      return new Response(await res.text(), { headers: { "content-type": "application/xml; charset=utf-8" } });
    }

    // ── Root JS
    if (p === "/show-data.js") {
      const res = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/show-data.js");
      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-store" }
      });
    }

    // ── Images anywhere in the site (root, deep-drop-party/now, deepdreamstate, etc.)
    // Was previously restricted to root-level-only paths, which silently 404'd any
    // poster image placed in a subfolder like /deep-drop-party/now/.
    {
      const ct = imgType(p);
      if (ct) return serveAsset(p, ct);
    }

    // ── The Pink Room
    if (p === "/the-pink-room" || p === "/the-pink-room/") return serveHtml("/the-pink-room/index.html");

    if (p === "/the-pink-room/weekly-events" || p === "/the-pink-room/weekly-events/")
      return serveHtml("/the-pink-room/weekly-events/index.html", true);

    if (p === "/the-pink-room/weekly-events/events-data.js") {
      const res = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/the-pink-room/weekly-events/events-data.js");
      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-store" }
      });
    }

    // ── Deep Drop Party
    if (p === "/deep-drop-party" || p === "/deep-drop-party/") return serveHtml("/deep-drop-party/index.html");
    if (p === "/deep-drop-party/now" || p === "/deep-drop-party/now/") return serveHtml("/deep-drop-party/now/index.html");
    if (p === "/deep-drop-party/faq" || p === "/deep-drop-party/faq/") return serveHtml("/deep-drop-party/faq/index.html");
    if (p === "/deep-drop-party/episodes" || p === "/deep-drop-party/episodes/") return serveHtml("/deep-drop-party/episodes/index.html");
    if (p === "/deep-drop-party/testpage" || p === "/deep-drop-party/testpage/") return serveHtml("/deep-drop-party/testpage/index.html", true);

    // ── Scripts
    if (p === "/scripts" || p === "/scripts/") return serveHtml("/scripts/index.html", true);
    if (p === "/scripts/scripts.json") {
      const res = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/scripts/scripts.json");
      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
      });
    }

    // ── Neuralpedia assets
    if (p.startsWith("/neuralpedia/")) {
      const ct = imgType(p);
      if (ct || p.endsWith(".css") || p.endsWith(".js")) {
        const ext = p.slice(p.lastIndexOf(".")).toLowerCase();
        const assetCt = contentTypes[ext] || "application/octet-stream";
        const res = await fetch(`https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main${p}`);
        if (!res.ok) return new Response("Not found", { status: 404 });
        return new Response(res.body, {
          status: res.status,
          headers: { "content-type": assetCt, "cache-control": "public, max-age=3600" }
        });
      }
      // ── Neuralpedia pages
      if (p === "/neuralpedia" || p === "/neuralpedia/") return serveHtml("/neuralpedia/index.html");
      const path = p.endsWith("/") ? p : p + "/";
      const res = await fetch(`https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main${path}index.html`);
      if (res.ok) return new Response(await res.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
      return new Response("Not found", { status: 404 });
    }

    if (p === "/neuralpedia" || p === "/neuralpedia/") return serveHtml("/neuralpedia/index.html");

    // ── Deep Dream State — pages served from main repo
    if (p === "/deepdreamstate/glossary" || p === "/deepdreamstate/glossary/")
      return serveHtml("/deepdreamstate/glossary/index.html", true);

    if (p === "/deepdreamstate/glossary/glossary.json") {
      const res = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/deepdreamstate/glossary/glossary.json");
      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
      });
    }

    if (p === "/deepdreamstate/glossary/appearances.json") {
      const res = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/deepdreamstate/glossary/appearances.json");
      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
      });
    }

    if (p === "/deepdreamstate/arcs" || p === "/deepdreamstate/arcs/")
      return serveHtml("/deepdreamstate/arcs/index.html", true);

    if (p === "/deepdreamstate" || p === "/deepdreamstate/")
      return serveHtml("/deepdreamstate/index.html", true);

    // ── Deep Dream State — catch-all (legacy deepdreamstate repo via GitHub Pages)
    if (p.startsWith("/deepdreamstate")) {
      const githubPath = p.replace("/deepdreamstate", "");
      const proxyUrl = `https://neuralnetsandprettypatterns.github.io/deepdreamstate${githubPath}${url.search}`;
      const response = await fetch(proxyUrl);
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("text/html") || contentType.includes("javascript")) {
        let text = await response.text();
        text = text.replaceAll(
          "https://neuralnetsandprettypatterns.github.io/deepdreamstate",
          "https://neuralnetsandprettypatterns.com/deepdreamstate"
        );
        return new Response(text, { status: response.status, headers: { "content-type": contentType } });
      }

      return new Response(response.body, { status: response.status, headers: response.headers });
    }

    // ── 404
    return new Response("Not found", { status: 404 });
  }
};
