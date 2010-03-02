YUI.add("form_to_obj_tests", function(Y) {
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
            f.one('#birth_month option[value=3]').set('selected', true);
            f.one('#birth_day option[value=11]').set('selected', true);
            f.one('#birth_year').set('value', 1971);
            f.one('#bio').set('text', 'This is my entire life story.');
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
            var d = Y.FormBind.pullData('personal-info', '_');
            assert.isNotNull(d.birth, 'birth date array was null');
            assert.areEqual(1971, d.birth.year, 'wrong year of birth');
            assert.areEqual('3', d.birth.month, 'wrong month of birth');
            assert.areEqual(11, d.birth.day, 'wrong day of birth');
        },
        
        testBindDate_InMapFormat_MonthAndDayAreText_AndYearIsComboBox: function() {
            // first replace the month and day combos with text inputs
            Y.one('select#birth_month').remove()
            Y.one('select#birth_day').remove()
            var wrapperDiv = Y.one('#birth div');
            wrapperDiv.append(Y.Node.create('<input type="text" id="birth_month" name="birth_month"/>'));
            wrapperDiv.append(Y.Node.create('<input type="text" id="birth_day" name="birth_day"/>'));
            // now replace the year text input with a select with options
            Y.one('input#birth_year').remove();
            var select = Y.Node.create('<select id="birth_year" name="birth_year"></select>');
            for (var i=1950; i<2000; i++) {
                select.append(Y.Node.create('<option value="' + i + '">'+ i + '</option>'));
            }
            wrapperDiv.append(select);
            var f = Y.one('#personal-info');
            f.one('#birth_month').set('value', 'March');
            f.one('#birth_day').set('value', 11);
            f.one('#birth_year option[value=1971]').set('selected', true);
            
            var d = Y.FormBind.pullData('personal-info', '_');
            assert.isNotNull(d.birth, 'birth date array was null');
            assert.areEqual(1971, d.birth.year, 'wrong year of birth');
            assert.areEqual('March', d.birth.month, 'wrong month of birth');
            assert.areEqual(11, d.birth.day, 'wrong day of birth');        
        },
        
        testBindTextarea: function() {
            var d = Y.FormBind.pullData('personal-info', '_');
            assert.isNotNull(d.bio, 'text area input was null');
            assert.areEqual('This is my entire life story.', d.bio, 'wrong text area input');
        },
        
        testTheWholeDamnThing_InMap: function() {
            var d = Y.FormBind.pullData('personal-info', '_');
            assert.isNotNull(d.fname, 'No first name value');
            assert.isNotNull(d.lname, 'No last name value');
            assert.areEqual('Matthew', d.fname);
            assert.areEqual('Taylor', d.lname);
            assert.isNotNull(d.gender);
            assert.areEqual('male', d.gender);
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
            assert.isNotNull(d.birth, 'birth date array was null');
            assert.areEqual(1971, d.birth.year, 'wrong year of birth');
            assert.areEqual('3', d.birth.month, 'wrong month of birth');
            assert.areEqual(11, d.birth.day, 'wrong day of birth');
            assert.isNotNull(d.bio, 'text area input was null');
            assert.areEqual('This is my entire life story.', d.bio, 'wrong text area input');
        },
        
        testButtonValuesAreNotPulled: function() {
            var d = Y.FormBind.pullData('personal-info', '_');
            assert.isUndefined(d.submit);
            assert.isUndefined(d.cancel);
        }

    }));
    
    Y.Test.Runner.add(testSuite);
    
}, "1.0");
