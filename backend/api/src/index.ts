import express from 'express';
import cors from 'cors';
import UserController from './controllers/v1/user.controller';
import registerControllers from './utils/registerControllers';

const app = express();
const port = 4000;

// Define base path for API version 1
const API_V1_BASE_PATH = '/api/v1';

// Middleware
app.use(cors());
app.use(express.json());

// Register versioned routes
registerControllers(app, [UserController], API_V1_BASE_PATH);

// Error handling for undefined routes (404)
app.use((_req, res) => {
  res.status(404).json({ error: 'NotFound' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
