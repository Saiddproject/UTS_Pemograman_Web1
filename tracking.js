(function(){
  const input = document.getElementById('doInput');
  const btn = document.getElementById('cariBtn');
  const result = document.getElementById('result');

  function showOrder(order){
    if(!order) {
      return result.innerHTML = '<p class="alert alert-warning">Order tidak ditemukan.</p>';
    }

    const progress = order.progress || 20;
    
    // Logika Status Pengiriman: Jika status BUKAN 'Baru', maka dianggap Sedang Dikirim.
    const isShipped = order.status !== 'Baru'; 

    // Tentukan teks status yang akan ditampilkan kepada pengguna.
    // Jika isShipped TRUE, tampilkan 'Sedang Dikirim', jika FALSE, gunakan status asli (mis. 'Baru').
    const displayedStatus = isShipped 
        ? 'Sedang Dikirim' 
        : order.status; 
    
    // Tentukan kelas CSS untuk warna.
    const statusClass = isShipped ? 'text-success' : '';

    // --- PERBAIKAN: Menggunakan displayedStatus dan statusClass di baris Status ---
    result.innerHTML = `
      <h4>${order.id} — ${order.nama}</h4>
      <p>Status: <strong class="${statusClass}">${displayedStatus}</strong></p> 
      
      <p>Tanggal: ${new Date(order.tanggal).toLocaleString()}</p>
      <p>Total: Rp ${order.total.toLocaleString()}</p>
      
      <hr> 
      <p><strong>Email:</strong> ${order.email || 'N/A'}</p> 
      <p><strong>Alamat:</strong> ${order.alamat || 'N/A'}</p>
      <hr>

      <div class="progress"><div class="progress-bar" style="width:${Math.min(progress,100)}%"></div></div>
      <h5>Detail Paket</h5>
      <ul>
        <li>Kurir: ${order.kurir||'JNE'}</li>
        <li>Jenis Paket: ${order.jenis||'Reguler'}</li>
      </ul>
    `;
  }

  btn.addEventListener('click', function(){
    const key = input.value.trim();
    // Mengambil data orders dari localStorage
    const orders = JSON.parse(localStorage.getItem('orders')||'[]');
    const found = orders.find(o=>o.id===key);
    showOrder(found);
  });

  // if param ?do= present, auto search
  const params = new URLSearchParams(location.search);
  if(params.has('do')){
    input.value = params.get('do');
    // Memastikan tombol ada sebelum mengklik
    if(btn) {
      btn.click();
    }
  }
})();