// Fix Full Height on Mobile

function full() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

window.addEventListener('resize', full);
window.addEventListener('orientationchange', full);