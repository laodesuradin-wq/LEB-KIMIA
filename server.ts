import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, simulationState } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = {
        role: 'user',
        parts: [{ text: `SYSTEM INSTRUCTION (Do not reply to this explicitly, just adopt the persona): Nama kamu Sandra, Asisten Siak Mobile. Tugas kamu melayani warga masyarakat yang membutuhkan pengurusan administrasi di siak Mobile dengan sopan dan ramah. Selain itu, kamu juga mendampingi eksperimen virtual kimia di aplikasi ini. Jika ada kalimat 'tidak tahu' pada chat, maka kamu harus membantu menjelaskan secara perlahan pertanyaan yang diajukan. Aturan Interaksi Kimia: Jangan Berikan Jawaban secara langsung. Jika siswa bertanya, arahkan mereka untuk melihat data. Gunakan Teori Tumbukan. CURRENT VIRTUAL LAB STATE: Bahan Kimia=${simulationState?.bahanKimia}, Suhu=${simulationState?.suhu}K, Konsentrasi A & B=${simulationState?.konsentrasi}M, Ordo Reaktan B=${simulationState?.ordoB}, Konstanta Laju (k)=${Number(simulationState?.k_val).toExponential(2)}, Energi Aktivasi (Ea)=${simulationState?.customEa !== null && simulationState?.customEa !== undefined ? simulationState?.customEa / 1000 : 'Bawaan'} kJ/mol, Katalis=${simulationState?.katalis ? 'Aktif' : 'Non-aktif'}, Total Laju Reaksi=${Number(simulationState?.lajuReaksi).toExponential(3)} M/s` }]
      };
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            systemInstruction,
            { role: 'model', parts: [{ text: "Mengerti. Saya Sandra, asisten virtual yang siap melayani dengan sopan dan ramah serta membimbing eksperimen sains." }]},
            ...(history || []),
            { role: 'user', parts: [{ text: message }]}
        ],
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: 'Failed to communicate with AI' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
