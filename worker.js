export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p === "/api/contact") {
      return handleContactPost(request, env);
    }

    // Public project calendar data
    if (p === "/api/calendar/events") {
      return handleCalendarEventsGet(request, env);
    }

    // Public casting call data
    if (p === "/api/casting/calls") {
      return handleCastingCallsGet(request, env);
    }

    // Script age attestation
    if (p === "/api/scripts/attest") {
      return handleScriptAgeAttestation(request, env);
    }

    // Protected script downloads from private R2 storage
    if (p.startsWith("/scripts/download/")) {
      return handleScriptDownload(request, env, p);
    }

    // CYOA poll results
    if (p === "/api/cyoa/results") {
      return handleCyoaResults(request, env);
    }

    // CYOA ballot submission
    if (p === "/api/cyoa/vote") {
      return handleCyoaVote(request, env);
    }

    // After After faction vote totals
    if (p === "/api/afterafter/votes") {
      return handleAfterAfterVotes(request, env);
    }

    // After After faction ballot submission
    if (p === "/api/afterafter/vote") {
      return handleAfterAfterVote(request, env);
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

    const RELEASES_JSON_PATH =
      "/releases.json";

    const GLOSSARY_JSON_PATH =
      "/deepdreamstate/glossary/glossary.json";

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
      const res = await fetch(
        mainRepoUrl(repoPath),
        { cache: "no-store" }
      );

      return new Response(await res.text(), {
        status: res.ok ? 200 : 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
          ...(noStore ? { "cache-control": "no-store" } : {})
        }
      });
    }

    async function serveCastingCallsPage(env) {
      const templateRes = await fetch(
        mainRepoUrl("/casting/calls/index.html"),
        { cache: "no-store" }
      );

      if (!templateRes.ok) {
        return new Response(
          "Casting calls page template not found.",
          {
            status: 404,
            headers: {
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "no-store"
            }
          }
        );
      }

      let html = await templateRes.text();

      if (!env || !env.calendar) {
        html = renderCastingCallsTemplate(
          html,
          [],
          [],
          "Casting data is not available yet."
        );

        return new Response(html, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store",
            "x-nnpp-casting-ssr": "1"
          }
        });
      }

      try {
        const { calls, roles } =
          await loadCastingCallsData(env);

        html = renderCastingCallsTemplate(
          html,
          calls,
          roles
        );

        return new Response(html, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store",
            "x-nnpp-casting-ssr": "1"
          }
        });
      } catch (error) {
        console.error(
          "Casting calls SSR failed:",
          error
        );

        html = renderCastingCallsTemplate(
          html,
          [],
          [],
          "Casting data could not be loaded."
        );

        return new Response(html, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store",
            "x-nnpp-casting-ssr": "1"
          }
        });
      }
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
      const migratedRes = await fetch(
        mainRepoUrl(repoPath),
        { cache: "no-store" }
      );

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

    async function serveAfterAfterPath(path) {
      const alternatePath = path.replace(
        "/deepdreamstate/arcs/afterafter",
        "/arcs/afterafter"
      );

      const candidates = [
        mainRepoPathForRequest(path),
        mainRepoPathForRequest(alternatePath)
      ];

      for (const repoPath of candidates) {
        const response = await fetch(
          mainRepoUrl(repoPath),
          { cache: "no-store" }
        );

        if (!response.ok) {
          continue;
        }

        const ct =
          fileType(repoPath) || "text/html; charset=utf-8";

        return new Response(response.body, {
          status: 200,
          headers: {
            "content-type": ct,
            "cache-control": "no-store"
          }
        });
      }

      return new Response(
        "After After asset not found.",
        {
          status: 404,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store"
          }
        }
      );
    }

    async function serveAfterAfterCyoaPage() {
      const candidatePaths = [
        "/deepdreamstate/arcs/afterafter/cyoa/index.html",
        "/arcs/afterafter/cyoa/index.html"
      ];

      let pageRes = null;

      for (const repoPath of candidatePaths) {
        const response = await fetch(
          mainRepoUrl(repoPath),
          { cache: "no-store" }
        );

        if (response.ok) {
          pageRes = response;
          break;
        }
      }

      if (!pageRes) {
        return new Response(
          "After After CYOA page not found in main repository.",
          {
            status: 404,
            headers: {
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "no-store"
            }
          }
        );
      }

      let html = await pageRes.text();

      try {
        const counts = await getAfterAfterVoteCounts(env);
        html = injectAfterAfterVoteCounts(html, counts);
      } catch (error) {
        console.error(
          "After After SSR vote totals failed:",
          error
        );
      }

      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    function homeEscapeHtml(value) {
      return String(value ?? "").replace(
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

    function homeSafeUrl(value) {
      const text = String(value ?? "").trim();

      if (!text) return "";

      try {
        const parsed = new URL(text);

        if (
          parsed.protocol === "http:" ||
          parsed.protocol === "https:"
        ) {
          return text;
        }
      } catch (error) {
        return "";
      }

      return "";
    }

    function homeFormatDate(value) {
      const text = String(value ?? "").trim();

      if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return "";
      }

      const date = new Date(`${text}T00:00:00Z`);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return new Intl.DateTimeFormat(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC"
        }
      ).format(date);
    }

    function latestReleaseFromData(data) {
      const releases =
        data && Array.isArray(data.new_releases)
          ? data.new_releases
          : [];

      const published = releases
        .filter(release => {
          const date =
            String(release?.release_date ?? "").trim();

          return /^\d{4}-\d{2}-\d{2}$/.test(date);
        })
        .map((release, index) => ({
          release,
          sourceIndex: index
        }))
        .sort((a, b) => {
          const dateCompare =
            String(a.release.release_date)
              .localeCompare(
                String(b.release.release_date)
              );

          if (dateCompare !== 0) {
            return dateCompare;
          }

          return a.sourceIndex - b.sourceIndex;
        });

      if (published.length === 0) {
        return null;
      }

      const latest =
        published[published.length - 1];

      return {
        ...latest.release,
        release_number: published.length,
        release_total: published.length
      };
    }

    function episodeRichness(episode) {
      if (!episode) return 0;

      let score = 0;

      if (episode.title) score += 1;
      if (episode.url) score += 2;
      if (episode.season) score += 1;
      if (episode.episode) score += 1;

      return score;
    }

    function latestEpisodeFromGlossary(data) {
      const records =
        Array.isArray(data)
          ? data
          : (
              data && Array.isArray(data.records)
                ? data.records
                : []
            );

      let latest = null;

      records.forEach(record => {
        const appearances =
          record && Array.isArray(record.appearances)
            ? record.appearances
            : [];

        appearances.forEach(appearance => {
          const ge = Number(appearance?.ge);

          if (!Number.isFinite(ge)) {
            return;
          }

          const candidate = {
            ge,
            season:
              Number(appearance?.season) || null,
            episode:
              Number(appearance?.episode) || null,
            title:
              String(appearance?.title ?? "").trim(),
            url:
              String(appearance?.url ?? "").trim()
          };

          if (
            !latest ||
            candidate.ge > latest.ge ||
            (
              candidate.ge === latest.ge &&
              episodeRichness(candidate) >
                episodeRichness(latest)
            )
          ) {
            latest = candidate;
          }
        });
      });

      if (!latest) {
        return null;
      }

      return {
        ...latest,
        episode_number_overall: latest.ge,
        episode_total: latest.ge
      };
    }

    function renderHomeLinks(links) {
      const items =
        Array.isArray(links)
          ? links
              .map(link => {
                const label =
                  String(link?.label ?? "").trim();
                const url =
                  homeSafeUrl(link?.url);

                if (!label || !url) {
                  return "";
                }

                return (
                  `<a href="${homeEscapeHtml(url)}"` +
                  ` target="_blank" rel="noopener">` +
                  `${homeEscapeHtml(label)}</a>`
                );
              })
              .filter(Boolean)
          : [];

      if (items.length === 0) {
        return "";
      }

      return (
        `<div class="featured-links">` +
        items.join("<span aria-hidden=\"true\">·</span>") +
        `</div>`
      );
    }

    function renderLatestRelease(release) {
      if (!release) {
        return (
          `<div class="featured-card featured-empty">` +
          `<p>No dated release is currently available.</p>` +
          `</div>`
        );
      }

      const title =
        String(release.title ?? "").trim() ||
        "Untitled release";

      const canonical =
        homeSafeUrl(release.canonical_url);

      const image =
        homeSafeUrl(release.image);

      const description =
        String(release.description ?? "").trim();

      const series =
        Array.isArray(release.series)
          ? release.series
              .map(value => String(value ?? "").trim())
              .filter(Boolean)
          : [];

      const genres =
        Array.isArray(release.genre)
          ? release.genre
              .map(value => String(value ?? "").trim())
              .filter(Boolean)
          : [];

      const date =
        homeFormatDate(release.release_date);

      const length =
        String(release.length ?? "").trim();

      const meta = [
        ...series,
        date,
        length,
        ...genres
      ].filter(Boolean);

      const titleMarkup = canonical
        ? (
            `<a href="${homeEscapeHtml(canonical)}"` +
            ` target="_blank" rel="noopener">` +
            `${homeEscapeHtml(title)}</a>`
          )
        : homeEscapeHtml(title);

      const imageMarkup = image
        ? (
            `<div class="featured-art">` +
            `<img src="${homeEscapeHtml(image)}"` +
            ` alt="${homeEscapeHtml(title)} cover art">` +
            `</div>`
          )
        : "";

      const metaMarkup =
        meta.length > 0
          ? (
              `<div class="featured-meta">` +
              `${homeEscapeHtml(meta.join(" · "))}` +
              `</div>`
            )
          : "";

      const descriptionMarkup =
        description
          ? `<p>${homeEscapeHtml(description)}</p>`
          : "";

      const counterMarkup =
        release.release_number &&
        release.release_total
          ? (
              `<div class="featured-counter">` +
              `Release ${homeEscapeHtml(release.release_number)}` +
              ` of ${homeEscapeHtml(release.release_total)}` +
              `</div>`
            )
          : "";

      return (
        `<article class="featured-card` +
        `${image ? " has-art" : ""}">` +
        imageMarkup +
        `<div class="featured-copy">` +
        counterMarkup +
        `<h2>${titleMarkup}</h2>` +
        metaMarkup +
        descriptionMarkup +
        renderHomeLinks(release.links) +
        `</div>` +
        `</article>`
      );
    }

    function homeEpisodeArcName(url) {
      const text = String(url ?? "").trim();
      const match = text.match(/\/arcs\/([^/]+)/i);

      if (!match) return "";

      return match[1]
        .split("-")
        .filter(Boolean)
        .map(
          word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");
    }

    function homeEpisodeRepoPath(url) {
      const safe = homeSafeUrl(url);

      if (!safe) return "";

      try {
        const parsed = new URL(safe);

        if (
          parsed.hostname !==
          "neuralnetsandprettypatterns.com"
        ) {
          return "";
        }

        const path = parsed.pathname;

        if (path.endsWith("/")) {
          return `${path}index.html`;
        }

        if (fileType(path)) {
          return path;
        }

        return `${path}/index.html`;
      } catch (error) {
        return "";
      }
    }

    function homeDecodeHtmlEntities(value) {
      return String(value ?? "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#(\d+);/g, (_, code) =>
          String.fromCharCode(Number(code))
        )
        .replace(/\s+/g, " ")
        .trim();
    }

    function homeFirstSentence(value) {
      const text =
        String(value ?? "")
          .replace(/\s+/g, " ")
          .trim();

      if (!text) return "";

      const match =
        text.match(/^.*?[.!?](?:["')\]]+)?(?=\s|$)/);

      return match
        ? match[0].trim()
        : text;
    }

    function homeMetaContent(
      html,
      attribute,
      key
    ) {
      const source = String(html ?? "");
      const escapedKey =
        String(key)
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const firstPattern = new RegExp(
        `<meta\\s+[^>]*${attribute}=["']${escapedKey}["'][^>]*content=(["'])([\\s\\S]*?)\\1[^>]*>`,
        "i"
      );

      const secondPattern = new RegExp(
        `<meta\\s+[^>]*content=(["'])([\\s\\S]*?)\\1[^>]*${attribute}=["']${escapedKey}["'][^>]*>`,
        "i"
      );

      const match =
        source.match(firstPattern) ||
        source.match(secondPattern);

      return match
        ? homeDecodeHtmlEntities(match[2])
        : "";
    }

    async function enrichLatestEpisode(episode) {
      if (!episode) return null;

      const enriched = {
        ...episode,
        arc: homeEpisodeArcName(episode.url),
        tagline: "",
        summary: ""
      };

      const repoPath =
        homeEpisodeRepoPath(episode.url);

      if (!repoPath) {
        return enriched;
      }

      try {
        const response = await fetch(
          mainRepoUrl(repoPath),
          { cache: "no-store" }
        );

        if (!response.ok) {
          return enriched;
        }

        const html =
          await response.text();

        enriched.tagline =
          homeMetaContent(
            html,
            "property",
            "og:description"
          ) ||
          homeMetaContent(
            html,
            "name",
            "twitter:description"
          );

        enriched.summary =
          homeFirstSentence(
            homeMetaContent(
              html,
              "name",
              "description"
            )
          );

        return enriched;
      } catch (error) {
        console.error(
          "Homepage episode metadata enrichment failed:",
          error
        );

        return enriched;
      }
    }

    function renderLatestEpisode(episode) {
      if (!episode) {
        return (
          `<div class="featured-card featured-empty">` +
          `<p>No episode appearance data is currently available.</p>` +
          `</div>`
        );
      }

      const title =
        episode.title || `GE${episode.ge}`;

      const url =
        homeSafeUrl(episode.url);

      const titleMarkup = url
        ? (
            `<a href="${homeEscapeHtml(url)}">` +
            `${homeEscapeHtml(title)}</a>`
          )
        : homeEscapeHtml(title);

      const episodeLabel =
        episode.season && episode.episode
          ? `S${episode.season}E${episode.episode}`
          : "";

      const meta = [
        "Deep Dream State",
        episode.arc || "",
        episodeLabel,
        `GE${episode.ge}`
      ].filter(Boolean);

      const taglineMarkup =
        episode.tagline
          ? (
              `<div class="featured-tagline">` +
              `${homeEscapeHtml(episode.tagline)}` +
              `</div>`
            )
          : "";

      const summaryMarkup =
        episode.summary
          ? `<p>${homeEscapeHtml(episode.summary)}</p>`
          : (
              `<p>The latest episode of ` +
              `<em>Deep Dream State</em>.</p>`
            );

      const action = url
        ? (
            `<div class="featured-links">` +
            `<a href="${homeEscapeHtml(url)}">Episode page</a>` +
            `</div>`
          )
        : "";

      const counterMarkup =
        episode.episode_number_overall &&
        episode.episode_total
          ? (
              `<div class="featured-counter">` +
              `Episode ${homeEscapeHtml(episode.episode_number_overall)}` +
              ` of ${homeEscapeHtml(episode.episode_total)}` +
              `</div>`
            )
          : "";

      return (
        `<article class="featured-card">` +
        `<div class="featured-copy">` +
        counterMarkup +
        `<h2>${titleMarkup}</h2>` +
        `<div class="featured-meta">` +
        `${homeEscapeHtml(meta.join(" · "))}` +
        `</div>` +
        taglineMarkup +
        summaryMarkup +
        action +
        `</div>` +
        `</article>`
      );
    }

    function replaceHomeRegion(
      html,
      startMarker,
      endMarker,
      replacement
    ) {
      const start = html.indexOf(startMarker);
      const end = html.indexOf(endMarker);

      if (
        start === -1 ||
        end === -1 ||
        end < start
      ) {
        return html;
      }

      const before =
        html.slice(0, start + startMarker.length);

      const after =
        html.slice(end);

      return (
        before +
        "\n" +
        replacement +
        "\n" +
        after
      );
    }

    async function serveHomePage() {
      const [
        pageRes,
        releasesRes,
        glossaryRes
      ] = await Promise.all([
        fetch(
          mainRepoUrl("/index.html"),
          { cache: "no-store" }
        ),
        fetch(
          mainRepoUrl(RELEASES_JSON_PATH),
          { cache: "no-store" }
        ),
        fetch(
          mainRepoUrl(GLOSSARY_JSON_PATH),
          { cache: "no-store" }
        )
      ]);

      if (!pageRes.ok) {
        return new Response(
          await pageRes.text(),
          {
            status: 404,
            headers: {
              "content-type":
                "text/html; charset=utf-8",
              "cache-control": "no-store"
            }
          }
        );
      }

      let html = await pageRes.text();

      if (releasesRes.ok) {
        try {
          const releaseData =
            await releasesRes.json();

          html = replaceHomeRegion(
            html,
            "<!-- LATEST_RELEASE_START -->",
            "<!-- LATEST_RELEASE_END -->",
            renderLatestRelease(
              latestReleaseFromData(releaseData)
            )
          );
        } catch (error) {
          console.error(
            "Homepage release data could not be parsed:",
            error
          );
        }
      } else {
        console.error(
          "Homepage release data request failed:",
          releasesRes.status
        );
      }

      if (glossaryRes.ok) {
        try {
          const glossaryData =
            await glossaryRes.json();

          const latestEpisode =
            latestEpisodeFromGlossary(
              glossaryData
            );

          const enrichedEpisode =
            await enrichLatestEpisode(
              latestEpisode
            );

          html = replaceHomeRegion(
            html,
            "<!-- LATEST_EPISODE_START -->",
            "<!-- LATEST_EPISODE_END -->",
            renderLatestEpisode(
              enrichedEpisode
            )
          );
        } catch (error) {
          console.error(
            "Homepage glossary data could not be parsed:",
            error
          );
        }
      } else {
        console.error(
          "Homepage glossary data request failed:",
          glossaryRes.status
        );
      }

      return new Response(html, {
        status: 200,
        headers: {
          "content-type":
            "text/html; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    // Root
    if (p === "/" || p === "/index.html") {
      return serveHomePage();
    }

    // Contact
    if (
      p === "/contact" ||
      p === "/contact/" ||
      p === "/contact/index.html"
    ) {
      return serveHtml("/contact/index.html", true);
    }

    // Casting: General
    if (
      p === "/casting/general" ||
      p === "/casting/general/" ||
      p === "/casting/general/index.html"
    ) {
      return serveHtml(
        "/casting/general/index.html",
        true
      );
    }

    // Casting: current calls, rendered server-side from D1
    if (
      p === "/casting/calls" ||
      p === "/casting/calls/" ||
      p === "/casting/calls/index.html"
    ) {
      return serveCastingCallsPage(env);
    }


    // Public project calendar
    if (
      p === "/calendar" ||
      p === "/calendar/" ||
      p === "/calendar/index.html"
    ) {
      return serveHtml(
        "/calendar/index.html",
        true
      );
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


    // Buh Ball
    if (
      p === "/games/buhball" ||
      p === "/games/buhball/" ||
      p === "/games/buhball/index.html"
    ) {
      return serveHtml(
        "/games/buhball/index.html",
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

    // Vale Four Episode 14: Rubido
    if (
      p === "/deepdreamstate/arcs/vale-four/episode-14-rubido" ||
      p === "/deepdreamstate/arcs/vale-four/episode-14-rubido/" ||
      p === "/deepdreamstate/arcs/vale-four/episode-14-rubido/index.html"
    ) {
      return serveHtml(
        "/deepdreamstate/arcs/vale-four/episode-14-rubido/index.html",
        true
      );
    }

    // After After CYOA page: main repo + server-rendered vote totals
    if (
      p === "/deepdreamstate/arcs/afterafter/cyoa" ||
      p === "/deepdreamstate/arcs/afterafter/cyoa/" ||
      p === "/deepdreamstate/arcs/afterafter/cyoa/index.html"
    ) {
      return serveAfterAfterCyoaPage();
    }

    // After After arc pages and assets
    // Main repo wins. A second candidate supports the older /arcs layout.
    if (
      p === "/deepdreamstate/arcs/afterafter" ||
      p.startsWith("/deepdreamstate/arcs/afterafter/")
    ) {
      return serveAfterAfterPath(p);
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

    // Deep Dream State cast pages
    // Main repo wins when present; missing paths fall back to the legacy DDS site.
    if (
      p === "/deepdreamstate/cast" ||
      p.startsWith("/deepdreamstate/cast/")
    ) {
      return serveMigratedDeepDreamStatePathWithFallback(
        p,
        url
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

/* =========================================================
   PROTECTED SCRIPT DOWNLOADS
   ========================================================= */

const SCRIPT_AGE_COOKIE = "nnpp_script_age";
const SCRIPT_AGE_MAX_AGE = 12 * 60 * 60;

async function handleScriptAgeAttestation(request, env) {
  if (request.method !== "POST") {
    return scriptJsonResponse(
      { ok: false, error: "Method not allowed." },
      405,
      { Allow: "POST" }
    );
  }

  if (!env || !env.SCRIPT_GATE_SECRET) {
    return scriptJsonResponse(
      { ok: false, error: "Script age attestation is not configured." },
      500
    );
  }

  if (!isSameOriginScriptRequest(request)) {
    return scriptJsonResponse(
      { ok: false, error: "Invalid request origin." },
      403
    );
  }

  let body;

  try {
    body = await request.json();
  } catch (error) {
    return scriptJsonResponse(
      { ok: false, error: "Invalid request body." },
      400
    );
  }

  if (body?.attest !== true) {
    return scriptJsonResponse(
      { ok: false, error: "Age attestation is required." },
      400
    );
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `18plus:${issuedAt}`;
  const signature = await signScriptAgePayload(
    env.SCRIPT_GATE_SECRET,
    payload
  );
  const value = `${payload}.${signature}`;

  return scriptJsonResponse(
    { ok: true, attested: true },
    200,
    {
      "Set-Cookie":
        `${SCRIPT_AGE_COOKIE}=${value}; ` +
        `Max-Age=${SCRIPT_AGE_MAX_AGE}; Path=/scripts; ` +
        "HttpOnly; Secure; SameSite=Strict"
    }
  );
}

async function handleScriptDownload(request, env, path) {
  if (request.method !== "GET") {
    return new Response("Method not allowed.", {
      status: 405,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "allow": "GET"
      }
    });
  }

  if (!env || !env.calendar) {
    return new Response("Script database is not configured.", {
      status: 500,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  if (!env.scripts) {
    return new Response("Script storage is not configured.", {
      status: 500,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  const idText = path.slice("/scripts/download/".length);

  if (!/^\d+$/.test(idText)) {
    return new Response("Script not found.", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  const scriptId = Number(idText);
  let row;

  try {
    row = await env.calendar
      .prepare(
        `SELECT id, title, series, r2_key, adult_material
         FROM writing_scripts
         WHERE id = ?
         LIMIT 1`
      )
      .bind(scriptId)
      .first();
  } catch (error) {
    console.error("Script lookup failed:", error);

    return new Response("Script could not be loaded.", {
      status: 500,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  if (!row || !row.r2_key) {
    return new Response("Script not found.", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  if (Number(row.adult_material) === 1) {
    const attested = await hasValidScriptAgeAttestation(
      request,
      env
    );

    if (!attested) {
      return new Response(
        "Age attestation required before downloading this script.",
        {
          status: 403,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store"
          }
        }
      );
    }
  }

  let object;

  try {
    object = await env.scripts.get(row.r2_key);
  } catch (error) {
    console.error("R2 script fetch failed:", error);

    return new Response("Script could not be loaded.", {
      status: 500,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  if (!object) {
    return new Response("Script file not found.", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  const filename = scriptDownloadFilename(
    row.r2_key,
    row.title
  );
  const headers = new Headers();

  object.writeHttpMetadata(headers);
  headers.set(
    "content-type",
    headers.get("content-type") || "application/octet-stream"
  );
  headers.set(
    "content-disposition",
    `attachment; filename="${filename}"`
  );
  headers.set("cache-control", "private, no-store");
  headers.set("x-content-type-options", "nosniff");

  if (object.httpEtag) {
    headers.set("etag", object.httpEtag);
  }

  return new Response(object.body, {
    status: 200,
    headers
  });
}

async function hasValidScriptAgeAttestation(request, env) {
  if (!env || !env.SCRIPT_GATE_SECRET) {
    return false;
  }

  const cookies = parseScriptCookies(
    request.headers.get("cookie") || ""
  );
  const value = cookies[SCRIPT_AGE_COOKIE];

  if (!value) return false;

  const dot = value.lastIndexOf(".");

  if (dot <= 0) return false;

  const payload = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  const match = payload.match(/^18plus:(\d+)$/);

  if (!match) return false;

  const issuedAt = Number(match[1]);
  const now = Math.floor(Date.now() / 1000);

  if (
    !Number.isFinite(issuedAt) ||
    issuedAt > now + 60 ||
    now - issuedAt > SCRIPT_AGE_MAX_AGE
  ) {
    return false;
  }

  const expected = await signScriptAgePayload(
    env.SCRIPT_GATE_SECRET,
    payload
  );

  return scriptConstantTimeEqual(signature, expected);
}

async function signScriptAgePayload(secret, payload) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(String(secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

function bytesToBase64Url(bytes) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function scriptConstantTimeEqual(a, b) {
  const left = String(a || "");
  const right = String(b || "");

  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let i = 0; i < left.length; i += 1) {
    result |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }

  return result === 0;
}

function parseScriptCookies(header) {
  const result = {};

  for (const part of String(header || "").split(";")) {
    const index = part.indexOf("=");

    if (index <= 0) continue;

    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();

    if (key) {
      result[key] = value;
    }
  }

  return result;
}

function scriptDownloadFilename(r2Key, title) {
  const keyName = String(r2Key || "")
    .split("/")
    .pop()
    .trim();
  const fallback = `${String(title || "script").trim() || "script"}.txt`;

  return (keyName || fallback)
    .replace(/[\r\n"]/g, "")
    .slice(0, 180);
}

function isSameOriginScriptRequest(request) {
  const origin = request.headers.get("origin") || "";

  if (!origin) return true;

  try {
    return origin === new URL(request.url).origin;
  } catch (error) {
    return false;
  }
}

function scriptJsonResponse(
  body,
  status = 200,
  extraHeaders = {}
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        ...extraHeaders
      }
    }
  );
}

/* =========================================================
   CASTING CALLS SSR
   ========================================================= */

async function loadCastingCallsData(env) {
  if (!env || !env.calendar) {
    throw new Error("Calendar database is not configured.");
  }

  const [callsResult, rolesResult] =
    await Promise.all([
      env.calendar
        .prepare(
          `SELECT *
           FROM calendar_casting_calls
           ORDER BY is_filled ASC,
                    callback_at ASC,
                    id ASC`
        )
        .all(),
      env.calendar
        .prepare(
          `SELECT *
           FROM calendar_casting_roles
           ORDER BY casting_call_id ASC,
                    sort_order ASC,
                    id ASC`
        )
        .all()
    ]);

  return {
    calls: callsResult.results || [],
    roles: rolesResult.results || []
  };
}

async function handleCastingCallsGet(request, env) {
  if (request.method !== "GET") {
    return Response.json(
      { ok: false, error: "Method not allowed." },
      {
        status: 405,
        headers: {
          "cache-control": "no-store",
          "allow": "GET"
        }
      }
    );
  }

  try {
    const { calls, roles } =
      await loadCastingCallsData(env);

    return Response.json(
      { ok: true, calls, roles },
      {
        status: 200,
        headers: { "cache-control": "no-store" }
      }
    );
  } catch (error) {
    console.error("Casting calls API failed:", error);

    return Response.json(
      {
        ok: false,
        error: "Casting data could not be loaded."
      },
      {
        status: 500,
        headers: { "cache-control": "no-store" }
      }
    );
  }
}

function renderCastingCallsTemplate(
  template,
  calls,
  roles,
  errorMessage = ""
) {
  const rolesByCall = new Map();

  for (const role of roles || []) {
    const key = Number(role.casting_call_id);

    if (!rolesByCall.has(key)) {
      rolesByCall.set(key, []);
    }

    rolesByCall.get(key).push(role);
  }

  const callsHtml = errorMessage
    ? `<div class="empty-state">${escapeHtml(errorMessage)}</div>`
    : (calls || []).length
      ? calls
          .map(call =>
            renderCastingCall(
              call,
              rolesByCall.get(Number(call.id)) || []
            )
          )
          .join("\n")
      : `<div class="empty-state">No casting calls are currently listed.</div>`;

  const openCalls = (calls || []).filter(
    call => Number(call.is_filled) !== 1
  );

  const callOptions = openCalls
    .map(call => {
      const label = [
        call.series,
        call.series_title || call.title
      ]
        .filter(Boolean)
        .join(" : ");

      return (
        `<option value="${escapeHtml(label)}" data-call-id="${escapeHtml(call.id)}">` +
        `${escapeHtml(label)}</option>`
      );
    })
    .join("\n");

  const roleOptions = openCalls
    .flatMap(call => {
      const callRoles =
        rolesByCall.get(Number(call.id)) || [];

      return callRoles
        .filter(role => Number(role.is_filled) !== 1)
        .map(role => {
          const callName =
            call.series_title || call.title || "Casting call";
          const roleName = role.role_label
            ? `${role.character_name} - ${role.role_label}`
            : role.character_name;

          return (
            `<option value="${escapeHtml(`${callName} : ${roleName}`)}" ` +
            `data-call-id="${escapeHtml(call.id)}">` +
            `${escapeHtml(callName)} : ${escapeHtml(roleName)}` +
            `</option>`
          );
        });
    })
    .join("\n");

  return template
    .replace(
      "<!--CASTING_CALLS_SSR-->",
      callsHtml
    )
    .replace(
      "<!--CASTING_CALL_OPTIONS_SSR-->",
      callOptions
    )
    .replace(
      "<!--CASTING_ROLE_OPTIONS_SSR-->",
      roleOptions
    );
}

function renderCastingCall(call, roles) {
  const slug = castingSlug(
    call.series_title || call.title || `call-${call.id}`
  );
  const isFilled = Number(call.is_filled) === 1;
  const status = isFilled ? "FILLED" : "OPEN";
  const statusClass = isFilled ? "filled" : "open";
  const displayTitle = [
    call.series,
    call.series_title || call.title
  ]
    .filter(Boolean)
    .join(" : ");

  const searchText = [
    call.title,
    call.series,
    call.season_number,
    call.season_title,
    call.series_title,
    call.series_subject,
    call.default_language_accent,
    status
  ]
    .filter(Boolean)
    .join(" ");

  const grouped = new Map();

  for (const role of roles || []) {
    const section = role.section || "ROLES";

    if (!grouped.has(section)) {
      grouped.set(section, []);
    }

    grouped.get(section).push(role);
  }

  const roleSections = Array.from(grouped.entries())
    .map(([section, sectionRoles]) => {
      const cards = sectionRoles
        .map(role => renderCastingRole(role))
        .join("\n");

      return `
        <h3 class="role-section-title">${escapeHtml(section)}</h3>
        <div class="role-list">
          ${cards}
        </div>`;
    })
    .join("\n");

  const meta = [
    ["Series", call.series],
    [
      "Season",
      [call.season_number, call.season_title]
        .filter(value => value !== null && value !== undefined && value !== "")
        .join(" : ")
    ],
    ["Series title", call.series_title],
    ["Subject", call.series_subject],
    ["Callbacks by", formatCastingDate(call.callback_at)],
    ["Fill by", formatCastingDate(call.fill_by)],
    ["Roles", roles.length],
    ["Language / Accent", call.default_language_accent]
  ]
    .filter(([, value]) =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    )
    .map(([label, value]) => `
      <div class="meta-item">
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(value)}</span>
      </div>`)
    .join("");

  const links = [
    `<a href="https://neuralnetsandprettypatterns.com/casting/general/">GENERAL CASTING GUIDELINES</a>`,
    call.script_url
      ? `<a href="${escapeHtml(call.script_url)}">SCRIPT</a>`
      : ""
  ]
    .filter(Boolean)
    .join("\n");

  return `
    <details class="casting-call" id="${escapeHtml(slug)}" data-search="${escapeHtml(searchText)}">
      <summary>
        <span>${escapeHtml(displayTitle || call.title || "Casting Call")}</span>
        <span class="status-badge ${statusClass}">${status}</span>
      </summary>
      <div class="details-body">
        <div class="call-meta">
          ${meta}
        </div>

        <div class="heat-key">
          <p><span class="heat-badge pg">PG</span> Roles may include coarse language and proximity to sexual situations.</p>
          <p><span class="heat-badge r">R</span> Roles include coarse language and some scenes of sexuality.</p>
        </div>

        <div class="call-links">
          ${links}
        </div>

        ${roleSections}
      </div>
    </details>`;
}

function renderCastingRole(role) {
  const isFilled = Number(role.is_filled) === 1;
  const roleStatus = isFilled ? "FILLED" : "OPEN";
  const roleStatusClass = isFilled ? "filled" : "open";
  const heat = String(role.heat || "").toUpperCase();
  const heatClass = heat === "R" ? "r" : "pg";

  const searchText = [
    role.character_name,
    role.role_label,
    role.gender,
    role.description,
    role.spotlight,
    role.episodes,
    role.heat,
    role.language_accent,
    role.section,
    roleStatus
  ]
    .filter(Boolean)
    .join(" ");

  const badges = [
    `<span class="status-badge ${roleStatusClass}">${roleStatus}</span>`,
    heat
      ? `<span class="heat-badge ${heatClass}">${escapeHtml(heat)}</span>`
      : "",
    role.spotlight
      ? `<span class="spotlight-badge">${escapeHtml(role.spotlight)}</span>`
      : ""
  ]
    .filter(Boolean)
    .join("");

  const specs = [
    ["Gender", role.gender],
    ["Episodes", role.episodes],
    ["Heat", heat],
    ["Language / Accent", role.language_accent]
  ]
    .filter(([, value]) =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    )
    .map(([label, value]) =>
      `<span><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</span>`
    )
    .join("");

  return `
    <article class="role-card" data-search="${escapeHtml(searchText)}">
      <div class="role-topline">
        <div>
          <div class="role-name">${escapeHtml(role.character_name)}</div>
          ${role.role_label ? `<div class="role-label">${escapeHtml(role.role_label)}</div>` : ""}
        </div>
        <div class="role-badges">${badges}</div>
      </div>
      ${role.description ? `<p class="role-description">${escapeHtml(role.description)}</p>` : ""}
      <div class="role-specs">${specs}</div>
    </article>`;
}

function castingSlug(value) {
  const slug = String(value || "casting-call")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "casting-call";
}

function formatCastingDate(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return text;

  return `${Number(match[2])}/${Number(match[3])}/${match[1]}`;
}

/* =========================================================
   PUBLIC PROJECT CALENDAR
   ========================================================= */

async function handleCalendarEventsGet(request, env) {
  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Method not allowed."
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "Allow": "GET"
        }
      }
    );
  }

  if (!env || !env.calendar) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Calendar database is not configured."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  try {
    const [
      scriptsResult,
      castingResult,
      productionsResult,
      castResult
    ] = await Promise.all([
      env.calendar
        .prepare(
          "SELECT * FROM calendar_scripts ORDER BY expected_completion_date, id"
        )
        .all(),
      env.calendar
        .prepare(
          "SELECT * FROM calendar_casting_calls ORDER BY callback_at, id"
        )
        .all(),
      env.calendar
        .prepare(
          "SELECT * FROM calendar_productions ORDER BY expected_completion_date, id"
        )
        .all(),
      env.calendar
        .prepare(
          "SELECT * FROM calendar_production_cast ORDER BY production_id, id"
        )
        .all()
    ]);

    const scripts = scriptsResult.results || [];
    const castingCalls = castingResult.results || [];
    const productionCast = castResult.results || [];
    const productions = (productionsResult.results || []).map(
      production => ({
        ...production,
        cast: productionCast.filter(
          member =>
            Number(member.production_id) ===
            Number(production.id)
        )
      })
    );

    return new Response(
      JSON.stringify({
        ok: true,
        scripts,
        casting_calls: castingCalls,
        productions
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error(
      "Calendar data request failed:",
      error
    );

    return new Response(
      JSON.stringify({
        ok: false,
        error: "Calendar data could not be loaded."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }
}

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
    audition_call: 120,
    audition_role: 120,
    demo_link: 500,
    voice_notes: 300,
    audition_links: 500,
    affirm_over_18: 10,
    affirm_legal: 10,
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
          fields.performer_name || fields.name
        ),
        fieldLine(
          "Casting call",
          fields.audition_call
        ),
        fieldLine(
          "Role",
          fields.audition_role
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
        ),
        fieldLine(
          "Over 18 affirmed",
          fields.affirm_over_18
        ),
        fieldLine(
          "Legal participation affirmed",
          fields.affirm_legal
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

/*/* =========================================================
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
      goldStarQuery,
      starSpeedrunQuery,
      flawlessVictoryQuery
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
           LIMIT 5`
        )
        .all(),

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
           LIMIT 5`
        )
        .all(),

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
           LIMIT 5`
        )
        .all()
    ]);

    const goldStarTop = (
      goldStarQuery.results || []
    ).map(row => ({
      player_name: row.player_name,
      total_score: Number(
        row.total_score
      )
    }));

    const starSpeedrunTop = (
      starSpeedrunQuery.results || []
    ).map(row => ({
      player_name: row.player_name,
      accuracy: Number(
        row.accuracy
      ),
      duration_ms: Number(
        row.duration_ms
      )
    }));

    const flawlessVictoryTop = (
      flawlessVictoryQuery.results || []
    ).map(row => ({
      player_name: row.player_name,
      best_block: Number(
        row.best_block
      )
    }));

    const goldStar =
      goldStarTop[0] || null;

    const starSpeedrun =
      starSpeedrunTop[0] || null;

    const flawlessVictory =
      flawlessVictoryTop[0] || null;

    return mantraJsonResponse({
      ok: true,
      leaderboard: {
        gold_star: goldStar,
        star_speedrun: starSpeedrun,
        flawless_victory: flawlessVictory,

        top_five: {
          gold_star: goldStarTop,
          star_speedrun: starSpeedrunTop,
          flawless_victory: flawlessVictoryTop
        },

        // Keep the old aliases working.
        star_quality: starSpeedrun,
        play_of_the_game: flawlessVictory
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
   AFTER AFTER FACTION VOTING
   ========================================================= */

const AFTER_AFTER_FACTIONS = [
  "orphics",
  "triplings",
  "pando",
  "lilies",
  "liminites",
  "synthservs",
  "the-pack"
];

async function ensureAfterAfterTables(env) {
  if (!env || !env.CYOA_DB) {
    throw new Error("CYOA database is not configured.");
  }

  await env.CYOA_DB.batch([
    env.CYOA_DB.prepare(
      `CREATE TABLE IF NOT EXISTS afterafter_votes (
         voter_hash TEXT PRIMARY KEY,
         faction TEXT NOT NULL,
         created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
         updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
       )`
    ),
    env.CYOA_DB.prepare(
      `CREATE TABLE IF NOT EXISTS afterafter_vote_batches (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         faction TEXT NOT NULL,
         source TEXT NOT NULL DEFAULT 'manual',
         votes INTEGER NOT NULL,
         note TEXT,
         created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
       )`
    )
  ]);
}

function emptyAfterAfterCounts() {
  return Object.fromEntries(
    AFTER_AFTER_FACTIONS.map(function (faction) {
      return [faction, 0];
    })
  );
}

async function getAfterAfterVoteCounts(env) {
  await ensureAfterAfterTables(env);

  const [siteVoteQuery, batchVoteQuery] = await Promise.all([
    env.CYOA_DB
      .prepare(
        `SELECT faction, COUNT(*) AS votes
         FROM afterafter_votes
         GROUP BY faction`
      )
      .all(),
    env.CYOA_DB
      .prepare(
        `SELECT faction, COALESCE(SUM(votes), 0) AS votes
         FROM afterafter_vote_batches
         GROUP BY faction`
      )
      .all()
  ]);

  const counts = emptyAfterAfterCounts();

  for (const row of siteVoteQuery.results || []) {
    const faction = String(row.faction || "");
    if (Object.prototype.hasOwnProperty.call(counts, faction)) {
      counts[faction] += Number(row.votes || 0);
    }
  }

  for (const row of batchVoteQuery.results || []) {
    const faction = String(row.faction || "");
    if (Object.prototype.hasOwnProperty.call(counts, faction)) {
      counts[faction] += Number(row.votes || 0);
    }
  }

  return counts;
}

function injectAfterAfterVoteCounts(html, counts) {
  const markerNames = {
    "orphics": "ORPHICS",
    "triplings": "TRIPLINGS",
    "pando": "PANDO",
    "lilies": "LILIES",
    "liminites": "LIMINITES",
    "synthservs": "SYNTHSERVS",
    "the-pack": "THE-PACK"
  };

  const factionLabels = {
    "orphics": "Orphics",
    "triplings": "Triplings",
    "pando": "Pando",
    "lilies": "Lilies",
    "liminites": "Liminites",
    "synthservs": "Synthservs",
    "the-pack": "The Pack"
  };

  function replaceAllMarkerRegions(source, marker, value) {
    const startMarker = `<!--AFTERAFTER:${marker}-->`;
    const endMarker = `<!--/AFTERAFTER:${marker}-->`;

    let output = String(source || "");
    let searchFrom = 0;

    while (true) {
      const start =
        output.indexOf(startMarker, searchFrom);

      if (start === -1) {
        break;
      }

      const contentStart =
        start + startMarker.length;

      const end =
        output.indexOf(endMarker, contentStart);

      if (end === -1) {
        break;
      }

      output =
        output.slice(0, contentStart) +
        String(value) +
        output.slice(end);

      searchFrom =
        contentStart +
        String(value).length +
        endMarker.length;
    }

    return output;
  }

  let output = String(html || "");

  const normalized = AFTER_AFTER_FACTIONS.map(
    (faction, order) => ({
      faction,
      order,
      votes: Number(counts?.[faction] || 0)
    })
  );

  for (const item of normalized) {
    output = replaceAllMarkerRegions(
      output,
      markerNames[item.faction],
      item.votes
    );
  }

  const totalVotes = normalized.reduce(
    (sum, item) => sum + item.votes,
    0
  );

  output = replaceAllMarkerRegions(
    output,
    "TOTAL-VOTES",
    totalVotes
  );

  const topThree = normalized
    .slice()
    .sort(
      (a, b) =>
        b.votes - a.votes ||
        a.order - b.order
    )
    .slice(0, 3);

  const topThreeHtml = topThree
    .map(
      (item, index) =>
        `<li><span><span class="leaderboard-rank">${index + 1}.</span> ` +
        `${factionLabels[item.faction]}</span>` +
        `<strong>${item.votes}</strong></li>`
    )
    .join("");

  output = replaceAllMarkerRegions(
    output,
    "TOP-THREE",
    topThreeHtml
  );

  return output;
}

async function handleAfterAfterVotes(request, env) {
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

  try {
    const counts = await getAfterAfterVoteCounts(env);

    return cyoaJsonResponse({
      ok: true,
      counts
    });
  } catch (error) {
    console.error(
      "After After vote totals read failed:",
      error
    );

    return cyoaJsonResponse(
      {
        ok: false,
        error: "After After vote totals could not be loaded."
      },
      500
    );
  }
}

async function handleAfterAfterVote(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Allow": "POST, OPTIONS",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
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

  const token = String(
    submission?.token || ""
  ).trim();

  const faction = String(
    submission?.faction || ""
  ).trim().toLowerCase();

  if (token.length < 12 || token.length > 200) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "A valid browser voter token is required."
      },
      400
    );
  }

  if (!AFTER_AFTER_FACTIONS.includes(faction)) {
    return cyoaJsonResponse(
      {
        ok: false,
        error: "Choose a valid After After faction."
      },
      400
    );
  }

  try {
    await ensureAfterAfterTables(env);

    const voterHash = await hashCyoaVoter(
      "afterafter",
      token
    );

    await env.CYOA_DB
      .prepare(
        `INSERT INTO afterafter_votes (
           voter_hash,
           faction,
           created_at,
           updated_at
         )
         VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (voter_hash)
         DO UPDATE SET
           faction = excluded.faction,
           updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        voterHash,
        faction
      )
      .run();

    const counts = await getAfterAfterVoteCounts(env);

    return cyoaJsonResponse({
      ok: true,
      selectedFaction: faction,
      counts
    });
  } catch (error) {
    console.error(
      "After After vote write failed:",
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
