import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin SPMB | SMA Garuda Utama",
  description: "Panel administrasi SPMB SMA Garuda Utama.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
