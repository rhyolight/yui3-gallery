YUI().add('color_suite', function(Y) {
    Y.TestBed.color_suite = new Y.Test.Suite({
        name: 'Some test case in color_suite'
    });
    
    Y.TestBed.color_suite.add(new Y.Test.Case({
        name: 'primary color test case',
        testRedThings: function() {},
        testBlueThings: function() {},
        testYellowThings: function() {}
    }));
});