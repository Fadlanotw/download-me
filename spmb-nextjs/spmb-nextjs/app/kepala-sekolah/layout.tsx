import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Portal Kepala Sekolah | SMA Garuda Utama",
  description: "Portal kepala sekolah SPMB SMA Garuda Utama.",
};

export default function PrincipalLayout({ children }: { children: ReactNode }) {
  return children;
}
