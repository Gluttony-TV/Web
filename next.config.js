// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
   enabled: process.env.NEXTJS_ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
   output: 'standalone',
   compiler: {
      styledComponents: true,
   },
   images: {
      domains: ['artworks.thetvdb.com'],
   },
})
