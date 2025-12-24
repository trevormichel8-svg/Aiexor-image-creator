import "./globals.css";

export const metadata = {
  title: "Aiexor",
  description: "AI Image Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
