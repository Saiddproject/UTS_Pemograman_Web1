// js/stok.js

(function(){
    // Pastikan dataKatalogBuku sudah dimuat dari data.js
    if (typeof dataKatalogBuku === 'undefined') {
        console.error("dataKatalogBuku tidak ditemukan. Pastikan js/data.js dimuat sebelum js/stok.js");
        return;
    }

    const tbody = document.querySelector('#tableBuku tbody');
    const addBookForm = document.getElementById('addBookForm');

    // Fungsi untuk merender seluruh tabel
    function render() {
        tbody.innerHTML = '';
        
        // Menghitung total judul untuk ditampilkan di header
        const totalJudulText = document.querySelector('h3');
        if (totalJudulText) {
            // Menghilangkan bintang di Total Judul
            totalJudulText.innerHTML = `<span class="material-symbols-rounded" style="font-size: 20px;">list_alt</span> Daftar Buku (Total Judul: ${dataKatalogBuku.length})`;
        }

        dataKatalogBuku.forEach(b => {
            // Tentukan class CSS berdasarkan jumlah stok
            let stokClass = 'stok-high'; 
            if (b.stok < 10 && b.stok > 0) {
                stokClass = 'stok-limited'; // Kuning (stok 1-9)
            }
            if (b.stok <= 0) {
                stokClass = 'stok-out'; // Merah (stok 0)
                b.stok = 0; // Pastikan stok tidak negatif
            }
            
            // Tentukan path gambar, gunakan placeholder jika tidak ada
            const imagePath = b.gambar || 'img/placeholder.jpg'; 

            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${b.id}</td>
                            <td class="judul-cell">
                                <img src="${imagePath}" alt="${b.judul}" class="buku-thumbnail">
                                <span>${b.judul}</span>
                            </td>
                            <td>${b.penulis || '-'}</td>
                            <td>Rp ${b.harga.toLocaleString('id-ID')}</td>
                            <td class="${stokClass}">${b.stok}</td>
                            <td>
                                <button class="btn small btn-pesan" data-id="${b.id}" ${b.stok <= 0 ? 'disabled' : ''}>Pesan</button>
                                <button class="btn small ghost btn-edit-data" data-id="${b.id}">Edit</button>
                                <button class="btn small btn-delete-data" data-id="${b.id}">Hapus</button>
                            </td>`;
            tbody.appendChild(tr);
        });
        
        attachTableEvents(); // Panggil fungsi untuk melampirkan event listener
    }
    
    // ... (Fungsi attachTableEvents, addToCart, editRow, deleteRow tetap sama)
    function attachTableEvents() {
        // Event Pesan
        document.querySelectorAll('.btn-pesan').forEach(button => {
            button.onclick = function() {
                window.addToCart(Number(this.dataset.id));
            };
        });

        // Event Edit (Menggunakan fungsi editRow)
        document.querySelectorAll('.btn-edit-data').forEach(button => {
            button.onclick = function() {
                window.editRow(Number(this.dataset.id));
            };
        });
        
        // Event Hapus (Tambahan fungsionalitas Delete)
        document.querySelectorAll('.btn-delete-data').forEach(button => {
            button.onclick = function() {
                window.deleteRow(Number(this.dataset.id));
            };
        });
    }

    // 1. Tambah ke Keranjang (addToCart)
    window.addToCart = function(id) {
        const buku = dataKatalogBuku.find(x => x.id === id);
        if (!buku || buku.stok <= 0) return alert('Stok buku habis atau tidak ditemukan.');

        // send to checkout via localStorage
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const found = cart.find(it => it.id === id);

        if (found) {
            found.qty++;
        } else {
            // Pastikan properti yang dikirim ke cart minimal: id, judul, harga, qty
            cart.push({ id: buku.id, judul: buku.judul, harga: buku.harga, qty: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Buku "${buku.judul}" ditambahkan ke keranjang.`);
    };

    // 2. Edit Data Buku (editRow)
    window.editRow = function(id) {
        const buku = dataKatalogBuku.find(x => x.id === id);
        if (!buku) return alert('Buku tidak ditemukan');

        // Menggunakan prompt untuk kemudahan
        const judul = prompt('Judul Buku Baru:', buku.judul);
        if (judul === null) return;
        buku.judul = judul.trim();
        
        const penulis = prompt('Penulis Baru:', buku.penulis || '');
        if (penulis !== null) buku.penulis = penulis.trim();

        const harga = prompt('Harga Baru:', buku.harga);
        if (harga !== null) buku.harga = Number(harga) || buku.harga;
        
        const stok = prompt('Stok Baru:', buku.stok);
        if (stok !== null) buku.stok = Number(stok) || buku.stok;
        
        // Tambahan: prompt untuk path gambar
        const gambar = prompt('Path Gambar Baru (misal: img/judul.jpg):', buku.gambar || '');
        if (gambar !== null) buku.gambar = gambar.trim();


        render();
    };
    
    // 3. Hapus Data Buku (deleteRow - Tambahan)
    window.deleteRow = function(id) {
        const index = dataKatalogBuku.findIndex(x => x.id === id);
        if (index === -1) return alert('Buku tidak ditemukan');

        if (confirm(`Anda yakin ingin menghapus buku "${dataKatalogBuku[index].judul}"?`)) {
            dataKatalogBuku.splice(index, 1);
            render();
            alert('Buku berhasil dihapus dari katalog.');
        }
    }


    // --- Form Submission ---

    // Fungsi untuk generate ID baru yang unik
    function generateNewId() {
        return dataKatalogBuku.length > 0 
               ? Math.max(...dataKatalogBuku.map(x => x.id)) + 1 
               : 1;
    }

    addBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const judul = document.getElementById('newJudul').value.trim();
        const penulis = document.getElementById('newPenulis').value.trim();
        const harga = Number(document.getElementById('newHarga').value);
        const stok = Number(document.getElementById('newStok').value);
        
        if (!judul || !penulis || isNaN(harga) || isNaN(stok) || harga <= 0 || stok < 0) {
            alert('Mohon lengkapi data buku dengan benar (harga harus > 0, stok >= 0).');
            return;
        }

        const id = generateNewId();
        // Ketika buku baru ditambahkan, properti 'gambar' tidak ada, sehingga akan menggunakan placeholder
        dataKatalogBuku.push({ id, judul, penulis, harga, stok, gambar: 'img/placeholder.jpg' }); 
        
        render();
        e.target.reset();
        alert(`Buku "${judul}" berhasil ditambahkan.`);
    });

    // Initial render
    render();
})();