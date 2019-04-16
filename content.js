const state = {
  postsLength: 0,
  wordsLength: 0,
}

const remove = () => {
  const allPosts = Array.from(document.getElementsByClassName('_5jmm'));

  chrome.storage.sync.get(["words"], res => {
    const currentWords = "{}" !== JSON.stringify(res) ? JSON.parse(res.words) : [];
    if (allPosts.length === state.postsLength && currentWords.length === state.wordsLength) return;
    state.postsLength = allPosts.length;
    state.wordsLength = currentWords.length;
    allPosts.forEach(post => {
      currentWords.forEach(word => {
        if (post.textContent.toLowerCase().includes(word.toLowerCase())) {
          post.style.display = 'none';
          return; // critical return
        }
      })
    })
  });
}


chrome.runtime.onMessage.addListener(({ method }) => {
  if (method === 'remove') remove()
});

document.addEventListener('scroll', remove)
