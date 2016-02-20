import Q from 'q';
import Octonode from 'octonode';

export default async function (req, res) {
	const client = Octonode.client(req.auth.githubToken);
	const repo = client.repo(`${req.params.repo_owner}/${req.params.repo_name}`);

	// find out some info about the issue the api is being asked about.
	const issue = repo.issue(req.params.issue_id);

	/*
	At some point, we could possibly extend this to look for things which indicate
	positive sentiment, for example +1s, :ship: emoji, etc...
	*/

	// look for comments containing +1s.
	// TODO: once we have a cache of comments:
	//       1. use the cached data
	//       2. add a since parameter, so we're not always fetching all of the comments
	const [comments] = await Q.ninvoke(issue, 'comments');

	let plus1s = 0;

	for (let comment of comments) {
		if (comment.body.includes('+1'))
			plus1s++;
	}

	res.json({ plus1s });
}
