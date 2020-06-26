"use strict";
exports.__esModule = true;
var applyInlineStyle_1 = require("./applyInlineStyle");
var roosterjs_editor_dom_1 = require("roosterjs-editor-dom");
/**
 * Set font size at selection
 * @param editor The editor instance
 * @param fontSize The fontSize string, should be a valid CSS font-size style.
 * Currently there's no validation to the string, if the passed string is invalid, it won't take affect
 */
function setFontSize(editor, fontSize) {
    fontSize = fontSize.trim();
    
    // The browser provided execCommand only accepts 1-7 point value. In addition, it uses HTML <font> tag with size attribute.
    // <font> is not HTML5 standard (http://www.w3schools.com/tags/tag_font.asp). Use applyInlineStyle which gives flexibility on applying inline style
    // for here, we use CSS font-size style
    applyInlineStyle_1["default"](editor, function (element, isInnerNode) {
        element.style.fontSize = isInnerNode ? '' : fontSize;
        console.log(fontSize);
        var lineHeight = roosterjs_editor_dom_1.getComputedStyle(element, 'line-height');
        if (lineHeight != 'normal') {
            element.style.lineHeight = 'normal';
        }
    });
}
exports["default"] = setFontSize;
