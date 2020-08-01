// Fix Full Height on Mobile

function full() {
  document.documentElement.style.setProperty('--vh', `${document.documentElement.clientHeight * 0.01}px`);
}

window.addEventListener('resize', full);
window.addEventListener('orientationchange', full);