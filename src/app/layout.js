import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RentCar App",
  description: "Find and rent your next ride easily",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClientWrapper>{children}</ClientWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
