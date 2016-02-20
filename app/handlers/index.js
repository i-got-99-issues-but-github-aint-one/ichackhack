import Router from 'express-promise-router';
import repos from './repos';

const router = Router();
export default router;

// prefix /
router.use('/repos', repos);
