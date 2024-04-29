import { marked } from "marked";
import hljs from "highlight.js";
import mermaid from "mermaid";

export const setupMarked = () => {
  mermaid.initialize({ startOnLoad: false });

  const renderer = new marked.Renderer();
  renderer.code = (code, language) => {
    if (language === "mermaid") {
      return `<div class="mermaid">${code}</div>`;
    } else {
      // 기존 하이라이트.js를 사용한 코드 하이라이트 처리
      const validLang = hljs.getLanguage(language) ? language : "plaintext";
      return `<pre><code class="hljs ${validLang}">${
        hljs.highlight(code, { language: validLang }).value
      }</code></pre>`;
    }
  };

  marked.setOptions({
    renderer,
    breaks: true,
    smartLists: true,
    smartypants: false,
    gfm: true,
    tables: true,
  });

  return marked;
};
