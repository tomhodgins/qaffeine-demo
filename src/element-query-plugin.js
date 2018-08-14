// Custom Element Query Plugin
module.exports.element = function(selector, options, stylesheet) {

  const eq = {
    minWidth: (el, number) => number <= el.offsetWidth,
    maxWidth: (el, number) => number >= el.offsetWidth,
    minHeight: (el, number) => number <= el.offsetHeight,
    maxHeight: (el, number) => number >= el.offsetHeight,
    minChildren: (el, number) => number <= el.children.length,
    children: (el, number) => number === el.children.length,
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

  return Array.from(document.querySelectorAll(selector))

    .reduce((styles, tag, count) => {

      const attr = (selector + Object.entries(options)).replace(/\W/g, '')

      if (Object.keys(options).every(test => {

        if (tag[test] !== null && typeof options[test] === 'function') {

          return options[test](tag[test])

        } else if (tag[test]) {

          return options[test] === tag[test]

        } else if (plugins[test]) {

          return plugins[test](tag, options[test])

        } else {

          return false

        }

      })) {

        tag.setAttribute(`data-element-${attr}`, count)
        styles += stylesheet.replace(
          /:self|\$this|\[--self\]/g,
          `${selector}[data-element-${attr}="${count}"]`
        )
        count++

      } else {

        tag.setAttribute(`data-element-${attr}`, '')

      }

      return styles

    }, '')

}