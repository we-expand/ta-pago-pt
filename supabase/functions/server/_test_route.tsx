// TEMPORARY TEST FILE - Diagnostic route to test if server is working
// This should appear in logs when server starts

console.log('🔴🔴🔴 [TEST] Test file loaded!', new Date().toISOString());

export const testRoute = () => {
  console.log('🔴🔴🔴 [TEST] Test route called!');
  return { test: true };
};
