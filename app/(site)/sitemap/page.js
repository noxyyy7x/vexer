import Link from 'next/link'

const SECTIONS = [
  {
    title: 'SHOP',
    links: [
      { label: "Men's Jerseys", href: '/men' },
      { label: "Women's Jerseys", href: '/women' },
      { label: "Kids' Jerseys", href: '/kids' },
      { label: "Babies' Jerseys", href: '/babies' },
    ],
  },
  {
    title: 'INFO',
    links: [
      { label: 'FAQs', href: '/faqs' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Reviews', href: '/reviews' },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: '#fff' }}>SITEMAP</h1>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 24 }}>
          {SECTIONS.map(section => (
            <div key={section.title} className="vx-glass" style={{ padding: 24 }}>
              <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{section.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.links.map(link => (
                  <Link key={link.href} href={link.href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    → {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
