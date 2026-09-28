import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiTarget = String(env.VITE_API_BASE || `http://127.0.0.1:${env.PORT || "4242"}`).replace(/\/+$/g, "")
  const buildVersion = env.VITE_BUILD_VERSION || String(Date.now())
  const buildGeneratedAt = new Date().toISOString()

  return {
    plugins: [
      react(),
      {
        name: "planner-version-file",
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "version.json",
            source: JSON.stringify(
              {
                version: buildVersion,
                generatedAt: buildGeneratedAt,
              },
              null,
              2
            ),
          })
        },
      },
      {
        name: "defer-global-stylesheet",
        transformIndexHtml: {
          order: "post",
          handler(html, context) {
            if (!context.bundle) return html

            return html.replace(
              /<link rel="stylesheet" crossorigin href="(\/assets\/index-[^"]+\.css)">/,
              (_, href: string) =>
                `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'">\n` +
                `    <noscript><link rel="stylesheet" href="${href}"></noscript>`,
            )
          },
        },
      },
    ],
    define: {
      __APP_VERSION__: JSON.stringify(buildVersion),
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/media": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
