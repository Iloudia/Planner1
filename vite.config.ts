import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiTarget = String(env.VITE_API_BASE || `http://127.0.0.1:${env.PORT || "4242"}`).replace(/\/+$/g, "")

  return {
    plugins: [react()],
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
