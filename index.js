const core = require('@actions/core');
const github = require('@actions/github');

try {
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  core.notice('Something happened that you might want to know about.')
} catch (error) {
  core.setFailed(error.message);
}
