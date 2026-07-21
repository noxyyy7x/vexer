import Link from 'next/link'

const FOOTER_COLS = [
  { title: 'SHOP', links: [["MEN'S", '/men'], ["WOMEN'S", '/women'], ["KIDS'", '/kids'], ["BABIES'", '/babies']] },
  { title: 'INFO', links: [['FAQs', '/faqs'], ['Size Guide', '/size-guide'], ['Shipping', '/shipping'], ['Returns', '/returns'], ['Reviews', '/reviews']] },
  { title: 'LEGAL', links: [['Privacy Policy', '/privacy'], ['Terms', '/terms'], ['Sitemap', '/sitemap']] },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 24px 32px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <img src="/logo.png" alt="Vexer" style={{ height: 36, width: 'auto', marginBottom: 20 }} />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, maxWidth: 260, marginBottom: 20 }}>
              Premium football jerseys from the world&apos;s greatest clubs and nations. Worldwide delivery.
            </p>
            <a
              href="https://discord.gg/6Xk2HmgT9N"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(88,101,242,0.1)', border: '1px solid rgba(88,101,242,0.25)', borderRadius: 6, textDecoration: 'none', color: '#7289da', fontSize: 10, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.1em' }}
            >
              💬 DISCORD
            </a>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
                {col.title}
              </div>
              {col.links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="vx-divider" style={{ marginBottom: 24 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="font-orb" style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
            © {new Date().getFullYear()} VEXER. ALL RIGHTS RESERVED.
          </div>
          <div className="font-orb" style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
            support@vexer.org
          </div>
        </div>
      </div>
    </footer>
  )
}
