import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Web3Provider from "@/providers/Web3Provider";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { getLangDir } from 'rtl-detect';


export const metadata: Metadata = {
  title: "Smart Contract Caller",
  description: "Smart Contract Caller",
};


export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const lang = await getLocale();
  const direction = getLangDir(lang);

  const messages = await getMessages();

  return (
    <html lang={lang} dir={direction}>
      <body >
        <NextIntlClientProvider messages={messages}>
          <Web3Provider>
            <AntdRegistry>
              {children}
            </AntdRegistry>
          </Web3Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
