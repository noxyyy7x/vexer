export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  try {
    const { name, rating, comment, imageBase64, imageType } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const projectId = process.env.VITE_SANITY_PROJECT_ID;
    const token = process.env.SANITY_WRITE_TOKEN;

    let imageAsset = null;

    if (imageBase64 && imageType) {
      const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
      const uploadRes = await fetch(`https://${projectId}.api.sanity.io/v2021-06-07/assets/images/production`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': imageType,
        },
        body: buffer,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.document?._id) {
        imageAsset = { _type: 'image', asset: { _type: 'reference', _ref: uploadData.document._id } };
      }
    }

    const doc = {
      _type: 'review',
      name,
      rating: Number(rating),
      comment,
      approved: false,
      submittedAt: new Date().toISOString(),
      ...(imageAsset && { image: imageAsset }),
    };

    const response = await fetch(`https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: [{ create: doc }] }),
    });

    if (!response.ok) return res.status(500).json({ error: 'Failed to save review' });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}