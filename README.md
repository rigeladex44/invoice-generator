# 🧾 Generator Invoice Arsaka Raya

Website generator invoice profesional dengan template Arsaka Raya. Mendukung pembuatan invoice PDF dengan ukuran 1/3 A4 (99mm x 297mm).

## ✨ Fitur

- 📝 Form input yang user-friendly
- 🔢 Perhitungan otomatis untuk total, diskon, dan pembayaran
- 👁️ Preview invoice sebelum generate PDF
- 📄 Generate PDF dengan ukuran 1/3 A4
- ➕ Tambah multiple items
- 💾 Download PDF langsung
- 📱 Responsive design

## 🚀 Cara Penggunaan

### 1. Buka Website
Buka file `index.html` di browser Anda.

### 2. Isi Form Invoice

#### Informasi Pelanggan
- **Kepada Yth**: Masukkan nama pelanggan atau perusahaan

#### Informasi Invoice
- **Tanggal**: Pilih tanggal invoice (default: hari ini)
- **Nomor Invoice**: Masukkan nomor invoice (contoh: T.103025.027)

#### Daftar Barang
Untuk setiap item, isi:
- **Kode**: Kode produk (contoh: FF158)
- **Nama Barang**: Nama produk lengkap
- **QTY**: Jumlah/kuantitas
- **Satuan**: Satuan produk (PCS, BOX, KG, dll)
- **Harga**: Harga per unit
- **Total**: Otomatis terkalkulasi

Gunakan tombol **➕ Tambah Item** untuk menambah barang baru.

#### Pembayaran
- **Diskon**: Masukkan jumlah diskon (jika ada)
- **Pembayaran**: Masukkan jumlah yang sudah dibayar

### 3. Generate Invoice

**Tombol Preview** (👁️ Preview)
- Melihat preview invoice sebelum di-generate
- Memastikan semua data sudah benar

**Tombol Generate PDF** (📄 Generate PDF)
- Membuat file PDF invoice
- File akan otomatis terdownload
- Format nama: `Invoice_T_103025_027.pdf`

**Tombol Reset** (🔄 Reset)
- Mengosongkan semua form
- Kembali ke kondisi awal

## 📋 Template Invoice

Invoice menggunakan template resmi Arsaka Raya dengan informasi:

**Header:**
```
ARSAKA RAYA
Pondok Blimbing Indah, Malang, 65126.
Telp: +62 851 5505 8577
Email: arsaka.raya@rigeel.id
```

**Bank Transfer:**
```
BCA 1501282770
AN MUHAMMAD RIGEL
```

## 🎨 Ukuran PDF

- Format: 1/3 A4 Landscape
- Dimensi: 99mm x 297mm
- Orientasi: Landscape
- Cocok untuk invoice thermal printer atau format khusus

## 💻 Teknologi

- **HTML5**: Struktur halaman
- **CSS3**: Styling dan responsive design
- **JavaScript**: Logic dan kalkulasi
- **jsPDF**: Library untuk generate PDF

## 📦 File Structure

```
invoice-generator/
│
├── index.html          # Halaman utama
├── styles.css          # Styling
├── script.js           # JavaScript logic
└── README.md          # Dokumentasi
```

## 🔧 Instalasi

### Langkah 1: Download/Clone
Download atau clone repository ini ke komputer Anda.

### Langkah 2: Buka di Browser
Cukup buka file `index.html` di browser modern (Chrome, Firefox, Edge, Safari).

Tidak memerlukan instalasi tambahan atau web server!

## 📝 Contoh Pengisian

**Kepada Yth:** SPPG Ngawonggo Tajinan  
**Tanggal:** 30 Oktober 2025  
**Nomor:** T.103025.027  

**Item 1:**
- Kode: FF158
- Nama Barang: Susu UHT Indomilk
- QTY: 1810
- Satuan: PCS
- Harga: 2850
- Total: 5.158.500 (otomatis)

**Pembayaran:**
- Sub Total: Rp 5.158.500
- Diskon: Rp 0
- Pembayaran: Rp 0
- **Jumlah Yang Harus Dibayar: Rp 5.158.500**

## 🎯 Tips Penggunaan

1. **Format Nomor Invoice**: Gunakan format standar seperti T.DDMMYY.XXX
2. **Harga**: Masukkan harga satuan tanpa pemisah ribuan
3. **Multiple Items**: Tambahkan item sebanyak yang diperlukan
4. **Preview**: Selalu preview sebelum generate untuk memastikan data benar
5. **Save Data**: Browser tidak menyimpan data, pastikan generate PDF setelah selesai

## 🐛 Troubleshooting

**PDF tidak terdownload?**
- Pastikan browser mengizinkan download
- Cek popup blocker
- Coba browser lain

**Perhitungan salah?**
- Pastikan input hanya angka (tanpa titik/koma)
- Refresh halaman dan coba lagi

**Layout berantakan?**
- Pastikan menggunakan browser modern
- Update browser ke versi terbaru
- Coba zoom reset (Ctrl + 0)

## 📄 License

Free to use untuk keperluan bisnis Arsaka Raya.

## 👤 Author

**Arsaka Raya**
- Email: arsaka.raya@rigeel.id
- Telp: +62 851 5505 8577
- Alamat: Pondok Blimbing Indah, Malang, 65126

## 🙏 Support

Jika ada pertanyaan atau masalah, hubungi email di atas.

---

**© 2025 Arsaka Raya - Invoice Generator**
