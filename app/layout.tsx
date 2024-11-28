import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/lib/context/AuthContext';
import  AuthenticatedLayout  from "@/lib/context/AuthenticatedLayout"
export const metadata: Metadata = {
  title: "CodePass",
  description: "CodePass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
