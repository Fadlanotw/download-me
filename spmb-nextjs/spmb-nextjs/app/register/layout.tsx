import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pendaftaran SPMB | SMA Garuda Utama",
  description: "Formulir pendaftaran murid baru SMA Garuda Utama tahun ajaran 2026/2027.",
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
