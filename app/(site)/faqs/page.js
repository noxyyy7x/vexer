'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  { q: 'Where do you ship to?', a: "We ship worldwide. No matter where you are, we'll get your jersey to you." },
  { q: 'How long does delivery take?', a: 'Approximately 2 weeks from the date of your order. We source your jersey and dispatch it as quickly as possible.' },
  { q: 'Can I track my order?', a: "Tracking is currently available for UK customers via Royal Mail. We're working on bringing tracking to international orders — watch this space." },
  { q: 'What is your returns policy?', a: 'We accept returns on standard jerseys only. Custom jerseys with player names and numbers cannot be returned as they are made specifically for you. Returns must be requested within 3 days of receiving your order.' },
  { q: 'What sizes do you offer?', a: 'We offer a wide range of sizes for Men, Women, Kids and Babies. Check our Size Guide for full sizing details.', link: { label: 'View Size Guide', href: '/size-guide' } },
  { q: 'Can I get a player name and number on my jersey?', a: 'Yes! Many of our jerseys offer the option to add a player name and number. Simply select this option on the product page before adding to cart.' },
  { q: 'How do I contact you?', a: "The fastest way to reach us is via Discord where you can open a support ticket and we'll get back to you quickly.", link: { label: 'Discord', href: 'https://discord.gg/6Xk2HmgT9N', external: true } },
  { q: "My order hasn't arrived — what do I do?", a: "If your order hasn't arrived within the expected timeframe please get in touch with us on Discord and we'll look into it right away.", link: { label: 'Discord', href: 'https://discord.gg/6Xk2HmgT9N', external: true } },
  { q: 'What payment methods do you accept?', a: 'We accept all major card payments, Apple Pay, Google Pay and Revolut. Pay with Revolut to earn 2x Revolut Points on your order.' },
]

export default function FAQsPage() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: '#fff' }}>FAQS</h1>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 96px' }}>
        {FAQS.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left' }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: open === i ? '#fff' : 'rgba(255,255,255,0.8)' }}>{faq.q}</span>
              <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)', flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>+</span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                  <div style={{ paddingBottom: 20 }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: faq.link ? 12 : 0 }}>{faq.a}</p>
                    {faq.link && (
                      faq.link.external ? (
                        <a href={faq.link.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#fff', fontWeight: 600, textDecoration: 'underline' }}>{faq.link.label}</a>
                      ) : (
                        <Link href={faq.link.href} style={{ fontSize: 12, color: '#fff', fontWeight: 600, textDecoration: 'underline' }}>{faq.link.label}</Link>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        <div style={{ marginTop: 48, padding: 28, background: 'rgba(88,101,242,0.06)', border: '1px solid rgba(88,101,242,0.2)', borderRadius: 8, textAlign: 'center' }}>
          <div className="font-orb" style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>STILL HAVE QUESTIONS?</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Our team is ready to help on Discord.</p>
          <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-white" style={{ padding: '12px 28px', fontSize: 9, letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-flex' }}>
            JOIN DISCORD →
          </a>
        </div>
      </div>
    </div>
  )
}
