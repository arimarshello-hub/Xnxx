// ==================== NAVIGASI ====================
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nav button[data-page="${page}"]`);
  if (btn) btn.classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
  if (page === 'katalog') renderKatalog();
  if (page === 'wishlist') renderWishlist();
}

// ==================== RENDER PRODUK ====================
function produkCard(p) {
  const fav = wishlist.includes(p.id);
  return `
    <div class="produk" onclick="openDetail(${p.id})">
      <div class="produk-img" style="background:linear-gradient(135deg,${p.warna[0]},${p.warna[1]})">
        <div class="bpm-badge">${p.bpm} BPM</div>
        <button class="fav-btn ${fav?'active':''}" onclick="event.stopPropagation(); toggleWish(${p.id}, this)">
          ${fav?'❤️':'🤍'}
        </button>
        <div class="play-btn" onclick="event.stopPropagation(); playTrack(${p.id})">▶️</div>
      </div>
      <div class="produk-info">
        <div class="produk-nama">"${p.nama}"</div>
        <div class="produk-artis">BY ARI MARSHELLO</div>
        <div class="produk-meta">
          <span>🎤 ${p.genre}</span>
          <span>🎹 ${p.key}</span>
        </div>
        <div>
          <span class="produk-harga">${rupiah(p.harga)}</span>
          <span class="produk-harga-asli">${rupiah(p.asli)}</span>
        </div>
        <div class="produk-rating">⭐ ${p.rating} | ${p.terjual} terjual</div>
        <button class="btn-beli" onclick="event.stopPropagation(); addCart(${p.id})">🛒 Tambah ke Keranjang</button>
      </div>
    </div>
  `;
}

function renderProduk(list, target) {
  const el = document.getElementById(target);
  if (!el) return;
  if (list.length === 0) {
    el.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-dim)"><div style="font-size:50px;opacity:0.4;margin-bottom:10px">🎵</div>Tidak ada produk ditemukan</div>';
    return;
  }
  el.innerHTML = list.map(produkCard).join('');
}

// ==================== KATALOG ====================
function renderKatalog() {
  let list = [...produk];
  if (currentFilter !== 'all') list = list.filter(p => p.genre === currentFilter);
  const q = document.getElementById('searchKatalog')?.value.toLowerCase() || '';
  if (q) list = list.filter(p => p.nama.toLowerCase().includes(q) || p.genre.toLowerCase().includes(q));
  const sort = document.getElementById('sortSelect')?.value || 'newest';
  if (sort === 'termurah') list.sort((a,b) => a.harga - b.harga);
  else if (sort === 'termahal') list.sort((a,b) => b.harga - a.harga);
  else if (sort === 'rating') list.sort((a,b) => b.rating - a.rating);
  else if (sort === 'terjual') list.sort((a,b) => parseFloat(b.terjual) - parseFloat(a.terjual));
  renderProduk(list, 'produkKatalog');
}

function setFilter(f, el) {
  currentFilter = f;
  document.querySelectorAll('.filter-bar .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderKatalog();
}

function filterKategori(genre) {
  currentFilter = genre;
  showPage('katalog');
  setTimeout(() => {
    document.querySelectorAll('.filter-bar .chip').forEach(c => {
      c.classList.remove('active');
      if (c.textContent.includes(genre)) c.classList.add('active');
    });
    renderKatalog();
  }, 100);
  showToast(`🎼 Menampilkan ${genre}`);
}

// ==================== DETAIL PRODUK ====================
function openDetail(id) {
  const p = produk.find(x => x.id === id);
  if (!p) return;
  currentProduk = p;
  selectedPaket = 'premium';

  const el = document.getElementById('detailContent');
  el.innerHTML = `
    <div class="detail-preview" style="background:linear-gradient(135deg,${p.warna[0]},${p.warna[1]})">
      <div class="big-play" onclick="playTrack(${p.id})">▶️</div>
      <div class="waveform">
        ${Array.from({length:30},(_,i)=>`<div style="animation-delay:${i*0.05}s"></div>`).join('')}
      </div>
      <div style="margin-top:20px;font-size:12px;opacity:0.9">Preview: 00:45 / 03:20</div>
    </div>
    <div class="detail-info">
      <h1>"${p.nama}"</h1>
      <div class="artist">BY ARI MARSHELLO</div>
      <div class="rating-row">
        <span>⭐ ${p.rating}</span><span>|</span>
        <span>${p.terjual} terjual</span><span>|</span>
        <span>🎤 ${p.genre}</span>
      </div>
      <div class="harga-besar">${rupiah(p.harga)} <span style="font-size:14px;color:var(--text-dim);text-decoration:line-through;font-weight:400">${rupiah(p.asli)}</span></div>
      <div class="info-grid">
        <div class="info-item"><div class="label">BPM</div><div class="value">${p.bpm}</div></div>
        <div class="info-item"><div class="label">Key</div><div class="value">${p.key}</div></div>
        <div class="info-item"><div class="label">Genre</div><div class="value">${p.genre}</div></div>
        <div class="info-item"><div class="label">DAW</div><div class="value">${p.daw}</div></div>
      </div>
      <h3 style="margin:20px 0 12px;font-size:16px">📦 Pilih Paket Lisensi</h3>
      <div class="paket-list">
        <div class="paket" data-paket="basic" onclick="pilihPaket('basic', this)">
          <div class="paket-info"><h4>Basic</h4><p>MP3 + WAV · Non-exclusive</p></div>
          <div class="paket-harga">${rupiah(p.harga)}</div>
        </div>
        <div class="paket active" data-paket="premium" onclick="pilihPaket('premium', this)">
          <div class="paket-info"><h4>Premium ⭐</h4><p>+ File Projek (${p.daw}) + MIDI + STEM</p></div>
          <div class="paket-harga">${rupiah(p.harga * 2)}</div>
        </div>
        <div class="paket" data-paket="exclusive" onclick="pilihPaket('exclusive', this)">
          <div class="paket-info"><h4>Exclusive 👑</h4><p>Full rights + hapus dari toko</p></div>
          <div class="paket-harga">${rupiah(p.harga * 8)}</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn-outline" style="flex:1" onclick="hubungiWA()">💬 Chat Ari</button>
        <button class="btn-primary" style="flex:1" onclick="addCartPaket()">🛒 Beli Sekarang</button>
      </div>
    </div>
  `;
  showPage('detail');
}

function pilihPaket(p, el) {
  selectedPaket = p;
  document.querySelectorAll('.paket').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
}

function addCartPaket() {
  if (!currentProduk) return;
  const mult = CONFIG.PAKET_MULTIPLIER[selectedPaket];
  const harga = currentProduk.harga * mult;
  const nama = `${currentProduk.nama} (${selectedPaket})`;
  cart.push({ ...currentProduk, nama, harga, qty:1, paket:selectedPaket });
  updateCart();
  showToast(`✅ "${currentProduk.nama}" paket ${selectedPaket} ditambahkan`);
}

// ==================== WISHLIST ====================
function toggleWish(id, el) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    if (el) { el.innerHTML = '🤍'; el.classList.remove('active'); }
    showToast('💔 Dihapus dari wishlist');
  } else {
    wishlist.push(id);
    if (el) { el.innerHTML = '❤️'; el.classList.add('active'); }
    showToast('❤️ Ditambahkan ke wishlist');
  }
  const badge = document.getElementById('wishBadge');
  badge.textContent = wishlist.length;
  badge.style.display = wishlist.length > 0 ? 'block' : 'none';
}

function renderWishlist() {
  const list = produk.filter(p => wishlist.includes(p.id));
  renderProduk(list, 'produkWishlist');
}

// ==================== CART ====================
function addCart(id) {
  const p = produk.find(x => x.id === id);
  const existing = cart.find(x => x.id === id && x.paket === 'basic');
  if (existing) existing.qty++;
  else cart.push({ ...p, qty:1, paket:'basic' });
  updateCart();
  showToast(`✅ "${p.nama}" ditambahkan`);
}

function updateCart() {
  const body = document.getElementById('cartBody');
  const badge = document.getElementById('cartBadge');
  const total = document.getElementById('cartTotal');
  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
  badge.textContent = totalQty;

  if (cart.length === 0) {
    body.innerHTML = `<div class="empty-cart"><span>🛒</span>Keranjang masih kosong<br><small>Yuk pilih projek Ari!</small></div>`;
    total.textContent = "Rp0";
    return;
  }

  body.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-img" style="background:linear-gradient(135deg,${item.warna[0]},${item.warna[1]})">🎵</div>
      <div class="cart-item-info">
        <h4>"${item.nama}"${item.paket ? ` <span style="font-size:10px;color:var(--accent)">[${item.paket}]</span>` : ''}</h4>
        <p>${rupiah(item.harga)}</p>
        <div class="qty-control">
          <button onclick="ubahQty(${idx}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="ubahQty(${idx}, 1)">+</button>
          <button onclick="hapusItem(${idx})" style="margin-left:auto;color:var(--secondary);border-color:var(--secondary)">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');

  const totalHarga = cart.reduce((s,i) => s + i.harga * i.qty, 0);
  total.textContent = rupiah(totalHarga);
}

function ubahQty(idx, delta) {
  if (!cart[idx]) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCart();
}

function hapusItem(idx) {
  cart.splice(idx, 1);
  updateCart();
}

function toggleCart() {
  document.getElementById('cartPanel').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

// ==================== CHECKOUT ====================
function checkout() {
  if (cart.length === 0) {
    showToast("❌ Keranjang masih kosong");
    return;
  }
  if (!currentUser) {
    showToast('🔓 Silakan login dulu untuk checkout');
    openAuth();
    return;
  }

  let pesan = `Halo Ari Marshello! 🎵%0A%0A*Pesanan dari:* ${currentUser.nama}%0A*Email:* ${currentUser.email}%0A%0A`;
  cart.forEach((item,i) => {
    pesan += `${i+1}. "${item.nama}"${item.paket?` [${item.paket}]`:''} x${item.qty} = ${rupiah(item.harga * item.qty)}%0A`;
  });
  const total = cart.reduce((s,i) => s + i.harga * i.qty, 0);
  pesan += `%0A*Total: ${rupiah(total)}*%0A%0ATerima kasih Ari! 🙏`;

  // Simpan riwayat
  const key = 'riwayat_' + currentUser.email;
  const riwayat = JSON.parse(localStorage.getItem(key) || '[]');
  riwayat.push({
    tanggal: new Date().toLocaleString('id-ID'),
    items: cart.reduce((s,i) => s + i.qty, 0),
    total: rupiah(total)
  });
  localStorage.setItem(key, JSON.stringify(riwayat));

  window.open(`https://wa.me/${CONFIG.WA_NUMBER}?text=${pesan}`, '_blank');
  showToast('✅ Pesanan dikirim ke WhatsApp Ari!');
}

function hubungiWA() {
  window.open(`https://wa.me/${CONFIG.WA_NUMBER}?text=Halo Ari Marshello! Saya tertarik dengan projek musik Anda 🎵`, '_blank');
}

// ==================== KONTAK ====================
function kirimPesan() {
  const nama = document.getElementById('formNama').value || '-';
  const kontak = document.getElementById('formKontak').value || '-';
  const topik = document.getElementById('formTopik').value;
  const pesan = document.getElementById('formPesan').value || '-';
  const text = `Halo Ari Marshello! 🎵%0A%0A*Nama:* ${nama}%0A*Kontak:* ${kontak}%0A*Topik:* ${topik}%0A%0A*Pesan:*%0A${pesan}`;
  window.open(`https://wa.me/${CONFIG.WA_NUMBER}?text=${text}`, '_blank');
}

function toggleFaq(el) {
  const item = el.parentElement;
  item.classList.toggle('open');
  el.querySelector('span').textContent = item.classList.contains('open') ? '−' : '+';
}

// ==================== THEME ====================
function toggleTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  document.querySelector('.header-actions .icon-btn').textContent = isLight ? '☀️' : '🌙';
  showToast(isLight ? '☀️ Mode Terang' : '🌙 Mode Gelap');
}

// ==================== TOAST ====================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ==================== INIT ====================
renderProduk(produk.slice(0,4), 'produkHome');
renderKatalog();
updateCart();