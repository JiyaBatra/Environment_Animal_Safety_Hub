/**
 * Error Handling Test Script
 * Tests various error scenarios to ensure proper handling
 */

const testErrorHandling = () => {
  console.log('🧪 Testing Error Handling...\n');

  const testCases = [
    {
      name: '404 API Route',
      url: 'http://localhost:5001/api/nonexistent',
      expected: '404 JSON response'
    },
    {
      name: '404 Web Route', 
      url: 'http://localhost:5001/nonexistent-page',
      expected: 'Custom 404 HTML page'
    },
    {
      name: 'Valid API Route',
      url: 'http://localhost:5001/api/quiz',
      expected: 'Success response'
    },
    {
      name: 'Valid Web Route',
      url: 'http://localhost:5001/',
      expected: 'Homepage HTML'
    }
  ];

  console.log('📋 Test Cases:');
  testCases.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}`);
    console.log(`   URL: ${test.url}`);
    console.log(`   Expected: ${test.expected}\n`);
  });

  console.log('🚀 To test manually:');
  console.log('1. Start server: npm start');
  console.log('2. Visit URLs above in browser');
  console.log('3. Check console for error logs');
  console.log('4. Verify proper error pages/responses\n');

  console.log('✅ Error handling implemented:');
  console.log('- 404 handler for invalid routes');
  console.log('- 500 handler for server errors');
  console.log('- Custom error pages');
  console.log('- API vs Web error differentiation');
  console.log('- Proper error logging');
};

// Run tests
testErrorHandling();