import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const FOOTER_COLS = [
  { title: 'SHOP', links: [["MEN'S", '/men'], ["WOMEN'S", '/women'], ["KIDS'", '/kids'], ["BABIES'", '/babies']] },
  { title: 'INFO', links: [['FAQs', '/faqs'], ['Size Guide', '/size-guide'], ['Shipping', '/shipping'], ['Returns', '/returns'], ['Reviews', '/reviews']] },
  { title: 'LEGAL', links: [['Privacy Policy', '/privacy'], ['Terms', '/terms'], ['Sitemap', '/sitemap']] },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '70px 24px 32px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 56 }}>
          <div>
            <div className="font-orb" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>VEXER</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, maxWidth: 260, marginBottom: 22 }}>
              Premium football jerseys from the world&apos;s greatest clubs and nations. Delivered across Europe, the UK and USA.
            </p>
            <a
              href="https://discord.gg/6Xk2HmgT9N"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '10px 18px', background: 'rgba(88,101,242,0.1)', border: '1px solid rgba(88,101,242,0.3)', borderRadius: 24, textDecoration: 'none', color: '#8a97f4', fontSize: 10, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.12em', fontWeight: 600 }}
            >
              <MessageCircle size={14} /> JOIN DISCORD
            </a>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 18 }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(([label, href]) => (
                  <Link key={href} href={href} className="footer-link" style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', transition: 'color 0.15s' }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="vx-divider" style={{ marginBottom: 22 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="font-orb" style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.15em' }}>
            © {new Date().getFullYear()} VEXER. ALL RIGHTS RESERVED.
          </div>
          <a href="mailto:support@vexer.org" className="font-orb" style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.15em' }}>
            SUPPORT@VEXER.ORG
          </a>
        </div>
      </div>

      <style>{`.footer-link:hover { color: rgba(255,255,255,0.9) !important; }`}</style>
    </footer>
  )
}
