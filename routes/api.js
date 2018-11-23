

var express = require('express');
var router = express.Router();
var path = require('path');


var ElasticSearch = require('../util/search');
var elasticsearch = new ElasticSearch();

// uncomment to load data into repo
// elasticsearch.bulk_index_repo('repository/', 'science', 'articles');

router.get('/', function(req, res) {
    res.sendFile('index.html');
});


router.post('/search', function(req, res) {

    var query_text = req.body.text;
    elasticsearch.search(query_text)
        .then(function(data) {
            res.send(data);
        })
        .catch(console.error);
    
});


router.get('/similarity', function(req, res) {
    // res.sendFile('views/similarity.html', {'root': __dirname+'/../public'});

    // res.sendFile(path.join(__dirname, '../public', 'views/similarity.html'));
    // res.sendFile('views/similarity.html');
    // res.redirect('/similarity.html');
    // res.redirect('views/similarity.html');

    // res.redirect('views/similarity.html');
    res.sendFile('/similarity.html', {
        root: __dirname + '/../public/views'
    });
    
});


//router.post('/similarity', function(req, res) {
//    console.log('post /similarity!');
//    return res.sendStatus(200);
//});



/*

router.post('/similarity', function(req, res) {

    var query_text = req.body.data;
    // console.log(query_text);

    elasticsearch.similar(query_text)
        .then(function(data) {
            // res.send(data);
            res.sendFile('views/similarity.html', data);
        })
        .catch(console.error);

    // res.send(query_text);

});

*/

module.exports = router;

