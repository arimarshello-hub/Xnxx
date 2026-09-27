// ==================== DATA PRODUK ====================
const produk = [
  { id:1, nama:"Aku Mati Rasa", harga:150000, asli:200000, genre:"Trap", bpm:140, key:"F# Minor", daw:"FL Studio", rating:4.9, terjual:"24", warna:["#7B2FF7","#F72585"] },
  { id:2, nama:"Ku Pamit Pergi V2", harga:200000, asli:280000, genre:"R&B", bpm:90, key:"C Major", daw:"FL Studio", rating:4.8, terjual:"18", warna:["#F72585","#FFD700"] },
  { id:3, nama:"DJ sad Kane Terimakasih Semua", harga:100000, asli:150000, genre:"Lo-Fi", bpm:75, key:"A Minor", daw:"Ableton", rating:5.0, terjual:"32", warna:["#00F5FF","#7B2FF7"] },
  { id:4, nama:"Terimakasih Mama", harga:175000, asli:230000, genre:"Trap", bpm:145, key:"G Minor", daw:"FL Studio", rating:4.7, terjual:"15", warna:["#14142B","#7B2FF7"] },
  { id:5, nama:"Maafkan Aku", harga:180000, asli:240000, genre:"Pop", bpm:105, key:"D Major", daw:"Ableton", rating:4.9, terjual:"22", warna:["#FFD700","#F72585"] },
  { id:6, nama:"Di Pelaminan Dirimu", harga:225000, asli:300000, genre:"EDM", bpm:128, key:"E Minor", daw:"FL Studio", rating:4.8, terjual:"19", warna:["#00F5FF","#F72585"] },
  { id:7, nama:"Orangtuamu Melarang", harga:160000, asli:210000, genre:"R&B", bpm:85, key:"B Minor", daw:"FL Studio", rating:4.6, terjual:"12", warna:["#7B2FF7","#00F5FF"] },
  { id:8, nama:"Tilu Bulan Jadiana", harga:140000, asli:190000, genre:"Lo-Fi", bpm:70, key:"D Minor", daw:"Ableton", rating:4.9, terjual:"28", warna:["#14142B","#00F5FF"] },
];

// ==================== KONFIGURASI ====================
const CONFIG = {
  WA_NUMBER: "62882008281462", // GANTI dengan nomor WA Ari
  TOKO_NAME: "ARI MARSHELLO",
  PAKET_MULTIPLIER: {
    basic: 1,
    premium: 2,
    exclusive: 8
  }
};

// ==================== STATE GLOBAL ====================
let cart = [];
let wishlist = [];
let currentFilter = 'all';
let currentProduk = null;
let selectedPaket = 'premium';
let currentIndex = 0;
let isPlaying = false;
let progressInterval = null;
let progressValue = 0;
let currentUser = null;

// ==================== UTIL ====================
function rupiah(n) { return "Rp" + n.toLocaleString('id-ID'); }
