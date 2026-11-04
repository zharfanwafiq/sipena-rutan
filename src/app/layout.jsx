import '../index.css'; // memuat Tailwind + gaya global ke seluruh aplikasi

export const metadata = {
  title: 'SIPENA-RUTAN',
  description: 'Sistem Pengelolaan Persuratan dan Naskah Dinas Rutan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}