/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Missing image cargo in payload." });
  }

  const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let mimeType = "image/jpeg";
  let base64Data = image;

  if (matches && matches.length === 3) {
    mimeType = matches[1];
    base64Data = matches[2];
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "Gemini API Key is not configured. Add GEMINI_API_KEY to Vercel environment variables.",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `Analyze this image of a Hong Kong Mahjong hand. Detect all the tiles laid out. Formulate the best winning hand representation consisting of 4 melds (chow, pung, or kong) and 1 eye (pair) which totals 14 tiles, plus optionally any flowers or seasons tiles shown in raw.

Use this EXACT terminology for the tile ID strings in the values arrays:
- Characters: '1w', '2w', '3w', '4w', '5w', '6w', '7w', '8w', '9w'
- Dots: '1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d'
- Bamboo: '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b'
- Winds: 'east', 'south', 'west', 'north'
- Dragons: 'red', 'green', 'white'
- Seasons: 's1', 's2', 's3', 's4'
- Flowers: 'f1', 'f2', 'f3', 'f4'

Ensure 'eye' has exactly 2 identical tile strings if found. Ensure melds have exactly 3 tiles (chow, pung) or 4 tiles (kong). If the photo doesn't have a valid hand, make a very close best-guess based on the tiles present.`,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["success", "melds", "eye", "flowers", "explanation"],
          properties: {
            success: { type: Type.BOOLEAN, description: "Whether the hand could be scanned or parsed successfully" },
            explanation: { type: Type.STRING, description: "English and traditional Cantonese explanation describing what tiles were found" },
            melds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["type", "tiles"],
                properties: {
                  type: { type: Type.STRING, description: "Must be 'chow', 'pung', or 'kong'" },
                  tiles: {
                    type: Type.ARRAY,
                    description: "List of tile ID strings representing the meld",
                    items: { type: Type.STRING },
                  },
                  isConcealed: { type: Type.BOOLEAN },
                },
              },
            },
            eye: {
              type: Type.ARRAY,
              description: "List of exactly 2 identical tile strings representing the pair 'eye'",
              items: { type: Type.STRING },
            },
            flowers: {
              type: Type.ARRAY,
              description: "List of flower/season tile strings found in photo",
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return res.status(502).json({ error: "Received empty response from Gemini." });
    }

    res.setHeader("Content-Type", "application/json");
    res.send(responseText);
  } catch (err: any) {
    console.error("Gemini scan error:", err);
    res.status(500).json({ error: err.message || "Failed to scan mahjong image" });
  }
}
