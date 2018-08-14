// jsincss
const jsincss = function (
  stylesheet = '',
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
const element = function (selector, options, stylesheet) {

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

        } else if (eq[test]) {

          return eq[test](tag, options[test])

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


// JS-powered rules with default event listeners
jsincss(() =>
  [
function anonymous() {
  return element(
    ".minwidth", {minWidth: 300}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".maxwidth", {maxWidth: 300}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".minheight", {minHeight: 200}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".maxheight", {maxHeight: 200}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".mincharacters", {minCharacters: 35}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".mincharacters-input", {minCharacters: 35}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".mincharacters-textarea", {minCharacters: 35}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".characters", {characters: 5}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".characters-input", {characters: 5}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".characters-textarea", {characters: 5}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".maxcharacters", {maxCharacters: 35}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".maxcharacters-input", {maxCharacters: 35}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".maxcharacters-textarea", {maxCharacters: 35}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".minchildren", {minChildren: 5}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".maxchildren", {maxChildren: 5}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".square", {orientation: "square"}, 
    `

  [--self] { background: orchid; }

  `
)
},
function anonymous() {
  return element(
    ".portrait", {orientation: "portrait"}, 
    `

  [--self] { background: darkturquoise; }

  `
)
},
function anonymous() {
  return element(
    ".landscape", {orientation: "landscape"}, 
    `

  [--self] { background: greenyellow; }

  `
)
},
function anonymous() {
  return element(
    ".minaspectratio", {minAspectRatio: 16/9}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
},
function anonymous() {
  return element(
    ".maxaspectratio", {maxAspectRatio: 16/9}, 
    `

  [--self] { background: greenyellow; border-color: limegreen; }

  `
)
}
  ]
  .map(func => func())
  .join(``)
)

// JS-powered rules with custom event listeners
jsincss(() =>
  element(
    ".children", {children: 5}, 
    `
  [--self] { --selector: window; --events: ["load", "resize", "input", "click", "mouseup"]; background: greenyellow; border-color: limegreen; }
  `),
  window,
  ["load", "resize", "input", "click", "mouseup"]
)
jsincss(() =>
  element(
    ".min-scroll-y", {minScrollY: 50}, 
    `
  [--self] { --selector: window; --events: ["load"]; background: greenyellow; border-color: limegreen; }
  `),
  window,
  ["load"]
)
jsincss(() =>
  element(
    ".min-scroll-y", {minScrollY: 50}, 
    `
  [--self] { --selector: ".min-scroll-y"; --events: ["scroll"]; background: greenyellow; border-color: limegreen; }
  `),
  ".min-scroll-y",
  ["scroll"]
)
jsincss(() =>
  element(
    ".max-scroll-y", {maxScrollY: 50}, 
    `
  [--self] { --selector: window; --events: ["load"]; background: greenyellow; border-color: limegreen; }
  `),
  window,
  ["load"]
)
jsincss(() =>
  element(
    ".max-scroll-y", {maxScrollY: 50}, 
    `
  [--self] { --selector: ".max-scroll-y"; --events: ["scroll"]; background: greenyellow; border-color: limegreen; }
  `),
  ".max-scroll-y",
  ["scroll"]
)
jsincss(() =>
  element(
    ".min-scroll-x", {minScrollX: 50}, 
    `
  [--self] { --selector: window; --events: ["load"]; background: greenyellow; border-color: limegreen; }
  `),
  window,
  ["load"]
)
jsincss(() =>
  element(
    ".min-scroll-x", {minScrollX: 50}, 
    `
  [--self] { --selector: ".min-scroll-x"; --events: ["scroll"]; background: greenyellow; border-color: limegreen; }
  `),
  ".min-scroll-x",
  ["scroll"]
)
jsincss(() =>
  element(
    ".max-scroll-x", {maxScrollX: 50}, 
    `
  [--self] { --selector: window; --events: ["load"]; background: greenyellow; border-color: limegreen; }
  `),
  window,
  ["load"]
)
jsincss(() =>
  element(
    ".max-scroll-x", {maxScrollX: 50}, 
    `
  [--self] { --selector: ".max-scroll-x"; --events: ["scroll"]; background: greenyellow; border-color: limegreen; }
  `),
  ".max-scroll-x",
  ["scroll"]
)