

var express = require('express');
var router = express.Router();


var ElasticSearch = require('../util/search');
var elasticsearch = new ElasticSearch();


router.get('/', function(req, res) {
    res.sendFile('index.html');
});


router.post('/search', function(req, res) {

    var query_text = req.body.text;
    elasticsearch.search(query_text)
    .then(function(data) {
        res.send(data);
    })
    .catch(console.log);
    
});


module.exports = router;

