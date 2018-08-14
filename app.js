const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css');

var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(req, res) {
  var url_parts = url.parse(req.url, true)

  switch (url_parts.pathname) {

    case '/':
      responst_index(req, res);
      break;
  
    case '/other':
      response_other(req, res);
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

var data = {msg: 'no message...'}

function responst_index(req, res) {

  if (req.method == 'POST') {
    var body = '';

    // データ受信のイベント処理
    req.on('data', (data) => {
      body += data;
    });

    // データ受信終了のイベント処理
    req.on('end', () => {
      data = qs.parse(body);
      setCookie('msg', data.msg, res);
      write_index(req, res);
    })
  } else {
    write_index(req, res);
  }
}

function write_index(req, res) {
  var msg = '※伝言を表示します'
  var cookie_data = getCookie('msg', req);
  var content = ejs.render(index_page, {
    title: 'Index',
    content: msg,
    data: data,
    cookie_data: cookie_data,
  });
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(content);
  res.end();
}

// クッキーの値を設定
function setCookie(key, value, res) {
  var cookie = escape(value);
  res.setHeader('Set-Cookie', [key + '=' + cookie]);
}

// クッキーの値を取得
function getCookie(key, req) {
  var cookie_data = req.headers.cookie != undefined ?
    req.headers.cookie : '';
  var data = cookie_data.split(';') // keyと値がセットになった配列ができる
  for (var i in data) {
    if (data[i].trim().startsWith(key + '=')){
      var result = data[i].trim().substring(key.length + 1);
      return unescape(result);
    }
  }
  return '';
}

function response_other(req, res) {
  var msg = "これはOtherページです"

  if (req.method == 'POST') {
    var body = '';

    // データ受信のイベント処理
    req.on('data', (data) => {
      body += data;
    });

    // データ受信終了のイベント処理
    req.on('end', () => {
      var post_data = qs.parse(body);
      msg += 'あなたは, 「'　+ post_data.msg + '」と書きました';
      var content = ejs.render(other_page, {
        title: 'Other',
        content: msg
      });
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(content);
      res.end();    
    });
  } else {
    var msg = "ページがありません"
    var content = ejs.render(other_page, {
      title: 'Other',
      content: msg
    });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(content);
    res.end();    
  }
}