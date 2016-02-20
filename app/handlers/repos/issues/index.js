import Router from 'express-promise-router';
import detail from './detail';

const router = Router({ mergeParams: true });
export default router;

// prefix /repos/:repo_owner/:repo_name/issues
router.get('/:issue_id', detail);
