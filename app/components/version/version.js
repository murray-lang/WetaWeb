'use strict';

angular.module('myApp.version', [
  'wetaApp.version.interpolate-filter',
  'wetaApp.version.version-directive'
])

.value('version', '0.1');
