import styles from "./pendaftar.module.css";

// Ganti dengan data asli dari database bila sudah tersedia
const dataContoh = [
  { nama: "Arissa Zulaikha", jurusan: "PPLG (RPL)", tanggal: "12 Feb 2026", status: "Terverifikasi" },
  { nama: "Baskara Putra", jurusan: "PPLG (RPL)", tanggal: "12 Feb 2026", status: "Terverifikasi" },
  { nama: "Raka Oktadiansyah", jurusan: "MPLB (Layanan Bisnis)", tanggal: "11 Feb 2026", status: "Menunggu" },
  { nama: "Ahmad Miftahul Khair", jurusan: "Pemasaran (BDR)", tanggal: "11 Feb 2026", status: "Terverifikasi" },
  { nama: "Arbia Corrona Aldo", jurusan: "MPLB (Layanan Bisnis)", tanggal: "10 Feb 2026", status: "Ditolak" },
];

const kelasStatus = {
  Terverifikasi: styles.ok,
  Menunggu: styles.wait,
  Ditolak: styles.no,
};

export default function PendaftarTerbaru({ data = dataContoh }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colNo}>No</th>
            <th>Nama Lengkap</th>
            <th>Jurusan</th>
            <th className={styles.colTgl}>Tanggal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={`${p.nama}-${i}`}>
              <td className={styles.colNo}>{i + 1}</td>
              <td className={styles.nama}>{p.nama}</td>
              <td className={styles.jurusan}>{p.jurusan}</td>
              <td className={styles.colTgl}>{p.tanggal}</td>
              <td>
                <span className={`${styles.pill} ${kelasStatus[p.status] ?? ""}`}>
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
