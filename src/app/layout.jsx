import { Inter } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';
import './global.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Linux Command Typing Test - LinuxTyper.com',
  description: 'Linux terminal command typing game to test your speed of typing terminal commands. Challenge yourself if you think you are a pro Linux user! ',
  keyword: ['linux', 'terminal', 'command', 'type test', 'typing test', 'typing game', 'linux game', 'terminal game'],
  icons: {
    icon: 'icon.ico'
  } 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-HDFPPVNZ3Z"/>
      <Script
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HDFPPVNZ3Z', {
              page_path: window.location.pathname,
            });
          `,
          }}
      />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
