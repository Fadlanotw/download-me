const form = document.getElementById('login-form');
const errorEl = document.getElementById('form-error');

document.querySelectorAll('.btn-social').forEach((btn) => {
  btn.addEventListener('click', () => {
    alert(`Login dengan ${btn.dataset.provider} belum dikonfigurasi (perlu OAuth app credentials).`);
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  const submitBtn = form.querySelector('.btn-login');
  const email = form.email.value.trim();
  const password = form.password.value;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Memproses…';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || 'Login gagal.';
      return;
    }

    submitBtn.textContent = 'Berhasil!';
    alert(`Selamat datang, ${data.name}!`);
  } catch (err) {
    errorEl.textContent = 'Tidak bisa terhubung ke server.';
  } finally {
    submitBtn.disabled = false;
    if (submitBtn.textContent !== 'Berhasil!') submitBtn.textContent = 'Login';
  }
});
