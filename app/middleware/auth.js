import Q from 'q';
import Octonode from 'octonode';

export default async function (req, res, next) {
	handle(req, res)
	.then(action => {
		if (action === 'next')
			next();
	})
	.catch(error => {
		next(error);
	});
}

async function handle(req, res) {
	let githubId = req.signedCookies.githubId;
	let githubToken = req.signedCookies.githubToken;

	if (req.path === '/github_callback') {
		const token = await Q.ninvoke(Octonode.auth, 'login', req.query.code);
		const ghme = Octonode.client(token).me();
		const info = await Q.ninvoke(ghme, 'info');

		githubId = info.id;
		githubToken = token;
	}

	if (!githubId || !githubToken) {
		const redirUrl = Octonode.login(['public_repo']);
		res.redirect(redirUrl);
		return;
	}

	const cookieOpts = { signed: true, secure: true, httpOnly: true };
	res.cookie('githubId', githubId, cookieOpts);
	res.cookie('githubToken', githubToken, cookieOpts);

	req.auth = { githubId, githubToken };

	return 'next';
}
