async function handleRequest(request) {
  return new Response(html, {
    headers: { 'content-type': 'text/html' },
  });
}

