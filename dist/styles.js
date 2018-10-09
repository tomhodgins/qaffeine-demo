// jsincss
const jsincss = function (
  stylesheet = () => '',
  selector = window,
  events = ['load', 'resize', 'input', 'click', 'reprocess']
) {

  function registerEvent(target, event, id, stylesheet) {

    return target.addEventListener(
      event,
      e => populateStylesheet(id, stylesheet)
    )

  }

  function populateStylesheet(id, stylesheet) {

    let tag = document.querySelector(`#jsincss-${id}`)

    if (!tag) {

      tag = document.createElement('style')
      tag.id = `jsincss-${id}`
      document.head.appendChild(tag)

    }

    const currentStyles = tag.textContent
    const generatedStyles = stylesheet()

    if (!currentStyles || (generatedStyles !== currentStyles)) {

      return tag.textContent = generatedStyles

    }

  }

  let id = Date.now() + Math.floor(Math.random() * 100)

  if (selector === window) {

    return events.forEach(event =>
      registerEvent(window, event, id, stylesheet)
    )

  } else {

    return document.querySelectorAll(selector).forEach(tag =>
      events.forEach(event =>
        registerEvent(tag, event, id, stylesheet)
      )
    )

  }

}

// jsincss plugins
const customAtRule = {}

customAtRule.element = function (selector='', ...extra) {

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
  let stylesheet = ''

  switch (extra.length) {

    // If 2 arguments present, use as options and custom plugin
    case 3:
      options = extra[0]
      plugins = Object.assign(extra[1], plugins)
      stylesheet = extra[2]
    break

    // If 1 argument present, use as options
    case 2:
      options = extra[0]
      stylesheet = extra[1]
    break

    // If no arguments present, run as scoped style
    case 1:
      stylesheet = extra[0]
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
        tag.setAttribute(`data-element-atRule-${attr}`, count)

        // Add CSS stylesheet to output, replacing [--self] with the current tag
        styles += stylesheet.replace(
          /:self|\$this|\[--self\]/g,
          `${selector}[data-element-atRule-${attr}="${count}"]`
        )

      } else {

        // Otherwise if tag fails tests, remove custom data attribute value
        tag.setAttribute(`data-element-atRule-${attr}`, '')

      }

      return styles

    }, '')

}

const customStyleRule = {}

customStyleRule.element = function (selector='', ...extra) {

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

// JS-powered rules with default event listeners
jsincss(() =>
  [
    customStyleRule.element(
      `.minwidth`,
      {"minWidth": 300}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".minwidth", {"minWidth": 300}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.maxwidth`,
      {"maxWidth": 300}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".maxwidth", {"maxWidth": 300}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.minheight`,
      {"minHeight": 200}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".minheight", {"minHeight": 200}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.maxheight`,
      {"maxHeight": 200}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".maxheight", {"maxHeight": 200}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.mincharacters`,
      {"minCharacters": 35}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".mincharacters", {"minCharacters": 35}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.mincharacters-input`,
      {"minCharacters": 35}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".mincharacters-input", {"minCharacters": 35}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.mincharacters-textarea`,
      {"minCharacters": 35}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".mincharacters-textarea", {"minCharacters": 35}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.characters`,
      {"characters": 5}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".characters", {"characters": 5}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.characters-input`,
      {"characters": 5}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".characters-input", {"characters": 5}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.characters-textarea`,
      {"characters": 5}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".characters-textarea", {"characters": 5}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.maxcharacters`,
      {"maxCharacters": 35}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".maxcharacters", {"maxCharacters": 35}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.maxcharacters-input`,
      {"maxCharacters": 35}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".maxcharacters-input", {"maxCharacters": 35}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.maxcharacters-textarea`,
      {"maxCharacters": 35}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".maxcharacters-textarea", {"maxCharacters": 35}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.minchildren`,
      {"minChildren": 5}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".minchildren", {"minChildren": 5}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.children`,
      {"totalChildren": 5}, 
      `border-color: limegreen;`
    ),
    customStyleRule.element(
      `.maxchildren`,
      {"maxChildren": 5}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".maxchildren", {"maxChildren": 5}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.square`,
      {"orientation": "square"}, 
      `border-color: darkorchid;`
    ),
    customAtRule.element(
      ".square", {"orientation": "square"}, 
      `
        [--self] { background: orchid; }
      `
    ),
    customStyleRule.element(
      `.portrait`,
      {"orientation": "portrait"}, 
      `border-color: teal;`
    ),
    customAtRule.element(
      ".portrait", {"orientation": "portrait"}, 
      `
        [--self] { background: darkturquoise; }
      `
    ),
    customStyleRule.element(
      `.landscape`,
      {"orientation": "landscape"}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".landscape", {"orientation": "landscape"}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.minaspectratio`,
      {"minAspectRatio": 1.777}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".minaspectratio", {"minAspectRatio": 1.777}, 
      `
        [--self] { background: greenyellow; }
      `
    ),
    customStyleRule.element(
      `.maxaspectratio`,
      {"maxAspectRatio": 1.777}, 
      `border-color: limegreen;`
    ),
    customAtRule.element(
      ".maxaspectratio", {"maxAspectRatio": 1.777}, 
      `
        [--self] { background: greenyellow; }
      `
    )
  ].join('')
)

// JS-powered rules with custom event listeners
jsincss(() =>
  customAtRule.element(
    ".children", {"totalChildren": 5}, 
    `
      [--options] { --selector: window; --events: ["load", "resize", "input", "click", "mouseup"]; }
      [--self] { background: greenyellow; }
    `
  ),
  window,
  ["load", "resize", "input", "click", "mouseup"]
)
jsincss(() =>
  customStyleRule.element(
    `.min-scroll-y`,
    {"minScrollY": 50}, 
    `--selector: window; --events: ["load"]; border-color: limegreen;`
  ),
  window,
  ["load"]
)
jsincss(() =>
  customStyleRule.element(
    `.min-scroll-y`,
    {"minScrollY": 50}, 
    `--selector: ".min-scroll-y"; --events: ["scroll"]; border-color: limegreen;`
  ),
  ".min-scroll-y",
  ["scroll"]
)
jsincss(() =>
  customAtRule.element(
    ".min-scroll-y", {"minScrollY": 50}, 
    `
      [--options] { --selector: window; --events: ["load"]; }
      [--self] { background: greenyellow; }
    `
  ),
  window,
  ["load"]
)
jsincss(() =>
  customAtRule.element(
    ".min-scroll-y", {"minScrollY": 50}, 
    `
      [--options] { --selector: ".min-scroll-y"; --events: ["scroll"]; }
      [--self] { background: greenyellow; }
    `
  ),
  ".min-scroll-y",
  ["scroll"]
)
jsincss(() =>
  customStyleRule.element(
    `.max-scroll-y`,
    {"maxScrollY": 50}, 
    `--selector: window; --events: ["load"]; border-color: limegreen;`
  ),
  window,
  ["load"]
)
jsincss(() =>
  customStyleRule.element(
    `.max-scroll-y`,
    {"maxScrollY": 50}, 
    `--selector: ".max-scroll-y"; --events: ["scroll"]; border-color: limegreen;`
  ),
  ".max-scroll-y",
  ["scroll"]
)
jsincss(() =>
  customAtRule.element(
    ".max-scroll-y", {"maxScrollY": 50}, 
    `
      [--options] { --selector: window; --events: ["load"]; }
      [--self] { background: greenyellow; }
    `
  ),
  window,
  ["load"]
)
jsincss(() =>
  customAtRule.element(
    ".max-scroll-y", {"maxScrollY": 50}, 
    `
      [--options] { --selector: ".max-scroll-y"; --events: ["scroll"]; }
      [--self] { background: greenyellow; }
    `
  ),
  ".max-scroll-y",
  ["scroll"]
)
jsincss(() =>
  customStyleRule.element(
    `.min-scroll-x`,
    {"minScrollX": 50}, 
    `--selector: window; --events: ["load"]; border-color: limegreen;`
  ),
  window,
  ["load"]
)
jsincss(() =>
  customStyleRule.element(
    `.min-scroll-x`,
    {"minScrollX": 50}, 
    `--selector: ".min-scroll-x"; --events: ["scroll"]; border-color: limegreen;`
  ),
  ".min-scroll-x",
  ["scroll"]
)
jsincss(() =>
  customAtRule.element(
    ".min-scroll-x", {"minScrollX": 50}, 
    `
      [--options] { --selector: window; --events: ["load"]; }
      [--self] { background: greenyellow; }
    `
  ),
  window,
  ["load"]
)
jsincss(() =>
  customAtRule.element(
    ".min-scroll-x", {"minScrollX": 50}, 
    `
      [--options] { --selector: ".min-scroll-x"; --events: ["scroll"]; }
      [--self] { background: greenyellow; }
    `
  ),
  ".min-scroll-x",
  ["scroll"]
)
jsincss(() =>
  customStyleRule.element(
    `.max-scroll-x`,
    {"maxScrollX": 50}, 
    `--selector: window; --events: ["load"]; border-color: limegreen;`
  ),
  window,
  ["load"]
)
jsincss(() =>
  customStyleRule.element(
    `.max-scroll-x`,
    {"maxScrollX": 50}, 
    `--selector: ".max-scroll-x"; --events: ["scroll"]; border-color: limegreen;`
  ),
  ".max-scroll-x",
  ["scroll"]
)
jsincss(() =>
  customAtRule.element(
    ".max-scroll-x", {"maxScrollX": 50}, 
    `
      [--options] { --selector: window; --events: ["load"]; }
      [--self] { background: greenyellow; }
    `
  ),
  window,
  ["load"]
)
jsincss(() =>
  customAtRule.element(
    ".max-scroll-x", {"maxScrollX": 50}, 
    `
      [--options] { --selector: ".max-scroll-x"; --events: ["scroll"]; }
      [--self] { background: greenyellow; }
    `
  ),
  ".max-scroll-x",
  ["scroll"]
)