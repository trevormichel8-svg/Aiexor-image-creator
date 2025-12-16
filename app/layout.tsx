import "./globals.css";
import "@/styles/theme.css";

export const metadata = {
  title: "Aiexor Image Creator",
  description: "AI image generation powered by Aiexor"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
