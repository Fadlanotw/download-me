import "./globals.css";

export const metadata = {
  title: "SPMB",
  description: "Project SPMB dengan Next.js, JavaScript, Laragon dan MySQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
