module.exports = {
  apps: [
    {
      name: process.env.PM2_PROCESS_NAME || "planner-api",
      cwd: process.env.PM2_APP_CWD || process.cwd(),
      script: "./server/index.mjs",
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        DOTENV_CONFIG_PATH: process.env.DOTENV_CONFIG_PATH || "/etc/planner/planner.env",
      },
      out_file: process.env.PM2_OUT_FILE || "/var/www/planner/shared/logs/planner-api.out.log",
      error_file: process.env.PM2_ERROR_FILE || "/var/www/planner/shared/logs/planner-api.error.log",
      merge_logs: true,
      time: true,
    },
  ],
}
