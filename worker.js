export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = await fetch("https://raw.githubusercontent.com/NeuralNetsAndPrettyPatterns/neuralnetsandprettypatterns/main/index.html");
      return new Response(await html.text(), {
        headers: { "content-type": "text/html" },
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
