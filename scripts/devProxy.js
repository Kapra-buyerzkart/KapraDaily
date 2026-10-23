const http = require('http');
const net = require('net');
const url = require('url');

const METRO_PORT = 8081;

const server = http.createServer((req, res) => {
  // If request is directed to Metro bundler (10.0.2.2:8081 or localhost:8081)
  const isMetro = req.headers.host && req.headers.host.includes('8081');
  const targetHost = '127.0.0.1';
  const targetPort = isMetro ? METRO_PORT : 80;

  const proxyReq = http.request(
    {
      hostname: targetHost,
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('[Proxy HTTP Error]:', err.message);
    res.writeHead(502);
    res.end('Bad Gateway');
  });

  req.pipe(proxyReq);
});

server.on('connect', (req, clientSocket, head) => {
  const [host, port] = req.url.split(':');
  console.log(`[Proxy CONNECT] -> ${host}:${port}`);
  const targetPort = parseInt(port, 10) || 443;

  const serverSocket = net.connect(targetPort, host, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    if (head && head.length) serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on('error', (err) => {
    console.error(`[Proxy CONNECT Error] ${host}:${port}:`, err.message);
    clientSocket.end();
  });

  clientSocket.on('error', () => {
    serverSocket.end();
  });
});

server.listen(8888, '0.0.0.0', () => {
  console.log('devProxy listening on 0.0.0.0:8888 (Metro + HTTPS forwarding)');
});
