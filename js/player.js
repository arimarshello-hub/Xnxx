// ==================== AUDIO PLAYER ====================
const audioCtx = window.AudioContext || window.webkitAudioContext;
let ctx = null;

function beep(freq, dur) {
  if (!ctx) ctx = new audioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function playMelodi(genre) {
  const patterns = {
    'Trap':  [220, 261, 293, 329, 293, 261, 220, 196],
    'R&B':   [261, 329, 392, 329, 261, 293, 261, 220],
    'Lo-Fi': [196, 233, 261, 233, 196, 174, 196, 233],
    'Pop':   [261, 329, 392, 523, 392, 329, 261, 293],
    'EDM':   [329, 392, 523, 659, 523, 392, 329, 261],
    'Jazz':  [261, 293, 329, 349, 392, 349, 329, 293],
  };
  const notes = patterns[genre] || patterns['Pop'];
  notes.forEach((f,i) => {
    setTimeout(() => { if (isPlaying) beep(f, 0.35); }, i*320);
  });
}

function playTrack(id) {
  const p = produk.find(x => x.id === id);
  if (!p) return;
  currentIndex = produk.indexOf(p);
  document.getElementById('nowPlaying').classList.add('show');
  document.getElementById('npCover').style.background = `linear-gradient(135deg,${p.warna[0]},${p.warna[1]})`;
  document.getElementById('npTitle').textContent = `"${p.nama}"`;
  document.getElementById('npArtist').textContent = `Ari Marshello • ${p.genre} • ${p.bpm} BPM`;
  isPlaying = true;
  document.getElementById('playBtn').textContent = '⏸';
  progressValue = 0;
  playMelodi(p.genre);
  startProgress();
  showToast(`🎵 Memutar: ${p.nama}`);
}

function startProgress() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (!isPlaying) return;
    progressValue += 0.6;
    if (progressValue >= 100) progressValue = 0;
    document.getElementById('progressFill').style.width = progressValue + '%';
  }, 100);
}

function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById('playBtn').textContent = isPlaying ? '⏸' : '▶️';
  if (isPlaying) playMelodi(produk[currentIndex].genre);
}

function prevAudio() {
  currentIndex = (currentIndex - 1 + produk.length) % produk.length;
  playTrack(produk[currentIndex].id);
}

function nextAudio() {
  currentIndex = (currentIndex + 1) % produk.length;
  playTrack(produk[currentIndex].id);
}

function seekAudio(e) {
  const bar = e.currentTarget;
  const rect = bar.getBoundingClientRect();
  progressValue = ((e.clientX - rect.left) / rect.width) * 100;
  document.getElementById('progressFill').style.width = progressValue + '%';
}