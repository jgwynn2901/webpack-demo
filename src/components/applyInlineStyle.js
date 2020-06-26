"use strict";
exports.__esModule = true;
var roosterjs_editor_dom_1 = require("roosterjs-editor-dom");
var roosterjs_editor_types_1 = require("roosterjs-editor-types");
var ZERO_WIDTH_SPACE = '\u200B';
/**
 * Apply inline style to current selection
 * @param editor The editor instance
 * @param callback The callback function to apply style
 */
function applyInlineStyle(editor, callback) {
    editor.focus();
    var range = editor.getSelectionRange();
    if (range && range.collapsed) {
        var node = range.startContainer;
        var isEmptySpan = roosterjs_editor_dom_1.getTagOfNode(node) == 'SPAN' &&
            (!node.firstChild ||
                (roosterjs_editor_dom_1.getTagOfNode(node.firstChild) == 'BR' && !node.firstChild.nextSibling));
        if (isEmptySpan) {
            editor.addUndoSnapshot();
            callback(node);
        }
        else {
            var isZWSNode = node &&
                node.nodeType == roosterjs_editor_types_1.NodeType.Text &&
                node.nodeValue == ZERO_WIDTH_SPACE &&
                roosterjs_editor_dom_1.getTagOfNode(node.parentNode) == 'SPAN';
            if (!isZWSNode) {
                editor.addUndoSnapshot();
                // Create a new text node to hold the selection.
                // Some content is needed to position selection into the span
                // for here, we inject ZWS - zero width space
                node = editor.getDocument().createTextNode(ZERO_WIDTH_SPACE);
                range.insertNode(node);
            }
            roosterjs_editor_dom_1.applyTextStyle(node, callback);
            editor.select(node, roosterjs_editor_types_1.PositionType.End);
        }
    }
    else {
        // This is start and end node that get the style. The start and end needs to be recorded so that selection
        // can be re-applied post-applying style
        editor.addUndoSnapshot(function () {
            var firstNode;
            var lastNode;
            var contentTraverser = editor.getSelectionTraverser();
            var inlineElement = contentTraverser && contentTraverser.currentInlineElement;
            while (inlineElement) {
                var nextInlineElement = contentTraverser.getNextInlineElement();
                inlineElement.applyStyle(function (element, isInnerNode) {
                    callback(element, isInnerNode);
                    firstNode = firstNode || element;
                    lastNode = element;
                });
                inlineElement = nextInlineElement;
            }
            if (firstNode && lastNode) {
                editor.select(firstNode, roosterjs_editor_types_1.PositionType.Before, lastNode, roosterjs_editor_types_1.PositionType.After);
            }
        }, roosterjs_editor_types_1.ChangeSource.Format);
    }
}
exports["default"] = applyInlineStyle;
