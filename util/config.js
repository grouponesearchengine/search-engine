

module.exports = function(express) {

    var express = require('express');
    var path = require( 'path' );
    var bodyParser = require('body-parser');
    var logger = require('morgan');

    var app = express();
    app.use(express.static(path.join( __dirname, '../public' )));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    
    var api = require('../routes/api.js');
    app.use(api);

    return app;

}

