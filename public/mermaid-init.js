// Import Mermaid from CDN
const mermaidScript = document.createElement('script');
mermaidScript.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
mermaidScript.onload = function() {
  // Initialize Mermaid
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'strict',
    flowchart: {
      htmlLabels: true,
      curve: 'basis'
    }
  });

  // Function to render Mermaid diagrams
  function renderMermaidDiagrams() {
    const mermaidElements = document.querySelectorAll('.mermaid');
    
    mermaidElements.forEach(async (element, index) => {
      if (!element.dataset.processed) {
        element.dataset.processed = 'true';
        const id = `mermaid-${Date.now()}-${index}`;
        
        try {
          const { svg } = await mermaid.render(id, element.textContent.trim());
          element.innerHTML = svg;
          
          // Add click handler for modal expansion
          element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showDiagramModal(element);
          });
          
          // Also add a visual indicator that it's clickable
          element.style.cursor = 'zoom-in';
          element.title = 'Click to enlarge diagram';
          
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          const errP = document.createElement('p');
          errP.textContent = `Error rendering diagram: ${error?.message || 'Invalid syntax'}`;
          element.replaceChildren(errP);
        }
      }
    });
  }

  // Function to show diagram in modal
  function showDiagramModal(diagramElement) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('diagram-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'diagram-modal';
      modal.className = 'diagram-modal';
      document.body.appendChild(modal);
      
      // Close modal on click
      modal.addEventListener('click', function() {
        closeDiagramModal();
      });
    }
    
    // Clone the diagram and add to modal
    const clonedDiagram = diagramElement.cloneNode(true);
    clonedDiagram.style.cursor = 'zoom-out';
    
    // Find the SVG inside and make it larger
    const svg = clonedDiagram.querySelector('svg');
    if (svg) {
      // Remove any fixed width/height attributes
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.width = 'auto';
      svg.style.height = 'auto';
      svg.style.maxWidth = 'none';
      svg.style.maxHeight = 'none';
    }
    
    modal.innerHTML = '';
    modal.appendChild(clonedDiagram);
    modal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Close modal on escape key
    const handleEscape = function(e) {
      if (e.key === 'Escape') {
        closeDiagramModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
  }

  // Function to close diagram modal
  function closeDiagramModal() {
    const modal = document.getElementById('diagram-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.innerHTML = '';
      document.body.style.overflow = '';
    }
  }

  // Render diagrams when script loads
  renderMermaidDiagrams();
  
  // Also run when navigating in SPA mode
  window.addEventListener('astro:page-load', renderMermaidDiagrams);
};

document.head.appendChild(mermaidScript);
