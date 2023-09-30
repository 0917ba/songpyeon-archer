import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="w-full h-full">
      <body className="w-full h-full">{children}</body>
    </html>
  );
}
