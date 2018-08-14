const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

// サーバ起動時にtemplate fileを読み込んでしまう
// サーバ起動中は、読み込んだ変数を使う
const index_page = fs.readFileSync('./index.ejs', 'utf8');
var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(req, res) {
  var content = ejs.render(index_page, {
    title: 'Indexページ',
    content: 'これはテンプレートを使ったサンプルページです',
  });
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(content)
  res.end()
}