import express, { Request, Response } from 'express';
import gameRoutes from './routes/gameRoutes';

const app = express();
const port = 3001;

// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Existing endpoint
app.get('/api/data', (req: Request, res: Response) => {
  console.log("Request received at /api/data");
  res.json({ message: 'Hello from the server!' });
});

// Game-related endpoints
app.use('/api/game', gameRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
