YUI.add("form_binding_tests", function(Y) {
    var assert = Y.Assert;
             
    //-------------------------------------------------------------------------
    // Test Suite 
    //-------------------------------------------------------------------------

    var testSuite = new Y.Test.Suite({
        name: "form_to_obj_suite"
    });
    
    testSuite.add(new Y.Test.Case({
        
        name:'Form to Object binding tests',
        
        _should: {
            error: {
            }
        },
        
        // stores the clean empty form on the first test run
        setUp: function() {
            var f = Y.one('#personal-info');
            f.one('#fname').set('value', 'Matthew');
            f.one('#lname').set('value', 'Taylor');
            f.one('#birth_month option[value=7]').set('selected', true);
            f.one('#birth_day option[value=11]').set('selected', true);
            f.one('#birth_year').set('value', 1978);
            f.one('#bio').set('value', 'This is my entire life story.');
            f.one('#fav-sammiches_cheese').set('checked', true);
            f.one('#fav-sammiches_ham').set('checked', true);
            f.one('#fav-sammiches_rueben').set('checked', true);
            if (!this.cleanFormMarkup) {
                this.cleanFormMarkup = Y.one('#formWrapper').get('innerHTML');
            }
        },
        
        // replaces the dirty form with the clean one
        tearDown: function() {
            Y.one('#formWrapper').set('innerHTML', this.cleanFormMarkup);
        },
        
        testBindTextInput: function(){
            var d = Y.FormBind.pullData('personal-info', '_');
            assert.isNotNull(d.fname, 'No first name value');
            assert.isNotNull(d.lname, 'No last name value');
            assert.areEqual('Matthew', d.fname);
            assert.areEqual('Taylor', d.lname);
        },
        
        testBindRadioInput: function() {
            var d = Y.FormBind.pullData('personal-info', '_');
            assert.isNotNull(d.gender);
            assert.areEqual('male', d.gender);
        },
        
        testBindCheckbox: function() {
            var d = Y.FormBind.pullData('personal-info', '_');
            assert.isNotNull(d['fav-sammiches'], 'Checkbox was null');
            assert.isArray(d['fav-sammiches'], 'Checkbox data was not array');
            assert.areEqual(3, d['fav-sammiches'].length, 'checkbox data wrong length');
            var founds = {cheese:false, ham:false, rueben:false};
            Y.each(d['fav-sammiches'], function(sammy) {
                founds[sammy] = true;
            });
            for(var f in founds) {
                assert.isTrue(founds[f], f + ' was not found');
            };
        },
        
        testBindDate_InMapFormat_MonthAndDayAsComboboxes_YearAsTextInput: function() {
            assert.fail('not implemented');
        },
        
        testBindDate_InMapFormat_MonthAndDayAreText_AndYearIsComboBox: function() {
            assert.fail('not implemented');
        },
        
        testBindTextarea: function() {
            assert.fail('not implemented');
        },
        
        testTheWholeDamnThing_InMap: function() {
            assert.fail('not implemented');
        }

    }));
    
    Y.Test.Runner.add(testSuite);
    
}, "1.0");
