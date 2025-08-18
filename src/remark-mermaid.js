import { visit } from 'unist-util-visit';

export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang === 'mermaid') {
        // Convert code block to HTML with mermaid class
        node.type = 'html';
        node.value = `<div class="mermaid">\n${node.value}\n</div>`;
      }
    });
  };
}
