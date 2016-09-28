'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('appApp')
  .controller('NavbarController', NavbarController);
