'use server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getUser, setSession, clearSession } from '@/lib/auth';
import { BERKAS, ALUR, ROLES, STAF, PORTAL, STATUS } from '@/lib/constants';
import { cekCaptcha } from '@/lib/captcha';
import { batas, ipPengguna } from '@/lib/ratelimit';
import { kirimEmail, emailAktif } from '@/lib/email';
import { buatToken, bacaToken } from '@/lib/reset';

const s = (fd, k) => String(fd.get(k) || '').trim();
const err = (to, m) => redirect(`${to}?err=${encodeURIComponent(m)}`);
function baseUrl() { if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, ''); const h = headers(); return `${h.get('x-forwarded-proto') || 'http'}://${h.get('host')}`; }

export async function daftar(fd) {
  if (!batas('daftar:' + ipPengguna(), 5, 10 * 60000)) err('/daftar', 'Terlalu banyak pendaftaran dari perangkat ini. Coba lagi beberapa menit lagi.');
  if (s(fd, 'website') || !cekCaptcha(s(fd, 'ctoken'), s(fd, 'cjawab'))) err('/daftar', 'Jawaban soal keamanan salah atau sudah kedaluwarsa. Coba lagi.');
  const d = { nama: s(fd, 'nama'), nik: s(fd, 'nik'), email: s(fd, 'email').toLowerCase(), telp: s(fd, 'telp'), pw: s(fd, 'password') };
  if (!d.nama || !/^\d{16}$/.test(d.nik) || !d.email.includes('@') || d.pw.length < 6) err('/daftar', 'Lengkapi data: NIK harus 16 digit, kata sandi minimal 6 karakter.');
  let u;
  try { u = await prisma.user.create({ data: { nama: d.nama, nik: d.nik, email: d.email, telp: d.telp, password: await bcrypt.hash(d.pw, 10) } }); }
  catch { err('/daftar', 'NIK atau email sudah terdaftar.'); }
  setSession(u.id, 'warga'); redirect('/dashboard');
}
export async function masuk(portal, fd) {
  const P = PORTAL[portal]; if (!P) redirect('/');
  const to = `/portal/${portal}`, email = s(fd, 'email').toLowerCase();
  const ip = (headers().get('x-forwarded-for') || 'lokal').split(',')[0].trim();
  const gagal = await prisma.logAkses.count({ where: { email, berhasil: false, createdAt: { gt: new Date(Date.now() - 15 * 60000) } } });
  if (gagal >= 5) err(to, 'Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.');
  const gagalIp = await prisma.logAkses.count({ where: { ip, berhasil: false, createdAt: { gt: new Date(Date.now() - 15 * 60000) } } });
  if (gagalIp >= 30) err(to, 'Terlalu banyak percobaan gagal dari perangkat ini. Coba lagi dalam 15 menit.');
  const u = await prisma.user.findUnique({ where: { email } });
  const ok = !!u && P.roles.includes(u.role) && (await bcrypt.compare(s(fd, 'password'), u.password));
  await prisma.logAkses.create({ data: { email, portal, berhasil: ok, ip, userId: u ? u.id : null } });
  if (!ok) err(to, 'Email atau kata sandi salah, atau akun tidak terdaftar pada portal ini.');
  setSession(u.id, portal); redirect(P.home);
}
export async function keluar() { clearSession(); redirect('/'); }

export async function ajukan(fd) {
  const u = await getUser(); if (!u || u.role !== 'warga') redirect('/portal/warga');
  const f = { jenisBencana: s(fd, 'jenisBencana'), tgl: s(fd, 'tanggalKejadian'), alamat: s(fd, 'alamat'), kelurahan: s(fd, 'kelurahan'), kecamatan: s(fd, 'kecamatan'), uraian: s(fd, 'uraian') };
  const tipe = s(fd, 'tipe') || 'Individu', pengusul = s(fd, 'pengusul');
  if (Object.values(f).some((v) => !v)) err('/dashboard/ajukan', 'Semua kolom data wajib diisi.');
  if (tipe !== 'Individu' && !pengusul) err('/dashboard/ajukan', 'Isi nama RT/RW/Kelurahan/Kecamatan pengusul.');
  const kode = `BTT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const dir = path.join(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'), kode); await fs.mkdir(dir, { recursive: true });
  const berkas = {};
  for (const [k, label, wajib] of BERKAS) {
    const file = fd.get(k);
    if (!file || !file.size) { if (wajib) err('/dashboard/ajukan', `Berkas wajib belum diunggah: ${label}`); continue; }
    const ext = path.extname(file.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.pdf'].includes(ext) || file.size > 3e6) err('/dashboard/ajukan', `${label}: gunakan JPG/PNG/PDF maksimal 3 MB.`);
    await fs.writeFile(path.join(dir, k + ext), Buffer.from(await file.arrayBuffer())); berkas[k] = k + ext;
  }
  await prisma.permohonan.create({ data: { kode, userId: u.id, jenisBencana: f.jenisBencana, tanggalKejadian: new Date(f.tgl), alamat: f.alamat, kelurahan: f.kelurahan, kecamatan: f.kecamatan, uraian: f.uraian, tipe, pengusul: pengusul || null, berkas: JSON.stringify(berkas), riwayat: { create: { status: 'DIAJUKAN', catatan: 'Permohonan diterima sistem, menunggu disposisi Wali Kota.' } } } });
  void kirimEmail(u.email, `Permohonan ${kode} diterima`, `Halo ${u.nama},\n\nPermohonan Anda sudah kami terima dengan kode ${kode}. Simpan kode ini untuk memantau status di ${baseUrl()}/cek?kode=${kode}`);
  redirect('/dashboard?ok=' + kode);
}

// Memproses satu tahap alur: hanya petugas pemilik tahap (atau super admin).
export async function proses(id, fd) {
  const u = await getUser(); if (!u || u.role === 'warga') redirect('/masuk');
  const p = await prisma.permohonan.findUnique({ where: { id } }); if (!p) redirect('/admin');
  const to = `/admin/${id}`, a = ALUR[p.status];
  if (!a || !a.role || (u.role !== 'admin' && u.role !== a.role)) err(to, 'Ini bukan tahap yang menjadi tugas Anda.');
  const tolak = s(fd, 'keputusan') === 'tolak', catatan = s(fd, 'catatan');
  if (tolak && !catatan) err(to, 'Alasan penolakan wajib diisi.');
  const data = {};
  if (!tolak) for (const f of a.fields || []) {
    const v = s(fd, f); if (!v) err(to, 'Lengkapi semua isian tahap ini.');
    data[f] = f === 'nominal' ? parseInt(v) || 0 : v;
  }
  const status = tolak ? 'DITOLAK' : a.next;
  await prisma.permohonan.update({ where: { id }, data: { ...data, status, tahapMulai: new Date(), riwayat: { create: { status, catatan: `${ROLES[u.role]}${catatan ? ': ' + catatan : ''}` } } } });
  const pem = await prisma.user.findUnique({ where: { id: p.userId } });
  if (pem) void kirimEmail(pem.email, `Status permohonan ${p.kode} diperbarui`, `Halo ${pem.nama},\n\nStatus permohonan ${p.kode} kini: ${STATUS[status] || status}.${tolak && catatan ? '\nAlasan: ' + catatan : ''}\n\nPantau di ${baseUrl()}/cek?kode=${p.kode}`);
  revalidatePath('/admin'); revalidatePath('/admin/persetujuan');
  redirect(u.role === 'admin' ? `${to}?ok=1` : '/admin/persetujuan?ok=1');
}

export async function buatStaf(fd) {
  const u = await getUser(); if (!u || u.role !== 'admin') redirect('/masuk');
  const role = s(fd, 'role'), email = s(fd, 'email').toLowerCase(), pw = s(fd, 'password'), nama = s(fd, 'nama');
  if (!STAF.includes(role) || !nama || !email.includes('@') || pw.length < 6) err('/admin/pengguna', 'Data petugas belum lengkap (kata sandi min. 6 karakter).');
  try { await prisma.user.create({ data: { nama, email, role, password: await bcrypt.hash(pw, 10), nik: 'STAF-' + Date.now() } }); }
  catch { err('/admin/pengguna', 'Email sudah terdaftar.'); }
  redirect('/admin/pengguna?ok=1');
}

export async function gantiSandi(fd) {
  const u = await getUser(); if (!u) redirect('/masuk');
  const lama = s(fd, 'lama'), baru = s(fd, 'baru');
  if (!(await bcrypt.compare(lama, u.password))) err('/akun/sandi', 'Kata sandi lama salah.');
  if (baru.length < 8 || baru !== s(fd, 'ulang')) err('/akun/sandi', 'Kata sandi baru minimal 8 karakter dan harus sama dengan pengulangannya.');
  await prisma.user.update({ where: { id: u.id }, data: { password: await bcrypt.hash(baru, 10) } });
  redirect('/akun/sandi?ok=1');
}

export async function mintaReset(fd) {
  if (!emailAktif()) err('/lupa-sandi', 'Pengiriman email belum diaktifkan.');
  if (!batas('reset:' + ipPengguna(), 5, 15 * 60000)) err('/lupa-sandi', 'Terlalu banyak permintaan. Coba lagi beberapa menit lagi.');
  const email = s(fd, 'email').toLowerCase();
  const u = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (u && u.role === 'warga') await kirimEmail(u.email, 'Atur ulang kata sandi – Layanan BTT Kota Depok', `Halo ${u.nama},\n\nGunakan tautan berikut untuk membuat kata sandi baru (berlaku 1 jam):\n${baseUrl()}/reset-sandi?t=${buatToken(u)}\n\nAbaikan email ini jika Anda tidak memintanya.`);
  redirect('/lupa-sandi?ok=1');
}

export async function setelSandi(t, fd) {
  const u = await bacaToken(t); if (!u) redirect('/lupa-sandi');
  const baru = s(fd, 'baru');
  if (baru.length < 8 || baru !== s(fd, 'ulang')) redirect(`/reset-sandi?t=${encodeURIComponent(t)}&err=${encodeURIComponent('Kata sandi minimal 8 karakter dan harus sama dengan pengulangannya.')}`);
  await prisma.user.update({ where: { id: u.id }, data: { password: await bcrypt.hash(baru, 10) } });
  redirect('/portal/warga?ok=' + encodeURIComponent('Kata sandi sudah diganti. Silakan masuk.'));
}
