const { execSync } = require("node:child_process");

const baseConfig = require("./app.json").expo;
const pkg = require("./package.json");

function getCommitCount() {
  try {
    const output = execSync("git rev-list --count HEAD", {
      stdio: ["ignore", "pipe", "ignore"]
    })
      .toString()
      .trim();
    const count = Number.parseInt(output, 10);
    return Number.isNaN(count) ? 1 : count;
  } catch {
    return 1;
  }
}

function buildVersion(baseVersion, commitCount) {
  const [major = "1", minor = "0"] = String(baseVersion).split(".");
  return `${major}.${minor}.${commitCount}`;
}

const commitCount = getCommitCount();
const baseVersion = pkg.version || baseConfig.version || "1.0.0";
const version = process.env.APP_VERSION || buildVersion(baseVersion, commitCount);
const versionCodeRaw = process.env.APP_VERSION_CODE || commitCount;
const versionCode = Number.parseInt(String(versionCodeRaw), 10) || 1;
const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://dummy-api-topaz.vercel.app";

module.exports = {
  expo: {
    ...baseConfig,
    version,
    extra: {
      ...(baseConfig.extra || {}),
      apiBaseUrl
    },
    ios: {
      ...(baseConfig.ios || {}),
      buildNumber: version
    },
    android: {
      ...(baseConfig.android || {}),
      package: "com.anonymous.cocosnuts",
      versionCode
    }
  }
};
