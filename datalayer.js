
exports.view = function(path, query, callback) {
    console.log('VIEW: ' + JSON.stringify(path) + '\n' + query);
    get_collection(path.customer, path.path, path.method, function(collection, resource) {
        callback(collection, true);
    },
    function() {
        callback(null, false);
    });
}

exports.create = function(path, body, callback) {
    console.log('CREATE: ' + JSON.stringify(path) + '\n' + JSON.stringify(body));
    get_collection(path.customer, path.path, path.method, function(collection, resource) {
        body['_id'] = collection.length + '';
        collection.push(body);
        callback(body['_id'], true);
    },
    function() {
        callback(null, false);
    });
}

exports.update = function(path, body, callback) {
    console.log('UPDATE: ' + JSON.stringify(path) + '\n' + body);
    
    callback(true);
}

exports.delete = function(path, query, callback) {
    console.log('DELETE: ' + JSON.stringify(path) + '\n' + query);
    callback(true);
}

var get_collection = function(customer_id, path, method, successCallback, notFoundCallback) {
    for (var id in customers) {
        if (customer_id == id) {
            var resources = customers[customer_id]['resources'];
            for (var r_id in resources) {
                var r = resources[r_id];
                if (path.match(r['uri']) && method == r['method']) {
                    var c = r['data_model']['collection'];
                    successCallback(customer_data[c], r);
                    return
                }
            }
        }
        notFoundCallback();
    }
};

//####################
//# Fake database.
//####################

var customers = {
    'megapong' : {}
};
var customer_data = {};

customers['megapong']['resources'] = {
    0 : {
        'uri' : 'leaderboard',
        'method' : 'GET',
        'data_model' : {
            'collection' : '09723603846',
            'key' : '_id',
            'groups' : {}
        }
    },
    1 : {
        'uri' : 'highscore',
        'method' : 'POST',
        'data_model' : {
            'collection' : '09723603846',
            'key' : '_id',
            'groups' : {}
        }
    },
    2 : {
        'uri' : 'highscore\/(\d+)',
        'method' : 'PUT',
        'data_model' : {
            'collection' : '09723603846',
            'key' : '_id',
            'groups' : {
                1 : '_id'
            }
        }
    },
    3 : {
        'uri' : 'highscore\/(\d+)',
        'method' : 'DELETE',
        'data_model' : {
            'collection' : '09723603846',
            'key' : '_id',
            'groups' : {
                1 : '_id'
            }
        }
    }
};

customer_data['09723603846'] = [
    { '_id' : '0', 'BEN' : 45093 },
    { '_id' : '1',  'GUY' : 44863 },
    { '_id' : '2',  'BEN' : 42944 },
    { '_id' : '3',  'FRD' : 42493 },
    { '_id' : '4',  'BRB' : 35937 },
    { '_id' : '5',  'TED' : 32974 },
    { '_id' : '6',  'TED' : 15353 },
    { '_id' : '7',  'AAA' : 3425 }
];