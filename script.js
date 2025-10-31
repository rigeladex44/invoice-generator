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
    // Ukuran 1/3 A4 landscape: 297mm x 99mm (A4 landscape dibagi 3)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [99, 297] // tinggi x lebar
    });
    
    const kepadaYth = document.getElementById('kepadaYth').value;
    const tanggal = formatDate(document.getElementById('tanggal').value);
    const nomorInvoice = document.getElementById('nomorInvoice').value;
    
    // Header
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('ARSAKA RAYA', 10, 10);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('Pondok Blimbing Indah, Malang, 65126.', 10, 15);
    doc.text('Telp: +62 851 5505 8577 Email: arsaka.raya@rigeel.id', 10, 19);
    
    // Kepada Yth (kanan atas)
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('Kepada Yth', 200, 10);
    doc.setFont(undefined, 'normal');
    doc.text(kepadaYth, 200, 15);
    
    // Judul
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('FAKTUR PENJUALAN', 148.5, 30, { align: 'center' });
    
    // Tanggal dan Nomor
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('TANGGAL : ' + tanggal, 10, 38);
    doc.text('Nomor : ' + nomorInvoice, 200, 38);
    
    // Tabel Header
    let y = 45;
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    
    const colWidths = [10, 20, 85, 25, 20, 30, 35];
    const colX = [10, 20, 40, 125, 150, 170, 200];
    const headers = ['NO', 'KODE', 'NAMA BARANG', 'QTY', 'SAT', 'HARGA', 'TOTAL'];
    
    // Draw header background
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y - 4, 277, 6, 'F');
    doc.rect(10, y - 4, 277, 6, 'S');
    
    headers.forEach((header, i) => {
        if (i === 0) {
            doc.text(header, colX[i] + colWidths[i]/2, y, { align: 'center' });
        } else {
            doc.text(header, colX[i], y);
        }
    });
    
    y += 6;
    
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
        
        doc.text(formatNumber(item.qty), colX[3] + colWidths[3] - 2, y, { align: 'right' });
        doc.text(item.sat, colX[4], y);
        doc.text(formatNumber(item.harga), colX[5] + colWidths[5] - 2, y, { align: 'right' });
        doc.text(item.total, colX[6] + colWidths[6] - 2, y, { align: 'right' });
        
        y += Math.max(6, namaLines.length * 4);
    });
    
    // Garis penutup tabel
    doc.line(10, y - 2, 287, y - 2);
    
    // Footer - Bank Info
    y += 5;
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('TF NO REKENING', 10, y);
    doc.setFont(undefined, 'normal');
    doc.text('BCA 1501282770', 10, y + 4);
    doc.text('AN MUHAMMAD RIGEL', 10, y + 8);
    
    // Totals
    const subTotal = document.getElementById('displaySubTotal').textContent;
    const diskon = document.getElementById('displayDiskon').textContent;
    const pembayaran = document.getElementById('displayPembayaran').textContent;
    const grandTotal = document.getElementById('displayGrandTotal').textContent;
    
    doc.setFont(undefined, 'bold');
    doc.text('SUB TOTAL', 180, y);
    doc.setFont(undefined, 'normal');
    doc.text(subTotal, 265, y, { align: 'right' });
    
    doc.setFont(undefined, 'bold');
    doc.text('DISC', 180, y + 4);
    doc.setFont(undefined, 'normal');
    doc.text(diskon, 265, y + 4, { align: 'right' });
    
    doc.setFont(undefined, 'bold');
    doc.text('PEMBAYARAN', 180, y + 8);
    doc.setFont(undefined, 'normal');
    doc.text(pembayaran, 265, y + 8, { align: 'right' });
    
    // Grand Total
    doc.line(180, y + 10, 267, y + 10);
    doc.setFont(undefined, 'bold');
    doc.text('JUMLAH YANG HARUS DIBAYAR', 180, y + 15);
    doc.text(grandTotal, 265, y + 15, { align: 'right' });
    
    // Tanda tangan
    doc.setFont(undefined, 'normal');
    doc.text('HORMAT KAMI', 230, y + 22);
    doc.text('(_____________)', 225, y + 42);
    
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
