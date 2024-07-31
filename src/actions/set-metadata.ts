import * as core from '@actions/core';
import { inspect } from 'util';
import { Metadata } from '../Metadata.js';
import { getOctokit, getIssueBody, getRepo, updateIssueBody } from '../GitHub.js';

async function run() {
  try {
    await exec();
  } catch (err: any) {
    core.debug(inspect(err))
    core.setFailed(err);
  }
}
run();


async function exec() {
  const inputs = {
    github_token: core.getInput('github_token', { required: true }),
    repository: core.getInput('repository', { required: true }),
    issue_number: core.getInput('issue_number', { required: true }),
    metadata_marker: core.getInput('metadata_marker', { required: true }),
    metadata_value: core.getInput('metadata_value', { required: true }),
    github_api_url: core.getInput('github_api_url', { required: true }),
  };

  const repo = getRepo(inputs.repository);
  const octokit = getOctokit(inputs.github_token, inputs.github_api_url);
  const metadata = new Metadata(inputs.metadata_marker);

  const issueBody = await getIssueBody(octokit, repo, parseInt(inputs.issue_number));
  if (!issueBody) {
    throw new Error(`Issue body is empty!`);
  }

  const newIssueBody = metadata.replaceOrAddMetadata(issueBody, inputs.metadata_value);
  await updateIssueBody(octokit, repo, parseInt(inputs.issue_number), newIssueBody);
}