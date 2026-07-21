import { Orbitron, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-orbitron',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Vexer — Football Jerseys',
  description: 'Football jerseys worldwide shipping. National, international, and retro kits.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body className="font-sans">
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
