console.log('🚀 TEST EDGE FUNCTION STARTED!');

Deno.serve((req) => {
  const url = new URL(req.url);
  console.log('Request:', url.pathname);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      path: url.pathname,
      message: 'New edge function is working!' 
    }),
    { 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      } 
    }
  );
});

console.log('🎉 TEST EDGE FUNCTION READY!');
