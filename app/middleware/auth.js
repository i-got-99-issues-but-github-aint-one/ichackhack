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
		const token = await getAccessToken(req.query.code);
		const client = createClient(token);
		const info = await getUserInfo(client);

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

async function getAccessToken(authorizationCode) {
	return await new Promise((resolve, reject) => {
		Octonode.auth.login(authorizationCode, (error, token) => {
			if (error)
				reject(error);
			else
				resolve(token);
		});
	});
}

function createClient(accessToken) {
	return Octonode.client(accessToken);
}

async function getUserInfo(client) {
	return new Promise((resolve, reject) => {
		client.me().info((error, info) => {
			if (error)
				reject(error);
			else
				resolve(info);
		});
	});
}
