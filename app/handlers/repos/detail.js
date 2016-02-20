import Q from 'q';

export default async function (req, res) {
	const client = req.app.get('github');
	const repo = client.repo(`${req.params.repo_owner}/${req.params.repo_name}`);

	const repoInfo = await Q.ninvoke(repo, 'info');

	const open_issues = repoInfo.open_issues_count;
	const has_issues = repoInfo.has_issues;

	res.json({ open_issues, has_issues });
}
