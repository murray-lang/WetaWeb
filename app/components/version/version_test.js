'use strict';

describe('wetaApp.version module', function() {
  beforeEach(module('wetaApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
