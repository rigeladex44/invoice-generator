#!/bin/bash

# Script untuk push ke GitHub
# Pastikan Anda sudah membuat repository di GitHub terlebih dahulu

echo "==================================="
echo "Push Invoice Generator ke GitHub"
echo "==================================="
echo ""

# Minta URL repository
read -p "Masukkan URL GitHub repository Anda (contoh: https://github.com/username/invoice-generator.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "Error: URL repository tidak boleh kosong!"
    exit 1
fi

echo ""
echo "Menambahkan remote repository..."
git remote add origin "$REPO_URL"

echo "Mengecek branch..."
git branch -M main

echo ""
echo "Pushing ke GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Berhasil! Repository sudah di-push ke GitHub"
    echo "🌐 Lihat di: $REPO_URL"
else
    echo ""
    echo "❌ Gagal push ke GitHub"
    echo "Pastikan:"
    echo "1. Repository sudah dibuat di GitHub"
    echo "2. URL repository benar"
    echo "3. Anda sudah login dengan GitHub credentials"
fi
