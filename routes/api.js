

var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.sendFile('index.html');
});


router.post('/search', function(req, res) {

    console.log('backend body: '+JSON.stringify(req.body));
    res.send(req.body);

});



module.exports = router;

