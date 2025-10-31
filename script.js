// Initialize
let itemCounter = 1;

// Set tanggal hari ini sebagai default
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
    
    // Add event listeners untuk perhitungan otomatis
    setupCalculations();
});

function setupCalculations() {
    // Event listener untuk setiap item
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('item-qty') || e.target.classList.contains('item-harga')) {
            calculateItemTotal(e.target);
        }
        if (e.target.id === 'diskon' || e.target.id === 'pembayaran') {
            calculateGrandTotal();
        }
    });
}

function calculateItemTotal(input) {
    const itemRow = input.closest('.item-row');
    const qty = parseFloat(itemRow.querySelector('.item-qty').value) || 0;
    const harga = parseFloat(itemRow.querySelector('.item-harga').value) || 0;
    const total = qty * harga;
    
    itemRow.querySelector('.item-total').value = formatNumber(total);
    calculateGrandTotal();
}

function calculateGrandTotal() {
    let subTotal = 0;
    
    // Hitung sub total dari semua item
    document.querySelectorAll('.item-row').forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const harga = parseFloat(row.querySelector('.item-harga').value) || 0;
        subTotal += qty * harga;
    });
    
    const diskon = parseFloat(document.getElementById('diskon').value) || 0;
    const pembayaran = parseFloat(document.getElementById('pembayaran').value) || 0;
    const grandTotal = subTotal - diskon - pembayaran;
    
    // Update tampilan
    document.getElementById('displaySubTotal').textContent = 'Rp ' + formatNumber(subTotal);
    document.getElementById('displayDiskon').textContent = 'Rp ' + formatNumber(diskon);
    document.getElementById('displayPembayaran').textContent = 'Rp ' + formatNumber(pembayaran);
    document.getElementById('displayGrandTotal').textContent = 'Rp ' + formatNumber(grandTotal);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDate(dateString) {
    const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 
                   'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function addItem() {
    itemCounter++;
    const itemsContainer = document.getElementById('itemsContainer');
    
    const newItem = document.createElement('div');
    newItem.className = 'item-row';
    newItem.setAttribute('data-item', itemCounter);
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group" style="flex: 1;">
                <label>Kode:</label>
                <input type="text" class="item-kode" placeholder="FF158" required>
            </div>
            <div class="form-group" style="flex: 2;">
                <label>Nama Barang:</label>
                <input type="text" class="item-nama" placeholder="Susu UHT Indomilk" required>
            </div>
            <div class="form-group" style="flex: 1;">
                <label>QTY:</label>
                <input type="number" class="item-qty" placeholder="1810" required min="1">
            </div>
            <div class="form-group" style="flex: 0.8;">
                <label>Satuan:</label>
                <input type="text" class="item-sat" placeholder="PCS" required>
            </div>
            <div class="form-group" style="flex: 1;">
                <label>Harga:</label>
                <input type="number" class="item-harga" placeholder="2850" required min="0">
            </div>
            <div class="form-group" style="flex: 1;">
                <label>Total:</label>
                <input type="text" class="item-total" readonly>
            </div>
            <div class="form-group" style="flex: 0.3;">
                <label>&nbsp;</label>
                <button type="button" class="btn-remove" onclick="removeItem(${itemCounter})">🗑️</button>
            </div>
        </div>
    `;
    
    itemsContainer.appendChild(newItem);
}

function removeItem(itemId) {
    const items = document.querySelectorAll('.item-row');
    if (items.length > 1) {
        const itemToRemove = document.querySelector(`.item-row[data-item="${itemId}"]`);
        itemToRemove.remove();
        calculateGrandTotal();
    } else {
        alert('Minimal harus ada 1 item!');
    }
}

function previewInvoice() {
    const form = document.getElementById('invoiceForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const kepadaYth = document.getElementById('kepadaYth').value;
    const tanggal = formatDate(document.getElementById('tanggal').value);
    const nomorInvoice = document.getElementById('nomorInvoice').value;
    
    // Ambil data items
    const items = [];
    document.querySelectorAll('.item-row').forEach((row, index) => {
        items.push({
            no: index + 1,
            kode: row.querySelector('.item-kode').value,
            nama: row.querySelector('.item-nama').value,
            qty: row.querySelector('.item-qty').value,
            sat: row.querySelector('.item-sat').value,
            harga: row.querySelector('.item-harga').value,
            total: row.querySelector('.item-total').value
        });
    });
    
    let itemsHTML = '';
    items.forEach(item => {
        itemsHTML += `
            <tr>
                <td style="text-align: center;">${item.no}</td>
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td class="number">${formatNumber(item.qty)}</td>
                <td>${item.sat}</td>
                <td class="number">${formatNumber(item.harga)}</td>
                <td class="number">${item.total}</td>
            </tr>
        `;
    });
    
    const subTotal = document.getElementById('displaySubTotal').textContent;
    const diskon = document.getElementById('displayDiskon').textContent;
    const pembayaran = document.getElementById('displayPembayaran').textContent;
    const grandTotal = document.getElementById('displayGrandTotal').textContent;
    
    const previewHTML = `
        <div class="invoice-preview">
            <div class="invoice-header">
                <div class="company-info">
                    <div class="company-name">ARSAKA RAYA</div>
                    <div>Pondok Blimbing Indah, Malang, 65126.</div>
                    <div>Telp: +62 851 5505 8577 Email: arsaka.raya@rigeel.id</div>
                </div>
                <div style="text-align: right; margin-top: -60px;">
                    <div><strong>Kepada Yth</strong></div>
                    <div>${kepadaYth}</div>
                </div>
            </div>
            
            <div class="invoice-title">FAKTUR PENJUALAN</div>
            
            <div class="invoice-details">
                <div><strong>TANGGAL:</strong> ${tanggal}</div>
                <div><strong>Nomor:</strong> ${nomorInvoice}</div>
            </div>
            
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th style="text-align: center;">NO</th>
                        <th>KODE</th>
                        <th>NAMA BARANG</th>
                        <th>QTY</th>
                        <th>SAT</th>
                        <th>HARGA</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
            
            <div class="invoice-footer">
                <div class="bank-info">
                    <div><strong>TF NO REKENING</strong></div>
                    <div>BCA 1501282770</div>
                    <div>AN MUHAMMAD RIGEL</div>
                </div>
                
                <div class="totals">
                    <div class="totals-row">
                        <span class="totals-label">SUB TOTAL</span>
                        <span>${subTotal}</span>
                    </div>
                    <div class="totals-row">
                        <span class="totals-label">DISC</span>
                        <span>${diskon}</span>
                    </div>
                    <div class="totals-row">
                        <span class="totals-label">PEMBAYARAN</span>
                        <span>${pembayaran}</span>
                    </div>
                    <div class="totals-row" style="border-top: 2px solid #333; padding-top: 10px; margin-top: 10px;">
                        <span class="totals-label">JUMLAH YANG HARUS DIBAYAR</span>
                        <span><strong>${grandTotal}</strong></span>
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: right;">
                    <div>HORMAT KAMI</div>
                    <div style="height: 60px;"></div>
                    <div>(_____________)</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('previewContent').innerHTML = previewHTML;
    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function generatePDF() {
    const form = document.getElementById('invoiceForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const { jsPDF } = window.jspdf;
    // Ukuran A4 landscape: 297mm x 594mm (tinggi 3x dari awal, lebar 2x)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [297, 594] // tinggi x lebar (A4 landscape)
    });
    
    const kepadaYth = document.getElementById('kepadaYth').value;
    const tanggal = formatDate(document.getElementById('tanggal').value);
    const nomorInvoice = document.getElementById('nomorInvoice').value;
    
    // Header (koordinat dan font size dikali 2)
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('ARSAKA RAYA', 20, 20);
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text('Pondok Blimbing Indah, Malang, 65126.', 20, 30);
    doc.text('Telp: +62 851 5505 8577 Email: arsaka.raya@rigeel.id', 20, 38);

    // Kepada Yth (kanan atas) - label normal, isi (nama customer) digeser ke kanan dan bawah
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Kepada Yth', 400, 25);
    doc.setFont(undefined, 'normal');
    doc.text(kepadaYth, 420, 35); // Isi nama customer digeser ke kanan dan bawah

    // Judul (koordinat dan font size dikali 2)
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('FAKTUR PENJUALAN', 297, 60, { align: 'center' });

    // Tanggal dan Nomor - label normal, ISI dibuat bold
    doc.setFontSize(18);
    doc.setFont(undefined, 'normal');
    doc.text('TANGGAL : ', 20, 76);
    doc.setFont(undefined, 'bold');
    doc.text(tanggal, 85, 76); // Isi tanggal bold

    doc.setFont(undefined, 'normal');
    doc.text('Nomor : ', 400, 76);
    doc.setFont(undefined, 'bold');
    doc.text(nomorInvoice, 450, 76); // Isi nomor bold
    
    // Tabel Header - disesuaikan agar proporsional
    let y = 90;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');

    const colWidths = [30, 60, 200, 70, 50, 80, 90];
    const colX = [20, 50, 110, 310, 380, 430, 510];
    const headers = ['NO', 'KODE', 'NAMA BARANG', 'QTY', 'SAT', 'HARGA', 'TOTAL'];

    // Draw header background - lebar disesuaikan dengan total kolom
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 8, 580, 12, 'F');
    doc.rect(20, y - 8, 580, 12, 'S');
    
    headers.forEach((header, i) => {
        if (i === 0) {
            doc.text(header, colX[i] + colWidths[i]/2, y, { align: 'center' });
        } else {
            doc.text(header, colX[i], y);
        }
    });

    y += 12;
    
    // Tabel Items
    doc.setFont(undefined, 'normal');
    const items = [];
    document.querySelectorAll('.item-row').forEach((row, index) => {
        const item = {
            no: index + 1,
            kode: row.querySelector('.item-kode').value,
            nama: row.querySelector('.item-nama').value,
            qty: row.querySelector('.item-qty').value,
            sat: row.querySelector('.item-sat').value,
            harga: row.querySelector('.item-harga').value,
            total: row.querySelector('.item-total').value
        };
        items.push(item);
        
        doc.text(item.no.toString(), colX[0] + colWidths[0]/2, y, { align: 'center' });
        doc.text(item.kode, colX[1], y);
        
        // Handle nama barang panjang
        const namaLines = doc.splitTextToSize(item.nama, colWidths[2] - 2);
        doc.text(namaLines, colX[2], y);
        
        doc.text(formatNumber(item.qty), colX[3] + colWidths[3] - 5, y, { align: 'right' });
        doc.text(item.sat, colX[4], y);
        doc.text(formatNumber(item.harga), colX[5] + colWidths[5] - 5, y, { align: 'right' });
        doc.text(item.total, colX[6] + colWidths[6] - 5, y, { align: 'right' });

        y += Math.max(12, namaLines.length * 8);
    });

    // Garis penutup tabel - disesuaikan dengan lebar tabel
    doc.line(20, y - 4, 600, y - 4);

    // Footer - diposisikan di margin bawah (mepet ke bawah)
    // PDF height = 297mm, footer height ~97mm, jadi mulai dari y = 200mm
    const footerY = 200;

    // Bank Info (koordinat dan font size dikali 2)
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('TF NO REKENING', 20, footerY);
    doc.setFont(undefined, 'normal');
    doc.text('BCA 1501282770', 20, footerY + 8);
    doc.text('AN MUHAMMAD RIGEL', 20, footerY + 16);

    // Totals - disesuaikan posisi agar rapi
    const subTotal = document.getElementById('displaySubTotal').textContent;
    const diskon = document.getElementById('displayDiskon').textContent;
    const pembayaran = document.getElementById('displayPembayaran').textContent;
    const grandTotal = document.getElementById('displayGrandTotal').textContent;

    doc.setFont(undefined, 'bold');
    doc.text('SUB TOTAL', 380, footerY);
    doc.setFont(undefined, 'normal');
    doc.text(subTotal, 570, footerY, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.text('DISC', 380, footerY + 10);
    doc.setFont(undefined, 'normal');
    doc.text(diskon, 570, footerY + 10, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.text('PEMBAYARAN', 380, footerY + 20);
    doc.setFont(undefined, 'normal');
    doc.text(pembayaran, 570, footerY + 20, { align: 'right' });

    // Grand Total - garis dibawah PEMBAYARAN (sama dengan garis pembatas lainnya)
    doc.line(380, footerY + 24, 574, footerY + 24);
    doc.setFont(undefined, 'bold');
    doc.text('JUMLAH YANG HARUS DIBAYAR', 380, footerY + 35);
    doc.text(grandTotal, 570, footerY + 35, { align: 'right' });

    // Tanda tangan - posisi di bagian bawah kanan
    doc.setFont(undefined, 'normal');
    doc.text('HORMAT KAMI', 480, footerY + 50);
    doc.text('(_____________)', 470, footerY + 80);
    
    // Save PDF
    const filename = `Invoice_${nomorInvoice.replace(/\./g, '_')}.pdf`;
    doc.save(filename);
    
    alert('Invoice berhasil dibuat! File: ' + filename);
}

function resetForm() {
    if (confirm('Apakah Anda yakin ingin mereset form?')) {
        document.getElementById('invoiceForm').reset();
        
        // Reset ke 1 item saja
        const itemsContainer = document.getElementById('itemsContainer');
        const items = itemsContainer.querySelectorAll('.item-row');
        items.forEach((item, index) => {
            if (index > 0) {
                item.remove();
            }
        });
        
        itemCounter = 1;
        
        // Set tanggal hari ini
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tanggal').value = today;
        
        calculateGrandTotal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
