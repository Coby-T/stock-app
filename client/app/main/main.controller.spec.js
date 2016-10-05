'use strict';

describe('Controller: MainController', function() {

  // load the controller's module
  beforeEach(module('stockTrackerApp'));
  beforeEach(module('stateMock'));
  beforeEach(module('socketMock'));

  var scope;
  var MainController;
  var state;
  var $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $controller, $rootScope, $state) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/stocks')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    state = $state;
    MainController = $controller('MainController', {
      $scope: scope
    });
  }));

  it('should attach a list of stocks to the controller', function() {
    $httpBackend.flush();
    MainController.awesomeStocks.length.should.equal(4);
  });
});
