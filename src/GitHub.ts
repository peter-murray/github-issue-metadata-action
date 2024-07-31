import { Octokit } from '@octokit/rest';
import { OctokitOptions } from '@octokit/core';
import * as core from '@actions/core';

export type Repo = {
  owner: string,
  repo: string
}

export function getRepo(repository: string): Repo {
  const parts = repository.split('/');
  if (parts.length !== 2) {
    throw new Error(`Invalid repository format: ${repository}`);
  }

  return {
    owner: parts[0],
    repo: parts[1]
  };
}

export function getOctokit(token: string, baseUrl?: string): Octokit {
  const options: OctokitOptions = {
    auth: token
  };

  if (baseUrl) {
    options.baseUrl = baseUrl;
  }

  return new Octokit(options);
}

export async function updateIssueBody(octokit: Octokit, repo: Repo, issueNumber: number, data: string) {
  try {
    await octokit.rest.issues.update({
      ...repo,
      issue_number: issueNumber,
      body: data
    });
  } catch(err: any) {
    core.setFailed(`Failed to update issue body for issue number ${issueNumber} on repository ${repo.owner}/${repo.repo}; ${err.message}`);
  }
}

export async function getIssueBody(octokit: Octokit, repo: Repo, issueNumber: number): Promise<string | undefined> {
  let issueBody: undefined | null | string;

  try {
    const issueResult = await octokit.rest.issues.get({
      ...repo,
      issue_number: issueNumber,
    });

    if (issueResult.status !== 200) {
      throw new Error(`unexpected status code fetching issue: ${issueResult.status}`);
    }

    issueBody = issueResult.data.body;
  } catch (err: any) {
    throw new Error(`Failed to fetch the issues details for issue number ${issueNumber} on repository ${repo.owner}/${repo.repo}; ${err.message}`);
  }

  return issueBody || undefined;
}