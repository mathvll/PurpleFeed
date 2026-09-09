module.exports = {
  apps: [
    {
      name: "curtidas-online",
      cwd: "/home/hyppe/curtidas.online/current",
      script: "dist/index.js",
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "5041",
        APP_URL: "https://curtidas.online",
      },
    },
  ],
};
