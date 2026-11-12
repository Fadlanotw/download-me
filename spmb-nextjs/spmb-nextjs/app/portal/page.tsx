import Link from "next/link";
import SchoolCrest from "../components/school-crest";

export const metadata = {
  title: "Pilih Portal | SMA Garuda Utama",
  description: "Pilih portal sekolah SMA Garuda Utama.",
};

export default function PortalSelectionPage() {
  return (
    <main className="principal-portal-page">
      <section className="principal-portal-card">
        <Link className="portal-school-brand" href="/" aria-label="SMA Garuda Utama">
          <SchoolCrest />
          <span><strong>GARUDA UTAMA</strong><small>SPMB ONLINE</small></span>
        </Link>
        <h1>Pilih portal masuk</h1>
        <p>Silakan pilih akses sesuai peran Anda di SMA Garuda Utama.</p>
        <div className="portal-role-links">
          <Link href="/admin/login">Masuk sebagai Admin</Link>
          <Link href="/kepala-sekolah/login">Masuk sebagai Kepala Sekolah</Link>
          <Link href="/login">Masuk sebagai Pendaftar</Link>
        </div>
      </section>
    </main>
  );
}
