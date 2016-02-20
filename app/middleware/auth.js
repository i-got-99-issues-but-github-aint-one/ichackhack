import Q from 'q';
import Octonode from 'octonode';

export default function (req, res, next) {
	handle(req, res, next).catch(e => next(e));
}

async function handle(req, res, next) {
	let auth = req.signedCookies.auth;

	if (req.path === '/github_callback') {
		const token = await Q.ninvoke(Octonode.auth, 'login', req.query.code);
		const ghme = Octonode.client(token).me();
		const [info] = await Q.ninvoke(ghme, 'info');

		auth = {
			githubId: info.id,
			githubToken: token,
		};
	}

	if (!auth || req.path === '/github_auth') {
		const redirUrl = Octonode.auth.login(['public_repo']);
		res.redirect(redirUrl);
		return;
	}

	res.cookie('auth', auth, { signed: true, secure: true, httpOnly: true });

	if (req.path === '/github_callback') {
		res.redirect('/');
		return;
	}

	req.auth = auth;

	next();
}
