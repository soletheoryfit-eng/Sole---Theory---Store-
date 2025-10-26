import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "SoleTheory — Premium Sneakers",
  description: "Premium sneakers for Romania. Order via WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="min-h-screen flex flex-col">
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg">SoleTheory</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/about">About</Link>
              <Link href="/shipping">Shipping & Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/admin" className="px-3 py-1 rounded-xl border">Admin</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold">SoleTheory</div>
              <p className="text-neutral-600 mt-1">
                Premium sneakers, delivered from verified suppliers in the U.S. and China to Romania.
              </p>
            </div>
            <div>
              <div className="font-semibold">Info</div>
              <ul className="mt-2 space-y-1">
                <li><Link href="/shipping">Shipping & Returns</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold">Social</div>
              <p className="text-neutral-600 mt-1">Instagram (coming soon)</p>
            </div>
          </div>
          <div className="text-xs text-neutral-500 text-center pb-6">© {new Date().getFullYear()} SoleTheory. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
