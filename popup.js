document.getElementById("wordinput").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    addWord(document.getElementById("wordinput").value);
    listWords();
  }
});

function addWord(newWord) {
  chrome.storage.sync.get(["words"], result => {
    console.log(newWord);
    //' '_5jmm''
    //document.getElementsByClassName('_5jmm')[0].textContent.includes('1945') ? document.getElementsByClassName('_5jmm')[0].style.display = 'none' : console.log('1')
    //_5pat
    //_5pbx
    chrome.storage.sync.set({
      words: JSON.stringify([...JSON.parse(result), newWord])
    });
  });
}

function removeWord() {}

function listWords() {
  chrome.storage.sync.get(["words"], res => {
    console.log(res);
    document.getElementById("te").innerHTML = res;
  });
}
