'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /monitor when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/monitor");
  });


  describe('monitor', function() {

    beforeEach(function() {
      browser.get('index.html#!/monitor');
    });


    it('should render monitor when user navigates to /monitor', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('blockly', function() {

    beforeEach(function() {
      browser.get('index.html#!/blockly');
    });


    it('should render blockly when user navigates to /blockly', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
