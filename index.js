const qaffeine = require('qaffeine')
const element = require('./src/element-query-plugin.js')

qaffeine(
  {
    stylesheet: {
      element
    },
    rule: {}
  },
  'src/stylesheet.css',
  'dist/styles.js',
  'dist/styles.css'
)