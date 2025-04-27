import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors(), express.json());

app.post('/search', async (req, res) => {
  const { address } = req.body;
  console.log(`[${new Date().toISOString()}] POST /search, body:`, req.body);

  if (!address) {
    console.warn(`[${new Date().toISOString()}] Missing "address" in request`);
    return res.status(400).json({ error: 'address is required' });
  }

  // выбираем команду и флаги
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
  const scriptPath = path.resolve(__dirname, 'find_simillar.py');
  const pythonArgs = ['-X', 'utf8', scriptPath, address];
  const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };

  console.log(`[${new Date().toISOString()}] Spawning Python:`, pythonCmd, pythonArgs);
  const py = spawn(pythonCmd, pythonArgs, { env });

  py.on('error', err => {
    console.error(`[${new Date().toISOString()}] spawn error:`, err);
    return res.status(500).json({
      error: 'Failed to start Python process',
      details: err.message,
      cmd: pythonCmd,
      args: pythonArgs
    });
  });

  let stdout = '', stderr = '';
  py.stdout.on('data', d => {
    stdout += d.toString();
    console.log(`[PY OUT] ${d}`);
  });
  py.stderr.on('data', d => {
    stderr += d.toString();
    console.error(`[PY ERR] ${d}`);
  });

  py.on('close', code => {
    console.log(`[${new Date().toISOString()}] Python exited ${code}`);
    if (code !== 0) {
      return res.status(500).json({ error: 'Python error', details: stderr });
    }
    try {
      const suggestions = JSON.parse(stdout);
      res.json({ suggestions });
    } catch (e) {
      console.error('JSON parse fail:', e, 'raw:', stdout);
      res.status(500).json({ error: 'Invalid JSON', raw: stdout });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
