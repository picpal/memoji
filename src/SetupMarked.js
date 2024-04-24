import { marked } from "marked";
import hljs from "highlight.js";

export const setupMarked = () => {
  const renderer = new marked.Renderer();
  renderer.code = (code, language) => {
    const validLang = hljs.getLanguage(language) ? language : "plaintext";
    return `<pre><code class="hljs ${validLang}">${
      hljs.highlight(code, { language: validLang }).value
    }</code></pre>`;
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
