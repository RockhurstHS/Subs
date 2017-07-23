app.component('home.calendar', {
    templateUrl: 'components/home/calendar/home-calendar.template.html',
    controller: function HomeCalendarController($scope, GoogleCalendar, Request) {
        
        
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        GoogleCalendar.getDay(new Date(y, m, d - 2));

        
        $scope.reqs = [];
            
        Request.getUserRequests().then(function(response) {
            console.log(JSON.stringify(response.data));
        });
        
        Request.getUserRequests().then(function(response) {
            response.data.forEach(function(req) {
                console.log(req._id);
                var evt = {
                    id: req._id, 
                    title: 'Period ' + req.timeslot + '-' + req.className, 
                    start: new Date(req.date),
                    allDay: true
                };
                console.log(evt);
                $scope.reqs.push(evt);
            });
            $scope.$apply();
        });

        // https://fullcalendar.io/docs/event_data/events_array/
        $scope.sources1 = [
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
            {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false}
        ];
        
        $scope.sources2 = [
            {title: 'All Day Event',start: new Date(y, m, 1)},
            {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)}
        ];
        
        $scope.eventSources = [
            $scope.sources1,
            $scope.sources2,
            $scope.reqs
        ];
        
        $scope.alertEventOnClick = function() {
            console.log('cal click');
        }

        $scope.uiConfig = {
            calendar: {
                editable: true,
                eventSources: [
                    { events : $scope.sources1, color : 'black' },
                    { events : $scope.sources2, color : 'green' },
                    { events : $scope.reqs, color : '#FBC' }
                ],
                header: {
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                viewRender: function(view, element) {
                    console.log("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
                }
            }
        };
    }
});