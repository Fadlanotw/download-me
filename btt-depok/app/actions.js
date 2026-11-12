'use server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getUser, setSession, clearSession } from '@/lib/auth';
import { BERKAS, STATUS } from '@/lib/constants';

const s = (fd, k) => String(fd.get(k) || '').trim();
const err = (to, m) => redirect(`${to}?err=${encodeURIComponent(m)}`);

export async function daftar(fd) {
  const d = { nama: s(fd, 'nama'), nik: s(fd, 'nik'), email: s(fd, 'email').toLowerCase(), telp: s(fd, 'telp'), pw: s(fd, 'password') };
  if (!d.nama || !/^\d{16}$/.test(d.nik) || !d.email.includes('@') || d.pw.length < 6) err('/daftar', 'Lengkapi data: NIK harus 16 digit, kata sandi minimal 6 karakter.');
  let u;
  try { u = await prisma.user.create({ data: { nama: d.nama, nik: d.nik, email: d.email, telp: d.telp, password: await bcrypt.hash(d.pw, 10) } }); }
  catch { err('/daftar', 'NIK atau email sudah terdaftar.'); }
  setSession(u.id); redirect('/dashboard');
}
export async function masuk(fd) {
  const u = await prisma.user.findUnique({ where: { email: s(fd, 'email').toLowerCase() } });
  if (!u || !(await bcrypt.compare(s(fd, 'password'), u.password))) err('/masuk', 'Email atau kata sandi salah.');
  setSession(u.id); redirect(u.role === 'admin' ? '/admin' : '/dashboard');
}
export async function keluar() { clearSession(); redirect('/'); }

export async function ajukan(fd) {
  const u = await getUser(); if (!u) redirect('/masuk');
  const f = { jenisBencana: s(fd, 'jenisBencana'), tgl: s(fd, 'tanggalKejadian'), alamat: s(fd, 'alamat'), kelurahan: s(fd, 'kelurahan'), kecamatan: s(fd, 'kecamatan'), uraian: s(fd, 'uraian') };
  if (Object.values(f).some((v) => !v)) err('/dashboard/ajukan', 'Semua kolom data wajib diisi.');
  const kode = `BTT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const dir = path.join(process.cwd(), 'uploads', kode); await fs.mkdir(dir, { recursive: true });
  const berkas = {};
  for (const [k, label, wajib] of BERKAS) {
    const file = fd.get(k);
    if (!file || !file.size) { if (wajib) err('/dashboard/ajukan', `Berkas wajib belum diunggah: ${label}`); continue; }
    const ext = path.extname(file.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.pdf'].includes(ext) || file.size > 3e6) err('/dashboard/ajukan', `${label}: gunakan JPG/PNG/PDF maksimal 3 MB.`);
    await fs.writeFile(path.join(dir, k + ext), Buffer.from(await file.arrayBuffer())); berkas[k] = k + ext;
  }
  await prisma.permohonan.create({ data: { kode, userId: u.id, jenisBencana: f.jenisBencana, tanggalKejadian: new Date(f.tgl), alamat: f.alamat, kelurahan: f.kelurahan, kecamatan: f.kecamatan, uraian: f.uraian, berkas: JSON.stringify(berkas), riwayat: { create: { status: 'DIAJUKAN', catatan: 'Permohonan diterima sistem.' } } } });
  redirect('/dashboard?ok=' + kode);
}

export async function updateStatus(id, fd) {
  const u = await getUser(); if (!u || u.role !== 'admin') redirect('/masuk');
  const status = s(fd, 'status'); if (!STATUS[status]) return;
  const nominal = parseInt(s(fd, 'nominal')) || null;
  await prisma.permohonan.update({ where: { id }, data: { status, tingkatKerusakan: s(fd, 'tingkatKerusakan') || null, nominal, nomorSK: s(fd, 'nomorSK') || null, riwayat: { create: { status, catatan: s(fd, 'catatan') || null } } } });
  revalidatePath('/admin'); redirect(`/admin/${id}?ok=1`);
}
