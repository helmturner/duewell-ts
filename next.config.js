const config = {
  reactStrictMode: true,
  webpack: (config) => {
    if (!config.experiments) {
      config.experiments = {}
    }
    config.experiments.topLevelAwait = true;
    return config;
  }
};

module.exports = config