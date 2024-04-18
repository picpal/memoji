import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';  // 스타일 먼저 로드

const MarkdownEditor = () => {
  const editorDiv = useRef(null);
  const [preview, setPreview] = useState('');
  
  useEffect(() => {
    const renderer = new marked.Renderer();
    renderer.code = function(code, language) {
      const validLang = hljs.getLanguage(language) ? language : 'plaintext';
      return `<pre><code class="hljs ${validLang}">${hljs.highlight(code, { language: validLang }).value}</code></pre>`;
    };

    marked.setOptions({
      breaks: true,
      gfm: true,
      tables: true,
      renderer,
    });
    
    const updatePreview = (doc) => {
      setPreview(marked(doc.toString()));
    };

    // useRef에서 current는 실제 생성된 DOM요소나 저장된 값을 참조하는데 사용 
    // useRef에서 참조하는 DOM이 생성되어 있을 때만 실행하도록 함.
    // 생성되지 않은 상태에서 참조하여 실행하려하면 오류가 발생하기 때문.
    if (editorDiv.current) {
      const highlightStyle = HighlightStyle.define([
        { tag: tags.heading1, fontSize: '1.8em', fontWeight: 'bold' },
        { tag: tags.heading2, fontSize: '1.6em', fontWeight: 'bold' },
        { tag: tags.heading3, fontSize: '1.4em', fontWeight: 'bold' },
      ]);

      const editorTheme = EditorView.theme({
        '&': {
          height: '100%',
          overflow: 'auto',
          padding: '12px'
        },
        '&.cm-focused': {
          borderColor: '#f22'
        },
      });

      const startState = EditorState.create({
        doc: '',
        extensions: [
          markdown(),
          syntaxHighlighting(highlightStyle),
          EditorView.lineWrapping,
          editorTheme,
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
    <div className="flex gap-3">
      <div ref={editorDiv} className="h-screen border border-blue-500 flex-1"></div>
      <div className="viewer h-screen border border-blue-500 flex-1 p-4 overflow-y-auto" dangerouslySetInnerHTML={{ __html: preview }}></div>
    </div>
  );
};

export default MarkdownEditor;
