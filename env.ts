import dotenv from "dotenv";
import path from "path";

export function loadProjectEnv(baseDir: string) {
  dotenv.config({
    path: path.resolve(baseDir, ".env"),
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
