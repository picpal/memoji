import { EditorView } from "@codemirror/view";
import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// styles/EditorStyles.js
export const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    overflow: "auto",
    padding: "12px",
  },
  "&.cm-focused": {
    border: "2px solid #ca8eff",
  },
  ".cm-scroller": {
    fontFamily: "Pretendard",
  },
});

export const customHighlightStyle = HighlightStyle.define([
  { tag: tags.heading1, fontSize: "1.8em", fontWeight: "bold" },
  { tag: tags.heading2, fontSize: "1.6em", fontWeight: "bold" },
  { tag: tags.heading3, fontSize: "1.4em", fontWeight: "bold" },
]);
