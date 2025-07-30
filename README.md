# GitHub Action: Webmention Parser

A GitHub Action that automatically parses webmentions from pull requests and extracts microformat data.

## Features

- 🚀 Triggers automatically when a PR is created with title starting with "New webmention"
- 📄 Extracts source and target URLs from PR descriptions
- 🔍 Fetches and parses microformats from the source URL
- 📝 Creates a `newWebmention.json` file with the parsed data
- 💬 Comments on the PR with the extracted information

## Usage

This action automatically runs when you create a pull request with a title that starts with "New webmention".

### PR Format

Your PR should include both source and target URLs in the body. You can format them in two ways:

**Option 1: Labeled URLs**
```
Source: https://example.com/post/123
Target: https://myblog.com/post/456
```

**Option 2: Positional URLs**
```
https://source-url.com/post/123
https://target-url.com/post/456
```

### Example

1. Create a PR with title: "New webmention from example.com"
2. In the PR body, include:
   ```
   Source: https://example.com/blog/my-post
   Target: https://myblog.com/blog/original-post
   ```
3. The action will automatically:
   - Download the content from the source URL
   - Parse it for microformats
   - Create `newWebmention.json` with the results
   - Comment on the PR with the parsed data

## Output

The action creates a `newWebmention.json` file with the following structure:

```json
{
  "source": "https://example.com/blog/my-post",
  "target": "https://myblog.com/blog/original-post",
  "microformats": {
    "items": [...],
    "rels": {...},
    "rel-urls": {...}
  },
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

## Development

To test locally:

```bash
npm install
npm test
```

## License

MIT
