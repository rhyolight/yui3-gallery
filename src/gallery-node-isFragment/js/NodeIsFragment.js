/**
 * Provides functions to bind JavaScript data objects to HTML forms, and extract
 * HTML form data back into JavaScript data objects.
 * @module FormBind
 * @requires node
 */
YUI().add('NodeIsFragment', function(Y) {

    function NodeIsFragment() {}
    
    NodeIsFragment.prototype.isFragment = function() {
        return this._node.nodeType === 11;
    };

    Y.Node = Y.augment(Y.Node, NodeIsFragment);
    
}, '0.1', { requires: ['node'] });