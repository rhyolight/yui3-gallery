YUI.add("obj_to_form_tests", function(Y) {
    var assert = Y.Assert;
             
    //-------------------------------------------------------------------------
    // Test Suite 
    //-------------------------------------------------------------------------

    var testSuite = new Y.Test.Suite({
        name: "obj_to_form_suite"
    });
    
    testSuite.add(new Y.Test.Case({
        
        name:'Object to Form binding tests',
        
        _should: {
            error: {
                testBindDate_InMapFormat_ThrowsErrorWhenComboboxSelectionDoesntExist: 'Cannot bind value "41" to a combo box without that option available.',
                testDateStringBindingThrowsErrorWhenMissingFormat: 'Cannot bind a date string without a format string. Need something like "format:\'%Y/%b/%d\'" in binding config for date.'
            }
        },
        
        // stores the clean empty form on the first test run
        setUp: function() {
            if (!this.cleanFormMarkup) {
                this.cleanFormMarkup = Y.one('#formWrapper').get('innerHTML');
            }
        },
        
        // replaces the dirty form with the clean one
        tearDown: function() {
            Y.one('#formWrapper').set('innerHTML', this.cleanFormMarkup);
        },
        
        testBindTextInput: function(){
            var d = {fname: 'Matthew', lname: 'Taylor'};
            
            Y.FormBind.pushData(d, 'personal-info');
            
            var fname = Y.one('input#fname').get('value');
            assert.isNotNull(fname, 'first name not entered');
            assert.areEqual('Matthew', fname, 'first name was wrong');
            var lname = Y.one('input#lname').get('value');
            assert.isNotNull(lname, 'last name not entered');
            assert.areEqual('Taylor', lname, 'last name was wrong');
        },
        
        testBindTextInput_InDetailObject: function() {
            var d = [
                {label:'fname', data:'Matthew'}, {label:'lname', data:'Taylor'}
            ];
            
            Y.FormBind.pushData(d, 'personal-info');
            
            var fname = Y.one('input#fname').get('value');
            assert.isNotNull(fname, 'first name not entered');
            assert.areEqual('Matthew', fname, 'first name was wrong');
            var lname = Y.one('input#lname').get('value');
            assert.isNotNull(lname, 'last name not entered');
            assert.areEqual('Taylor', lname, 'last name was wrong');
        },
        
        testBindRadioInput: function() {
            var d = {gender: 'male'};
            
            Y.FormBind.pushData(d, 'personal-info');
            
            assert.isTrue(Y.one('input#gender_male').get('checked'), 'gender_male radio not checked');
            assert.isFalse(Y.one('input#gender_female').get('checked'), 'gender_female radio was checked');
        }, 

        testBindRadioInput_InDetailObject: function() {
            var d = [{label: 'gender', data:'male'}];
            
            Y.FormBind.pushData(d, 'personal-info');
            
            assert.isTrue(Y.one('input#gender_male').get('checked'), 'gender_male radio not checked');
            assert.isFalse(Y.one('input#gender_female').get('checked'), 'gender_female radio was checked');
        },
        
        testBindCheckbox: function() {
            var d = {'fav-sammiches': ['cheese', 'ham', 'rueben']};
            
            Y.FormBind.pushData(d, 'personal-info', '_');
            
            assert.isTrue(Y.one('input#fav-sammiches_cheese').get('checked'), 'cheese was not checked');
            assert.isFalse(Y.one('input#fav-sammiches_egg').get('checked'), 'egg was checked');
            assert.isFalse(Y.one('input#fav-sammiches_chicken').get('checked'), 'chicken was checked');
            assert.isTrue(Y.one('input#fav-sammiches_rueben').get('checked'), 'rueben was not checked');
            assert.isTrue(Y.one('input#fav-sammiches_ham').get('checked'), 'ham was not checked');
        },
        
        testBindCheckbox_InDetailObject: function() {
            var d = [{label: 'fav-sammiches', data: ['cheese', 'ham', 'rueben']}];
            
            Y.FormBind.pushData(d, 'personal-info', '_');
            
            assert.isTrue(Y.one('input#fav-sammiches_cheese').get('checked'), 'cheese was not checked');
            assert.isFalse(Y.one('input#fav-sammiches_egg').get('checked'), 'egg was checked');
            assert.isFalse(Y.one('input#fav-sammiches_chicken').get('checked'), 'chicken was checked');
            assert.isTrue(Y.one('input#fav-sammiches_rueben').get('checked'), 'rueben was not checked');
            assert.isTrue(Y.one('input#fav-sammiches_ham').get('checked'), 'ham was not checked');
        },
        
        testBindCheckbox_WhenSomeCheckboxesAreAlreadyChecked : function() {
            // check all boxes
            Y.all('input[type=checkbox]').each(function(ch) {
                ch.set('checked', true);
            });
            var d = {'fav-sammiches': ['cheese', 'ham', 'rueben']};
            
            Y.FormBind.pushData(d, 'personal-info', '_');
            
            assert.isTrue(Y.one('input#fav-sammiches_cheese').get('checked'), 'cheese was not checked');
            assert.isFalse(Y.one('input#fav-sammiches_egg').get('checked'), 'egg was checked');
            assert.isFalse(Y.one('input#fav-sammiches_chicken').get('checked'), 'chicken was checked');
            assert.isTrue(Y.one('input#fav-sammiches_rueben').get('checked'), 'rueben was not checked');
            assert.isTrue(Y.one('input#fav-sammiches_ham').get('checked'), 'ham was not checked');        
        },
        
        testBindDate_InMapFormat_MonthAndDayAsComboboxes_YearAsTextInput: function() {
            var i = 0, d = [{label:'birth', data:{year:1971, month:3, day:11}}];

            Y.FormBind.pushData(d, 'personal-info', '_');

            // month
            var monthOptions = Y.all('select#birth_month option');
            monthOptions.each(function(monthOption) {
                if (monthOption.get('value') == 3) {
                    assert.isTrue(monthOption.get('selected'), 'because month is 3, month option with value of ' + monthOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(monthOption.get('selected'), 'because month is 3, month option with value of ' + monthOption.get('value') + ' should not be selected');
                }
            });
            // day
            var dayOptions = Y.all('select#birth_day option');
            dayOptions.each(function(dayOption) {
                if (dayOption.get('value') == 11) {
                    assert.isTrue(dayOption.get('selected'), 'because day is 11, day option with value of ' + dayOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(dayOption.get('selected'), 'because day is 11, day option with value of ' + dayOption.get('value') + ' should not be selected');
                }
            });
            // year
            assert.areEqual('1971', Y.one('input#birth_year').get('value'), 'birth year was not correct');
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

            var i = 0, d = [{label:'birth', data:{year:1971, month:3, day:11}}];

            Y.FormBind.pushData(d, 'personal-info', '_');
            
            // month
            assert.areEqual('3', Y.one('input#birth_month').get('value'), 'birth month was not correct');
            // day
            assert.areEqual('11', Y.one('input#birth_day').get('value'), 'birth day was not correct');
            // year
            var yearOptions = Y.all('select#birth_year option');
            yearOptions.each(function(yearOption) {
                if (yearOption.get('value') == 1971) {
                    assert.isTrue(yearOption.get('selected'), 'because year is 1971, year option with value of ' + yearOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(yearOption.get('selected'), 'because year is 1971, year option with value of ' + yearOption.get('value') + ' should not be selected');
                }
            });
        },
        
        // this test is configured to throw a specific error, see this._should.error for details (*vomit*)
        testBindDate_InMapFormat_ThrowsErrorWhenComboboxSelectionDoesntExist: function() {
            var d = [{label:'birth', data:{year:1971, month:3, day:41}}];

            Y.FormBind.pushData(d, 'personal-info', '_');
        },
        
        testBindDateObject: function() {
            var i = 0, d = {birth: new Date(1971, 6, 11, 0, 0, 0, 0)};

            Y.FormBind.pushData(d, 'personal-info', '_');

            // month
            var monthOptions = Y.all('select#birth_month option');
            var month = d.birth.getMonth() + 1, day = d.birth.getDate(), year = d.birth.getFullYear();
            monthOptions.each(function(monthOption) {
                if (monthOption.get('value') == month) {
                    assert.isTrue(monthOption.get('selected'), 'because month is ' + month + ', month option with value of ' + monthOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(monthOption.get('selected'), 'because month is ' + month + ', month option with value of ' + monthOption.get('value') + ' should not be selected');
                }
            });
            // day
            var dayOptions = Y.all('select#birth_day option');
            dayOptions.each(function(dayOption) {
                if (dayOption.get('value') == day) {
                    assert.isTrue(dayOption.get('selected'), 'because day is ' + day + ', day option with value of ' + dayOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(dayOption.get('selected'), 'because day is ' + day + ', day option with value of ' + dayOption.get('value') + ' should not be selected');
                }
            });
            // year
            assert.areEqual('1971', Y.one('input#birth_year').get('value'), 'birth year was not correct');
        },
        
        testBindDateString: function() {
            var i = 0, d = [{label:'birth', data:{date:'1971/03/11', format: '%Y/%b/%d'}}];

            Y.FormBind.pushData(d, 'personal-info', '_');

            // month
            var monthOptions = Y.all('select#birth_month option');
            var month = '3', day = '11', year = '1971';
            monthOptions.each(function(monthOption) {
                if (monthOption.get('value') == month) {
                    assert.isTrue(monthOption.get('selected'), 'because month is ' + month + ', month option with value of ' + monthOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(monthOption.get('selected'), 'because month is ' + month + ', month option with value of ' + monthOption.get('value') + ' should not be selected');
                }
            });
            // day
            var dayOptions = Y.all('select#birth_day option');
            dayOptions.each(function(dayOption) {
                if (dayOption.get('value') == day) {
                    assert.isTrue(dayOption.get('selected'), 'because day is ' + day + ', day option with value of ' + dayOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(dayOption.get('selected'), 'because day is ' + day + ', day option with value of ' + dayOption.get('value') + ' should not be selected');
                }
            });
            // year
            assert.areEqual('1971', Y.one('input#birth_year').get('value'), 'birth year was not correct');
        },
        
        testDateStringBindingThrowsErrorWhenMissingFormat: function() {
            var i = 0, d = [{label:'birth', data:{date:'1971/03/11'}}];

            Y.FormBind.pushData(d, 'personal-info', '_');

        },
        
        testBindTextarea: function() {
            var d = {bio:'This is my entire life story.'};
            
            Y.FormBind.pushData(d, 'personal-info');
            
            assert.areEqual('This is my entire life story.', Y.one('#bio').get('value'));
        },
        
        testBindTextarea_InDetailObject: function() {
            var d = [{label: 'bio', data: 'This is my entire life story.'}];
            
            Y.FormBind.pushData(d, 'personal-info');
            
            assert.areEqual('This is my entire life story.', Y.one('#bio').get('value'));
        },
        
        testPassingFormNode: function() {
            var d = [{label: 'bio', data: 'This is my entire life story.'}];
            
            Y.FormBind.pushData(d, Y.one('#personal-info'));
            
            assert.areEqual('This is my entire life story.', Y.one('#bio').get('value'));
        },
        
        testTheWholeDamnThing_InMap: function() {
            var d = {
                bio:'This is my entire life story.',
                birth: new Date(1971, 2, 11, 0, 0, 0, 0),
                fname: 'Matthew',
                lname: 'Taylor',
                gender:'Male',
                'fav-sammiches': ['cheese', 'ham', 'rueben']
            };
            
            Y.FormBind.pushData(d, 'personal-info', '_');
            
            var fname = Y.one('input#fname').get('value');
            assert.isNotNull(fname, 'first name not entered');
            assert.areEqual('Matthew', fname, 'first name was wrong');
            var lname = Y.one('input#lname').get('value');
            assert.isNotNull(lname, 'last name not entered');
            assert.areEqual('Taylor', lname, 'last name was wrong');
            assert.isTrue(Y.one('input#gender_male').get('checked'), 'gender_male radio not checked');
            assert.isFalse(Y.one('input#gender_female').get('checked'), 'gender_female radio was checked');
            assert.isTrue(Y.one('input#fav-sammiches_cheese').get('checked'), 'cheese was not checked');
            assert.isFalse(Y.one('input#fav-sammiches_egg').get('checked'), 'egg was checked');
            assert.isFalse(Y.one('input#fav-sammiches_chicken').get('checked'), 'chicken was checked');
            assert.isTrue(Y.one('input#fav-sammiches_rueben').get('checked'), 'rueben was not checked');
            assert.isTrue(Y.one('input#fav-sammiches_ham').get('checked'), 'ham was not checked');
            // month
            var monthOptions = Y.all('select#birth_month option');
            monthOptions.each(function(monthOption) {
                if (monthOption.get('value') == '3') {
                    assert.isTrue(monthOption.get('selected'), 'because month is 3, month option with value of ' + monthOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(monthOption.get('selected'), 'because month is 3, month option with value of ' + monthOption.get('value') + ' should not be selected');
                }
            });
            // day
            var dayOptions = Y.all('select#birth_day option');
            dayOptions.each(function(dayOption) {
                if (dayOption.get('value') == 11) {
                    assert.isTrue(dayOption.get('selected'), 'because day is 11, day option with value of ' + dayOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(dayOption.get('selected'), 'because day is 11, day option with value of ' + dayOption.get('value') + ' should not be selected');
                }
            });
            // year
            assert.areEqual('1971', Y.one('input#birth_year').get('value'), 'birth year was not correct');
            assert.areEqual('This is my entire life story.', Y.one('#bio').get('value'));
        },
        
        testTheWholeDamnThing_UsingDetailObjects: function() {
            var d = [
                {label:'bio', data:'This is my entire life story.'},
                {label:'birth', data:{date:'1971/03/11', format: '%Y/%b/%d'}},
                {label:'fname', data:'Matthew'}, {label:'lname', data:'Taylor'},
                {label: 'gender', data:'male'},
                {label: 'fav-sammiches', data: ['cheese', 'ham', 'rueben']}
            ];
            
            Y.FormBind.pushData(d, 'personal-info', '_');
            
            var fname = Y.one('input#fname').get('value');
            assert.isNotNull(fname, 'first name not entered');
            assert.areEqual('Matthew', fname, 'first name was wrong');
            var lname = Y.one('input#lname').get('value');
            assert.isNotNull(lname, 'last name not entered');
            assert.areEqual('Taylor', lname, 'last name was wrong');
            assert.isTrue(Y.one('input#gender_male').get('checked'), 'gender_male radio not checked');
            assert.isFalse(Y.one('input#gender_female').get('checked'), 'gender_female radio was checked');
            assert.isTrue(Y.one('input#fav-sammiches_cheese').get('checked'), 'cheese was not checked');
            assert.isFalse(Y.one('input#fav-sammiches_egg').get('checked'), 'egg was checked');
            assert.isFalse(Y.one('input#fav-sammiches_chicken').get('checked'), 'chicken was checked');
            assert.isTrue(Y.one('input#fav-sammiches_rueben').get('checked'), 'rueben was not checked');
            assert.isTrue(Y.one('input#fav-sammiches_ham').get('checked'), 'ham was not checked');
            // month
            var monthOptions = Y.all('select#birth_month option');
            monthOptions.each(function(monthOption) {
                if (monthOption.get('value') == '3') {
                    assert.isTrue(monthOption.get('selected'), 'because month is 3, month option with value of ' + monthOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(monthOption.get('selected'), 'because month is 3, month option with value of ' + monthOption.get('value') + ' should not be selected');
                }
            });
            // day
            var dayOptions = Y.all('select#birth_day option');
            dayOptions.each(function(dayOption) {
                if (dayOption.get('value') == 11) {
                    assert.isTrue(dayOption.get('selected'), 'because day is 11, day option with value of ' + dayOption.get('value') + ' should be selected');
                } else {
                    assert.isFalse(dayOption.get('selected'), 'because day is 11, day option with value of ' + dayOption.get('value') + ' should not be selected');
                }
            });
            // year
            assert.areEqual('1971', Y.one('input#birth_year').get('value'), 'birth year was not correct');
            assert.areEqual('This is my entire life story.', Y.one('#bio').get('value'));
        }
        

    }));
    
    Y.Test.Runner.add(testSuite);
    
}, "1.0");
