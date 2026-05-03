export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html" } });
    }

    if (url.pathname === "/sitemap.xml") {
      const xml = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/sitemap.xml");
      return new Response(await xml.text(), { headers: { "content-type": "application/xml" } });
    }

    if (url.pathname === "/neuralpedia" || url.pathname === "/neuralpedia/") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/neuralpedia/index.html");
      return new Response(await html.text(), { headers: { "content-type": "text/html" } });
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
        ".css": "text/css",
        ".js": "application/javascript"
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
        return new Response(await html.text(), { headers: { "content-type": "text/html" } });
      }
      return new Response("Not found", { status: 404 });
    }

    if (url.pathname === "/deepdreamstate") {
      return Response.redirect(`${url.origin}/deepdreamstate/`, 301);
    }

    if (url.pathname.startsWith("/deepdreamstate")) {
      const githubPath = url.pathname.replace("/deepdreamstate", "");
      const proxyUrl = `https://neuralnetsandprettypatterns.github.io/deepdreamstate${githubPath}${url.search}`;
      const response = await fetch(proxyUrl);
      return new Response(response.body, { status: response.status, headers: response.headers });
    }

    return new Response("Not found", { status: 404 });
  }
};
