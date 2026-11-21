import { visit } from 'unist-util-visit';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang === 'mermaid') {
        // Convert code block to HTML with mermaid class (escaped to prevent raw HTML injection)
        node.type = 'html';
        node.value = `<div class="mermaid">\n${escapeHtml(node.value)}\n</div>`;
      }
    });
  };
}
