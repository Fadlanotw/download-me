'use client';
import { useState } from 'react';
export default function LoginForm({ action, akun }) {
  const [email, setEmail] = useState(''), [pw, setPw] = useState('');
  return (<>
    <form action={action} className="form">
      <label>Email<input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Kata sandi<input name="password" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} /></label>
      <button className="btn">Masuk</button></form>
    {akun && <div className="demo"><b>Akun demo petugas</b> <small>(klik untuk mengisi otomatis)</small>
      {akun.map((a) => <button type="button" key={a[0]} onClick={() => { setEmail(a[0]); setPw(a[2]); }}><span>{a[1]}<br /><small>{a[0]}</small></span><small>{a[2]}</small></button>)}
      <small className="muted">Peran warga: daftar sendiri lewat menu Daftar. Matikan panel ini dengan DEMO_MODE=false di .env.</small></div>}
  </>);
}
