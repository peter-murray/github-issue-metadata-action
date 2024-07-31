# github-issue-metadata-action

This action exists to inject and extract metadata hidden inside an Issue body contents.

## set-metadata

An action that will allow you to set some metadata into an issue.

### Parameters

* `github_token`: GitHub token used for access, defaults to `${{ github.token }}`
* `repository`: Optional repository full name, i.e. `<owner>/<repo>` for the repositoryt hat hosts the issues, defaults to `${{ github.repository }}`
* `issue_number`: The issue number that will be used to store the metadata
* `metadata_marker`: Optional metadata marker/key name for the metadata object, defaults to `bootstrap`.
* `metadata_value`: The actual string value to set for the value of the metadata
* `github_api_url`: Optional GitHub API URL to use for accessing the issue, defaults to the `${{ github.api_url}}` from the actions runtime


## get-metadata

An action that will fetch any existing metadata from an issue.

### Parameters

* `github_token`: GitHub token used for access, defaults to `${{ github.token }}`
* `repository`: Optional repository full name, i.e. `<owner>/<repo>` for the repositoryt hat hosts the issues, defaults to `${{ github.repository }}`
* `issue_number`: The issue number that will be used to store the metadata
* `metadata_marker`: Optional metadata marker/key name for the metadata object, defaults to `bootstrap`.
* `metadata_parse_json_payload`: A boolean flag that will further parse the content for the marker metadata as JSON and then provide outputs for each key in the data under `metadata_value_<key>` in the outputs
* `github_api_url`: Optional GitHub API URL to use for accessing the issue, defaults to the `${{ github.api_url}}` from the actions runtime

### Outputs

* `metadata_value`: The string value of the metadata sorted in the marker
* `metadata_value_<key>`: The additional key based metadata values if the `metadata_parse_json_payload` is set to `true`.