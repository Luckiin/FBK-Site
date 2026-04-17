import "./globals.css";
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
};

export const viewport = {
  themeColor: "#dc2626",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <AuthProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
