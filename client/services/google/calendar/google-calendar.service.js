app.service('GoogleCalendar', function($http, $log, moment) {
    
    $log.debug('\n--- SERVICE: GoogleCalendar ---\n\n');

    var self = this;
    
    var calendarId = 'rockhursths.edu_vm6bt9h5uust4qkr1tqnkmtnac@group.calendar.google.com';

    var KEY = 'AIzaSyDU1yMxRcZrs8M_dT9SeLxs6hT7Nzmqjyk';
    
    self.getDay = function(date) {
        date = '08-17-2017';
        var startMin = moment(date, 'MM-DD-YYYY').format();
        var startMax = moment(startMin).add(1, 'days');
        var https = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?singleEvents=true&orderBy=startTime&sortOrder=ascending&timeMin=' + moment(startMin).format() + '&timeMax=' + moment(startMax).format() + '&key=' + KEY;
        
        $http.get(https).then(function(response) {
            $log.debug('\nGoogleCalendar service requested url: ' + https);
            $log.debug('\nGoogleCalendar service got result: ' + JSON.stringify(response));
            
            if(response.data && response.data.items) {
                var items = response.data.items;
                
                var dayRegex = /[ABCDEF] Day/;
                
                for(var i = 0; i < items.length; i++) {
                    var summary = items[i].summary;
                    if(summary.search(/[ABCDEF] Day/) !== -1) {
                        //todo Match = 18 because 18 is the index of the match
                        console.log('\nMATCH = ' + summary.search(/[ABCDEF] Day/));
                    }
                }
            }
        });
    };
});