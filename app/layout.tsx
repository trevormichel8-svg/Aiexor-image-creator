import "./globals.css";

export const metadata = {
  title: "Aiexor.com",
  description: "Let Your Imagination Run Wild.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* BACKGROUND EFFECTS (MOBILE SAFE) */}
        <div className="bg-effects">
          <div className="particles" />
          <div className="streak s1" />
          <div className="streak s2" />
          <div className="streak s3" />
        </div>

        {children}
      </body>
    </html>
  );
}
