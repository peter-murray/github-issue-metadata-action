import * as core from '@actions/core';
import { inspect } from 'util';
import { Metadata } from '../Metadata.js';
import { getOctokit, getIssueBody, getRepo } from '../GitHub.js';

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
    parse_json: core.getBooleanInput('metadata_parse_json_payload'),
    github_api_url: core.getInput('github_api_url', { required: true }),
  };

  const repo = getRepo(inputs.repository);
  const octokit = getOctokit(inputs.github_token, inputs.github_api_url);
  const metadata = new Metadata(inputs.metadata_marker);

  try {
    const issueBody = await getIssueBody(octokit, repo, parseInt(inputs.issue_number));
    if (!issueBody) {
      throw new Error(`Issue body is empty!`);
    }

    const rawMetadata = metadata.getMetadata(issueBody);
    if (!rawMetadata) {
      core.info(`No metadata found in issue body!`);
    } else {
      core.info(`Found metadata: ${rawMetadata}`);
      core.setOutput('metadata_value', rawMetadata);

      if (inputs.parse_json) {
        try {
          core.startGroup('Parsing metadata as JSON');
          const parsed = JSON.parse(rawMetadata);

          Object.keys(parsed).forEach((key) => {
            const keyName = `metadata_value_${key}`;
            const keyValueString = parsed[key];
            core.info(`Setting output '${keyName}' to '${keyValueString}'`);
            core.setOutput(keyName, keyValueString);
          });
        } catch (err: any) {
          core.setFailed(`Could not parse metadata as JSON: ${err.message}`);
          return;
        } finally {
          core.endGroup();
        }
      }
    }
  } catch (err: any) {
    core.setFailed(`Could not fetch issue body: ${err.message}`);
    return;
  }
}