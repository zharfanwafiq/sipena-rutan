import '../index.css'; // memuat Tailwind + gaya global ke seluruh aplikasi

export const metadata = {
  title: 'SIPENA-RUTAN',
  description: 'Sistem Pengelolaan Persuratan dan Naskah Dinas Rutan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}