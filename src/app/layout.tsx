import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Web3Provider from "@/providers/Web3Provider";



export const metadata: Metadata = {
  title: "Smart Contract ABI Caller",
  description: "Smart Contract ABI Caller",
  icons: {
    icon: '/images/logo.png?v=1.0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <Web3Provider>
          <AntdRegistry>{children}</AntdRegistry>
        </Web3Provider>
      </body>
    </html>
  );
}
