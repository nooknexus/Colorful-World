// content.js

// The main logic is now handled by the background script.
// This script ensures that when a page loads, it checks the stored
// state and applies the style if necessary.

chrome.storage.sync.get('enabled', (data) => {
  if (data.enabled) {
    injectStyle();
  }
});

function injectStyle() {
    const styleId = 'grayscale-disabler-style-sheet';
    if (document.getElementById(styleId)) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.innerHTML = `
      html, body, img, video, figure {
        filter: none !important;
        -webkit-filter: none !important;
      }
    `;
    document.head.appendChild(styleSheet);
}
