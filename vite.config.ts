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
