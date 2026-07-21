'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('vexer_cart')
      const savedWishlist = localStorage.getItem('vexer_wishlist')
      if (savedCart) setItems(JSON.parse(savedCart))
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    } catch (e) { console.error('Failed to load saved cart:', e) }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem('vexer_cart', JSON.stringify(items))
  }, [items, hydrated])

  useEffect(() => {
    if (hydrated) localStorage.setItem('vexer_wishlist', JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  function addToCart(item) {
    setItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.productId === item.productId && i.size === item.size && i.playerName === item.playerName
      )
      if (existingIdx > -1) {
        const next = [...prev]
        next[existingIdx] = { ...next[existingIdx], qty: next[existingIdx].qty + item.qty }
        return next
      }
      return [...prev, item]
    })
    setCartOpen(true)
  }

  function removeFromCart(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function updateQty(index, qty) {
    if (qty < 1) return removeFromCart(index)
    setItems(prev => prev.map((item, i) => i === index ? { ...item, qty } : item))
  }

  function toggleWishlist(productId) {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId])
  }

  function clearCart() { setItems([]) }

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0)

  return (
    <CartContext.Provider value={{
      items, wishlist, cartOpen, cartCount, cartTotal,
      setCartOpen, addToCart, removeFromCart, updateQty, toggleWishlist, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
