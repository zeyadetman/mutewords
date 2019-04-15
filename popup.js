listWords();

document.getElementById("wordinput").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    addWord(document.getElementById("wordinput").value);
    listWords();
  }
});

document.getElementById('clearall').addEventListener('click', e => {
  clearAll()
})

function addWord(newWord) {
  chrome.storage.sync.get(["words"], result => {
    const newWordsObject = "{}" === JSON.stringify(result) ? { words: [] } : result;
    const newWords = newWordsObject.words.length > 0 ? JSON.parse(newWordsObject.words) : newWordsObject.words;
    //' '_5jmm''    //_5pat  //_5pbx
    chrome.storage.sync.set({
      words: JSON.stringify([...newWords, newWord])
    }, listWords);
  });
}

function removeWord() {
  /* TODO */
}

function clearAll() {
  chrome.storage.sync.clear(listWords);
}

function listWords() {
  chrome.storage.sync.get(["words"], res => {
    const currentWords = "{}" !== JSON.stringify(res) ? JSON.parse(res.words) : [];
    let listItems = '';
    currentWords.map(itm => listItems += `<li>${itm}</li>`)
    document.getElementById("currentwords").innerHTML = listItems;
  });
}
