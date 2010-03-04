/**
 * Provides functions to bind JavaScript data objects to HTML forms, and extract
 * HTML form data back into JavaScript data objects.
 * @module FormBind
 * @requires node
 */
YUI().add('FormBind', function(Y) {
    var FORMBIND_NAME = 'FormBind',
        // a delimiter is used when form input is grouped
        DEFAULT_DELIMITER = '-',
        // this object contains the binding processes for each type of form element by name
        tagBindingStrategies = {
            radio: function(target) {
                target.set('checked', true);
            },
            input: function(target, value) {
                target.set('value', value);
            },
            select: function(target, value) {
                var field = target.one('option[value=' + value +']');
                if (!field) {
                    throw new Error('Cannot bind value "' + value + '" to a combo box without that option available.');
                }
                field.set('selected', true);
            }
        };
        tagBindingStrategies.checkbox = tagBindingStrategies.radio;
        tagBindingStrategies.textarea = tagBindingStrategies.input;
   
    function dateToObj(d, delim, label) {
        var result = {};
        result[label + delim + 'year'] = d.getFullYear();
        result[label + delim + 'month'] = d.getMonth()+1;
        result[label + delim + 'day'] = d.getDate();
        return result;
    }
    
    function handleItemGroup(g, form, delim, label) {
        var detailObjLabel,  // used to find out if we are inside a detail object
            target,          // element in form we're targeting 
            prop,            // a name of a data in the data object 
            d,               // date object used if there is a date involved
            i,               // iterator
            value;           // a value in the object

        if (!label) {label = '';}
        
        // handle each attribute
        for (prop in g) {
            if (typeof g[prop] !== 'function') {       
                         
                value = g[prop];
                // if this is a date object, we want to break it up and re-handle it with an updated label
                if (value instanceof Date) {
                    handleItemGroup(dateToObj(value, delim, prop), form, delim, prop + delim);
                    continue;
                } 
                // otherwise this is an object or a string
                else {
                    if (prop == 'date') {
                        if (!g.format) {
                            throw new Error('Cannot bind a date string without a format string. Need something like "format:\'%Y/%b/%d\'" in binding config for date.');
                        }
                        d = new Date(Date.parse(value, g.format));
                        handleItemGroup(dateToObj(d, label), form, delim, label);
                        return;
                    }
                } 
                
                target = form.one('#' + prop);
                // if there is an element with an id matching this data key name
                if (target) {
                    // if this is a fieldset grouping, we'll need to go deeper for radios or checkboxes
                    if (target.get('tagName').toLowerCase() == 'fieldset') {
                        // radio value
                        if (typeof value == 'string') {
                            target = form.one('#' + prop + delim + value);
                            tagBindingStrategies[target.get('type').toLowerCase()](target);                            
                        } 
                        // checkbox values
                        else if (value instanceof Array) {
                            for (i = 0; i< value.length; i++) {
                                target = form.one('#' + prop + delim + value[i]);
                                tagBindingStrategies[target.get('type').toLowerCase()](target);
                            }
                        }
                    } else {
                        tagBindingStrategies[target.get('tagName').toLowerCase()](target, value, prop, g, form);
                    }
                } else {
                    throw new Error('Cannot bind form data to element named "' + prop + '" because it does not exist!');
                }
            }
        }
    }
    
    function identify(form) {
        if (typeof form == 'string') {
            return Y.one('#' + form);
        }
        return form;
    }
    
    function normalizeArray(data, delim) {
        var result = {}, oneResult, i, j;
        for (i=0; i< data.length; i++) {
            oneResult = this.normalizeLabels(data[i]);
            if (this.containsGroup(oneResult)) {
                // for a subgroup, we normalize again
                oneResult = this.normalizeLabels(oneResult, delim);
            }
            for (j in oneResult) {
                result[j] = oneResult[j];
            }
        }
        return result;                
    }
    
    function normalizeString(data, label) {
        var result = {};
        if (label) {
            result[label] = data;
            return result;
        }
        return data;
    }
    
    function normalizeObject(data, delim, label) {
        var result = {}, i, j, key, oneResult;
        if (data.label) {
            result[data.label] = data.data;
            return result;
        }
        if (this.containsGroup(data)) {
            for (i in data) {
                oneResult = this.normalizeLabels(data[i], delim, i);
                for (j in oneResult) {
                    key = label ? label + delim + j : j;
                    result[key] = oneResult[j];
                }
            }
            return result;
        }
        if (label) {
            for (i in data) {
                if (i == 'date') {
                    if (!data.format) {
                        throw new Error('Cannot bind a date string without a format string. Need something like "format:\'%Y/%b/%d\'" in binding config for date.');
                    }
                    return dateToObj(new Date(Date.parse(data[i], data.format)), delim, label);
                }
                result[label + delim + i] = data[i];
            }
            return result;
        }
        return data;
    }
    
    function processGroupFormComponent(el, id, type, delim, data) {
        var pieces, 
            val, 
            elementTypeStrategies = {
                radio: function(el, data, pieces) {
                    var val;
                    // if it is checked, then we have a radio or checkbox
                    if (el.get('checked')) {
                        // if there is already a value
                        if (data[pieces[0]]) {
                            // string needs to be put into a new array
                            if (typeof data[pieces[0]] == 'string') {
                                val = data[pieces[0]];
                                data[pieces[0]] = [val];
                            }
                            data[pieces[0]].push(pieces[1]);
                        } else {
                            data[pieces[0]] = pieces[1];
                        }
                    }
                },
                select: function(el, data, pieces) {
                    if (!data[pieces[0]]) {
                        data[pieces[0]] = {}
                    }
                    data[pieces[0]][pieces[1]] = el.get('value');
                }
            };
            elementTypeStrategies.checkbox = elementTypeStrategies.radio;
            elementTypeStrategies.text = elementTypeStrategies.select;
        pieces = id.split(delim);
        
        elementTypeStrategies[type](el, data, pieces);
    }
    
    function processFormComponent(el, id, type, data) {
        switch (type) {
            case 'text':
                data[id] = el.get('value');
                break;
            case 'textarea':
                data[id] = el.get('text');
                break;
            // ignore buttons
            case 'button':
                break;
            default:
                throw new Error('Unexpected input type: \'' + type + '\'');
        }
    }

    Y[FORMBIND_NAME] = {
        
        push: function(data, form, delim) {
            var i = 0;
            
            if (!delim) { delim = DEFAULT_DELIMITER; }
            
            data = this.normalizeLabels(data, delim);
            
            form = identify(form);

            // uncheck any checkboxes in the form
            form.all('input[type="checkbox"]').set('checked', false);

            if (data instanceof Array) {
                for (i = 0; i < data.length; i++) {
                    handleItemGroup.call(this, data[i], form, delim);
                }
            } else {
                handleItemGroup.call(this, data, form, delim);
            }
        },
        
        pull: function(form, delim) {
            var data = {},      // return this
                type,           // type of the html element input
                id;             // id of each element as we loop through form
            
            if (!delim) { delim = DEFAULT_DELIMITER; }
            
            form = identify(form);
            
            form.all('input, select, textarea').each(function(el) {

                id = el.get('id');
                type = el.get('tagName').toLowerCase() == 'select' ? 'select' : el.get('type');
                if (id.indexOf(delim) > 0) {
                    processGroupFormComponent(el, id, type, delim, data);
                } else {
                    processFormComponent(el, id, type, data);
                }
            });
            return data;
        },
        
        normalizeLabels: function(data, delim, label) {
            if (data instanceof Array) {
                return normalizeArray.call(this, data, delim);
            } else if (typeof data == 'string') {
                return normalizeString.call(this, data, label);             
            } else {
                return normalizeObject.call(this, data, delim, label);
            }
        }, 
        
        containsGroup: function(data) {
            var i; // iterator
            for (i in data) {
                if (!(data[i] instanceof Array) &&
                    !(data[i] instanceof Date) &&
                    typeof data[i] == 'object') {
                        return true;
                }
            }
            return false;
        }
        
    };
    
    return Y[FORMBIND_NAME];
    
}, '0.1', { requires: ['node'] });