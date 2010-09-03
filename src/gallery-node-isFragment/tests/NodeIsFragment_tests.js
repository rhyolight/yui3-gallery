YUI.add("node-isfragment-tests", function(Y) {
    var assert = Y.Assert;
             
    //-------------------------------------------------------------------------
    // Test Suite 
    //-------------------------------------------------------------------------

    var testSuite = new Y.Test.Suite({
        name: "NodeIsFragment tests"
    });
    
    testSuite.add(new Y.Test.Case({
        name:'NodeIsFragment tests',
        
        test_Y_Node_isFragment_returnsFalse_forFullDOMNodes: function() {
            
            var n = Y.Node.create("<div></div>");
            
            assert.isFalse(n.isFragment(), 'node was not a fragment, but isFragment() returned true');
            
        },
        
        test_Y_Node_isFragment_returnsTrue_forPartials: function() {
            
            var n = Y.Node.create("<div></div><div></div>");
            
            assert.isTrue(n.isFragment(), 'node was a fragment, but isFragment() returned false');
            
        }
        
    }));
    
    Y.Test.Runner.add(testSuite);
        
}, "1.0", {requires: ['test', 'NodeIsFragment']});
