var fs = require('fs'); // file systems
var jwt = require('jsonwebtoken'); // json web tokens
var http = require('http'); // http protocol
var express = require('express'); // web server
var request = require('request'); // http trafficer
var jwkToPem = require('jwk-to-pem'); // converts json web key to pem
var bodyParser = require('body-parser'); // http body parser
var mongodb = require('mongodb'); // MongoDB driver

var Mongo = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

var keyCache = {}; // public key cache

const MONGO_URL = 'mongodb://localhost:27017/subs';
const CLIENT_ID = fs.readFileSync('bin/CLIENT_ID', 'utf8');

const ADMINS = fs.readFileSync('bin/ADMINS', 'utf8').split('\r\n');
const SUPERADMINS = fs.readFileSync('bin/SUPERADMINS', 'utf8').split('\r\n');
const TEACHERS = fs.readFileSync('bin/TEACHERS', 'utf8').split('\r\n');

/**
 * MongoDB operations
 * connects to MongoDB and registers a series of asynchronous methods
 */
Mongo.connect(MONGO_URL, function(err, db) {
    
    // TODO: handle err
    if(err) {
        log('You should know... there was an error in the Mongo connection');
    }

    Mongo.ops = {};
    
    Mongo.ops.find = function(collection, json, callback) {
        db.collection(collection).find(json).toArray(function(error, docs) {
            if(callback) callback(error, docs);
        });
    };
    
    Mongo.ops.findOne = function(collection, json, callback) {
        db.collection(collection).findOne(json, function(error, doc) {
            if(callback) callback(error, doc);
        });
    };

    Mongo.ops.insert = function(collection, json, callback) {
        db.collection(collection).insert(json, function(error, result) {
            if(callback) callback(error, result);
        });
    };

    Mongo.ops.upsert = function(collection, query, json, callback) {
        db.collection(collection).updateOne(query, { $set: json }, { upsert: true }, function(error, result) {
            if (callback) callback(error, result);
        });
    };
    
    Mongo.ops.updateOne = function(collection, query, json, callback) {
        db.collection(collection).updateOne(query, { $set : json }, function(error, result) {
            if(callback) callback(error, result);
        });
    };
    
    Mongo.ops.deleteOne = function(collection, query, callback) {
        db.collection(collection).deleteOne(query, function(error, result) {
            if(callback) callback(error, result);
        });
    };
    
    Mongo.ops.deleteMany = function(collection, query, callback) {
        db.collection(collection).deleteMany(query, function(error, result) {
            if(callback) callback(error, result);
        });
    };
});



// web server
var app = express();

// use middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(allowCrossDomain);
app.use(logAllRequests);
app.use('/api', authorize);
app.use('/api/admin', adminAuthorize);

app.use('/', express.static('../client/'));

app.post('/api/request', function(req, res) {
    Mongo.ops.insert('request', payload(req), function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(201).send(result);
    });
});

app.get('/api/request/:requestid', function(req, res) {
    var query = { _id : new ObjectID(req.params.requestid) };
    query.userid = getUserId(req);
    Mongo.ops.findOne('request', query, function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(201).send(result);
    });
});

app.put('/api/request/:requestid', function(req, res) {
    var query = { _id : new ObjectID(req.params.requestid) };
    delete req.body._id;
    Mongo.ops.updateOne('request', query, req.body, function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(200).send(result);
    });
});

// returns all requests
app.get('/api/requests', function(req, res) {
    // todo: limit to just last week, this week, and next week.
    var query = {};
    Mongo.ops.find('request', query, function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(200).send(result);
    });
});

// returns personal requests, as well as sub assignments
app.get('/api/requests/:userid', function(req, res) {
    var idToken = req.headers.authorization;
    var decoded = jwt.decode(idToken);
    var e = decoded.email;
    var u = decoded.sub;
    
    var query = { '$or' : [ { assignedTo : e } , { userid : u } ] };

    Mongo.ops.find('request', query, function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(200).send(result);
    });
});

// update a faculty members sub availability
app.put('/api/admin/faculty/availability', function(req, res) {
    var query = {
        email : req.body.email,
    };
    var data = {
        slots : new Array(8)
    };
    data.slots[req.body.slot - 1] = req.body.status;
    
    Mongo.ops.upsert('faculty', query, data, function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(200).send(result);
    });
});

app.get('/api/admin/requests', function(req, res) {
    Mongo.ops.find('request', {}, function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(200).send(result);
    });
});

app.post('/api/admin/teacher', function(req, res) {
    var query = req.body;
    var data = req.body;
    Mongo.ops.upsert('faculty', query, data, function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(201).send(result);
    });
});

app.get('/api/teachers', function(req, res) {
    var query = {};
    Mongo.ops.find('faculty', query, function(error, result) {
        if(error) res.status(500).send(error);
        else res.status(200).send(result);
    });
});

app.get('/api/credential', function(req, res) {
    var cred = {};
    if(isUserAdmin(req))
        cred.admin = true;
    if(isUserSuperadmin(req))
        cred.superadmin = true;
    res.status(200).send(cred);
});

app.post('/task', function(req, res) {
    Mongo.ops.insert('task', payload(req), function(error, result) {
        log('post /task = ', payload(req));
        if(error) res.status(500).send(error);
        else res.status(201).send(result);
    });
});

app.put('/task/:taskId', function(req, res) {
    var query = { _id : new ObjectID(req.params.taskId) };
    query.userid = getUserId(req);
    Mongo.ops.updateOne('task', query, req.body, function(error, result) {
        log('put /task/:taskId = ', query);
        if(error) res.status(500).send(error);
        else res.status(200).send(result);
    });
});

app.delete('/task/:taskId', function(req, res) {
    var query = payload(req);
    query._id = new ObjectID(req.params.taskId);
    Mongo.ops.deleteOne('task', query, function(error, result) {
        log('delete /task/:taskId = ', query);
        if(error) res.status(500).send(error);
        else res.status(200).send(result);
    });
});

app.get('/tasks', function(req, res) {
    Mongo.ops.find('task', payload(req), function(error, docs) {
        log('get /tasks = ', payload(req));
        if(error) res.status(500).send(error);
        else res.status(200).send(docs);
    });
});

// listen on port 3000
app.listen(3000, function() {
    cacheWellKnownKeys();
    log('listening on port 3000');
});

/**
 * Middleware:
 * log all requests
 */
function logAllRequests(req, res, next) {
    console.log('\n' + JSON.stringify({
        path : req.path,
        remoteAddress : req.connection.remoteAddress,
        headers : req.headers,
        body : req.body
    }));
    next();
}

/**
 * Middleware:
 * allows cross domain requests
 * ends preflight checks
 */
function allowCrossDomain(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    // end pre flights
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
    } else {
        next();
    }
}

/**
 * Middlware:
 * validate tokens and authorize users
 */
function authorize(req, res, next) {

    // jwt.decode: https://github.com/auth0/node-jsonwebtoken#jwtdecodetoken--options
    // jwt.verify: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback

    try {
        var token       = req.headers.authorization;
        var decoded     = jwt.decode(token, { complete: true });
        var keyID       = decoded.header.kid;
        var algorithm   = decoded.header.alg;
        var iss         = decoded.payload.iss;
        var pem         = getPem(keyID);

        if (iss === 'accounts.google.com' || iss === 'https://accounts.google.com') {
            var options = {
                audience: CLIENT_ID,
                issuer: iss,
                algorithms: [algorithm]
            }

            jwt.verify(token, pem, options, function(err) {
                if (err) {
                    res.writeHead(401);
                    res.end();
                } else {
                    next();
                }
            });            

        } else {
            res.writeHead(401);
            res.end();
        }
    } catch (err) {
        res.writeHead(401);
        res.end();
    }
}

/**
 * Middleware:
 * validate admin requests (used on /api/admin/*)
 */
function adminAuthorize(req, res, next) {
    if(!isUserAdmin(req)) {
        res.status(403).send("Eh, but you're not an admin...?");
    } else {
        next();
    }
}

function isUserAdmin(req) {
    var idToken = req.headers.authorization;
    var email = jwt.decode(idToken).email;
    if(ADMINS.indexOf(email) === -1)
        return false;
    else
        return true;
}

function isUserSuperadmin(req) {
    var idToken = req.headers.authorization;
    var email = jwt.decode(idToken).email;
    if(SUPERADMINS.indexOf(email) === -1)
        return false;
    else
        return true;
}

/**
 * Attach user ID to their payload
 */
function payload(req) {
    if(req.body) {
        var data = req.body;
        data.userid = getUserId(req);
        return data;        
    } else {
        return { userid : getUserId(req) };
    }
}

/**
 * Get userid from idtoken in authorization header
 */
function getUserId(req) {
    var idToken = req.headers.authorization;
    return jwt.decode(idToken).sub;
};

/**
 * Converts json web key to pem key
 */
function getPem(keyID) {
    var jsonWebKeys = keyCache.keys.filter(function(key) {
        return key.kid === keyID;
    });
    return jwkToPem(jsonWebKeys[0]);
}

/**
 * Cache Google's well known public keys
 */
function cacheWellKnownKeys() {

    // get the well known config from google
    request('https://accounts.google.com/.well-known/openid-configuration', function(err, res, body) {
        var config = JSON.parse(body);
        var address = config.jwks_uri; // ex: https://www.googleapis.com/oauth2/v3/certs

        // get the public json web keys
        request(address, function(err, res, body) {

            keyCache.keys = JSON.parse(body).keys;

            // example cache-control header: 
            // public, max-age=24497, must-revalidate, no-transform
            var cacheControl = res.headers['cache-control'];
            var values = cacheControl.split(',');
            var maxAge = parseInt(values[1].split('=')[1]);

            // update the key cache when the max age expires
            setTimeout(cacheWellKnownKeys, maxAge * 1000);

            log('Cached keys = ', keyCache.keys);
        });
    });
}

/**
 * Custom logger to prevent circular reference in JSON.parse(obj)
 */
function log(msg, obj) {
    console.log('\n');
    if (obj) {
        try {
            console.log(msg + ', ' + JSON.stringify(obj));
        } catch (err) {
            var simpleObject = {};
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop)) {
                    continue;
                }
                if (typeof(obj[prop]) == 'object') {
                    continue;
                }
                if (typeof(obj[prop]) == 'function') {
                    continue;
                }
                simpleObject[prop] = obj[prop];
            }
            console.log('circular-' + msg + ', ' + JSON.stringify(simpleObject)); // returns cleaned up JSON
        }
    } else {
        console.log(msg);
    }
}