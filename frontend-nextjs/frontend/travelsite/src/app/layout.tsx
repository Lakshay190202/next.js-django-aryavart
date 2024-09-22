import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/Authcontext"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <ToastContainer />
          <footer>
            {/* Your footer content here */}
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}