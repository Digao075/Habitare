import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habitare Ecosystem",
  description: "Marketplace e Portal de Arquitetura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="border-b border-orange-100 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              habitare.
            </Link>
            
            <div className="flex gap-6 text-sm font-medium">
              <Link href="/materias" className="text-gray-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-full">
                Matérias
              </Link>
              <Link href="/marketplace" className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full">
                Marketplace (Projetos)
              </Link>
            </div>
          </div>
        </nav>
        
        {children}
      </body>
    </html>
  );
}