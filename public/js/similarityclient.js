
/**
 *  Generates an interactive network 
 *  of related research articles
 */


var PALETTE = Object.freeze({
    0: '#ffe0e7',
    1: '#f6f1f4',
    2: '#d3f4ff',
    3: '#fef5dc',
    4: '#d2ffe1',
    5: '#e1e0ff',
});


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


function loadSimilar() {

    var article = window.localStorage.getItem('article');
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


function redirectIndex() {
    $('.similarity-logo').click(function(evnt) {
        evnt.preventDefault();
        window.location.href = '/';
    });
}


function resizeCanvas() {

    $('canvas')
        .width(window.innerWidth)
        .height(window.innerHeight);
    
    $('#network')
        .width(window.innerWidth)
        .height(window.innerHeight);

}


function createCanvas() {
    
    var canvas = $('<canvas/>', {
        id: 'network-canvas'
    }).prop({
        width: window.innerWidth,
        height: window.innerHeight
    });
    $('#network').append(canvas);

    var network = $('#network');
    network.css({
        width: window.innerWidth,
        height: window.innerHeight
    });

    return canvas;

}


function populateNetworkRecursive(queries, nodes, edges, iter) {

    var size = 5;
    var dispersion = 10;
    $.ajax({
        type: 'POST',
        data: JSON.stringify({ 
            data: queries[iter],
            from: iter*dispersion+1,
            size: size
        }),
        contentType: 'application/json',
        url: '/similarity',
        success: function(data) {

            var pnodes = [];
            var pedges = [];
            for (var i = 0; i < size && i < data.length; ++i) {
                pnodes.push({
                    id: size*iter+i+1,
                    title: data[i].title,
                    url: data[i].url,
                    color: PALETTE[iter+1]
                });
                pedges.push({
                    from: iter,
                    to: size*iter+i+1
                });
                queries.push(data[i]);
            }
            nodes.update(pnodes);
            edges.update(pedges);
            
            if (iter++ < size) {
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
    nodes.add([{
        id: 0, 
        title:article.title,
        url: article.url,
        // group: 0,
        color: PALETTE[0],
    }]);
    
    var edges = new vis.DataSet();
    edges.on('*', function (event, properties, senderId) {
        //console.log('event', event, properties);
    });
    
    var container = document.getElementById('network');
    var data = {
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
                gravitationalConstant: -100,
                centralGravity: 0.05,
                springLength: 25,
                springConstant: 0.1
            },
            maxVelocity: 120,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {iterations: 100}
        }
    };

    var network = new vis.Network(container, data, options);

    var queries = [article];
    populateNetworkRecursive(queries, nodes, edges, 0);

    network.on("selectNode", function (params) {
        if (params.nodes.length === 1) {
            var node = nodes.get(params.nodes[0]);
            window.open(node.url, '_blank');
        }
    });

    // console.log(queries);

}


$(window).on('load', function() {
    redirectIndex();
    createCanvas();
    generateNetwork();
});


$(window).on('resize', function() {
    resizeCanvas();
})

