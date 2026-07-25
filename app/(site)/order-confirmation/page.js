'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmationContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
          ORDER CONFIRMED
        </div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, color: '#fff', marginBottom: 20 }}>
          THANK YOU
        </h1>
        {orderNumber && (
          <div className="vx-card" style={{ padding: '14px 24px', display: 'inline-block', marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Order Number</span>
            <div className="font-orb" style={{ fontSize: 14, fontWeight: 700 }}>{orderNumber}</div>
          </div>
        )}
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 32 }}>
          A confirmation email is on its way. Delivery takes approximately 2 weeks — we&apos;ll email you again once it&apos;s dispatched.
        </p>
        <Link href="/" className="vx-btn vx-btn-white" style={{ padding: '14px 32px', fontSize: 10, letterSpacing: '0.2em', display: 'inline-block' }}>
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  )
}
