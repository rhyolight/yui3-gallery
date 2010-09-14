(function() {
    
    var RAPHAEL_SRC = {
        raw: 'http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael.js',
        min: 'http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael-min.js'
    };
    
    function RaphaelLoader(opts) {
        var NAME = 'RaphaelLoader';
        opts = opts || {};
        var defaults = {
            type: 'min'
        };
        opts = Y.mix(opts, defaults);
        return {
            use: function(cb) {
				var scriptOpts = {};
				scriptOpts.onSuccess	= function( d ) {
				    var oldR = Raphael;
				    var newR = function() {
				        Y.log('getting Raphael through YUI...', 'info', NAME);
				        var R = oldR.apply(oldR, arguments);
				        return applyEventAugmentation(R);
				    };
				    cb(newR);
				};
				scriptOpts.onTimeout  = function( d ) {
				    // TODO
				};
				Y.Get.script( RAPHAEL_SRC[opts.type], scriptOpts );
            }
        };
    }
    
    function applyEventAugmentation(r) {
        var i=0, vectors = ['rect', 'circle', 'ellipse', 'path', 'text'], cache = {};
        Y.Array.each(vectors, function(fnName) {
            cache[fnName] = r[fnName];
            r[fnName] = function() {
                Y.log('call to internally replaced "' + fnName + '" function');
                var inst = cache[fnName].apply(r, arguments);
                inst.$node = new Y.Node(inst.node);
                return Y.augment(inst, Y.EventTarget);
            };
        });
        return r;
    }
    
    Y.Raphael = RaphaelLoader;
    
}());