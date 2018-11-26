
/**
 *  Generates an interactive network 
 *  of related research articles
 */


var PALETTE = Object.freeze({
    0: '#f6f1f4',
    1: '#ffe0e7',
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


function sizeCanvas() {

    //var canvas = $('#network canvas')[0];
    //canvas.height = window.innerHeight;
    //canvas.width = window.innerWidth;

    var canvas = document.getElementById('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    console.log(canvas);


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
                    title: data[i].title,
                    url: data[i].url,
                    //group: iter+1,
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

    var queries = [article];
    var network = new vis.Network(container, data, {});
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

    sizeCanvas();
    generateNetwork();

});

