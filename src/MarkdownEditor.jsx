import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting } from '@codemirror/language';
import { editorTheme, customHighlightStyle } from './EditorStyles';
import { setupMarked } from './SetupMarked';
import { useFetchDocument } from './hooks/useFetchDocument';
import 'highlight.js/styles/github-dark.css';


const MarkdownEditor = ({ docId }) => {
  const editorDiv = useRef(null);
  const previewDiv = useRef(null);
  const { docContent, isLoading, error } = useFetchDocument(docId);
  const [preview, setPreview] = useState('');
  const marked = setupMarked();

  useEffect(() => {
    if(!editorDiv.current) return;

    const startState = EditorState.create({
      doc: docContent,
      extensions: [
        markdown(),
        syntaxHighlighting(customHighlightStyle),
        EditorView.lineWrapping,
        editorTheme
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorDiv.current,
    });

    const updatePreview = (doc) => {
      setPreview(marked(doc.toString()));
    };

    view.updateListener.of(update => {
      if (update.docChanged) {
        updatePreview(update.state.doc);
      }
    });

    return () => {
      view.destroy();
    };
  }, [docContent]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading document: {error.message}</p>;

  return (
    <div className="flex gap-3">
      <div className="h-screen border border-blue-500 w-44"></div>
      <div ref={editorDiv} className="h-screen border border-blue-500 flex-1"></div>
      <div className="viewer h-screen border border-blue-500 flex-1 p-4 overflow-y-auto" dangerouslySetInnerHTML={{ __html: preview }} ref={previewDiv}></div>
    </div>
  );
};

export default MarkdownEditor;
