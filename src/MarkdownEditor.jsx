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

  const clickHandler = () => {
    const viewer = previewDiv.current.innerHTML;
    if(!viewer || viewer === "") {
      return;
    }

    downloadPDF(viewer);
  }

  async function downloadPDF(htmlContent) {
    const response = await fetch('http://localhost:3000/api/generate-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ htmlContent })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }


  useEffect(() => {
    if(!editorDiv.current) return;

    const updatePreview = (doc) => {
      setPreview(marked(doc.toString()));
    };

    const startState = EditorState.create({
      doc: docContent,
      extensions: [
        markdown(),
        syntaxHighlighting(customHighlightStyle),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            updatePreview(update.state.doc);
          }
        }),
        editorTheme
      ],
    });
    
    const view = new EditorView({
      state: startState,
      parent: editorDiv.current,
    });
    
    return () => {
      view.destroy();
    };
  }, [docContent]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading document: {error.message}</p>;

  return (
    <div className="flex gap-3">
      <div className="h-screen border border-blue-500 w-44">
        <button onClick={clickHandler}>PDF DOWN</button>
      </div>
      <div ref={editorDiv} className="h-screen border border-blue-500 flex-1"></div>
      <div ref={previewDiv} className="viewer h-screen border border-blue-500 flex-1 p-4 overflow-y-auto" dangerouslySetInnerHTML={{ __html: preview }} ></div>
    </div>
  );
};

export default MarkdownEditor;
