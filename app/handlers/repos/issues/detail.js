import wu from 'wu';
import Q from 'q';
import Octonode from 'octonode';
import JSONClient from 'json-client-node';

export default async function (req, res) {
	const client = Octonode.client(req.auth.githubToken);
	const repo = client.repo(`${req.params.repo_owner}/${req.params.repo_name}`);

	// find out some info about the issue the api is being asked about.
	const issue = repo.issue(req.params.issue_id);

	/*
	At some point, we could possibly extend this to look for things which indicate
	positive sentiment, for example +1s, :ship: emoji, etc...
	*/

	// configure azure client
	const azure_url = 'https://api.datamarket.azure.com/data.ashx/amla/text-analytics/v1';

	let azure_client = JSONClient(azure_url, {
		'headers': {
			'Authorization': 'Basic ' + req.app.get('azure_key')
		}
	});

	const [comments] = await Q.ninvoke(issue, 'comments');

	// look for comments containing +1s.
	// TODO: once we have a cache of comments:
	//       1. use the cached data
	//       2. add a since parameter, so we're not always fetching all of the comments
	let positive_sentiment = new Map([
		['+1', 0],
		[':ship:', 0],
		['LGTM', 0],
		['lgtm', 0],
		['me too', 0],
	]);

	let user_comments = new Map();

	// work out the overall senitment of the issue

	for (let comment of comments) {

		for (let [token, total] of positive_sentiment) {
			if (comment.body.includes(token)) {
				positive_sentiment.set(token, positive_sentiment.get(token) + 1);
			}
		}

		// collate together all of the different users' comments
		if (!user_comments.has(comment.user.login)) {
			user_comments.set(comment.user.login, comment.body)
		} else {
			user_comments.set(comment.user.login, user_comments.get(comment.user.login) + "\n" + comment.body);
		}
	}

	let user_sentiments = new Map();

	for (let [name, comment] of user_comments) {
		let result = await azure_client('get', 'GetSentiment', {
			'Text': comment
		})

		user_sentiments.set(name, result.Score);
	}

	// we can now look at the maximum, average and minimum sentiments of each
	// of the users:
	const sentiment_score = wu(user_sentiments.values()).reduce((a, b) => a + b, 0) / user_sentiments.size;

	// TODO: correlate this with other data, like the contributors' ranks etc.

	res.json({
		"comment_count": comments.length,
		"positive_strings": wu(positive_sentiment.values()).reduce((a, b) => a + b, 0),
		"sentiment_score": sentiment_score
	});
}
