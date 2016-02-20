import Router from 'express-promise-router';
import repo_info from './repos/repo_info.js';
import issue_info from './repos/issue_info.js'

const router = Router();
export default router;

// prefix /1

router.get('/repos/:repo_owner/:repo_name', repo_info);
router.get('/repos/:repo_owner/:repo_name/issues/:issue_id', issue_info);
