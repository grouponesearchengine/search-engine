


module.exports = function(express) {

    
    var app = express();

    // var path = require('path');
    var logger = require('morgan');

    app.use(logger('dev'));
    // app.get('/', 'hey');

    return app;

}


