# SIPENA-RUTAN – Aplikasi Nomor Surat Rutan Sungai Penuh

1. `npm install`
2. Salin `.env.example` menjadi `.env.local` lalu isi kunci Supabase.
3. Pastikan database sudah punya tabel `users`, `surat_history`, fungsi RPC `generate_nomor_surat`, RLS, dan trigger role.
4. `npm run dev` → http://localhost:3000
