import { Inter } from 'next/font/google';
import Head from 'next/head';
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
