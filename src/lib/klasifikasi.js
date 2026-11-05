/* Kode Klasifikasi Arsip Kementerian Imigrasi dan Pemasyarakatan.
   Sumber: Kepmen IMIPAS No. M.IP-06.OT.01.01 Tahun 2024 (lampiran II) dan file klasifikasi_surat.docx.
   Struktur 3 level:
     Level 1 = kategori   (mis. UM)
     Level 2 = sub        (mis. 01)
     Level 3 = rincian    (mis. 01 -> "UM.01.01 Persuratan"); sebagian sub tidak punya rincian.
   Kode akhir: "UM.01" (tanpa rincian) atau "UM.01.01" (dengan rincian).
   Catatan: kode rincian di sini hanya angka kedua (mis. "01"); level di bawahnya
   (butir bertanda "-" pada dokumen) tidak punya kode sendiri sehingga tidak dimasukkan. */

const R = (kode, nama) => ({ kode, nama })
const S = (kode, nama, ket, rincian) => ({ kode, nama, ket, rincian })
const K = (kode, nama, sub) => ({ kode, nama, sub })

export const KLASIFIKASI = [
  {
    kelompok: "Klasifikasi Fasilitatif",
    items: [
      K("PR", "Perencanaan", [
        S("01", "Program dan Anggaran", "", [
          R("01", "Rencana Strategis"),
          R("02", "Trilateral Meeting"),
          R("03", "Rencana Kerja"),
          R("04", "Rencana Kerja dan Anggaran (RKA K/L)"),
        ]),
        S("02", "Evaluasi", "", [
          R("01", "Unit Utama"),
          R("02", "Kantor Wilayah"),
        ]),
        S("03", "Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP)", "", []),
        S("04", "Pelaporan", "", [
          R("01", "Laporan Tetap (Bulanan, Triwulan, Semester, Tahunan)"),
          R("02", "Laporan Insidentil"),
        ]),
        S("05", "Rapat Kerja", "", [
          R("01", "Dengan Dewan Perwakilan Rakyat (DPR)"),
          R("02", "Tingkat Kementerian"),
          R("03", "Tingkat Unit Utama (Rapat Kerja Teknis)"),
          R("04", "Tingkat Kantor Wilayah"),
          R("05", "Rapat Pimpinan dan Rapat Staf"),
        ]),
        S("06", "Sidang Kabinet", "", [
          R("01", "Sidang Kabinet Terbatas"),
          R("02", "Sidang Kabinet Paripurna"),
        ]),
      ]),
      K("KU", "Keuangan", [
        S("01", "Pelaksanaan Anggaran", "", [
          R("01", "Pedoman, Petunjuk, dan Administrasi Pelaksanaan Anggaran"),
          R("02", "Daftar Isian Pelaksanaan Anggaran (DIPA)"),
          R("03", "Penerimaan Negara Bukan Pajak (PNBP)"),
        ]),
        S("02", "Tata Usaha Keuangan", "", [
          R("01", "Pedoman dan Petunjuk Administrasi Keuangan"),
          R("02", "Penatausahaan Hibah"),
          R("03", "Pejabat Perbendaharaan Negara"),
          R("04", "Penyelesaian Kerugian Negara"),
          R("05", "Penatausahaan Rekening Pemerintah"),
        ]),
        S("03", "Perbendaharaan", "", [
          R("01", "Dokumen Pertanggungjawaban Belanja"),
          R("02", "Buku Kas Umum dan Buku Pembantu"),
          R("03", "LPJ Bendahara Pengeluaran"),
          R("04", "LPJ Bendahara Penerimaan"),
          R("05", "Penerimaan Negara Pajak"),
        ]),
        S("04", "Akuntansi dan Pelaporan", "", [
          R("01", "Laporan Keuangan"),
          R("02", "Rekonsiliasi dan Data Laporan Keuangan"),
          R("03", "Penyelesaian Tindak Lanjut Temuan Hasil Pemeriksaan BPK dan Inspektorat Jenderal"),
        ]),
      ]),
      K("OT", "Organisasi dan Tata Laksana", [
        S("01", "Organisasi dan Tata Kerja", "", [
          R("01", "Organisasi dan Tata Kerja Kementerian"),
          R("02", "Organisasi dan Tata Kerja Kantor Wilayah"),
          R("03", "Organisasi dan Tata Kerja Unit Pelaksana Teknis (UPT)"),
          R("04", "Evaluasi Kelembagaan"),
        ]),
        S("02", "Ketatalaksanaan", "", [
          R("01", "Standarisasi Sarana Kerja"),
          R("02", "Sistem, Prosedur dan Metode Kerja (SOP & Permen)"),
          R("03", "Analisa dan Uraian Jabatan"),
        ]),
        S("03", "Reformasi Birokrasi", "", [
          R("01", "Penilaian Mandiri Pelaksanaan Reformasi Birokrasi (PMPRB)"),
          R("02", "Zona Integritas (ZI)"),
          R("03", "Evaluasi Reformasi Birokrasi"),
        ]),
        S("04", "Instruksi Menteri", "", []),
      ]),
      K("SA", "Sumber Daya Manusia Aparatur", [
        S("01", "Formasi SDM Aparatur", "", [
          R("01", "Inventarisasi Jabatan/Peta Jabatan"),
          R("02", "Evaluasi Jabatan"),
          R("03", "Usulan Formasi"),
          R("04", "Alokasi Formasi"),
        ]),
        S("02", "Penerimaan/Pengadaan SDM Aparatur", "", [
          R("01", "Proses Penerimaan SDM Aparatur"),
          R("02", "Berkas Lamaran Yang Tidak Diterima"),
          R("03", "Surat Keputusan CPNS/PNS Kolektif"),
          R("04", "Penerimaan SDM Aparatur dari Politeknik Ilmu Pemasyarakatan dan Politeknik Imigrasi"),
          R("05", "Ujian Dinas dan Ujian Penyesuaian Ijazah"),
        ]),
        S("03", "Pengangkatan SDM Aparatur", "Pengangkatan CPNS, PNS, Jabatan Struktural, dan Jabatan Fungsional", [
          R("01", "Pengangkatan CPNS"),
          R("02", "Pengangkatan PNS"),
          R("03", "Pengangkatan Jabatan Struktural"),
          R("04", "Pengangkatan Jabatan Fungsional"),
        ]),
        S("04", "Mutasi SDM Aparatur", "Alih tugas, Plh/Plt, Gelar akademik, KGB, Kenaikan Pangkat, Peninjauan Masa Kerja, hingga Pengaktifan kembali", [
          R("01", "Alih Tugas/Diperbantukan/Dipekerjakan/Pelaksana"),
          R("02", "Pelaksana Harian/Pelaksana Tugas"),
          R("03", "Pencantuman Gelar Akademik"),
          R("04", "Kenaikan Gaji Berkala (KGB)"),
          R("05", "Kenaikan Pangkat (KP)/Golongan"),
          R("06", "Peninjauan Masa Kerja"),
          R("07", "Berkas Badan Pertimbangan Jabatan dan Kepangkatan (Baperjakat)"),
          R("08", "Pengaktifan Kembali dari Cuti Luar Tanggungan Negara (CLTN) dan Hukuman Disiplin"),
        ]),
        S("05", "Pembinaan SDM Aparatur", "Penilaian Prestasi Kerja (PPKP), Pembinaan Disiplin/Kode Etik, Penghargaan/Tanda Jasa", [
          R("01", "Penilaian Prestasi Kerja Pegawai (PPKP)"),
          R("02", "Pembinaan Disiplin dan Kode Etik"),
          R("03", "Pemberian Penghargaan dan Tanda Jasa"),
        ]),
        S("06", "Pengembangan SDM Aparatur", "Pengembangan kompetensi pimpinan/fungsional, pengiriman diklat, dan beasiswa", [
          R("01", "Pengembangan Kompetensi Jabatan Pimpinan Tinggi dan Administrasi"),
          R("02", "Pengembangan Kompetensi Fungsional"),
          R("03", "Pengiriman Peserta Diklat"),
          R("04", "Bea Siswa"),
        ]),
        S("07", "Hukuman Disiplin", "Tingkat Ringan, Tingkat Sedang, dan Tingkat Berat", [
          R("01", "Tingkat Ringan"),
          R("02", "Tingkat Sedang"),
          R("03", "Tingkat Berat"),
        ]),
        S("08", "Tata Usaha SDM Aparatur", "Data pegawai, Kartu Identitas (Karpeg, Karsu, Karstri), Izin belajar, Absensi", [
          R("01", "Data SDM Aparatur"),
          R("02", "Identitas Pegawai (Kartu Pegawai, Kartu Suami, Kartu Istri)"),
          R("03", "Izin Kepegawaian (Izin Belajar, Tugas Belajar Dalam/Luar Negeri)"),
          R("04", "Keanggotaan SDM Aparatur Dalam Organisasi Sosial"),
          R("05", "Daftar Hadir/Absensi SDM Aparatur"),
        ]),
        S("09", "Kesejahteraan SDM Aparatur", "Kesehatan, Perumahan, Taspen, Cuti, Mutasi Keluarga, LHKPN/LP2P", [
          R("01", "Kesehatan"),
          R("02", "Perumahan (TAPERUM, Biaya Uang Muka)"),
          R("03", "Tabungan dan Asuransi Pegawai Negeri (TASPEN)"),
          R("04", "Cuti"),
          R("05", "Uang Duka Tewas"),
          R("06", "Pembekalan Purnabakti"),
          R("07", "Mutasi Keluarga"),
          R("08", "Laporan Kekayaan (LP2P dan LHKPN)"),
        ]),
        S("10", "Pembinaan Jabatan Fungsional", "JFU & JFT", [
          R("01", "Jabatan Fungsional Umum (JFU)"),
          R("02", "Jabatan Fungsional Tertentu (JFT)"),
        ]),
        S("11", "Pemberhentian SDM Aparatur", "Pensiun, Permintaan sendiri, dll", [
          R("01", "Pemberhentian Atas Permintaan Sendiri"),
          R("02", "Pemberhentian Karena Batas Usia Pensiun"),
          R("03", "Pemberhentian Karena Keuzuran/Kondisi Jasmani dan Rohani"),
          R("04", "Pemberhentian Karena Hilang"),
          R("05", "Pemberhentian Sementara"),
          R("06", "Pensiun Janda/Duda dan Anak"),
        ]),
        S("12", "Berkas Perseorangan PNS", "Dossier Pegawai", []),
        S("13", "Berkas Perseorangan Menteri, Wakil Menteri dan Pejabat Negara lainnya", "", []),
        S("14", "Organisasi Non Kedinasan", "KORPRI, Dharma Wanita, Koperasi", [
          R("01", "KORPRI"),
          R("02", "Dharma Wanita"),
          R("03", "Koperasi"),
        ]),
      ]),
      K("PB", "Pengelolaan Barang Milik Negara", [
        S("01", "Perencanaan BMN", "Usulan, Analisis Kebutuhan, Aset Berwujud/Tidak Berwujud", [
          R("01", "Usulan Rencana Kebutuhan BMN"),
          R("02", "Rencana Kebutuhan BMN Kementerian"),
          R("03", "Hasil Analisis Kebutuhan BMN"),
          R("04", "Rencana Kebutuhan Aset Berwujud"),
          R("05", "Rencana Kebutuhan Aset Tak Berwujud"),
        ]),
        S("02", "Pengadaan BMN (Layanan Pengadaan)", "Layanan Pengadaan Barang/Jasa, UKPBJ, Pendistribusian", [
          R("01", "Pengelolaan Pengadaan Barang/Jasa"),
          R("02", "Pengelolaan Layanan Pengadaan Secara Elektronik dan Data Informasi Pengadaan Barang/Jasa"),
          R("03", "Pembinaan, Bimbingan, Pendampingan, dan Konsultasi Teknis Pengadaan Barang/Jasa"),
          R("04", "Tindak Lanjut Hasil Pemeriksaan"),
          R("05", "Laporan Pengadaan Barang/Jasa"),
          R("06", "Telaahan Permasalahan Pengadaan Barang/Jasa"),
          R("07", "Unit Kerja Pengadaan Barang dan Jasa (UKPBJ)"),
          R("08", "Pendistribusian Barang Milik Negara"),
        ]),
        S("03", "Penetapan Status dan Pengamanan BMN", "Penggunaan, Pemanfaatan/Sewa, Rumah Negara", [
          R("01", "Penggunaan Barang Milik Negara"),
          R("02", "Pemanfaatan Barang Milik Negara"),
          R("03", "Pengamanan dan Pemeliharaan"),
          R("04", "Rumah Negara"),
        ]),
        S("04", "Penatausahaan BMN", "Pencatatan, Inventarisasi, Opname fisik, Rekonsiliasi, Laporan", [
          R("01", "Pencatatan Barang Milik Negara"),
          R("02", "Inventarisasi"),
          R("03", "Opname Fisik"),
          R("04", "Rekonsiliasi Data Barang Milik Negara"),
          R("05", "Pengawasan dan Pengendalian BMN"),
          R("06", "Laporan Barang Milik Negara"),
        ]),
        S("05", "Pemindahtanganan dan Penghapusan", "Penjualan, Tukar-menukar, Hibah, Pemusnahan", [
          R("01", "Penjualan"),
          R("02", "Tukar Menukar"),
          R("03", "Hibah"),
          R("04", "Pemusnahan"),
          R("05", "Penghapusan"),
        ]),
      ]),
      K("HK", "Hukum dan Kerja Sama", [
        S("01", "Kerja Sama/Hubungan Lembaga dan Organisasi Kemasyarakatan", "Lembaga Tinggi Negara, Lembaga Pemerintah, Ormas, Perguruan Tinggi, Penyusunan Dokumen Kerja Sama, Audiensi, Pemantauan Evaluasi", [
          R("01", "Lembaga Tinggi Negara (dalam negeri dan luar negeri)"),
          R("02", "Lembaga Pemerintah (dalam negeri dan luar negeri)"),
          R("03", "Organisasi Kemasyarakatan/Lembaga Swasta (dalam negeri dan luar negeri)"),
          R("04", "Perguruan Tinggi/Sekolah (dalam negeri dan luar negeri)"),
          R("05", "Penyusunan Dokumen Kerja Sama (dalam negeri dan luar negeri)"),
          R("06", "Permintaan dan Pengelolaan Data Kerja Sama (dalam negeri dan luar negeri)"),
          R("07", "Audiensi/Kunjungan"),
          R("08", "Pemantauan dan Evaluasi"),
          R("09", "Administrasi Kerja Sama (Pajak, Hibah, Izin Tenaga Asing)"),
        ]),
        S("02", "Layanan Advokasi Hukum", "Litigasi, Non Litigasi, Pengaduan Hukum, Bantuan Hukum, LAPOR, SIPP", [
          R("01", "Advokasi Hukum Litigasi"),
          R("02", "Advokasi Hukum Non Litigasi"),
          R("03", "Pengaduan Hukum"),
          R("04", "Bantuan Hukum"),
          R("05", "Layanan Aspirasi dan Pengaduan Online Rakyat (LAPOR)"),
          R("06", "Sistem Informasi Pelayanan Publik (SIPP)"),
        ]),
        S("03", "Penyusunan Peraturan Perundang-undangan", "Perencanaan, penyusunan, penetapan, dan pengundangan regulasi", [
          R("01", "Penyusunan Rencana Pembentukan Perundang-undangan"),
          R("02", "Penyusunan, Penetapan dan Pengundangan"),
        ]),
      ]),
      K("UM", "Umum", [
        S("01", "Ketatausahaan", "Persuratan, Ucapan Terima Kasih/Selamat", [
          R("01", "Persuratan"),
          R("02", "Ucapan Terima Kasih/Ucapan Selamat"),
        ]),
        S("02", "Kearsipan", "Pemindahan, Pemusnahan, Penyerahan, Pembinaan & Pengawasan Arsip", [
          R("01", "Pemindahan Arsip"),
          R("02", "Pemusnahan Arsip"),
          R("03", "Penyerahan"),
          R("04", "Pembinaan Kearsipan"),
          R("05", "Pengawasan Kearsipan"),
          R("06", "Monitoring dan Evaluasi"),
        ]),
        S("03", "Kerumahtanggaan", "Ruang kantor, Rumah negara, Kendaraan dinas, Perjalanan dinas", [
          R("01", "Penggunaan Ruang dan Peralatan Kantor"),
          R("02", "Penggunaan dan Penghunian Rumah Negara"),
          R("03", "Penggunaan dan Pemeliharaan Kendaraan Dinas"),
          R("04", "Penggunaan dan Pemeliharaan Barang Elektronik serta Mesin"),
          R("05", "Pemeliharaan Gedung dan Bangunan serta Area Kantor"),
          R("06", "Pemeliharaan Alat Kesehatan"),
          R("07", "Perjalanan Dinas (Dalam Negeri/Luar Negeri)"),
          R("08", "Penghematan Energi dan Air"),
        ]),
        S("04", "Keprotokolan", "Upacara, Tamu kedinasan, Jamuan", [
          R("01", "Penyelenggaraan Upacara"),
          R("02", "Pelayanan Tamu, Acara Kedinasan, Jamuan dan Ramah Tamah"),
          R("03", "Daftar Nama Pejabat dan Alamat"),
        ]),
        S("05", "Pengamanan", "Pengamanan VVIP/VIP, lingkungan, dokumen rahasia, laporan kejadian", [
          R("01", "Pengamanan Personil (VVIP/VIP)"),
          R("02", "Pengamanan Lingkungan, Fisik dan Instalasi"),
          R("03", "Pengamanan Dokumen dan Informasi Rahasia"),
          R("04", "Laporan Keamanan"),
          R("05", "Laporan Kejadian"),
          R("06", "Bantuan Pengamanan"),
        ]),
        S("06", "Pembinaan Sikap Mental dan Layanan Kesehatan", "Rohaniawan, senam pagi, poli kesehatan", [
          R("01", "Layanan Keagamaan dan Sosial"),
          R("02", "Layanan Kesehatan Jasmani"),
          R("03", "Pelayanan Kesehatan"),
        ]),
        S("07", "Kepustakaan", "Akusisi bahan pustaka, pengolahan, layanan perpustakaan, preservasi", [
          R("01", "Akusisi"),
          R("02", "Pengolahan Bahan Pustaka"),
          R("03", "Pangkalan Data Koleksi"),
          R("04", "Layanan Perpustakaan"),
          R("05", "Preservasi Bahan Pustaka"),
          R("06", "Pengembangan Perpustakaan"),
          R("07", "Pendidikan dan Pelatihan Perpustakaan"),
          R("08", "Tenaga Perpustakaan"),
        ]),
      ]),
      K("PW", "Pengawasan", [
        S("01", "Perencanaan", "Kebijakan pengawasan, Perjanjian Kinerja, PKPT", [
          R("01", "Kebijakan Pengawasan"),
          R("02", "Perjanjian Kinerja"),
          R("03", "Program Kerja Pengawasan Tahunan (PKPT)"),
          R("04", "Program Kerja Administrasi Umum (PKAU)"),
          R("05", "Rapat Koordinasi Pengawasan (RAKORWAS)"),
          R("06", "Ikhtisar Hasil Pengawasan"),
        ]),
        S("02", "Pelaksanaan Pengawasan", "Audit kinerja, reviu, evaluasi, audit khusus, monitoring BPK/Itjen", [
          R("01", "Audit Kinerja & Informasi, Reviu dan Evaluasi"),
          R("02", "Audit Tujuan Tertentu / Khusus"),
          R("03", "Pemantauan / Monitoring"),
          R("04", "Pengawasan Lainnya, Pendampingan, Sosialisasi, Perjanjian Kerja Sama"),
        ]),
        S("03", "Pelaporan", "LHA/LHP, laporan pemantauan", [
          R("01", "Laporan Hasil Audit Kinerja (LHA/LHP)"),
          R("02", "Laporan Hasil Audit Tujuan Tertentu (Audit Khusus)"),
          R("03", "Pemantauan/Monitoring BPK RI, BPKP RI, ORI, Inspektorat Jenderal"),
          R("04", "Pengawasan Lainnya, Pendampingan, Sosialisasi, Perjanjian Kerja Sama"),
          R("05", "Inspektorat Jenderal"),
        ]),
        S("04", "Tindak Lanjut", "Laporan tindak lanjut hasil audit", [
          R("01", "Laporan Tindak Lanjut Hasil Audit Kinerja"),
          R("02", "Laporan Tindak Lanjut Hasil Audit Khusus"),
          R("03", "Tindak Lanjut BPKP RI, BPK RI, ITJEN"),
        ]),
        S("05", "Reviu dan Tindak Lanjut Reviu", "", [
          R("01", "Reviu"),
          R("02", "Tindak Lanjut Reviu"),
        ]),
        S("06", "Tindak Lanjut Pengaduan", "WBS, gratifikasi, pengaduan tertulis/LAPOR/Ombudsman", [
          R("01", "Whistle Blowing System (WBS)"),
          R("02", "Gratifikasi"),
          R("03", "Pengaduan Tertulis (SMS Gateway, PO BOX, Email ITJEN)"),
          R("05", "Pengaduan melalui Aplikasi LAPOR"),
          R("06", "Pengaduan Ombudsman"),
        ]),
        S("07", "Tindak Lanjut Atensi dan Telaahan", "", [
          R("01", "Tanggapan/Telaahan Hukuman Disiplin Yang Tidak Ditindaklanjuti"),
          R("02", "Tanggapan/Telaahan Hukuman Disiplin Yang Ditindaklanjuti"),
          R("03", "Daftar Nama Pegawai Yang Dikenakan Sanksi Hukuman Disiplin/Kartu Cela"),
        ]),
      ]),
      K("TI", "Teknologi, Informasi dan Komunikasi Publik", [
        S("01", "Pengamanan Data", "", []),
        S("02", "Pengamanan Jaringan", "", []),
        S("03", "Standarisasi", "Regulasi TIK, implementasi aplikasi, situs internet", [
          R("01", "Standarisasi Teknologi dan Informasi"),
          R("02", "Implementasi Aplikasi"),
          R("03", "Implementasi Situs Internet, Portal Internet dan Surat Elektronik"),
          R("04", "Uji Coba Infrastruktur"),
        ]),
        S("04", "Kerja Sama", "Internal & Eksternal", [
          R("01", "Kerja Sama Internal"),
          R("02", "Kerja Sama Eksternal"),
        ]),
        S("05", "Perencanaan Pengembangan Teknologi Informasi", "", [
          R("01", "Penyusunan Program Perencanaan Teknologi dan Informasi"),
          R("02", "Pengembangan Infrastruktur Teknologi dan Informasi"),
          R("03", "Pengembangan Aplikasi"),
          R("04", "Pengembangan Database, Situs Internet dan Surat Elektronik"),
        ]),
        S("06", "Pengelolaan Sistem Teknologi Informasi", "", [
          R("01", "Pengelolaan Jaringan"),
          R("02", "Pengelolaan Jaringan Sistem Informasi"),
          R("03", "Pengelolaan Database"),
          R("04", "Pengelolaan Situs Internet, Portal Internet dan Surat Elektronik"),
          R("05", "Pengelolaan Aplikasi"),
          R("06", "Pengelolaan Alat Pendukung"),
        ]),
        S("07", "Layanan Sistem Teknologi dan Informasi", "", [
          R("01", "Layanan Keluhan LPSE (Layanan Pengadaan Secara Elektronik)"),
          R("02", "Tindak Lanjut Keluhan"),
          R("03", "Monitoring/Pemantauan Layanan Keluhan Software/Hardware"),
          R("04", "Evaluasi (Hasil Evaluasi TI)"),
        ]),
        S("08", "Informasi dan Komunikasi Publik", "", [
          R("01", "Media Massa (Cetak, Elektronik, Media Sosial)"),
          R("02", "Sosialisasi dan Diseminasi"),
          R("03", "Pejabat Pengelola Informasi dan Dokumentasi (PPID)"),
          R("04", "Badan Koordinasi Hubungan Masyarakat (Bakohumas)"),
          R("05", "Peliputan"),
          R("06", "Konferensi Pers"),
          R("07", "Siaran Pers"),
        ]),
        S("09", "Dokumentasi", "", [
          R("01", "Produk Informasi (Media Cetak, Elektronik, Media Sosial)"),
          R("02", "Rekapitulasi Pemberitaan"),
        ]),
      ]),
    ],
  },
  {
    kelompok: "Klasifikasi Substantif",
    items: [
      K("PK", "Pemasyarakatan", [
        S("01", "Pelayanan Pemasyarakatan", "Registrasi Tahanan, Narapidana, Klien, Orang Titipan, Bon Tahanan", [
          R("01", "Registrasi Tahanan dan Anak"),
          R("02", "Registrasi Narapidana dan Anak Binaan"),
          R("03", "Registrasi Klien Pemasyarakatan"),
          R("04", "Registrasi Titipan"),
          R("05", "Administrasi Pelayanan Tahanan di luar Rutan"),
          R("06", "Peminjaman/Bon Narapidana dan Anak Binaan"),
        ]),
        S("02", "Admisi Orientasi, Asesmen dan Klasifikasi", "", [
          R("01", "Admisi Orientasi"),
          R("02", "Asesmen dan Klasifikasi"),
        ]),
        S("03", "Mutasi", "Tahanan, Narapidana, Klien Pemasyarakatan", [
          R("01", "Mutasi Tahanan dan Anak"),
          R("02", "Mutasi Narapidana dan Anak Binaan"),
          R("03", "Mutasi Klien Pemasyarakatan"),
        ]),
        S("04", "Bimbingan Kemasyarakatan dan Pengentasan Anak", "Layanan kepribadian, kemandirian, pelindungan hukum, pengeluaran tahanan", [
          R("01", "Layanan Kepribadian"),
          R("02", "Layanan Kemandirian"),
          R("03", "Layanan Pelindungan Hukum Tahanan dan Anak"),
          R("04", "Pengeluaran Tahanan dan Anak"),
          R("05", "Tim Pertimbangan Pemasyarakatan Pelayanan Tahanan dan Anak"),
        ]),
        S("05", "Pembinaan Narapidana dan Anak Binaan", "Kepribadian, kemandirian, asimilasi, integrasi/PB/CB, pengeluaran", [
          R("01", "Pembinaan Kepribadian"),
          R("02", "Pembinaan Kemandirian"),
          R("03", "Asimilasi dan Integrasi Narapidana dan Anak Binaan"),
          R("04", "Pengeluaran Narapidana dan Anak Binaan"),
          R("05", "Tim Pertimbangan Pemasyarakatan Pembinaan Narapidana dan Anak Binaan"),
        ]),
        S("06", "Pembimbingan Kemasyarakatan", "Litmas, pendampingan klien, keadilan restoratif, pengawasan", [
          R("01", "Penelitian Kemasyarakatan"),
          R("02", "Pendampingan Klien Pemasyarakatan dan Upaya Keadilan Restoratif Pemasyarakatan"),
          R("03", "Pembimbingan Klien Pemasyarakatan"),
          R("04", "Pengawasan Klien Pemasyarakatan"),
          R("05", "Tim Pertimbangan Pemasyarakatan Pembimbingan Klien Pemasyarakatan"),
        ]),
        S("07", "Perawatan Kesehatan dan Rehabilitasi", "Kesehatan dasar, lanjutan, khusus/narkotika, lingkungan", [
          R("01", "Perawatan Kesehatan Dasar"),
          R("02", "Perawatan Kesehatan Lanjutan"),
          R("03", "Perawatan Kesehatan Khusus"),
          R("04", "Kebutuhan Dasar dan Kesehatan Lingkungan"),
        ]),
        S("08", "Pengamanan dan Intelijen", "Intelijen pemasyarakatan, pencegahan gangguan keamanan, penindakan", [
          R("01", "Intelijen Pemasyarakatan"),
          R("02", "Pencegahan Gangguan Keamanan dan Pemeliharaan Keamanan"),
          R("03", "Penindakan dan Pemulihan"),
        ]),
        S("09", "Kepatuhan Internal", "Pencegahan, pengendalian, fasilitasi advokasi & investigasi internal", [
          R("01", "Pencegahan dan Pengendalian"),
          R("02", "Fasilitasi Advokasi dan Investigasi Internal"),
        ]),
        S("10", "Pengelolaan Data dan Informasi Pemasyarakatan", "Statistik tahanan, narapidana, klien", [
          R("01", "Pengelolaan Data dan Informasi"),
          R("02", "Statistik Tahanan dan Anak"),
          R("03", "Statistik Narapidana dan Anak Binaan"),
          R("04", "Statistik Klien Pemasyarakatan"),
          R("05", "Statistik Titipan"),
        ]),
      ]),
    ],
  },
]

export const getKategori = (kode) =>
  KLASIFIKASI.flatMap((g) => g.items).find((x) => x.kode === kode) || null

export const getSub = (kat, kode) => kat?.sub.find((s) => s.kode === kode) || null

// "UM" + "01" + "01" -> "UM.01.01"; tanpa rincian -> "UM.01"
export const buildKode = (l1, l2, l3) => [l1, l2, l3].filter(Boolean).join('.')
