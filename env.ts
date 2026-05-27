import fs from "fs";
import dotenv from "dotenv";
import path from "path";

function resolveEnvPath(baseDir: string) {
  const candidateDirs = [
    process.cwd(),
    baseDir,
    path.resolve(baseDir, ".."),
    path.resolve(baseDir, "../.."),
  ];

  for (const dir of candidateDirs) {
    const envPath = path.resolve(dir, ".env");

    if (fs.existsSync(envPath)) {
      return envPath;
    }
  }

  return path.resolve(baseDir, ".env");
}

export function loadProjectEnv(baseDir: string) {
  dotenv.config({
    path: resolveEnvPath(baseDir),
    override: true,
  });
}

export function getAppRoot(baseDir: string) {
  const configuredRoot = process.env.APP_ROOT?.trim();

  if (!configuredRoot) {
    return path.resolve(baseDir);
  }

  return path.isAbsolute(configuredRoot)
    ? path.resolve(configuredRoot)
    : path.resolve(baseDir, configuredRoot);
}
