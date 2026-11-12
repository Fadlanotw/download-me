"use client";

import AdminShell from "../_components/AdminShell";
import PengumumanSection from "./PengumumanSection";
import s from "./page.module.css";

export default function PengumumanPage() {
  return (
    <AdminShell breadcrumb="Pengumuman">
      <div className={s.wrap}>
        <PengumumanSection />
      </div>
    </AdminShell>
  );
}