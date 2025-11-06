// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');

  // Load the saved state from storage and update the toggle
  chrome.storage.sync.get('enabled', (data) => {
    toggleSwitch.checked = !!data.enabled;
  });

  // Save the state and send a message to the background script when the toggle is changed
  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({ enabled: isEnabled });

    // Notify all relevant tabs to update their state (use MV2-style executeScript for Firefox)
    chrome.tabs.query({ url: ["http://*/*", "https://*/*"] }, (tabs) => {
      tabs.forEach(tab => {
        chrome.runtime.sendMessage({ action: "toggle", enabled: isEnabled });
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
            if (styleSheet) styleSheet.remove();
          }
        })(${JSON.stringify(isEnabled)});`;

        try {
          chrome.tabs.executeScript(tab.id, { code: code });
        } catch (e) {
          try { chrome.tabs.executeScript({ code: code }); } catch (err) { console.error('executeScript failed', err); }
        }
      });
    });
  });
});
