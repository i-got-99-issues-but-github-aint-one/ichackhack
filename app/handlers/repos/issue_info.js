import github from "octonode";
import {getIssueInfo, getIssueComments} from "../../util/octonode_promise.js"

export default async function (req, res) {
    var client = req.app.get('github');
    var repo = client.repo(req.params.repo_owner + "/" + req.params.repo_name);

    // find out some info about the issue the api is being asked about.
    var issue = repo.issue(req.params.issue_id);

    /*
    At some point, we could possibly extend this to look for things which indicate
    positive sentiment, for example +1s, :ship: emoji, etc...
    */

    // look for comments containing +1s.
    // TODO: once we have a cache of comments:
    //       1. use the cached data
    //       2. add a since parameter, so we're not always fetching all of the comments
    var comments = await getIssueComments(issue);

    var plus1s = 0;

    for (let comment of comments) {
        if (comment.body.includes("+1")) {
            plus1s++;
        }
    }

    res.json({
        "plus1s": plus1s
    });
}
