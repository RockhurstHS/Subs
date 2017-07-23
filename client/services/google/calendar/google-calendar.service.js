app.service('GoogleCalendar', function($http, moment) {
    var self = this;
    
    var calendarId = 'rockhursths.edu_vm6bt9h5uust4qkr1tqnkmtnac@group.calendar.google.com';

    var KEY = 'AIzaSyDU1yMxRcZrs8M_dT9SeLxs6hT7Nzmqjyk';
    
    self.getDay = function(date) {
        date = '08-17-2017';
        var startMin = moment(date, 'MM-DD-YYYY').format();
        var startMax = moment(startMin).add(1, 'days');
        console.log('min = ' + startMin);
        console.log('max = ' + startMax);
        var https = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?singleEvents=true&orderBy=startTime&sortOrder=ascending&timeMin=' + moment(startMin).format() + '&timeMax=' + moment(startMax).format() + '&key=' + KEY;
        
        $http.get(https).then(function(response) {
            console.log(JSON.stringify(response));
            
            if(response.data && response.data.items) {
                var items = response.data.items;
                
                var dayRegex = /[ABCDEF] Day/;
                
                for(var i = 0; i < items.length; i++) {
                    var summary = items[i].summary;
                    if(summary.search(/[ABCDEF] Day/) !== -1) {
                        console.log('MATCH = ' + summary.search(/[ABCDEF] Day/));
                    }
                }
            }
        });
        console.log(https);
    };
});