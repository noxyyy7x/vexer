export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  try {
    const { name, rating, comment, image } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const doc = {
      _type: 'review',
      name,
      rating: Number(rating),
      comment,
      approved: false,
      submittedAt: new Date().toISOString(),
    };

    // If image provided as base64
    if (image) {
      doc.image = image;
    }

    const response = await fetch(`https://${process.env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [{ create: doc }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Sanity error:', data);
      return res.status(500).json({ error: 'Failed to save review' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}