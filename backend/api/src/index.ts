import express from 'express';
import cors from 'cors';
import UserController from './controllers/v1/user.controller';
import TeamController from './controllers/v1/team.controller';
import registerControllers from './utils/registerControllers';
import MatchController from './controllers/v1/match.controller';
import RankingController from './controllers/v1/ranking.controller';
import DeleteController from './controllers/v1/delete.controller';
import LoggingController from './controllers/v1/logging.controller';

const app = express();
const port = 4000;

// Define base path for API version 1
const API_V1_BASE_PATH = '/api/v1';

// Middleware
app.use(cors());
app.use(express.json());

// Register versioned routes
registerControllers(
  app,
  [UserController, TeamController, MatchController, RankingController, DeleteController, LoggingController],
  API_V1_BASE_PATH,
);

// Error handling for undefined routes (404)
app.use((_req, res) => {
  res.status(404).json({ error: 'NotFound' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
