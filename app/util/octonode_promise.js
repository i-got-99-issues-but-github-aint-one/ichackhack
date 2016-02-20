export async function getRepoInfo(repo) {
    return new Promise(function(resolve, reject) {
        repo.info(function(error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

export async function getRepoIssues(repo) {
    return new Promise(function(resolve, reject) {
        repo.issues(function(error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

export async function getIssueInfo(issue) {
    return new Promise(function(resolve, reject) {
        issue.info(function(error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    })
}

export async function getIssueComments(issue) {
    return new Promise(function(resolve, reject) {
        issue.comments(function(error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    })
}
