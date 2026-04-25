import "./globals.css";

export const metadata = {
  title: "FoundrAI 2.0 — Autonomous Business Validation Engine",
  description:
    "Multi-agent AI that debates your startup idea with real market data",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
