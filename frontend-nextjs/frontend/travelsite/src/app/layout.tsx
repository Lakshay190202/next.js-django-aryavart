import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/Authcontext"; // Adjust the path as necessary
import Header from "./components/header"; // Import the Header component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arya Vart",
  description: "A simple travel blog site with modern feat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header>
             {/* Include the Header component */}
          </header>
          <main>
            {children}
          </main>
          <footer>
            {/* Your footer content here */}
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}