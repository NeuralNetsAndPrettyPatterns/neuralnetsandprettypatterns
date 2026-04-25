export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Serve your main index
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/index.html");
      return new Response(await html.text(), {
        headers: { "content-type": "text/html" },
      });
    }

    // Proxy everything under /deepdreamstate to GitHub Pages
    if (url.pathname.startsWith("/deepdreamstate")) {
      const githubPath = url.pathname.replace("/deepdreamstate", "");
      const proxyUrl = `https://neuralnetsandprettypatterns.github.io/deepdreamstate${githubPath}${url.search}`;
      const response = await fetch(proxyUrl);
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
