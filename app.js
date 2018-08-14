const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url')

// サーバ起動時にtemplate fileを読み込んでしまう
// サーバ起動中は、読み込んだ変数を使う
const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css');

var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(req, res) {
  var url_parts = url.parse(req.url)
  switch (url_parts.pathname) {

    case '/':
      var content = ejs.render(index_page, {
        title: 'Indexページ',
        content: 'これはテンプレートを使ったサンプルページです',
      });
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(content);
      res.end();
      break;
  
    case '/other':
      var content = ejs.render(other_page, {
        title: 'Otherページ',
        content: 'これは新しく用意したページです',
      });
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(content);
      res.end();
      break;
      
    case '/style.css':
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(style_css);
      res.end();
      break;

    default:
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('no page...');
      break;
  }
}