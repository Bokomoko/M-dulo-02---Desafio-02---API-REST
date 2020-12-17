// servidor web
const express = require('express');
// parser the html
const bodyParser = require('body-parser');
// log para fins de debug
const logger = require('morgan');
// path para manipular paths na criação de arquivos
const path = require('path');

// criar o servidor
const myServer = express();

// obtem a porta em que o servidor vai ouvir. default 8080
const PORT = process.env.PORT || 8080;

// ambiente de desenvolvimento
const NODE_ENV = process.env.NODE_ENV || 'development';
// configura o servidor
myServer.set('port', PORT);
myServer.set('env', NODE_ENV);
myServer.use(logger('tiny'));
// req.body já vem em json
myServer.use(bodyParser.json());

// o arquvivo index.js vai ser incluido aqui e vai criar as rotas
require('./src/Routes/index')(myServer);

console.log('Grades Server started\nListening on port', PORT);
// ativa o servidor
myServer.listen(PORT);
