const state = {
  postsLength: 0,
  wordsLength: 0,
  lastPostIndex: 0,
};

const methodsCases = {
  remove() {
    const allPosts = Array.from(document.getElementsByClassName('_5jmm'));
    window.chrome.storage.sync.get(['words'], (res) => {
      const currentWords = JSON.stringify(res) !== '{}' ? JSON.parse(res.words) : [];
      if (allPosts.length === state.postsLength && currentWords.length === state.wordsLength) return;
      state.postsLength = allPosts.length;
      state.wordsLength = currentWords.length;
      allPosts.slice(state.lastPostIndex).forEach((post, i) => {
        currentWords.find((word) => {
          if (post.style.display === 'none') return true;
          if (post.textContent.toLowerCase().includes(word.toLowerCase())) {
            post.style.display = 'none';
            state.lastPostIndex = i;
            return true;
          }
          return false;
        });
      });
    });
  },
};

window.chrome.runtime.onMessage.addListener(({ method, data }) => {
  methodsCases[method](data);
});

const observer = new MutationObserver(methodsCases.remove);
observer.observe(document, { childList: true, subtree: true });
