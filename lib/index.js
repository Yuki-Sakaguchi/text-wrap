(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Elements = global.Elements || {}));
}(this, function (exports) { 'use strict';

  /**
   *
   * @param {string} match
   * @param {string} p1
   * @return
   */
  var replacefn = function (match, p1) {
      if (p1) {
          return ',\u0027' + p1 + '\u0027';
      }
      return ',"' + match + '"';
  };
  /**
   * 文字列をXPath用の文字列に変換
   * @param {string} str
   * @return {string} XPath用の文字列
   */
  var toXPathStringLiteral = function (str) {
      if (/^"+$/g.test(str)) {
          return '\u0027' + str + '\u0027';
      }
      switch (str.indexOf('"')) {
          case -1:
              return '"' + str + '"';
          case 0:
              return 'concat(' + str.replace(/("+)|[^"]+/g, replacefn).slice(1) + ')';
          default:
              return 'concat(' + str.replace(/("+)|[^"]+/g, replacefn) + ')';
      }
  };
  /**
   *
   * @param {Object} options
   */
  var wrap = function (options) {
      var doc = options.contextNode.nodeType === options.contextNode ? options.contextNode : options.contextNode.ownerDocument, xpathResult = doc.evaluate('descendant::text()[contains(.,' + toXPathStringLiteral(options.target) + ')]', options.contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), df = doc.createDocumentFragment(), target = doc.createElement(options.tag);
      Object.keys(options.attribute).forEach(function (key) {
          target.setAttribute(key, options.attribute[key]);
      });
      target.appendChild(doc.createTextNode(options.tar));
      for (var i = 0, xLen = xpathResult.snapshotLength, currentTextNode = void 0, stringList = void 0, textNode = void 0; i < xLen; ++i) {
          currentTextNode = xpathResult.snapshotItem(i);
          stringList = currentTextNode.data.split(options.tar);
          textNode = df.appendChild(doc.createTextNode(stringList[0]));
          for (var j = 1, stringLen = stringList.length; j < stringLen; ++j) {
              target = target.cloneNode(true);
              df.appendChild(target);
              Object.keys(options.event).forEach(function (key) {
                  target.addEventListener(key, options.event[key]);
              });
              textNode = textNode.cloneNode(false);
              textNode.data = stringList[j];
              df.appendChild(textNode);
          }
          currentTextNode.parentNode.replaceChild(df, currentTextNode);
      }
  };

  exports.replacefn = replacefn;
  exports.toXPathStringLiteral = toXPathStringLiteral;
  exports.wrap = wrap;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
