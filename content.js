// let's make it more dynamic we will check if this link is facebook or ,
// twitter or anything then we will remove it
const state = {
  page: window.location.toString(),
  postPath: '',
  postsLength: 0,
  wordsLength: 0,
};

// here let's make it more dynamic with facebook and twitter and linkedin

if (state.page.includes('facebook.com')) {
  state.postsPath = document.getElementsByClassName('_5jmm');
} else if (state.page.includes('twitter.com')) {
  state.postsPath = document.getElementsByClassName('tweet');
}

const methodsCases = {
  remove() {
    // here we get all posts from facebook
    const allPosts = Array.from(state.postsPath);
    window.chrome.storage.sync.get(['words'], (res) => {
      // we add ourword in storage google just get it please and change it to json
      const currentWords = JSON.stringify(res) !== '{}' ? JSON.parse(res.words) : [];
      // okay just equal every thing with state props
      if (allPosts.length === state.postsLength && currentWords.length === state.wordsLength) return;
      state.postsLength = allPosts.length;
      state.wordsLength = currentWords.length;
      // For each posts in new feeds Foreach word in post:
      // if post style == display none dosen't make any thing
      // if word in somewhere has word in blocked words just make it none
      allPosts.forEach((post) => {
        currentWords.forEach((word) => {
          if (post.style.display === 'none') return;
          if (post.textContent.toLowerCase().includes(word.toLowerCase())) {
            post.style.display = 'none';
            return undefined; // critical return
          }
        });
      });
    });
  },
};

window.chrome.runtime.onMessage.addListener(({
  method,
  data
}) => {
  methodsCases[method](data);
});

const observer = new MutationObserver(methodsCases.remove);
observer.observe(document, {
  childList: true,
  subtree: true
});