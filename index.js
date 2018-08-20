const qaffeine = require('qaffeine')
const eqAtRule = require('./src/element-query-at-rule.js')
const eqSelector = require('./src/element-query-selector.js')

qaffeine(
  {
    stylesheet: {
      element: eqAtRule
    },
    rule: {
      element: eqSelector
    }
  },
  'src/stylesheet.css',
  'dist/styles.js',
  'dist/styles.css'
)