# 📤 Cara Upload ke GitHub

Repository Git sudah siap untuk di-push ke GitHub Anda!

## 🚀 Metode 1: Menggunakan Script (Termudah)

1. **Buat Repository Baru di GitHub**
   - Buka https://github.com/new
   - Nama repository: `invoice-generator` (atau nama lain)
   - Pilih **Public** atau **Private**
   - **JANGAN** centang "Initialize with README"
   - Klik **Create repository**

2. **Jalankan Script**
   ```bash
   cd invoice-generator
   chmod +x push-to-github.sh
   ./push-to-github.sh
   ```

3. **Masukkan URL Repository**
   - Copy URL dari GitHub (contoh: `https://github.com/username/invoice-generator.git`)
   - Paste saat diminta

4. **Login (jika diminta)**
   - Masukkan username GitHub Anda
   - Masukkan Personal Access Token (bukan password!)

## 🔧 Metode 2: Manual Command

### Langkah 1: Buat Repository di GitHub
Sama seperti Metode 1 di atas.

### Langkah 2: Push ke GitHub
```bash
cd invoice-generator

# Ganti URL dengan repository Anda
git remote add origin https://github.com/USERNAME/invoice-generator.git

# Rename branch ke main
git branch -M main

# Push ke GitHub
git push -u origin main
```

**Ganti `USERNAME` dengan username GitHub Anda!**

## 🔑 Cara Membuat Personal Access Token

Jika diminta password saat push, Anda perlu Personal Access Token:

1. Buka https://github.com/settings/tokens
2. Klik **Generate new token** → **Generate new token (classic)**
3. Nama: `Invoice Generator`
4. Pilih scope: **repo** (centang semua)
5. Klik **Generate token**
6. **COPY token** (hanya muncul sekali!)
7. Gunakan token ini sebagai password saat push

## 📝 Contoh URL Repository

**HTTPS:**
```
https://github.com/username/invoice-generator.git
```

**SSH (jika sudah setup SSH key):**
```
git@github.com:username/invoice-generator.git
```

## 🎯 Setelah Berhasil Upload

Repository Anda akan tersedia di:
```
https://github.com/USERNAME/invoice-generator
```

### Mengaktifkan GitHub Pages (Opsional)

Agar website bisa diakses online:

1. Buka repository di GitHub
2. Klik **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** → **/root**
5. Klik **Save**

Website akan tersedia di:
```
https://USERNAME.github.io/invoice-generator/
```

## ❓ Troubleshooting

### Error: "Repository not found"
- Pastikan URL repository benar
- Pastikan repository sudah dibuat di GitHub

### Error: "Authentication failed"
- Gunakan Personal Access Token, bukan password
- Pastikan token memiliki permission **repo**

### Error: "Remote already exists"
```bash
git remote remove origin
# Lalu tambahkan lagi dengan URL yang benar
git remote add origin https://github.com/USERNAME/invoice-generator.git
```

## 🔄 Update Repository (Setelah Edit)

Jika Anda melakukan perubahan pada code:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

---

**📧 Butuh bantuan?** Hubungi arsaka.raya@rigeel.id
