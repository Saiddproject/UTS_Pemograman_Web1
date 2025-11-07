// js/checkout.js

(function(){
    // Menyesuaikan query selector dengan ID di HTML Anda
    const cartItemsContainer = document.querySelector('#cartTable tbody');
    const finalTotalDisplay = document.getElementById('finalTotal');
    const cartCountDisplay = document.getElementById('cartCount'); // Tambahkan ini jika ada di HTML
    
    // --- Fungsi untuk memuat dan merender Keranjang ---
    function loadCart(){
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cartItemsContainer.innerHTML = '';
        let totalBelanja = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 20px;">Keranjang kosong.</td></tr>`;
            finalTotalDisplay.textContent = 'Rp 0';
            if (cartCountDisplay) cartCountDisplay.textContent = '0 Item';
            document.getElementById('submitOrderBtn').disabled = true;
            return;
        }

        cart.forEach((it,idx)=>{
            const sub = it.qty * it.harga;
            totalBelanja += sub;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${idx + 1}</td>                 <td>${it.judul}</td>
                <td>Rp ${it.harga.toLocaleString('id-ID')}</td>
                <td><input type="number" value="${it.qty}" min="1" data-idx="${idx}" class="qtyInput" style="width: 60px; text-align: center; padding: 5px;"></td>
                <td style="color: var(--primary-dark); font-weight: 700;">Rp ${sub.toLocaleString('id-ID')}</td>
                <td><button class="btn small btn-delete-data" data-idx="${idx}">Hapus</button></td>`;
            cartItemsContainer.appendChild(tr);
        });
        
        // MEMPERBAIKI ID TOTAL HARGA
        finalTotalDisplay.textContent = 'Rp ' + totalBelanja.toLocaleString('id-ID');
        if (cartCountDisplay) cartCountDisplay.textContent = `${cart.length} Item`;
        document.getElementById('submitOrderBtn').disabled = false;

        // Re-bind event listener untuk tombol Hapus (mengganti onclick di HTML)
        document.querySelectorAll('.btn-delete-data').forEach(button => {
            button.onclick = function() {
                removeItem(Number(this.dataset.idx));
            };
        });

        // bind qty changes
        document.querySelectorAll('.qtyInput').forEach(inp=>{
            inp.addEventListener('change', function(){
                const idx = Number(this.dataset.idx);
                const val = Math.max(1, Number(this.value)); // Pastikan minimal 1
                let cart = JSON.parse(localStorage.getItem('cart')||'[]');
                cart[idx].qty = val;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCart();
            });
        });
    }

    // --- Fungsi Hapus Item ---
    window.removeItem = function(idx){
        let cart = JSON.parse(localStorage.getItem('cart')||'[]');
        cart.splice(idx,1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }

    // --- Fungsi Kosongkan Keranjang (Tambahan) ---
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.onclick = function() {
            if (confirm('Anda yakin ingin mengosongkan seluruh isi keranjang?')) {
                localStorage.removeItem('cart');
                loadCart();
            }
        };
    }
    
    // --- Event Submit Form Order ---
    document.getElementById('checkoutForm').addEventListener('submit', function(e){
        e.preventDefault();
        
        // MENGGANTI ID INPUT AGAR SESUAI DENGAN HTML DASHBOARD
        const nama = document.getElementById('recipientName').value.trim();
        const email = document.getElementById('recipientEmail').value.trim();
        const alamat = document.getElementById('recipientAddress').value.trim();
        const kurir = document.getElementById('courier').value.trim();
        const layanan = document.getElementById('serviceType').value.trim();
        const metode = document.getElementById('paymentMethod').value.trim();
        
        if(!nama || !email || !alamat || !kurir || !layanan || !metode) return alert('Mohon lengkapi semua data pemesan dan pengiriman.');
        
        const cart = JSON.parse(localStorage.getItem('cart')||'[]');
        if(cart.length===0) return alert('Keranjang kosong. Tidak bisa memproses pesanan.');
        
        const orders = JSON.parse(localStorage.getItem('orders')||'[]');
        const id = 'DO' + Date.now();
        const total = cart.reduce((s,it)=>s+it.harga*it.qty,0);
        
        const order = { 
            id, nama, email, alamat, kurir, layanan, metode,
            cart, total, 
            tanggal: new Date().toISOString(), 
            status: 'Baru' 
        };
        
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Simulasi pengurangan stok (dari js/stok.js sebelumnya)
        let katalog = JSON.parse(localStorage.getItem('katalog') || JSON.stringify(dataKatalogBuku));
        cart.forEach(item => {
            const index = katalog.findIndex(b => b.id === item.id);
            if (index !== -1) {
                katalog[index].stok = Math.max(0, katalog[index].stok - item.qty);
            }
        });
        localStorage.setItem('katalog', JSON.stringify(katalog));
        
        localStorage.removeItem('cart');
        alert('Pesanan berhasil! Nomor DO Anda: ' + id);
        
        // Redirect ke halaman tracking dengan nomor DO
        window.location.href = 'tracking.html?do=' + id;
    });

    // --- Muat Keranjang Saat Halaman Dibuka ---
    loadCart();
})();