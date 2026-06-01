export default {
  async fetch(request) {
    const url = new URL(request.url);

    // ── Root
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    // ── Sitemap
    if (url.pathname === "/sitemap.xml") {
      const xml = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/sitemap.xml");
      return new Response(await xml.text(), { headers: { "content-type": "application/xml; charset=utf-8" } });
    }

    // ── Root show data
    if (url.pathname === "/show-data.js") {
      const js = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/show-data.js");
      return new Response(await js.text(), {
        status: js.ok ? 200 : 404,
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // ── Root images
    if (
      url.pathname === "/ThePinkRoom.jpg" ||
      url.pathname === "/JustMyTypeHapticCover.jpg" ||
      url.pathname === "/JustMyType.jpg" ||
      url.pathname === "/SparkleService.jpg"
    ) {
      const img = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/ThePinkRoom.jpg");
      return new Response(img.body, {
        status: img.ok ? 200 : 404,
        headers: {
          "content-type": "image/jpeg",
          "cache-control": "public, max-age=86400"
        }
      });
    }

    // ── The Pink Room
    if (url.pathname === "/the-pink-room" || url.pathname === "/the-pink-room/") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/the-pink-room/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    // ── Deep Drop Party
    if (url.pathname === "/deep-drop-party" || url.pathname === "/deep-drop-party/") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/deep-drop-party/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if (url.pathname === "/deep-drop-party/now" || url.pathname === "/deep-drop-party/now/") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/deep-drop-party/now/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if (url.pathname === "/deep-drop-party/faq" || url.pathname === "/deep-drop-party/faq/") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/deep-drop-party/faq/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if (url.pathname === "/deep-drop-party/episodes" || url.pathname === "/deep-drop-party/episodes/") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/deep-drop-party/episodes/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    // ── Deep Drop Party testpage
    if (url.pathname === "/deep-drop-party/testpage" || url.pathname === "/deep-drop-party/testpage/") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/deep-drop-party/testpage/index.html");
      return new Response(await html.text(), {
        status: html.ok ? 200 : 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // ── Neuralpedia
    if (url.pathname === "/neuralpedia" || url.pathname === "/neuralpedia/") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/neuralpedia/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if (
      url.pathname.startsWith("/neuralpedia/") &&
      (
        url.pathname.endsWith(".webp") ||
        url.pathname.endsWith(".png") ||
        url.pathname.endsWith(".jpg") ||
        url.pathname.endsWith(".jpeg") ||
        url.pathname.endsWith(".svg") ||
        url.pathname.endsWith(".gif") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".js")
      )
    ) {
      const rawUrl = `https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main${url.pathname}`;
      const asset = await fetch(rawUrl);
      if (!asset.ok) {
        return new Response("Not found", { status: 404 });
      }

      const contentTypes = {
        ".webp": "image/webp",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".gif": "image/gif",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8"
      };

      const ext = url.pathname.slice(url.pathname.lastIndexOf(".")).toLowerCase();

      return new Response(asset.body, {
        status: asset.status,
        headers: {
          "content-type": contentTypes[ext] || "application/octet-stream",
          "cache-control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname.startsWith("/neuralpedia/")) {
      const path = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
      const rawUrl = `https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main${path}index.html`;
      const html = await fetch(rawUrl);
      if (html.ok) {
        return new Response(await html.text(), { headers: { "content-type": "text/html; charset=utf-8" } });
      }
      return new Response("Not found", { status: 404 });
    }

    // ── Deep Dream State
    if (url.pathname === "/deepdreamstate") {
      return Response.redirect(`${url.origin}/deepdreamstate/`, 301);
    }

    if (url.pathname.startsWith("/deepdreamstate")) {
      const githubPath = url.pathname.replace("/deepdreamstate", "");
      const proxyUrl = `https://neuralnetsandprettypatterns.github.io/deepdreamstate${githubPath}${url.search}`;
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
          headers: { "content-type": contentType }
        });
      }

      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    }

    // ── 404
    return new Response("Not found", { status: 404 });
  }
};
