YUI.add('gallery-formbinder', function(Y) {

YUI().add('FormBind', function(Y) {
    var FORMBIND_NAME = 'FormBind',
        tagBindings = null;
        
        tagBindings = {};
    
    function bindRadio(name, value, form) {
        var input = form.one('input[type="radio"]#' + name + '-' + value);
        if (input) {
            input.set('checked', true);
            return true;
        } 
        return false;
    }
    
    function bindCheckboxes(data, form) {
        var input = form.all('input[type="checkbox"]');
        if (input.size() === 0) { return false; }
        Y.each(input, function(checkboxElement, i) {
            for (var cbVal in data) {
                if (checkboxElement.get('id') == data[cbVal]) {
                    checkboxElement.set('checked', true);
                }
            }
        });
    }
    
    tagBindings.input = function(target, name, value) {
        target.set('value', value);
    };
    tagBindings.textarea = function(target, name, value) {
        target.set('value', value);
    };
    tagBindings.select = function(target, name, value) {
        var field = target.one('option[value=' + value +']');
        if (!field) {
            throw new Error('Cannot bind value "' + value + '" to a combo box without that option available.');
        }
        field.set('selected', true);
    };
    tagBindings.fieldset = function(target, name, value, data, form) {
        // attempt to bind to a group of radio buttons, but if that fails then try other stuff
        if (!bindRadio(name, value, form)) {
            // if the data is an array, they represent checkboxes that should be checked
            if (value instanceof Array) {
                bindCheckboxes(value, form);
            }
        }
    };
    
    
    
    function dateToObj(d) {
        return {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()};
    }
    
    function handleItemGroup(g, formId, form, label) {
        var detailObjLabel = null,  // used to find out if we are inside a detail object
            target = null,          // element in form we're targeting 
            prop = null,            // a name of a data in the data object 
            d = null,               // date object used if there is a date involved
            value = null,           // a value in the object
            sublabel = '';          // used to drill down into sub objects of a group
        if (!label) {label = '';}
        
        // handle each attribute
        for (prop in g) {
            if (typeof g[prop] !== 'function') {       
                         
                value = g[prop];
                // if this is a date object, we want to break it up and re-handle it with an updated label
                if (value instanceof Date) {
                    handleItemGroup(dateToObj(value), formId, form, prop + '-');
                    continue;
                } 
                // sublabel may need to be adjusted for Arrays
                if (value instanceof Array) {
                    if (!sublabel) {
                        sublabel = prop;
                    }
                } 
                // otherwise this is an object or a string
                else {
                    // if this is just the label for some data, set it and continue to the data
                    if (prop == 'label') {
                        sublabel = value;
                        continue;
                    } 
                    // this is actually the data
                    else if (prop == 'data') {
                        // an object will be a subgroup of the label, so we adjust the label
                        if (typeof value == 'object') {
                            sublabel += '-';
                        }
                        // arrays and data objects need to pass through the method again
                        if (typeof value != 'string') {
                            handleItemGroup(value, formId, form, sublabel);
                            continue;
                        }
                        if (!sublabel) {
                            sublabel = label + prop;
                        }
                    } 
                    // real date objects need formatting
                    else if (prop == 'date') {
                        if (!g.format) {
                            throw new Error('Cannot bind a date string without a format string. Need something like "format:\'%Y/%b/%d\'" in binding config for date.');
                        }
                        d = new Date(Date.parse(value, g.format));
                        handleItemGroup(dateToObj(d), formId, form, label);
                        return;
                    } else {
                        sublabel = label + prop;
                    }
                } 
                
                target = form.one('#' + sublabel);
                // if there is an element with an id matching this data key name
                if (target) {
                    tagBindings[target.get('tagName').toLowerCase()](target, sublabel, value, g, form);
                } else {
                    throw new Error('Cannot bind form data to element named "' + sublabel + '" because it does not exist!');
                }
                
            }
        }
    }

    Y[FORMBIND_NAME] = {
        
        formBind: function(data, form) {
            var i = 0, formId = null;
            
            if (typeof form == 'string') {
                formId = form;
                form = Y.one('#' + formId);
            }

            // uncheck any checkboxes in the form
            form.all('input[type="checkbox"]').set('checked', false);

            if (data instanceof Array) {
                for (i = 0; i < data.length; i++) {
                    handleItemGroup.call(this, data[i], formId, form);
                }
            } else {
                handleItemGroup.call(this, data, formId, form);
            }
        }
        
    };
    
    return Y[FORMBIND_NAME];
}, '0.1', { requires: ['node'] });


}, '@VERSION@' ,{requires:['node']});
