const createGPTScript = () => {
  const id = 'react-ads-google-tag-script';
  const scriptExists = document.getElementById(id);

  if (scriptExists) {
    console.log('google tag script already exists');
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.src = 'https://www.googletagservices.com/tag/js/gpt.js';
  script.async = true;
  document.head.appendChild(script);
};

const startGoogleTagQue = () => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
};

const enableSingleRequest = () => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSingleRequest();
  });
};

export const initializeGoogleTags = () => {
  // creates the gpt script
  createGPTScript();
  // creates the gpt queue
  startGoogleTagQue();
  // enables SR mode
  enableSingleRequest();
};
