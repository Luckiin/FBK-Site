import "./globals.css";
import { Toaster } from 'sonner';
import { AuthProvider } from "@/context/AuthContext";
import { TransitionProvider } from "@/components/TransitionWrapper";
import { APP_FULL_NAME } from "@/lib/constants";

export const metadata = {
  title: {
    default: `${APP_FULL_NAME} - FBK`,
    template: `%s | FBK`,
  },
  description:
    "Promovendo o Kickboxing como esporte, educação e inclusão social na Bahia.",
  keywords: ["kickboxing", "federação", "bahia", "esporte", "inclusão social", "FBK"],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
};

export const viewport = {
  themeColor: "#dc2626",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body suppressHydrationWarning className="antialiased">
        <AuthProvider>
          <TransitionProvider>
            {children}
            <Toaster 
              richColors 
              position="top-right"
              theme="dark"
              toastOptions={{
                className: 'rounded-xl border border-white/10 bg-dark-200 text-ink-100 shadow-2xl',
              }}
            />
          </TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
