const qaffeine = require('qaffeine')
const {element} = require('./src/element-query-plugin.js')

// Plugins
const plugins = {
  stylesheet: {
    element
  },
  rule: {

  }
}

qaffeine(
  plugins,
  'src/stylesheet.css',
  'dist/styles.js',
  'dist/styles.css'
)