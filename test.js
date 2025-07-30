const { parseUrls, fetchUrl, parseMicroformats } = require('./index.js');

async function runTests() {
  console.log('Running tests...');
  
  // Test URL parsing
  console.log('\n1. Testing URL parsing...');
  
  const testBody1 = `
New webmention from example.com

Source: https://example.com/post/123
Target: https://myblog.com/post/456
  `;
  
  const { source, target } = parseUrls(testBody1);
  console.log(`Parsed source: ${source}`);
  console.log(`Parsed target: ${target}`);
  
  if (source === 'https://example.com/post/123' && target === 'https://myblog.com/post/456') {
    console.log('✅ URL parsing test passed');
  } else {
    console.log('❌ URL parsing test failed');
  }
  
  // Test positional URL parsing
  const testBody2 = `
New webmention from somewhere

https://first.com/page
https://second.com/page
  `;
  
  const { source: source2, target: target2 } = parseUrls(testBody2);
  console.log(`\nPositional parsing - Source: ${source2}, Target: ${target2}`);
  
  if (source2 === 'https://first.com/page' && target2 === 'https://second.com/page') {
    console.log('✅ Positional URL parsing test passed');
  } else {
    console.log('❌ Positional URL parsing test failed');
  }
  
  console.log('\n2. Testing HTML fetch and microformat parsing...');
  
  // Test with a simple HTML string (simulating a fetched page)
  const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <article class="h-entry">
    <h1 class="p-name">Test Blog Post</h1>
    <p class="p-summary">This is a test post</p>
    <time class="dt-published" datetime="2024-01-01">January 1, 2024</time>
    <a class="p-author h-card" href="https://example.com">John Doe</a>
  </article>
</body>
</html>
  `;
  
  try {
    const microformats = await parseMicroformats(testHtml);
    console.log('Microformats parsed successfully:');
    console.log(JSON.stringify(microformats, null, 2));
    console.log('✅ Microformat parsing test passed');
  } catch (error) {
    console.log('❌ Microformat parsing test failed:', error.message);
  }
  
  console.log('\nAll tests completed!');
}

runTests().catch(console.error);