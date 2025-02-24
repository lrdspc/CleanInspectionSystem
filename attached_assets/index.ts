import express from "express";
import path from 'path';

const app = express();

// Basic middleware
app.use(express.json());

// Serve static files from the dist/public directory
app.use(express.static(path.join(process.cwd(), 'dist/public')));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(process.cwd(), 'dist/public', 'index.html'));
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running`);
  console.log(`Port: ${PORT}`);
  console.log(`Host: 0.0.0.0`);
  console.log(`Process ID: ${process.pid}`);
  console.log(`Time: ${new Date().toISOString()}`);
});