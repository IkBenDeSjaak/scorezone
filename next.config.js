module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com']
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.resolve.fallback.net = false
      config.resolve.fallback.tls = false
      config.resolve.fallback.fs = false
    }
    return config
  }
}
