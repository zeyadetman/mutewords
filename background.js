window.chrome.runtime.onInstalled.addListener(() => {
  window.chrome.contextMenus.removeAll(() => {
    window.chrome.contextMenus.create({
      id: 'sdf9876yhjuy6',
      title: 'Add to word list',
      contexts: ['selection'],
    });
  });
});

function addWord(newWord) {
  newWord = newWord.trim();
  if (!newWord) return;
  window.chrome.storage.sync.get(['words'], (result) => {
    // ' '_5jmm''    //_5pat  //_5pbx
    const { words = '[]' } = result;
    const parsedWords = JSON.parse(words);
    if (parsedWords.find(w => w === newWord)) {
      return;
    }
    window.chrome.storage.sync.set({
      words: JSON.stringify([...parsedWords, newWord]),
    }, () => {
      window.chrome.runtime.sendMessage({ method: 'listWords' });
      window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        window.chrome.tabs.sendMessage(tabs[0].id, { method: 'remove' });
      });
    });
  });
}

window.chrome.runtime.onMessage.addListener(({ method, text }) => {
  if (method === 'addWord') addWord(text);
});

window.chrome.contextMenus.onClicked.addListener(({ selectionText }) => addWord(selectionText));
