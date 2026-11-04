import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate Kit
  app.post("/api/generate-kit", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server." });
      }

      const { vibe, musicKey } = req.body;
      const vibeText = vibe && vibe !== 'Random' && vibe !== 'Vibe' ? `The style/vibe should be: ${vibe}. If it's cat-related (Neko, Chaton, Miaou, Zoomies), incorporate playful, bouncy, feline Miaou character and cute arcade sound design.` : 'Choose a random arcade/retro video game vibe or fun cat-themed Miaou vibe.';
      const keyText = musicKey && musicKey !== 'Random' && musicKey !== 'Keys' ? `Force the key to be EXACTLY: ${musicKey}.` : 'Choose a random musical key.';

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a retro 8-bit/16-bit arcade Miaou music producer AI. Create an 8-pad Glitch-Pad kit.
Make the music sound authentic to retro video games and cute Miaou soundboards.
${vibeText}
${keyText}
Ensure all notes are musically coherent and in key.
The output must be a valid JSON object matching the requested schema.
There must be exactly 8 pads. 
Mix different types: 2 drums (kick/snare), 2 basslines, 2 leads, 2 chords/arps.
For sequences, provide an array of exactly 16 elements (16th notes in a 4/4 bar). Use note names like "C3", "Eb4", or null for a rest.
IMPORTANT: Each pad's 'name' must be exactly TWO words, and each word must be NO MORE THAN 8 letters long (in French or English fitting the theme, e.g. "Miaou Lead", "Pattes Kick", "Ronron Bass").`;

      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          key: { type: Type.STRING, description: "Musical key, e.g. 'C Minor'" },
          tempo: { type: Type.INTEGER, description: "BPM, e.g. 120" },
          pads: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                name: { type: Type.STRING },
                type: { type: Type.STRING, description: "'drum', 'bass', 'lead', or 'chord'" },
                synthParams: {
                  type: Type.OBJECT,
                  properties: {
                    oscillatorType: { type: Type.STRING, description: "'square', 'sawtooth', 'triangle', or 'pwm'" }
                  },
                  required: ["oscillatorType"]
                },
                sequence: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING, nullable: true },
                  description: "Array of exactly 16 elements, either note names like 'C4' or null."
                }
              },
              required: ["id", "name", "type", "synthParams", "sequence"]
            }
          }
        },
        required: ["key", "tempo", "pads"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      });

      const jsonStr = response.text || '';

      if (!jsonStr) {
        throw new Error("Empty response from AI");
      }

      const kit = JSON.parse(jsonStr);
      res.json(kit);
    } catch (error: any) {
      console.error("Failed to generate kit:", error);
      res.status(500).json({ error: error.message || "Failed to generate kit." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
