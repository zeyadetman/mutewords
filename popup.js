listWords();

const wordinput = document.getElementById("wordinput");
wordinput.addEventListener("keypress", e => {
  if (!(e.key === "Enter")) return;
  chrome.runtime.sendMessage({ method: 'addWord', text: wordinput.value });
  wordinput.value = '';
});

document.getElementById('clearall').addEventListener('click', clearAll)
document.getElementById('currentwords').addEventListener('click', removeWord)

function removeWord(e) {
  if (e.target.className !== 'delete-word') return;
  const { text } = e.target.dataset;
  if (!text) return;
  chrome.storage.sync.get(["words"], res => {
    const { words = "[]" } = res;
    const filteredWords = JSON.parse(words).filter(i => i !== text);
    chrome.storage.sync.set({
      words: JSON.stringify(filteredWords)
    }, () => {
      listWords();
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { method: "remove" });
      });
    });
  });
}

function clearAll() {
  chrome.storage.sync.clear(listWords);
}

function listWords() {
  chrome.storage.sync.get(["words"], res => {
    const { words = "[]" } = res;
    const listItems = JSON.parse(words).reduce((agg, itm) => agg.concat(`<li>${itm}<span data-text=${itm} class="delete-word">X</span></li>`), '')
    document.getElementById("currentwords").innerHTML = listItems;
  });
}


chrome.runtime.onMessage.addListener(({ method, text }) => {
  if (method === 'listWords') listWords();
});