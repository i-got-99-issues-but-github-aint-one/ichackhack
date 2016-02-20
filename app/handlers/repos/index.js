import Router from 'express-promise-router';
import issues from './issues';
import detail from './detail';

const router = Router({ mergeParams: true });
export default router;

// prefix /repos
router.get('/:repo_owner/:repo_name', detail);
router.use('/:repo_owner/:repo_name/issues', issues);
