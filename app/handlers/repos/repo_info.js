import {getRepoInfo} from "../../util/octonode_promise.js"

export default async function (req, res) {
    var client = req.app.get('github');
    var repo = client.repo(req.params.repo_owner + "/" + req.params.repo_name);

    var repoInfo = await getRepoInfo(repo);

    var issue_count = repoInfo.open_issues_count;
    var has_issues = repoInfo.has_issues;

    res.json({
        'open_issues': issue_count,
        'has_issues': has_issues
    });
}


