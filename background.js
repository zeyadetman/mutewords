chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
        "id": "sdf9876yhjuy6",
        "title": "Add to word list",
        "contexts": ["selection"],
    });
  });
});

// delete *chrome.browserAction.onClicked* no need for it
// Fired when a browser action icon is clicked. 
// Does not fire if the browser action has a popup.



function addWord(newWord) {
  newWord = newWord.trim();
  if (!newWord) return;
  chrome.storage.sync.get(["words"], result => {
    //' '_5jmm''    //_5pat  //_5pbx
    const { words = "[]" } = result;
    const parsedWords = JSON.parse(words);
    if (parsedWords.find(w => w === newWord)) {
      return;
    };
    chrome.storage.sync.set({
      words: JSON.stringify([...parsedWords, newWord])
    }, () => {
      chrome.runtime.sendMessage({ method: 'listWords' });
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { method: "remove" });
      });
    });
  });
}


chrome.runtime.onMessage.addListener(({ method, text }) => {
  if (method === 'addWord') addWord(text);
});

chrome.contextMenus.onClicked.addListener(({ selectionText }) => addWord(selectionText));
