// Pengiriman email lewat SMTP. Aktif hanya jika SMTP_HOST diisi di .env.
export const emailAktif = () => !!process.env.SMTP_HOST;
export async function kirimEmail(to, subjek, teks) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !to) return false;
  try {
    const nm = (await import('nodemailer')).default, port = Number(SMTP_PORT || 587);
    const t = nm.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined });
    await t.sendMail({ from: SMTP_FROM || SMTP_USER, to, subject: subjek, text: teks });
    return true;
  } catch (e) { console.error('Email gagal dikirim:', e.message); return false; }
}
