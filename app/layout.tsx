import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/lib/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

export const metadata: Metadata = {
  title: "CodePass",
  description: "CodePass",
};


const queryClient = new QueryClient();


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <AuthProvider>
                {children}
            </AuthProvider>
          </GoogleOAuthProvider>
          <Toaster 
            position="top-right"
            richColors
            closeButton
          />
        </QueryClientProvider>
      </body>
    </html>
  );
}
