module.exports = {
  apps: [
    {
      name: "instamediabr",
      script: "./dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: "5040",
        DATABASE_URL: "postgresql://neondb_owner:npg_sG09KjbVWgky@ep-summer-mode-aemy3ps9.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
      }
    }
  ]
}

