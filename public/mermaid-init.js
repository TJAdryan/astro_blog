// Import Mermaid from CDN
const mermaidScript = document.createElement('script');
mermaidScript.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
mermaidScript.onload = function() {
  // Initialize Mermaid
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: {
      htmlLabels: true,
      curve: 'basis'
    }
  });

  // Function to render Mermaid diagrams
  function renderMermaidDiagrams() {
    console.log('Rendering mermaid diagrams...');
    const mermaidElements = document.querySelectorAll('.mermaid');
    console.log(`Found ${mermaidElements.length} mermaid elements`);
    
    mermaidElements.forEach(async (element, index) => {
      if (!element.dataset.processed) {
        console.log(`Processing mermaid element ${index}:`, element.textContent.trim());
        element.dataset.processed = 'true';
        const id = `mermaid-${Date.now()}-${index}`;
        
        try {
          const { svg } = await mermaid.render(id, element.textContent.trim());
          element.innerHTML = svg;
          console.log(`Successfully rendered mermaid diagram ${index}`);
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          element.innerHTML = `<p>Error rendering diagram: ${error.message}</p>`;
        }
      }
    });
  }

  // Render diagrams when script loads
  renderMermaidDiagrams();
  
  // Also run when navigating in SPA mode
  window.addEventListener('astro:page-load', renderMermaidDiagrams);
};

document.head.appendChild(mermaidScript);
