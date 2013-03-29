;(function ( $, window, document, undefined ) {

    var pluginName = 'editorial',
        defaults = {
            buttons: {
                 'bold': 'b, strong',
                 'italic': 'i, em',
                 'underline': 'u'
            },
            buttonClass: '',
            debug: false
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.progress = false;
        this.init();
    }

    Plugin.prototype = {
        
        //Plugin init function
        init: function(){
            var instance = this;
            var wrapper = $(this.element);
            var editorTextarea = $(wrapper).children('textarea');

            //If textarea does not exist, return
            if(editorTextarea.length < 1){
                this._log('Editorial.js: no textarea found in root element.');
                return;
            }

            editorTextarea.css('display', 'none');
            this.editableDiv = $('<div class="editorial-element" contenteditable="true" spellcheck="false"></div>');
            this.buttonsWrapper = $('<div class="editorial-buttons"></div>');
        
            this.editableDiv.appendTo(wrapper);
            this.editableDiv.html($(editorTextarea).val());

            this.buttonsWrapper.prependTo(wrapper);
            this.registerDefaultButtons();

            this.editableDiv.on('click', function(e){
                instance.reloadButtons();
            });

            this.editableDiv.on('focus', function(e){
                wrapper.addClass('focused');
            });

            this.editableDiv.on('blur', function(e){
                wrapper.removeClass('focused');
            });

            this.editableDiv.on('keyup', function(){
                $(editorTextarea).val($(this).html());
            });
        },

        //Register all default buttons.
        registerDefaultButtons: function(){
            var instance = this;
            var defaultButtons = this.options.buttons;

            $.each(defaultButtons, function(key, tags){
                name = $.trim(key);
                instance.addButton(name, tags, Plugin.defaultButtons[key])
            })
        },

        //Add a single button to the button wrapper.
        addButton: function(name, tagString, callback){
            var instance = this;

            var tagNameClass = '';
            var tags = tagString.split(',');

            $.each(tags, function(key, tag){
                tag = $.trim(tag);
                tagNameClass += ' tagname-' + tag;
            });

            var button = $('<a class="button ' + this.options.buttonClass + ' ' + name + tagNameClass +'"></a>');
            this.buttonsWrapper.append(button);

            //Check if callback exists and is a function
            if(typeof callback == 'function'){
                //Keep editor focused
                button.on('mousedown', function(e){
                    e.preventDefault();
                });

                button.on('click', function(){
                    callback.call(instance);
                    instance.reloadButtons();
                    return false;
                });
            } else {
                this._log('Editorial.js: addButton callback has to be a function.');
            }
        },

        //Reload editor buttons, add class ".active" to those which are active on current selection.
        reloadButtons: function(){
            var instance = this;
            instance.buttonsWrapper.children('.button').each(function(){
                $(this).removeClass('active');
            });

            var selectionParents = instance.getSelectionParents();

            $.each(selectionParents, function(key, value){
                instance.buttonsWrapper.children('.tagname-' + value).addClass('active');
            });
        },

        //http://stackoverflow.com/questions/5442091/how-do-i-know-which-element-is-modifying-in-contenteditable-case/5446726#5446726
        //Function to determine in which element the caret is located right know.
        //Returns an array of parent elements.
        getSelectionParents: function(start) {
            var instance = this;
            var parents = null;
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var range = sel.getRangeAt(0);
                    range.collapse(start);
                    a = range.startContainer;
                    var parents = [];

                    if (a.nodeType != 1) {
                        while (a) {
                            if( typeof a.tagName != 'undefined' ) {
                                parents.unshift(a.tagName.toLowerCase());
                            }

                            a = a.parentNode;
                            if(a.tagName === 'DIV'){
                                break;
                            }
                        }
                    }
                }
            } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
                var textRange = document.selection.createRange();
                textRange.collapse(start);
                a = textRange.parentElement();

                var parents = [];

                while (a) {
                    if( typeof a.tagName != 'undefined' ) {
                        parents.unshift(a.tagName.toLowerCase());
                    }

                    a = a.parentNode;
                    if(a.tagName === 'DIV'){
                        break;
                    }
                }
            }
            return parents;
        },

        _log: function() {
            if (this.options.debug !== true) {
                //Debug disabled, return
                return;
            }

            //Log time
            var now = new Date();
            var timestamp = now.getHours() + ':' + ("0" + now.getMinutes()).slice(-2) + ':' + ("0" + now.getSeconds()).slice(-2) + ':' + now.getMilliseconds();

            if (window.console) {
                console.log(timestamp, Array.prototype.slice.call(arguments));
            }
        }
    };

    //Register callbacks for default buttons.
    Plugin.defaultButtons = {

        bold: function(){
            this.editableDiv.focus();
            document.execCommand('bold', false, null);
        },

        italic: function(){
            this.editableDiv.focus();
            document.execCommand('italic', false, null);
        },

        underline: function(){
            this.editableDiv.focus();
            document.execCommand('underline', false, null);
        },

        orderedlist: function(){
            this.editableDiv.focus();
            document.execCommand('insertorderedlist', false, null);
        }

    };

    //jQuery plugin namespace.
    $.fn[pluginName] = function ( options ) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName,
                    new Plugin( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;

            this.each(function () {
                var instance = $.data(this, pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                if (options === 'destroy') {
                  $.data(this, pluginName, null);
                }
            });

            return returns !== undefined ? returns : this;
        }
    }

})( jQuery, window, document );