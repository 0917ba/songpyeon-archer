import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="w-full h-full">
      <body className="w-full h-full">
        <div className="flex justify-center items-center h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
