import "./globals.css";

export const metadata = {
  title: "Masuk",
  description: "Halaman login dengan Next.js dan SQLite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
