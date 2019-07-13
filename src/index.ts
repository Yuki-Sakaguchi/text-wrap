'use strict'

/**
 * 
 * @param {string} match 
 * @param {string} p1 
 * @return 
 */
export const replacefn = (match: string, p1: string) => {
  if (p1) {
    return ',\u0027' + p1 + '\u0027'
  }
  return ',"' + match + '"'
}

/**
 * 文字列をXPath用の文字列に変換
 * @param {string} str 
 * @return {string} XPath用の文字列
 */
export const toXPathStringLiteral = (str: string): string => {
  if (/^"+$/g.test(str)) {
    return '\u0027' + str + '\u0027'
  }

  switch (str.indexOf('"')) {
    case -1:
      return '"' + str + '"'
    case 0:
      return 'concat(' + str.replace(/("+)|[^"]+/g, replacefn).slice(1) + ')'
    default:
      return 'concat(' + str.replace(/("+)|[^"]+/g, replacefn) + ')'
  }
}

/**
 * 
 * @param {Object} options
 */
export const wrap = (options) => {
  let doc = options.contextNode.nodeType === options.contextNode ? options.contextNode : options.contextNode.ownerDocument,
      xpathResult = doc.evaluate('descendant::text()[contains(.,' + toXPathStringLiteral(options.target) + ')]', options.contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null),
      df = doc.createDocumentFragment(),
      target = doc.createElement(options.tag)
  
  Object.keys(options.attribute).forEach((key) => {
    target.setAttribute(key, options.attribute[key])
  })

  target.appendChild(doc.createTextNode(options.tar));

  for (let i = 0, xLen = xpathResult.snapshotLength, currentTextNode, stringList, textNode; i < xLen; ++i) {
    currentTextNode = xpathResult.snapshotItem(i)
    stringList = currentTextNode.data.split(options.tar)
    textNode = df.appendChild(doc.createTextNode(stringList[0]))

    for (let j = 1, stringLen = stringList.length; j < stringLen; ++j) {
      target = target.cloneNode(true)
      df.appendChild(target)
      Object.keys(options.event).forEach((key) => {
        target.addEventListener(key, options.event[key])
      })
      textNode = textNode.cloneNode(false)
      textNode.data = stringList[j]
      df.appendChild(textNode)
    }

    currentTextNode.parentNode.replaceChild(df, currentTextNode)
  }
}
