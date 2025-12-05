// babel.config.js
// Babel配置 (Jest使用)

export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react'
  ]
};
