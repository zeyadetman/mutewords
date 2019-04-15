document.addEventListener('DOMNodeInserted', () => {
  chrome.storage.sync.get(["words"], res => {
    const currentWords = "{}" !== JSON.stringify(res) ? JSON.parse(res.words) : [];
    const allPosts = Array.from(document.getElementsByClassName('_5jmm'));
    allPosts.map(post => {
      currentWords.forEach(word => {
        if (post.textContent.includes(word)) {
          console.log(word)
          post.style.display = 'none';
        }
      })
    })
  });
})