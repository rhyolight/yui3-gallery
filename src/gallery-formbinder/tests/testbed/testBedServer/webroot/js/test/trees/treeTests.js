YUI().add('tree_suite', function(Y) {
    Y.TestBed.tree_suite = new Y.Test.Suite({
        name: 'Some test case in tree_suite'
    });
    
    Y.TestBed.tree_suite.add(new Y.Test.Case({
        name: 'deciduous tree test case',
        testOaks: function() {},
        testElms: function() {},
        testMaples: function() {}
    }));
});