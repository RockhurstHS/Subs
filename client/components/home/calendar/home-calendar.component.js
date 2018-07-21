app.component('home.calendar', {
    templateUrl: 'components/home/calendar/home-calendar.template.html',
    controller: function HomeCalendarController($log, $scope, GoogleCalendar, Request, Auth) {
        
        $log.debug('\n--- COMPONENT: home.calendar ---\n\n');
        
        
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        GoogleCalendar.getDay(new Date(y, m, d - 2));

        $scope.userReqs = [];
        $scope.otherReqs = [];
        $scope.assignedReqs = [];

        /*
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
        */
        
        function getEvent(req) {
            var evt = {
                id: req._id, 
                title: 'Period ' + req.timeslot + '-' + req.className, 
                start: new Date(req.date),
                allDay: true,
                color: 'red'
            };
            return evt;
        }
        
        Request.getAll().then(function(response) {
            var data = response.data;
            var email = Auth.getUser().email;
            
            $log.debug('component: home.calendar, debug: ');
            $log.debug('Request.getAll() has json: ' + JSON.stringify(data));
                       
            data.forEach(function(subRequest) {
                if(subRequest.email === email) {
                    $scope.userReqs.push(getEvent(subRequest));
                } else if(subRequest.email !== email) {
                    $scope.otherReqs.push(getEvent(subRequest));
                } else if(subRequest.assignedTo === email) {
                    $scope.assignedReqs.push(getEvent(subRequest));
                }
            });
            
            $log.debug('\n$scope.userReqs = ' + $scope.userReqs);
            $log.debug('\n$scope.otherReqs = ' + $scope.otherReqs);
            //$log.debug('\n$scope.assignedReqs = ' + $scope.assignedReqs);
            
            $scope.$apply();
        });
        
        $scope.eventSources = [
            { events : $scope.userReqs, color: '#888' },
            { events : $scope.otherReqs, color: '#CCC' }
            //{ events : $scope.assignedReqs, color: '#ABC' }
        ];
        
        $scope.alertEventOnClick = function() {
            console.log('home cal click');
            console.log($scope.eventSources);
        }

        $scope.uiConfig = {
            calendar: {
                editable: true,
                eventSources: [
                    { events : $scope.userReqs, color: '#888' },
                    { events : $scope.otherReqs, color: '#CCC' }
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