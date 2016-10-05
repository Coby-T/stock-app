(function(angular, undefined) {
'use strict';

angular.module('stockTrackerApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin']})

;
})(angular);