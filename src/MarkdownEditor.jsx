import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { marked } from 'marked';


const MarkdownEditor = () => {
  const editorDiv = useRef(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (editorDiv.current) {
      const myHighlightStyle = HighlightStyle.define([
        { tag: tags.heading1, fontSize: '1.8em', fontWeight: 'bold' },
        { tag: tags.heading2, fontSize: '1.6em', fontWeight: 'bold' },
        { tag: tags.heading3, fontSize: '1.4em', fontWeight: 'bold' },
      ]);

      const updatePreview = (doc) => {
        setPreview(marked(doc.toString()));
      };

      const startState = EditorState.create({
        doc: '',
        extensions: [
          markdown(),
          syntaxHighlighting(myHighlightStyle),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              updatePreview(update.state.doc);
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorDiv.current,
      });

      return () => {
        view.destroy();
      };
    }
  }, []);

  return (
    <div className="flex">
      <div ref={editorDiv} className="flex-1 p-4 border-r border-gray-300"></div>
      <div className="flex-1 p-4 overflow-y-auto" dangerouslySetInnerHTML={{ __html: preview }}></div>
    </div>
  );
};

export default MarkdownEditor;
