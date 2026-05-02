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
