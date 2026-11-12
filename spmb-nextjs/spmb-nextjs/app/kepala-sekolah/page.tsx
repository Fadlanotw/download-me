import Link from "next/link";
import { redirect } from "next/navigation";
import PrincipalLogoutButton from "./logout-button";
import { getPrincipalSession } from "@/lib/admin-auth";
import SchoolCrest from "../components/school-crest";

export const runtime = "nodejs";

export default async function PrincipalPortalPage() {
  const principal = await getPrincipalSession();
  if (!principal) redirect("/kepala-sekolah/login");

  return (
    <main className="principal-portal-page">
      <section className="principal-portal-card">
        <Link className="portal-school-brand" href="/" aria-label="SMA Garuda Utama">
          <SchoolCrest />
          <span><strong>GARUDA UTAMA</strong><small>SPMB ONLINE</small></span>
        </Link>
        <h1>Selamat datang, Kepala Sekolah</h1>
        <p>
          Akun {principal.identifier} telah terverifikasi. Ringkasan kinerja dan persetujuan
          sekolah akan tersedia di portal ini.
        </p>
        <PrincipalLogoutButton />
      </section>
    </main>
  );
}
