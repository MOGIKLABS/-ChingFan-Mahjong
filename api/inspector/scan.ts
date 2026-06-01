/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const SCAN_PROMPT = `Analyze this image of a Hong Kong Mahjong hand. Detect all the tiles laid out. Formulate the best winning hand representation consisting of 4 melds (chow, pung, or kong) and 1 eye (pair) which totals 14 tiles, plus optionally any flowers or seasons tiles shown.

Use this EXACT terminology for tile ID strings:
- Characters: '1w', '2w', '3w', '4w', '5w', '6w', '7w', '8w', '9w'
- Dots: '1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d'
- Bamboo: '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b'
- Winds: 'east', 'south', 'west', 'north'
- Dragons: 'red', 'green', 'white'
- Seasons: 's1', 's2', 's3', 's4'
- Flowers: 'f1', 'f2', 'f3', 'f4'

Respond with JSON only. The shape must be:
{
  "success": true/false,
  "explanation": "English and Cantonese description of tiles found",
  "melds": [
    { "type": "chow|pung|kong", "tiles": ["1w","2w","3w"], "isConcealed": false }
  ],
  "eye": ["5w","5w"],
  "flowers": ["f1","s2"]
}

Ensure 'eye' has exactly 2 identical tile strings. Ensure melds have exactly 3 tiles (chow/pung) or 4 tiles (kong). If the photo doesn't show a valid hand, make your best guess from tiles visible.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Missing image in payload." });
  }

  // Ensure we have a proper data URL
  let imageUrl = image;
  if (!image.startsWith("data:")) {
    imageUrl = `data:image/jpeg;base64,${image}`;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "API key is not configured. Add OPENAI_API_KEY to Vercel environment variables.",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: SCAN_PROMPT },
              {
                type: "image_url",
                image_url: { url: imageUrl, detail: "high" },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: "Empty response from OpenAI." });
    }

    // Parse and validate the JSON response
    const parsed = JSON.parse(content);

    res.setHeader("Content-Type", "application/json");
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to scan mahjong image" });
  }
}
