import "./globals.css";

export const metadata = {
  title: "Aiexor",
  description: "AI image generation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="app-root">{children}</main>
      </body>
    </html>
  );
}

