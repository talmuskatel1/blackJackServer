import { Router } from 'express';
import { getInitialGameState } from '../controllers/gameController';

const router = Router();

router.get('/initial-state', getInitialGameState);

export default router;
