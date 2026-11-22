// Use document scroll for the whole journey, including touch, keyboard, hashes
// and restored scroll positions. The content reaches the viewport after nightfall.
(() => {
  const intro = document.getElementById('landscape-intro');
  const pin = intro.querySelector('.landscape-pin');
  const root = document.documentElement;
  const state = window.landscapeScroll = { progress: 0, night: 0 };
  const clamp = n => Math.max(0, Math.min(1, n));
  function smooth(a, b, value) {
    const t = clamp((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  }
  let distance, queued = false;
  function sync() {
    queued = false;
    const t = clamp(window.scrollY / distance);
    state.progress = t;
    state.night = smooth(.025, .96, t);
    root.style.setProperty('--day-poster', (1 - state.night).toFixed(4));
    root.style.setProperty('--sunset', (.88 * smooth(.02,.38,t) * (1 - smooth(.40,.74,t))).toFixed(4));
    root.style.setProperty('--twilight', (.67 * smooth(.32,.63,t) * (1 - smooth(.69,.97,t))).toFixed(4));
    root.style.setProperty('--caption', (1 - smooth(.48,.9,t)).toFixed(4));
    root.style.setProperty('--reading', smooth(.81,1,t).toFixed(4));
    pin.inert = t >= .91;
  }
  function measure() {
    distance = Math.max(1, intro.offsetHeight - window.innerHeight);
    sync();
  }
  function onScroll() {
    if (!queued) { queued = true; requestAnimationFrame(sync); }
  }
  root.classList.add('has-landscape');
  measure();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', measure);
  addEventListener('pageshow', measure);
  new ResizeObserver(measure).observe(intro);
})();
