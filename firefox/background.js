// background.js

// Set the initial state of the extension on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: false });
});

// Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    toggleGrayscaleInTab(sender.tab.id, request.enabled);
  }
});

// Re-apply the style on tab updates (e.g., page navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    chrome.storage.sync.get('enabled', (data) => {
      if (data.enabled) {
        toggleGrayscaleInTab(tabId, true);
      }
    });
  }
});

// The core function to inject or remove CSS
function toggleGrayscaleInTab(tabId, enabled) {
  // Manifest V2 / Firefox-compatible injection using chrome.tabs.executeScript
  // Build a small IIFE string that runs in the page context.
  const code = `(function(isEnabled){
    const styleId = 'grayscale-disabler-style-sheet';
    let styleSheet = document.getElementById(styleId);

    if (isEnabled) {
      if (styleSheet) return;

      styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.innerHTML = 'html, body, img, video, figure { filter: none !important; -webkit-filter: none !important; }';
      document.head.appendChild(styleSheet);
    } else {
      if (styleSheet) {
        styleSheet.remove();
      }
    }
  })(${JSON.stringify(enabled)});`;

  try {
    chrome.tabs.executeScript(tabId, { code: code });
  } catch (e) {
    // Fallback: if API signature differs, try without tabId
    try { chrome.tabs.executeScript({ code: code }); } catch (err) { console.error('executeScript failed', err); }
  }
}
