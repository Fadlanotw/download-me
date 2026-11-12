import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Masuk | SPMB SMA Garuda Utama",
  description: "Masuk ke akun pendaftaran SPMB SMA Garuda Utama.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
