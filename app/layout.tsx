import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/lib/context/AuthContext';
import  AuthenticatedLayout  from "@/lib/context/AuthenticatedLayout"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';

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
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            <AuthenticatedLayout>
              {children}
            </AuthenticatedLayout>
          </AuthProvider>
        </GoogleOAuthProvider>
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
