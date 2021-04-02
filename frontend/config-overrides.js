const { useBabelRc, override, addBabelPlugin, addBabelPreset } = require('customize-cra')

module.exports = override(
   addBabelPreset([
      '@babel/preset-react',
      {
         runtime: 'automatic',
         importSource: '@emotion/react'
      }
   ]),
   addBabelPlugin('@emotion/babel-plugin'),
   addBabelPlugin([
      'formatjs',
      {
         idInterpolationPattern: '[sha512:contenthash:base64:6]',
         ast: true
      }
   ])
)