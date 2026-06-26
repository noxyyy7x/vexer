export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  try {
    const { items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'No items provided' });

    const totalAmount = items.reduce((sum, item) => {
      return sum + Math.round(Number(item.price) * 100) * (Number(item.qty) || 1);
    }, 0);

    const description = items.map(i => `${i.team} ${i.name} x${i.qty}`).join(', ');

    const metadata = {};
    items.forEach((item, i) => {
      const prefix = `item_${i}`;
      metadata[`${prefix}_name`] = item.name || '';
      metadata[`${prefix}_team`] = item.team || '';
      metadata[`${prefix}_qty`] = String(item.qty || 1);
      metadata[`${prefix}_size`] = item.selectedSize || '';
      metadata[`${prefix}_gender`] = item.selectedGender || '';
      metadata[`${prefix}_playerName`] = item.playerName || '';
      metadata[`${prefix}_playerNumber`] = item.playerNumber || '';
      metadata[`${prefix}_badge`] = item.addBadge ? 'Yes' : '';
      metadata[`${prefix}_notes`] = item.notes || '';
    });
    metadata['item_count'] = String(items.length);

    const response = await fetch('https://merchant.revolut.com/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Revolut-Api-Version': '2024-09-01',
      },
      body: JSON.stringify({
        amount: totalAmount,
        currency: 'GBP',
        description,
        merchant_order_ext_ref: `VEXER-${Date.now()}`,
        metadata,
        redirect_url: 'https://vexer.org?success=true',
        cancel_url: 'https://vexer.org?cancelled=true',
      }),
    });

    const order = await response.json();
    if (!response.ok) return res.status(500).json({ error: order.message || 'Failed to create order' });
    if (!order.checkout_url) return res.status(500).json({ error: 'No checkout URL returned' });

    res.status(200).json({ url: order.checkout_url });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}