import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView , keymap} from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting } from '@codemirror/language';
import { indentWithTab,history, undo, redo  } from "@codemirror/commands";
import { editorTheme, customHighlightStyle } from './EditorStyles';
import { setupMarked } from './SetupMarked';
import { useFetchDocument } from './hooks/useFetchDocument';
import 'highlight.js/styles/github-dark.css';
import mermaid from "mermaid";

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
  const updatePreview = (doc) => {
    setPreview(marked(doc.toString()));
  };

  const errorHandler = (err) => {
    console.error(err); // 콘솔에 에러 로그 출력
    // 여기서 커스텀 에러 메시지를 DOM에 추가하거나 상태로 관리할 수 있습니다.
    const errorContainer = document.querySelector('#mermaid-error-container');
    if (errorContainer) {
      errorContainer.innerHTML = "죄송합니다, 다이어그램을 렌더링하는 동안 문제가 발생했습니다.";
    }
  }

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: "default",
      errorHandler,
    });
    mermaid.contentLoaded();
  })

  useEffect(() => {
    if(!editorDiv.current) return;

    const startState = EditorState.create({
      doc: docContent,
      extensions: [
        history(),
        keymap.of([
          indentWithTab, 
          { key: 'Mod-z', run: undo },  // 'Mod'는 Ctrl 또는 Cmd 키를 자동으로 매핑
          { key: 'Mod-y', run: redo, mac: 'Mod-Shift-z' }  // Mac에서는 'Cmd-Shift-Z'를 사용
        ]),
        markdown(),
        syntaxHighlighting(customHighlightStyle),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            updatePreview(update.state.doc);
          }
        }),
        editorTheme,
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
