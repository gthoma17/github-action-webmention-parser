# Example PR Usage

This file demonstrates how to use the webmention parser action.

## Creating a Test PR

To test the action, create a PR with:

**Title:** "New webmention from example.com"

**Body:**
```
I found a great mention of our blog post!

Source: https://example.com/blog/mentioning-us
Target: https://myblog.com/blog/original-post

This is a test webmention to see how our parser works.
```

## Expected Behavior

1. The workflow will trigger because the title starts with "New webmention"
2. The action will extract the source and target URLs
3. It will fetch the source URL and parse microformats
4. A `newWebmention.json` file will be created
5. A comment will be posted on the PR with the parsed data

## Alternative Format

You can also use positional URLs without labels:

**Body:**
```
https://source-site.com/post/123
https://target-site.com/post/456

Description of the webmention...
```

The first URL will be treated as the source, the second as the target.