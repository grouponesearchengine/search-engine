

function generateArticle(title, url, abstract) {

    return `<div class="similar-wrapper">
      <div class="similar-title"> ${title} </div>
      <div class="similar-url-wrapper">
        <a class="similar-url" href="${url}"> ${url} </a>
      </div>
      <div class="similar-abstract"> ${abstract} </div>
    </div>`;

}



function displayArticles(data) {

    data.forEach(function(elem, index) {

        var article_markup = generateArticle(
                elem.title, elem.url, elem.abstract);
        $('.similarity-layout').append(article_markup);
        $('.similarity-layout').append('<div>&nbsp;</div>')

    });

}


/*

function generateNetwork(data) {

    var nodes = [{
        id: 0,
        label: data[0].title,
        group: 1
    }];
    var edges = [];

    var c = 10;
    for (var i = 0; i < c; ++i) {
        var subnode = nodes[i];
        for (var j = 0; j < c; ++j) {
            var k = c*i+j+1;
            nodes.push({
                id: k,
                label: data[k].title,
                group: i
            });
            edges.push({
                from: subnode.id,
                to: k
            });
            
        }
    }

    var container = document.getElementById('network');
    var network = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'dot',
            size: 16
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {iterations: 150}
        }
    };

    var network = new vis.Network(container, network, options);
    return network;
}

*/


/*

function gatherSimilarArticles() {

    var nodes = [];
    var edges = [];

    var nodes = new vis.Nodes();
    
    var container = document.getElementById('network');
    var network = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'dot',
            size: 16
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {iterations: 150}
        }
    };

    var network = new vis.Network(container, network, options);




    // return network;
}

*/

/*

function gatherSimilarArticles() {

    var article = window.localStorage.getItem('article');
    if (article != null) {
        
        var seeds = 5;
        var articles = {};
        var query_article = JSON.parse(article);
        for (var i = 0; i < seeds+1; ++i) {
            articles[i] = {
                seed: query_article,
                nodes: []
            };

            console.log(articles);
            
            
            
            $.ajax({
                type: 'POST',
                data: JSON.stringify({ 
                    data: query_article 
                }),
                contentType: 'application/json',
                url: '/similarity',
                success: function(data) {
                    // displayArticles(data);
                    
                }
            });

        }

        // display here
        
    }

}

*/


function loadSimilar() {

    var article = window.localStorage.getItem('article');
    // console.log('loadsimilar',article);
    // return;
    if (article != null) {
        article = JSON.parse(article);
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify({ data: article }),
            contentType: 'application/json',
            url: '/similarity',
            success: function(data) {
                // displayArticles(data);
                generateNetwork(data);
            }
        });

    }

}



function generateNetworkTrivial() {

    var nodes = new vis.DataSet();
    nodes.on('*', function (event, properties, senderId) {
        console.log('event', event, properties);
    });
    nodes.add([
        {id: 0, label:"Myriel", group: 1},
        {id: 1, label:"Napoleon", group: 1},
        {id: 2, label:"Baptistine", group: 1},
    ]);


    var edges = new vis.DataSet();
    edges.on('*', function (event, properties, senderId) {
        console.log('event', event, properties);
    });
    edges.add([
        {from: 0, to: 1},
        {from: 0, to: 2},
        {from: 1, to: 2}
    ]);

    var container = document.getElementById('network');
    var data = {
        nodes: nodes,
        edges: edges
    };

    var network = new vis.Network(container, data, {});


    var i = 3;
    setInterval(function() {

        ++i;
        var pnode = [{
            id: i, label: "new", group: 1
        }];
        var pedge = [{
            from: i-1,
            to: i
        }];
        nodes.update(pnode);
        edges.update(pedge);


    }, 1000);

}



function populateNetworkRecursive(queries, nodes, edges, iter) {
    var size = 5;
    $.ajax({
        type: 'POST',
        data: JSON.stringify({ 
            data: queries[iter],
            from: 1,
            size: size
        }),
        contentType: 'application/json',
        url: '/similarity',
        success: function(data) {

            var pnodes = [];
            var pedges = [];
            for (var i = 0; i < size; ++i) {
                pnodes.push({
                    id: size*iter+i+1,
                    label: data[i].title,
                    group: 1
                });
                pedges.push({
                    from: iter,
                    to: size*iter+i+1
                });
                queries.push(data[i]);
            }
            nodes.update(pnodes);
            edges.update(pedges);
            
            if (++iter < size) {
                populateNetworkRecursive(queries, nodes, edges, iter);
            }

        }
    });
}


function generateNetwork() {

    var article = window.localStorage.getItem('article');
    if (article == null) return;
    article = JSON.parse(article);
    
    var nodes = new vis.DataSet();
    nodes.on('*', function (event, properties, senderId) {
        //console.log('event', event, properties);
    });
    nodes.add([
        {id: 0, label:article.title, group: 1}
    ]);
    
    var edges = new vis.DataSet();
    edges.on('*', function (event, properties, senderId) {
        //console.log('event', event, properties);
    });
    
    var container = document.getElementById('network');
    var data = {
        nodes: nodes,
        edges: edges
    };

    var network = new vis.Network(container, data, {});

    var iter = 0;
    var queries = [article];
    populateNetworkRecursive(queries, nodes, edges, iter);

}



$(window).on('load', function() {

    // loadSimilar();

    // gatherSimilarArticles();

    // generateNetworkTrivial();

    generateNetwork();


});

