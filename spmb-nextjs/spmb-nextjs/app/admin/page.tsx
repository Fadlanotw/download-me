import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLogoutButton from "./admin-logout-button";
import { getAdminSession } from "@/lib/admin-auth";
import SchoolCrest from "../components/school-crest";

export const runtime = "nodejs";

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link className="admin-dashboard-brand" href="/" aria-label="SMA Garuda Utama">
          <SchoolCrest className="admin-brand-crest" />
          <span><strong>GARUDA UTAMA</strong><small>ADMINISTRATOR</small></span>
        </Link>
        <nav className="admin-navigation" aria-label="Navigasi admin">
          <span className="admin-nav-label">MENU UTAMA</span>
          <span className="admin-nav-item admin-nav-active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="5" rx="1.5" /><rect x="13" y="10" width="8" height="11" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" />
            </svg>
            Ringkasan
          </span>
          <span className="admin-nav-item admin-nav-disabled" aria-disabled="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M16 20v-1.5a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4V20m15 0v-1.5a4 4 0 0 0-3-3.87M14 4.13a4 4 0 0 1 0 7.75M10 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Data Pendaftar
            <small>Belum tersedia</small>
          </span>
        </nav>
        <div className="admin-sidebar-footer">SPMB TAHUN AJARAN 2026/2027</div>
      </aside>

      <section className="admin-main-panel">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar-kicker">PANEL ADMINISTRASI</span>
            <h1>Ringkasan</h1>
          </div>
          <div className="admin-user-actions">
            <div className="admin-user-avatar" aria-hidden="true">{admin.username.slice(0, 1).toUpperCase()}</div>
            <span className="admin-current-user">{admin.username}</span>
            <AdminLogoutButton />
          </div>
        </header>

        <div className="admin-dashboard-content">
          <section className="admin-welcome-card">
            <span className="admin-eyebrow">SPMB GARUDA UTAMA</span>
            <h2>Selamat datang, {admin.username}</h2>
            <p>Anda masuk ke area administrasi dengan sesi yang aman.</p>
          </section>

          <div className="admin-section-heading">
            <div>
              <h2>Status sistem</h2>
              <p>Informasi ketersediaan fitur administrasi.</p>
            </div>
          </div>

          <div className="admin-status-grid">
            <article className="admin-status-card">
              <span className="admin-card-icon admin-card-icon-gold" aria-hidden="true">✓</span>
              <span className="admin-card-label">Akses administrator</span>
              <strong>Aktif</strong>
              <small>Akun {admin.username} berhasil diautentikasi.</small>
            </article>
            <article className="admin-status-card">
              <span className="admin-card-icon admin-card-icon-blue" aria-hidden="true">◷</span>
              <span className="admin-card-label">Data pendaftaran</span>
              <strong>Belum terhubung</strong>
              <small>Formulir pendaftaran belum menyimpan data ke database.</small>
            </article>
          </div>

          <div className="admin-setup-notice">
            <strong>Pengelolaan data pendaftar belum tersedia</strong>
            <p>
              Login admin dan database akun sudah aktif. Agar data murid dapat ditampilkan di sini,
              formulir pendaftaran perlu dihubungkan ke penyimpanan data pendaftar.
            </p>
            <Link href="/">Lihat halaman pendaftaran</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
