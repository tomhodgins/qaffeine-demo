module.exports = function(selector='', ...extra) {

  // Built-in element query tests
  const eq = {
    minWidth: (el, number) => number <= el.offsetWidth,
    maxWidth: (el, number) => number >= el.offsetWidth,
    minHeight: (el, number) => number <= el.offsetHeight,
    maxHeight: (el, number) => number >= el.offsetHeight,
    minChildren: (el, number) => number <= el.children.length,
    totalChildren: (el, number) => number === el.children.length,
    maxChildren: (el, number) => number >= el.children.length,
    minCharacters: (el, number) => number <= (
      (el.value && el.value.length) || el.textContent.length
    ),
    characters: (el, number) => number === (
      (el.value && el.value.length) || el.textContent.length
    ),
    maxCharacters: (el, number) => number >= (
      (el.value && el.value.length) || el.textContent.length
    ),
    minScrollX: (el, number) => number <= el.scrollLeft,
    maxScrollX: (el, number) => number >= el.scrollLeft,
    minScrollY: (el, number) => number <= el.scrollTop,
    maxScrollY: (el, number) => number >= el.scrollTop,
    minAspectRatio: (el, number) => number <= el.offsetWidth / el.offsetHeight,
    maxAspectRatio: (el, number) => number >= el.offsetWidth / el.offsetHeight,
    orientation: (el, string) => {
      switch (string) {
        case 'portrait': return el.offsetWidth < el.offsetHeight
        case 'square': return el.offsetWidth === el.offsetHeight
        case 'landscape': return el.offsetWidth > el.offsetHeight
      }
    }
  }

  let options = {}
  let plugins = eq
  let rule = ''

  switch (extra.length) {

    // If 2 arguments present, use as options and custom plugin
    case 3:
      options = extra[0]
      plugins = Object.assign(extra[1], plugins)
      rule = extra[2]
    break

    // If 1 argument present, use as options
    case 2:
      options = extra[0]
      rule = extra[1]
    break

    // If no arguments present, run as scoped style
    case 1:
      rule = extra[0]
    break

  }

  // For each tag in the document matching the CSS selector
  return Array.from(document.querySelectorAll(selector))

    // Process each tag and return a string of CSS that tag needs
    .reduce((styles, tag, count) => {

      // Create a custom data atribute we can assign if the tag matches
      const attr = (selector + Object.entries(options)).replace(/\W/g, '')

      // Test tag to see if it passes all conditions
      if (

        // Pass if every condition given is true
        Object.keys(options).every(test => {

          // If condition is a property of the tag, test the property
          if (
            tag[test] !== null 
            && typeof options[test] === 'function'
          ) return options[test](tag[test])

          // Otherwise if condition is a method of the tag, run the method
          else if (tag[test]) return options[test] === tag[test]

          // Otherwise if condition matches a loaded plugin, run the plugin
          else if (plugins[test]) return plugins[test](tag, options[test])

        })

      ) {

        // If the tag passes, set a custom data attribute
        tag.setAttribute(`data-element-selector-${attr}`, count)

        // Add CSS rule to output, adding selector for the current tag
        styles += `${selector}[data-element-selector-${attr}="${count}"] { ${rule} }\n`

      } else {

        // Otherwise if tag fails tests, remove custom data attribute value
        tag.setAttribute(`data-element-selector-${attr}`, '')

      }

      return styles

    }, '')

}