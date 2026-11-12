/**
 * Membuat Google Form "Input Gadai" - Gadai Plus (PT Gadai Sinar Abadi)
 * Cara pakai:
 * 1. Buka https://script.google.com -> Proyek baru
 * 2. Hapus isi Code.gs, tempel seluruh kode ini
 * 3. Klik Run (fungsi: buatFormGadai) -> izinkan akses
 * 4. Link form (edit & isi) muncul di Execution log; form juga masuk ke Google Drive
 */
function buatFormGadai() {
  var form = FormApp.create('Input Gadai - Gadai Plus');
  form.setDescription('PT Gadai Sinar Abadi (Gadai Plus)\nJl Kebayoran Lama No.22, Kebayoran Lama, Jakarta Selatan\nTelp 0811992283');
  form.setCollectEmail(false);
  form.setConfirmationMessage('Data gadai berhasil disimpan. Terima kasih.');

  var rupiah = FormApp.createTextValidation()
    .setHelpText('Isi angka saja tanpa titik/koma, contoh: 2500000')
    .requireNumber().build();
  var digit16 = FormApp.createTextValidation()
    .setHelpText('No. KTP harus 16 digit angka')
    .requireTextMatchesPattern('^[0-9]{16}$').build();
  var telp = FormApp.createTextValidation()
    .setHelpText('Isi nomor telepon dengan angka, contoh: 08123456789')
    .requireTextMatchesPattern('^[0-9]{9,14}$').build();

  // ---- Bagian 1: Transaksi
  form.addSectionHeaderItem().setTitle('Data Transaksi');
  form.addMultipleChoiceItem().setTitle('Nama Cabang')
    .setChoiceValues(['Kebayoran Lama', 'Cipulir', 'Cinere Raya']).setRequired(true);
  form.addDateItem().setTitle('Tanggal Transaksi').setRequired(true);
  form.addTextItem().setTitle('No. Surat Bukti Gadai (SBG)').setRequired(true);
  form.addTextItem().setTitle('No. Inventori').setRequired(false);

  // ---- Bagian 2: Customer
  form.addPageBreakItem().setTitle('Data Customer');
  form.addTextItem().setTitle('No. KTP Customer').setValidation(digit16).setRequired(true);
  form.addTextItem().setTitle('Nama Customer (sesuai KTP)').setRequired(true);
  form.addParagraphTextItem().setTitle('Alamat (sesuai KTP/domisili)').setRequired(true);
  form.addTextItem().setTitle('No. Telepon').setValidation(telp).setRequired(true);

  // ---- Bagian 3: Barang
  form.addPageBreakItem().setTitle('Data Barang Jaminan');
  form.addListItem().setTitle('Kategori Unit')
    .setChoiceValues(['HP', 'Laptop', 'TV', 'Console Game', 'BPKB', 'iMac', 'Smartwatch',
                      'Emas Batangan', 'Emas Perhiasan', 'Kamera', 'Tablet'])
    .setRequired(true);
  form.addTextItem().setTitle('Nama Unit').setHelpText('Contoh: iPhone 13 Pro 256GB').setRequired(true);
  form.addTextItem().setTitle('IMEI (opsional, untuk HP/elektronik)').setRequired(false);
  form.addListItem().setTitle('Kategori Barang')
    .setChoiceValues(['1', '2', '3', '4', '5', '6', '7', '8', '9']).setRequired(true);
  form.addTextItem().setTitle('Harga Pasar Setempat (Rp)').setValidation(rupiah).setRequired(true);
  form.addTextItem().setTitle('Kondisi Barang').setHelpText('Contoh: Bagus, lecet minor di sudut layar').setRequired(true);
  form.addTextItem().setTitle('Kelengkapan').setHelpText('Contoh: Unit + Charger + Dus').setRequired(true);

  // ---- Bagian 4: Pinjaman
  form.addPageBreakItem().setTitle('Data Pinjaman');
  form.addTextItem().setTitle('Nilai Pinjaman (Rp)').setValidation(rupiah).setRequired(true);
  form.addMultipleChoiceItem().setTitle('Metode Pencairan')
    .setChoiceValues(['Tunai', 'Transfer']).setRequired(true);
  form.addTextItem().setTitle('Masa Tenor (hari)').setRequired(false);
  form.addDateItem().setTitle('Tanggal Jatuh Tempo').setRequired(false);

  // ---- Simpan jawaban ke Google Sheet
  var ss = SpreadsheetApp.create('Jawaban Input Gadai - Gadai Plus');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('Link isi form : ' + form.getPublishedUrl());
  Logger.log('Link edit form: ' + form.getEditUrl());
  Logger.log('Link Sheet    : ' + ss.getUrl());
}
