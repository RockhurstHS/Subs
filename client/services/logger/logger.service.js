app.service('Logger', function() {
    var self = this;

    // logger that prints json objects and prevents circular reference
    self.log = function(msg, obj) {
        console.log('\n');
        if (obj) {
            try {
                console.log(msg + JSON.stringify(obj));
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
                console.log('cleaned-by-logger-' + msg + JSON.stringify(simpleObject)); // returns cleaned up JSON
            }
        } else {
            console.log(msg);
        }
    };
});