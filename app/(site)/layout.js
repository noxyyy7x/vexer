import { CartProvider } from '@/context/CartContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import LiveChatButton from '@/components/LiveChatButton'

export default function SiteLayout({ children }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <AnnouncementBanner />
        <Header />
        {children}
        <Footer />
        <CartDrawer />
        <LiveChatButton />
      </CartProvider>
    </CurrencyProvider>
  )
}
