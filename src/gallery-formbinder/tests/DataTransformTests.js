YUI.add("data_xform_tests", function(Y) {
    var assert = Y.Assert;
             
    //-------------------------------------------------------------------------
    // Test Suite 
    //-------------------------------------------------------------------------

    var testSuite = new Y.Test.Suite({
        name: "label_normalization_suite"
    });
    
    testSuite.add(new Y.Test.Case({
        name:'Data transformation tests',
        
        testNormalizeObject_OneElement: function() {
            var d = {fname: 'Matt'};
            var res = Y.FormBind.normalizeLabels(d);
            assert.areEqual('Matt', res.fname);
        },
        
        testNormalizeObject_TwoElements: function() {
            var d = {fname: 'Matt', lname: 'Taylor'};
            var res = Y.FormBind.normalizeLabels(d);
            assert.areEqual('Matt', res.fname);
            assert.areEqual('Taylor', res.lname);
        },
        
        testNormalizeObjectInArray_OneElement: function() {
            var d = [{fname:'Matt'}];
            var res = Y.FormBind.normalizeLabels(d);
            assert.areEqual('Matt', res.fname);
        },
        
        testNormalizeObjectInArray_TwoElementsInMap: function() {
            var d = [{fname:'Matt', lname: 'Taylor'}];
            var res = Y.FormBind.normalizeLabels(d);
            assert.areEqual('Matt', res.fname);
            assert.areEqual('Taylor', res.lname);
        },
        
        testNormalizeObjectInArray_TwoMaps: function() {
            var d = [{fname:'Matt'}, {lname: 'Taylor'}];
            var res = Y.FormBind.normalizeLabels(d);
            assert.areEqual('Matt', res.fname);
            assert.areEqual('Taylor', res.lname);
        },
        
        testNormalizeLabeledObject_OneElement: function() {
            var d = [{label: 'fname', data:'Matt'}];
            var res = Y.FormBind.normalizeLabels(d);
            assert.areEqual('Matt', res.fname);
        },
        
        testNormalizeLabeledObject_TwoElements: function() {
            var d = [{label: 'fname', data:'Matt'}, {label: 'lname', data:'Taylor'}];
            var res = Y.FormBind.normalizeLabels(d);
            assert.areEqual('Matt', res.fname);
            assert.areEqual('Taylor', res.lname);
        },
        
        testNormalize_Mixtureof_LabeledObject_AndObject: function() {
            var d = [{label: 'fname', data:'Matt'}, {lname:'Taylor'}];
            var res = Y.FormBind.normalizeLabels(d);
            assert.areEqual('Matt', res.fname);
            assert.areEqual('Taylor', res.lname);
        },
        
        testSpecialCase_DateAndFormat: function() {
            var d = [{label:'birth', data:{date:'1971/03/11', format: '%Y/%b/%d'}}];
            var res = Y.FormBind.normalizeLabels(d, '_');
            assert.areEqual(1971, res.birth_year);
            assert.areEqual(3, res.birth_month);
            assert.areEqual(11, res.birth_day);
        },
        
        testGroupedObject: function() {
            var d = {'group-one': {seven: '7', eight: '8', nine: '9'}};
            var res = Y.FormBind.normalizeLabels(d, '_');
            assert.isNotUndefined(res['group-one_seven']);
            assert.areEqual('7', res['group-one_seven']);
            assert.isNotUndefined(res['group-one_eight']);
            assert.areEqual('8', res['group-one_eight']);
            assert.isNotUndefined(res['group-one_nine']);            
            assert.areEqual('9', res['group-one_nine']);
        },
        
        testComplexGroupedObject: function() {
            var d = {'group-one': {seven: '7', eight: {red:'bird', blue:'jay'}, nine: '9'}};
            var res = Y.FormBind.normalizeLabels(d, '_');
            assert.isNotUndefined(res['group-one_seven']);
            assert.areEqual('7', res['group-one_seven']);
            assert.isNotUndefined(res['group-one_eight_red']);
            assert.areEqual('bird', res['group-one_eight_red']);
            assert.isNotUndefined(res['group-one_eight_blue']);
            assert.areEqual('jay', res['group-one_eight_blue']);
            assert.isNotUndefined(res['group-one_nine']);            
            assert.areEqual('9', res['group-one_nine']);
        },
        
        testGroupedDetailObject: function() {
            var d = [{label:'birth', data:{year:1971, month:3, day:11}}];
            var res = Y.FormBind.normalizeLabels(d, '_');
            assert.isNotUndefined(res['birth_year']);
        },
        
        testComplexGroupedDetailObject: function() {
            var d = [
                {label:'bio', data:'This is my entire life story.'},
                {label:'birth', data:{date:'1971/03/11', format: '%Y/%b/%d'}},
                {label:'fname', data:'Matthew'}, {label:'lname', data:'Taylor'},
                {label: 'gender', data:'male'},
                {label: 'fav-sammiches', data: ['cheese', 'ham', 'rueben']}
            ];
            var res = Y.FormBind.normalizeLabels(d, '_');

            assert.isNotUndefined(res['bio']);
            assert.areEqual('This is my entire life story.', res['bio']);
            
            assert.isNotUndefined(res['birth_year']);
            assert.areEqual(1971, res['birth_year']);
            assert.isNotUndefined(res['birth_month']);
            assert.areEqual(3, res['birth_month']);
            assert.isNotUndefined(res['birth_day']);
            assert.areEqual(11, res['birth_day']);
            
            assert.isNotUndefined(res['fname']);
            assert.areEqual('Matthew', res['fname']);
            assert.isNotUndefined(res['lname']);
            assert.areEqual('Taylor', res['lname']);
            assert.isNotUndefined(res['gender']);
            
            assert.areEqual('male', res['gender']);
            
            assert.isNotUndefined(res['fav-sammiches']);
            var sams = ['cheese', 'ham', 'rueben'];
            for (var i in sams) {
                var found = false;
                for (var j in res['fav-sammiches']) {
                    if (res['fav-sammiches'][j] == sams[i]) { found = true; }
                }
                assert.isTrue(found, 'Needed ' + sams[i] + ' in results, but not found');
            }
        }
        
    }));
    
    Y.Test.Runner.add(testSuite);

    testSuite = new Y.Test.Suite({
        name: 'contains_group_suite'
    });
    
    testSuite.add(new Y.Test.Case({
        name: 'Contains Group stuff',
        
        testContainsGroup_WithNoGroupReturnsFalse: function() {
            assert.isFalse(Y.FormBind.containsGroup({no:'group',right:'here'}));
        },
        
        testContainsGroup_WithGroupReturnsTrue: function() {
            assert.isTrue(Y.FormBind.containsGroup({mygroup:{red:'birds', blue:'jays'}}));
        },
        
        testContainsGroup_WithOnlyArrayReturnsFalse: function() {
            assert.isFalse(Y.FormBind.containsGroup({myarray:[1,2,3,4,5]}));
        },

        testContainsGroup_WithDateObjectReturnsFalse: function() {
            assert.isFalse(Y.FormBind.containsGroup({birth: new Date(1971, 6, 11, 0, 0, 0, 0)}));
        }
        
    }));
    
    Y.Test.Runner.add(testSuite);
        
}, "1.0");
