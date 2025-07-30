const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const microformat = require('microformat-node');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // Get inputs
    const prBody = core.getInput('pr-body');
    const githubToken = core.getInput('github-token');
    const prNumber = core.getInput('pr-number');
    
    // Create GitHub client
    const octokit = github.getOctokit(githubToken);
    const context = github.context;
    
    // Parse URLs from PR body
    const { source, target } = parseUrls(prBody);
    
    if (!source || !target) {
      throw new Error('Could not find both source and target URLs in PR body');
    }
    
    core.info(`Found source URL: ${source}`);
    core.info(`Found target URL: ${target}`);
    
    // Fetch and parse the source URL
    const sourceContent = await fetchUrl(source);
    const microformats = await parseMicroformats(sourceContent);
    
    // Create webmention object
    const webmention = {
      source: source,
      target: target,
      microformats: microformats,
      createdAt: new Date().toISOString()
    };
    
    // Save to file
    const outputPath = path.join(process.cwd(), 'newWebmention.json');
    fs.writeFileSync(outputPath, JSON.stringify(webmention, null, 2));
    
    core.info(`Created webmention file: ${outputPath}`);
    core.setOutput('webmention-file', outputPath);
    
    // Comment on PR with the JSON
    const comment = `## Webmention Parsed Successfully ✅

**Source:** ${source}
**Target:** ${target}

**Parsed Microformats:**
\`\`\`json
${JSON.stringify(webmention, null, 2)}
\`\`\`

The webmention data has been saved to \`newWebmention.json\`.`;

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
      body: comment
    });
    
    core.info('Successfully commented on PR');
    
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

function parseUrls(prBody) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = prBody.match(urlRegex) || [];
  
  // Look for explicit source/target labels or assume first is source, second is target
  let source = null;
  let target = null;
  
  // Try to find labeled URLs
  const sourceMatch = prBody.match(/source:?\s*(https?:\/\/[^\s]+)/i);
  const targetMatch = prBody.match(/target:?\s*(https?:\/\/[^\s]+)/i);
  
  if (sourceMatch) source = sourceMatch[1];
  if (targetMatch) target = targetMatch[1];
  
  // Fallback to positional URLs if no labels found
  if (!source && urls.length > 0) source = urls[0];
  if (!target && urls.length > 1) target = urls[1];
  
  return { source, target };
}

async function fetchUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}

async function parseMicroformats(html) {
  return new Promise((resolve, reject) => {
    microformat.get({
      html: html
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Run the action
if (require.main === module) {
  run();
}

module.exports = { run, parseUrls, fetchUrl, parseMicroformats };