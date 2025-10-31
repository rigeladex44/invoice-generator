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
    // Ukuran landscape: 210mm x 140mm (lebar 210mm, tinggi 140mm - melebar)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [140, 210] // tinggi x lebar untuk landscape
    });
    
    const kepadaYth = document.getElementById('kepadaYth').value;
    const tanggal = formatDate(document.getElementById('tanggal').value);
    const nomorInvoice = document.getElementById('nomorInvoice').value;
    
    // Header - dikompres untuk tinggi 95mm
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('ARSAKA RAYA', 10, 8);
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text('Pondok Blimbing Indah, Malang, 65126.', 10, 12);
    doc.text('Telp: +62 851 5505 8577', 10, 15);
    doc.text('Email: arsaka.raya@rigeel.id', 10, 18);

    // Kepada Yth (kanan atas) - label normal, isi (nama customer) digeser ke kanan dan bawah
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.text('Kepada Yth', 130, 8);
    doc.setFont(undefined, 'normal');
    doc.text(kepadaYth, 135, 12); // Isi nama customer digeser ke kanan dan bawah

    // Judul - center untuk portrait
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('FAKTUR PENJUALAN', 105, 24, { align: 'center' });

    // Tanggal dan Nomor - label normal, ISI dibuat bold
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('TANGGAL : ', 10, 30);
    doc.setFont(undefined, 'bold');
    doc.text(tanggal, 32, 30); // Isi tanggal bold

    doc.setFont(undefined, 'normal');
    doc.text('Nomor : ', 10, 34);
    doc.setFont(undefined, 'bold');
    doc.text(nomorInvoice, 28, 34); // Isi nomor bold
    
    // Tabel Header - disesuaikan untuk tinggi 95mm
    let y = 40;
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');

    // Kolom disesuaikan untuk lebar 210mm (total usable: 190mm)
    const colWidths = [10, 20, 60, 20, 15, 30, 35];
    const colX = [10, 20, 40, 100, 120, 135, 165];
    const headers = ['NO', 'KODE', 'NAMA BARANG', 'QTY', 'SAT', 'HARGA', 'TOTAL'];

    // Draw header background
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y - 3, 190, 5, 'F');
    doc.rect(10, y - 3, 190, 5, 'S');

    headers.forEach((header, i) => {
        if (i === 0) {
            // NO - center
            doc.text(header, colX[i] + colWidths[i]/2, y, { align: 'center' });
        } else if (i === 3 || i === 5 || i === 6) {
            // QTY, HARGA, TOTAL - align right (luruskan)
            doc.text(header, colX[i] + colWidths[i] - 2, y, { align: 'right' });
        } else {
            // KODE, NAMA BARANG, SAT - align left
            doc.text(header, colX[i], y);
        }
    });

    y += 5; // Spacing setelah header
    
    // Tabel Items - disesuaikan untuk tinggi 95mm
    doc.setFontSize(7);
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

        // Spacing antar baris (lebih kecil untuk tinggi 95mm)
        y += Math.max(4, namaLines.length * 3);
    });

    // Garis penutup tabel
    doc.line(10, y - 1, 200, y - 1);

    // Footer - diposisikan di margin bawah (mepet ke bawah)
    // PDF height = 140mm, footer mulai dari y = 110mm
    const footerY = 110;

    // Bank Info - dikompres untuk tinggi 95mm
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.text('TF NO REKENING', 10, footerY);
    doc.setFont(undefined, 'normal');
    doc.text('BCA 1501282770', 10, footerY + 3);
    doc.text('AN MUHAMMAD RIGEL', 10, footerY + 6);

    // Totals - dikompres untuk tinggi 95mm
    const subTotal = document.getElementById('displaySubTotal').textContent;
    const diskon = document.getElementById('displayDiskon').textContent;
    const pembayaran = document.getElementById('displayPembayaran').textContent;
    const grandTotal = document.getElementById('displayGrandTotal').textContent;

    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.text('SUB TOTAL', 110, footerY);
    doc.setFont(undefined, 'normal');
    doc.text(subTotal, 198, footerY, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.text('DISC', 110, footerY + 3);
    doc.setFont(undefined, 'normal');
    doc.text(diskon, 198, footerY + 3, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.text('PEMBAYARAN', 110, footerY + 6);
    doc.setFont(undefined, 'normal');
    doc.text(pembayaran, 198, footerY + 6, { align: 'right' });

    // Grand Total - garis dibawah PEMBAYARAN
    doc.line(110, footerY + 7.5, 200, footerY + 7.5);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(8);
    doc.text('JUMLAH YANG HARUS DIBAYAR', 110, footerY + 11);
    doc.text(grandTotal, 198, footerY + 11, { align: 'right' });

    // Tanda tangan - posisi di bagian bawah kanan
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text('HORMAT KAMI', 155, footerY + 15);
    doc.text('(_____________)', 150, footerY + 22);
    
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
