function listWords() {
  window.chrome.storage.sync.get(['words'], (res) => {
    const { words = '[]' } = res;
    const listItems = JSON.parse(words).reduce((agg, itm) => agg.concat(`<li>${itm}<span data-text="${itm}" class="delete-word">X</span></li>`), '');
    document.getElementById('currentwords').innerHTML = listItems;
  });
}

listWords();

const wordinput = document.getElementById('wordinput');
wordinput.addEventListener('keypress', (e) => {
  if (!(e.key === 'Enter')) return;
  window.chrome.runtime.sendMessage({ method: 'addWord', text: wordinput.value });
  wordinput.value = '';
});

function removeWord(e) {
  if (e.target.className !== 'delete-word') return;
  const { text } = e.target.dataset;
  if (!text) return;
  window.chrome.storage.sync.get(['words'], (res) => {
    const { words = '[]' } = res;
    const filteredWords = JSON.parse(words).filter(i => i !== text);
    window.chrome.storage.sync.set({
      words: JSON.stringify(filteredWords),
    }, () => {
      listWords();
      window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        window.chrome.tabs.sendMessage(tabs[0].id, { method: 'remove' });
      });
    });
  });
}

function clearAll() {
  window.chrome.storage.sync.clear(listWords);
}


document.getElementById('clearall').addEventListener('click', clearAll);
document.getElementById('currentwords').addEventListener('click', removeWord);

window.chrome.runtime.onMessage.addListener(({ method, text }) => {
  if (method === 'listWords') listWords();
});
