YUI.add('gallery-formbinder', function(Y) {

YUI().add('FormBind', function(Y) {
    var FORMBIND_NAME = 'FormBind',
        FORMBIND_NAMESPACE = 'forms',
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
    
    function handleItemGroup(g, label, formId, form) {
        var detailObjLabel = null,  // used to find out if we are inside a detail object
            target = null,          // element in form we're targeting 
            prop = null,            // a name of a data in the data object 
            value = null,           // a value in the object
            sublabel = '';          // used to drill down into sub objects of a group
        // handle each attribute
        for (prop in g) {
            if (typeof g[prop] !== 'function') {                
                value = g[prop];
                // if this is a date object, we want to break it up and resubmit
                if (value instanceof Date) {
                    this.formBind({label: prop, data:dateToObj(value)}, formId);
                } else {
                    if (detailObjLabel) {
                        sublabel = detailObjLabel;
                    } else {
                        sublabel = label.length > 0 ? label + '-' + prop : prop;
                        if (sublabel == 'label') {
                            detailObjLabel = g[prop];
                            continue;
                        }
                    }
                }
                target = form.one('#' + sublabel);
                // if there is an element with an id matching this data key name
                if (target) {
                    tagBindings[target.get('tagName').toLowerCase()](target, sublabel, value, g, form);
                }
            }
        }
    }
    
    Y.namespace(FORMBIND_NAMESPACE);
    
    Y[FORMBIND_NAMESPACE][FORMBIND_NAME] = {
        
        formBind: function(data, formId) {
            var label = '',     // possible label of the data object
                d = null,       // date object used if there is a date involved
                i = 0,          // to iterate through arrays
                form = Y.one('#' + formId);

            // uncheck any checkboxes in the form
            form.all('input[type="checkbox"]').set('checked', false);

            // if there is a label, that means there is a map of data associated with this form object,
            // so we'll take out the label and extract the data
            if (data.label) {
                label = data.label;
                data = data.data;
            }
            
            // if this data contains a date and format string, we'll need to process it differently
            if (data.date && data.format) {
                d = new Date(Date.parse(data.date, data.format));
                return this.formBind({label: label, data:dateToObj(d)}, formId);
            }
            
            if (data instanceof Array) {
                for (i = 0; i < data.length; i++) {
                    handleItemGroup.call(this, data[i], label, formId, form);
                }
            }
            
            handleItemGroup.call(this, data, label, formId, form);

        }
        
    };
    
    return Y[FORMBIND_NAMESPACE][FORMBIND_NAME];
}, '0.1', { requires: ['node'] });


}, '@VERSION@' ,{requires:['node']});
