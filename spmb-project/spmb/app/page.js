export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Project SPMB</h1>
      <p className="text-gray-600">Next.js berhasil berjalan.</p>
      <a href="/api/test-db" className="text-blue-600 underline">
        Uji koneksi database
      </a>
    </main>
  );
}
