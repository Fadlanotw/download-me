import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import db from "@/lib/db";

// font bawaan PDF hanya mendukung karakter Latin, jadi tanda baca khusus diganti
const bersih = (t) =>
  String(t ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\n\x20-\x7E\xA0-\xFF]/g, "");

function bungkus(text, font, size, maxWidth) {
  const lines = [];
  for (const para of bersih(text).split("\n")) {
    if (!para.trim()) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    lines.push(line);
  }
  return lines;
}

const ROMAWI = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const INISIAL_ATAS_KANAN = "MF";
const INISIAL_BAWAH_KIRI = "MS";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [rows] = await db.query(
      "SELECT id, judul, isi, published_at FROM pengumuman WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return Response.json({ error: "Pengumuman tidak ditemukan" }, { status: 404 });
    }
    const p = rows[0];
    const tanggal = p.published_at ? new Date(p.published_at) : new Date();

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.TimesRoman);
    const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
    const W = 595.28;
    const H = 841.89;
    const M = 64;
    let page = pdf.addPage([W, H]);
    let y = H - M;

    const ensure = (need) => {
      if (y - need < M) {
        page = pdf.addPage([W, H]);
        y = H - M;
      }
    };

    const tengah = (text, size, f = font) => {
      ensure(size + 6);
      const t = bersih(text);
      const w = f.widthOfTextAtSize(t, size);
      page.drawText(t, { x: (W - w) / 2, y, size, font: f });
      y -= size + 6;
    };

    const paragraf = (text, size = 12, f = font) => {
      for (const line of bungkus(text, f, size, W - 2 * M)) {
        ensure(size + 5);
        if (line) page.drawText(line, { x: M, y, size, font: f });
        y -= size + 5;
      }
    };

    // Kop surat
    tengah("PANITIA SPMB GARUDA UTAMA", 16, bold);
    tengah("Penerimaan Murid Baru Tahun Akademik 2026/2027", 11);
    page.drawLine({
      start: { x: M, y: y + 2 },
      end: { x: W - M, y: y + 2 },
      thickness: 1.2,
      color: rgb(0, 0, 0),
    });
    y -= 22;

    // Judul surat
    tengah("SURAT KEPUTUSAN KELULUSAN", 14, bold);
    const nomor = `${String(p.id).padStart(3, "0")}/SPMB-GU/${ROMAWI[tanggal.getMonth()]}/${tanggal.getFullYear()}`;
    tengah(`Nomor: ${nomor}`, 11);
    y -= 14;

    // Isi
    paragraf(p.judul, 12, bold);
    y -= 6;
    paragraf(p.isi, 12);

    // Tanda tangan
    ensure(130);
    y -= 24;
    const x = W - M - 210;
    page.drawText(
      bersih(tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })),
      { x, y, size: 12, font }
    );
    y -= 16;
    page.drawText("Ketua Panitia SPMB", { x, y, size: 12, font });
    y -= 72;
    page.drawText("(........................................)", { x, y, size: 12, font });

    
    const pages = pdf.getPages();
pages.forEach((pg, i) => {
  const abu = rgb(0.4, 0.4, 0.4);

  const atas = bersih(INISIAL_ATAS_KANAN);
  pg.drawText(atas, {
    x: W - 40 - font.widthOfTextAtSize(atas, 9),
    y: H - 30,
    size: 9,
    font,
    color: abu,
  });

  pg.drawText(bersih(`${INISIAL_BAWAH_KIRI}/${i + 1}`), {
    x: 40,
    y: 30,
    size: 9,
    font,
    color: abu,
  });
});const bytes = await pdf.save();
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SK-Kelulusan-${p.id}.pdf"`,
      },
    });
  } catch (err) {
    console.error("SK PDF ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}