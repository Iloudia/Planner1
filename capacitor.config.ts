import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.meandrituals.app",
  appName: "Me&rituals",
  webDir: "dist",
  backgroundColor: "#f8f6f1",
  loggingBehavior: "none",
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
  },
  server: {
    hostname: "localhost",
    androidScheme: "https",
    iosScheme: "capacitor",
  },
}

export default config
