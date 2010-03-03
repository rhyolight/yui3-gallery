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
        tagBindings = {};
    
    tagBindings.radio = function(target) {
        target.set('checked', true);
    };
    
    tagBindings.checkbox = function(target) {
        target.set('checked', true);
    };
    
    tagBindings.input = function(target, value) {
        target.set('value', value);
    };
    
    tagBindings.textarea = function(target, value) {
        target.set('text', value);
    };
    tagBindings.select = function(target, value) {
        var field = target.one('option[value=' + value +']');
        if (!field) {
            throw new Error('Cannot bind value "' + value + '" to a combo box without that option available.');
        }
        field.set('selected', true);
    };
    
    function dateToObj(d, delim, label) {
        var result = {};
        result[label + delim + 'year'] = d.getFullYear();
        result[label + delim + 'month'] = d.getMonth()+1;
        result[label + delim + 'day'] = d.getDate();
        return result;
    }
    
    function handleItemGroup(g, form, delim, label) {
        var detailObjLabel = null,  // used to find out if we are inside a detail object
            target = null,          // element in form we're targeting 
            prop = null,            // a name of a data in the data object 
            d = null,               // date object used if there is a date involved
            value = null;           // a value in the object

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
                    // if this is a fieldset grouping, we'll need to go deeper
                    if (target.get('tagName').toLowerCase() == 'fieldset') {
                        // radio value
                        if (typeof value == 'string') {
                            target = form.one('#' + prop + delim + value);
                            tagBindings[target.get('type').toLowerCase()](target);                            
                        } 
                        // checkbox values
                        else if (value instanceof Array) {
                            for (var i in value) {
                                target = form.one('#' + prop + delim + value[i]);
                                tagBindings[target.get('type').toLowerCase()](target);
                            }
                        }
                    } else {
                        tagBindings[target.get('tagName').toLowerCase()](target, value, prop, g, form);
                    }
                } else {
                    throw new Error('Cannot bind form data to element named "' + prop + '" because it does not exist!');
                }
            }
        }
    }

    Y[FORMBIND_NAME] = {
        
        pushData: function(data, form, delimiter) {
            var i = 0;
            
            if (!delimiter) { delimiter = DEFAULT_DELIMITER; }
            
            data = this.normalizeLabels(data, delimiter);
            
            if (typeof form == 'string') {
                form = Y.one('#' + form);
            }

            // uncheck any checkboxes in the form
            form.all('input[type="checkbox"]').set('checked', false);

            if (data instanceof Array) {
                for (i = 0; i < data.length; i++) {
                    handleItemGroup.call(this, data[i], form, delimiter);
                }
            } else {
                handleItemGroup.call(this, data, form, delimiter);
            }
        },
        
        pullData: function(form, delimiter) {
            var data = {},      // return this
                type,           // type of the html element input
                pieces,         // pieces of a hyphenated id
                id;             // id of each element as we loop through form
            
            if (!delimiter) { delimiter = DEFAULT_DELIMITER; }
            
            
            if (typeof form == 'string') {
                form = Y.one('#' + form);
            }
            form.all('input, select, textarea').each(function(el) {
                id = el.get('id');
                type = el.get('tagName').toLowerCase() == 'select' ? 'select' : el.get('type');
                if (id.indexOf(delimiter) > 0) {
                    pieces = id.split(delimiter);
                    switch (type) {
                        // radio and checkbox are treated the same
                        case 'radio':
                        case 'checkbox':
                            // if it is checked, then we have a radio or checkbox
                            if (el.get('checked')) {
                                // if there is already a value
                                if (data[pieces[0]]) {
                                    // string needs to be put into a new array
                                    if (typeof data[pieces[0]] == 'string') {
                                        var v = data[pieces[0]];
                                        data[pieces[0]] = [v];                                
                                    }
                                    data[pieces[0]].push(pieces[1]);
                                } else {
                                    data[pieces[0]] = pieces[1];
                                }
                            }
                            break;
                        case 'select':
                        case 'text':
                            if (!data[pieces[0]]) {
                                data[pieces[0]] = {}
                            }
                            data[pieces[0]][pieces[1]] = el.get('value');
                            break;
                        default:
                            throw new Error('Unexpected input type: \'' + type + '\'');
                    }
                } else {
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
            });
            return data;
        },
        
        normalizeLabels: function(data, delim, label) {
            if (data instanceof Array) {
                var result = {};
                for (var i in data) {
                    var oneResult = this.normalizeLabels(data[i]);
                    if (this.containsGroup(oneResult)) {
                        // for a subgroup, we normalize again
                        oneResult = this.normalizeLabels(oneResult, delim);
                    }
                    for (var j in oneResult) {
                        result[j] = oneResult[j];
                    }
                }
                return result;
            } else if (typeof data == 'string') {
                if (label) {
                    var result = {};
                    result[label] = data;
                    return result;
                }
                return data;                
            } else {
                if (data.label) {
                    var result = {};
                    result[data.label] = data.data;
                    return result;
                }
                if (this.containsGroup(data)) {
                    var result = {};
                    for (var i in data) {
                        var oneResult = this.normalizeLabels(data[i], delim, i);
                        for (var j in oneResult) {
                            var key = label ? label + delim + j : j;
                            result[key] = oneResult[j];
                        }
                    }
                    return result;
                }
                if (label) {
                    var result = {};
                    for (var i in data) {
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
        }, 
        
        containsGroup: function(data) {
            for (var i in data) {
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