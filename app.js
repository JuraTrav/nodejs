const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  console.log(req.headers)
  
  if (req.url === '/api/file' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    let contentLength = parseInt(req.headers['content-length']);
    if (isNaN(contentLength) || contentLength <= 0 ) {
      res.statusCode = 411;
      res.end(JSON.stringify({status: "error", description: "No File"}))
      return
    }

    const filename = 'file1.txt'
    const filestream = fs.createWriteStream(`${__dirname}/stream-files/${filename}`)

    filestream.on("error", (error) => {
      console.error(error)
      res.statusCode = 400;
      res.write(JSON.stringify({status: "error", description: error}))
      res.end()
    })

    req.pipe(filestream)

    req.on('end', () => {
      filestream.close(() => {
        res.end(JSON.stringify({status: "success"}))
      })
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log('Server started on port 3000')
});
