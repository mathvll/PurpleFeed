const path = require("path");

const rootDir = path.resolve(__dirname, "..");

module.exports = {
  apps: [
    {
      name: "instamediabr",
      script: "./dist/index.js",
      cwd: rootDir,
      env: {
        NODE_ENV: "production",
        PORT: "5040",
        APP_ROOT: rootDir,
      },
    },
  ],
};


