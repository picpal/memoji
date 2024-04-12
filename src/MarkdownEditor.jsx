import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { marked } from 'marked';


const MarkdownEditor = () => {
  const editorDiv = useRef(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    marked.setOptions({
      breaks: true, // 줄바꿈 인식
    })


    if (editorDiv.current) {
      const myHighlightStyle = HighlightStyle.define([
        { tag: tags.heading1, fontSize: '1.8em', fontWeight: 'bold' },
        { tag: tags.heading2, fontSize: '1.6em', fontWeight: 'bold' },
        { tag: tags.heading3, fontSize: '1.4em', fontWeight: 'bold' },
      ]);

      const updatePreview = (doc) => {
        setPreview(marked(doc.toString()));
      };

      const editorTheme = EditorView.theme({
        '&': {
          height: '100%', // 에디터의 높이 설정
          overflow: 'auto', // 내용이 높이를 초과할 경우 스크롤바 표시
          padding: '12px' // 내부 여백
        },
        '&.cm-focused': {
          borderColor: '#f22' // 포커스가 있을 때 테두리 색상
        },
        '.cm-scroller': { // 스크롤영역
        }
      });

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
    }
  }, []);

  return (
    <div className="flex gap-3">
      <div ref={editorDiv} className="h-screen border border-blue-500 flex-1"></div>
      <div className="h-screen border border-blue-500 flex-1 p-4 overflow-y-auto" dangerouslySetInnerHTML={{ __html: preview }}></div>
    </div>
  );
};

export default MarkdownEditor;
