'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const TABS = [
  { key: 'men', label: 'MEN' },
  { key: 'women', label: 'WOMEN' },
  { key: 'kids', label: 'KIDS' },
  { key: 'babies', label: 'BABIES' },
]

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 10, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)', textAlign: 'center', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: j === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)', textAlign: 'center', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent', fontWeight: j === 0 ? 600 : 400, whiteSpace: 'nowrap' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SizeGuidePage() {
  const [active, setActive] = useState('men')

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>SIZE GUIDE</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>All measurements are in centimetres unless stated</p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 96px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActive(t.key)} className="vx-btn" style={{ padding: '10px 24px', fontSize: 10, letterSpacing: '0.2em', background: active === t.key ? '#fff' : 'transparent', color: active === t.key ? '#050508' : 'rgba(255,255,255,0.5)', border: '1px solid', borderColor: active === t.key ? '#fff' : 'rgba(255,255,255,0.15)', borderRadius: 4 }}>
              {t.label}
            </button>
          ))}
        </div>

        {active === 'men' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>ADULT MEN&apos;S JERSEY</div>
            <Table
              headers={['Measurement', 'S', 'M', 'L', 'XL', '2XL']}
              rows={[
                ['Suggested Height (cm)', '160-170', '170-175', '175-180', '180-185', '185-190'],
                ['Suggested Weight (kg)', '60-65', '66-70', '71-75', '76-80', '81-87'],
                ['Chest', '51cm', '53cm', '55cm', '57cm', '60cm'],
                ['Jersey Length', '71cm', '73cm', '75cm', '77cm', '81cm'],
                ['Sleeve Length (Short)', '36.5cm', '38cm', '39.5cm', '41cm', '42cm'],
                ['Sleeve Length (Long)', '75.5cm', '77cm', '78.5cm', '80cm', '81cm'],
                ['Cuff Width', '16.5cm', '17.5cm', '18.5cm', '19.5cm', '20.5cm'],
              ]}
            />
          </motion.div>
        )}

        {active === 'women' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>ADULT WOMEN&apos;S JERSEY</div>
            <Table
              headers={['Measurement', 'S', 'M', 'L', 'XL']}
              rows={[
                ['Length', '64-66cm', '66-68cm', '68-70cm', '70-72cm'],
                ['Waist', '36-38cm', '38-40cm', '40-42cm', '42-44cm'],
                ['Chest', '40-42cm', '42-44cm', '44-46cm', '46-48cm'],
                ['Suggested Height', '155-160cm', '160-165cm', '165-170cm', '170-175cm'],
                ['Suggested Weight', '43-50kg', '48-55kg', '55-60kg', '60-68kg'],
              ]}
            />
          </motion.div>
        )}

        {active === 'kids' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>CHILDREN&apos;S JERSEY</div>
            <Table
              headers={['Measurement', '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL']}
              rows={[
                ['T-Shirt Length', '43cm', '47cm', '50cm', '53cm', '56cm', '58cm', '61cm'],
                ['Pants Length', '29cm', '31cm', '33cm', '35cm', '37cm', '39cm', '41cm'],
                ['Chest', '34cm', '36cm', '38cm', '40cm', '42cm', '44cm', '46cm'],
                ['Fit Age', '2-3 yrs', '4-5 yrs', '6-7 yrs', '8-9 yrs', '10-11 yrs', '12-13 yrs', '14-15 yrs'],
                ['Fit Height', '90-100cm', '100-110cm', '110-120cm', '120-130cm', '130-140cm', '140-150cm', '150-160cm'],
              ]}
            />
          </motion.div>
        )}

        {active === 'babies' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>BABY ONESIE</div>
            <Table
              headers={['Size', 'Suggested Height', 'Suggested Weight', 'Length', 'Chest', 'Shoulders']}
              rows={[
                ['6-12 Months', '67-72cm', '7.5-9.3kg', '44cm', '27cm', '24cm'],
                ['12-18 Months', '72-78cm', '9.1-11.1kg', '46cm', '28cm', '25cm'],
              ]}
            />
          </motion.div>
        )}

        <div style={{ marginTop: 40, padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, margin: 0 }}>
            💡 <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Tip:</strong> If you&apos;re between sizes we recommend sizing up for a more comfortable fit. Still unsure? Contact us on <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>Discord</a> and we&apos;ll help you out.
          </p>
        </div>
      </div>
    </div>
  )
}
