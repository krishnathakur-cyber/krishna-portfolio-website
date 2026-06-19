import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './src/server/config/db';
import apiRouter from './src/server/routes/api';

// Instantly initialize configuration
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize dynamic database connection safely
  await connectDB();

  // Basic security middleware setups
  app.use(express.json());
  app.use(cors());

  // Gentle Helmet Integration: Bypass inside iframe dev mode to allow scripts and websockets
  if (process.env.NODE_ENV === 'production') {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
            imgSrc: ["'self'", "data:", "https://*"],
            connectSrc: ["'self'", "ws:", "wss:", "https://*"],
          },
        },
      })
    );
  }

  // Bind All API Routes
  app.use('/api', apiRouter);

  // Serve static UI client via Vite Engine
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚡ Mounting Vite Middleware in Development mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // This hooks Vite assets into Express handling
    app.use(vite.middlewares);
  } else {
    console.log('📦 Serving compiled static client folder...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Automated Portfolio API Service listening on port http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Server crash sequence triggered:', error);
});
