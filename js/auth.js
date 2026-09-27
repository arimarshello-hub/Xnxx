// ==================== SISTEM LOGIN & REGISTER ====================
// Data user disimpan di localStorage browser

const STORAGE_KEY = 'ari_marshello_users';
const SESSION_KEY = 'ari_marshello_session';

// Ambil semua user
function getAllUsers() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Simpan user baru
function saveUser(user) {
  const users = getAllUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Cari user by email
function findUser(email) {
  return getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Buka modal login
function openAuth() {
  document.getElementById('authOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Tutup modal login
function closeAuth() {
  document.getElementById('authOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Ganti tab login/register
function switchAuthTab(tab, el) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById(tab + 'Form').classList.add('active');
}

// ==================== LOGIN ====================
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('rememberMe').checked;

  const user = findUser(email);
  if (!user) {
    showToast('❌ Email tidak terdaftar. Silakan daftar dulu.');
    return;
  }
  if (user.password !== password) {
    showToast('❌ Password salah!');
    return;
  }

  // Simpan session
  currentUser = { nama: user.nama, email: user.email, wa: user.wa };
  if (remember) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  }

  updateUserUI();
  closeAuth();
  showToast(`🎉 Selamat datang, ${user.nama}!`);
}

// ==================== REGISTER ====================
function handleRegister(e) {
  e.preventDefault();
  const nama = document.getElementById('regNama').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const wa = document.getElementById('regWA').value.trim();
  const password = document.getElementById('regPassword').value;
  const password2 = document.getElementById('regPassword2').value;

  if (password !== password2) {
    showToast('❌ Password tidak sama!');
    return;
  }
  if (findUser(email)) {
    showToast('❌ Email sudah terdaftar!');
    return;
  }

  const newUser = { nama, email, wa, password, createdAt: Date.now() };
  saveUser(newUser);

  currentUser = { nama, email, wa };
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

  updateUserUI();
  closeAuth();
  showToast(`🎉 Akun berhasil dibuat! Selamat datang, ${nama}!`);
}

// ==================== DEMO LOGIN ====================
function loginDemo() {
  currentUser = { nama: 'Tamu Demo', email: 'demo@arimarshello.com', wa: '6281234567890' };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  updateUserUI();
  closeAuth();
  showToast('🎧 Login sebagai Tamu Demo');
}

// ==================== LOGOUT ====================
function logout() {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  updateUserUI();
  document.getElementById('userMenu')?.classList.remove('open');
  showToast('👋 Anda telah keluar');
}

// ==================== UPDATE UI ====================
function updateUserUI() {
  const btn = document.getElementById('userBtn');
  const oldMenu = document.getElementById('userMenu');
  if (oldMenu) oldMenu.remove();

  if (currentUser) {
    btn.classList.add('logged-in');
    btn.innerHTML = `👤 <span style="font-size:11px;margin-left:4px">${currentUser.nama.split(' ')[0]}</span>`;

    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.id = 'userMenu';
    menu.innerHTML = `
      <div class="user-menu-header">
        <div class="user-name">👤 ${currentUser.nama}</div>
        <div class="user-email">${currentUser.email}</div>
      </div>
      <div class="user-menu-list">
        <a onclick="showPage('wishlist'); closeUserMenu()">❤️ Wishlist Saya</a>
        <a onclick="showPage('katalog'); closeUserMenu()">🎵 Katalog</a>
        <a onclick="showRiwayat(); closeUserMenu()">📦 Riwayat Pembelian</a>
        <a onclick="showPage('kontak'); closeUserMenu()">📞 Hubungi Ari</a>
        <a class="logout" onclick="logout()">🚪 Keluar</a>
      </div>
    `;
    document.body.appendChild(menu);
  } else {
    btn.classList.remove('logged-in');
    btn.innerHTML = '👤';
  }
}

function closeUserMenu() {
  document.getElementById('userMenu')?.classList.remove('open');
}

// ==================== HANDLE USER BUTTON ====================
function handleUserBtn() {
  if (currentUser) {
    document.getElementById('userMenu')?.classList.toggle('open');
  } else {
    openAuth();
  }
}

// Tutup menu kalau klik di luar
document.addEventListener('click', (e) => {
  const menu = document.getElementById('userMenu');
  if (!menu) return;
  if (!menu.contains(e.target) && !e.target.closest('#userBtn')) {
    menu.classList.remove('open');
  }
});

// ==================== RIWAYAT PEMBELIAN ====================
function showRiwayat() {
  if (!currentUser) {
    openAuth();
    return;
  }
  const key = 'riwayat_' + currentUser.email;
  const riwayat = JSON.parse(localStorage.getItem(key) || '[]');
  if (riwayat.length === 0) {
    showToast('📦 Belum ada riwayat pembelian');
    return;
  }
  alert('📦 Riwayat Pembelian:\n\n' + riwayat.map((r,i) => 
    `${i+1}. ${r.tanggal}\n   ${r.items} item - ${r.total}`
  ).join('\n\n'));
}

// ==================== CEK SESSION SAAT LOAD ====================
function checkSession() {
  const saved = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  if (saved) {
    currentUser = JSON.parse(saved);
  }
  updateUserUI();
}

// Tutup modal kalau klik overlay
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('authOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'authOverlay') closeAuth();
  });
  checkSession();
});