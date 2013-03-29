// jquery.editorial.js - super light-weight WYSIWIG editor.
// Version: 1.0
// Author: Martin Šnajdr (@martinsnajdr, @bulbthemes on Twitter)
// Copyright (c) 2012 BulbThemes (http://www.bulbthemes.com)

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
        
        //Private function.
        //
        //Plugin init.
        init: function(){
            var self = this;

            //Main wrapper element.
            self.wrapper = $(this.element);

            //Wrapper elements has to be a DIV.
            if(self.wrapper[0].tagName.toUpperCase() !== 'DIV') {
                self._log('Wrapping element has to be a div.');
                return;
            }

            self.editorTextarea = self.wrapper.children('textarea');

            //The source textarea has to be inside the wrapping element.
            if(self.editorTextarea.length < 1){
                self._log('No children textarea found in the wrapping element.');
                return;
            }

            self._create();
        },

        //Private function.
        //
        //Create all necessary elements, setup default buttons and bindings.
        _create: function(){
            var self = this;

            //Hide the source textarea.
            self.editorTextarea.css('display', 'none');

            //Create editable div and a button bar.
            self.editableDiv = $('<div class="editorial-element" contenteditable="true" spellcheck="false"></div>')
                .html(self.editorTextarea.val());
            self.buttonsWrapper = $('<div class="editorial-buttons"></div>');
        
            //Insert them into DOM.
            self.wrapper
                .prepend(self.buttonsWrapper)
                .append(self.editableDiv);

            //Update editable div content if source textarea value changes.
            self.editorTextarea.on('keyup', function(){
                self.editableDiv.html($(this).val());
            });

            //Register default buttons and bind events.
            self._registerDefaultButtons();
            self._bindings();
        },

        //Private function.
        //
        //Bind all event listeners to the wrapping element.
        _bindings: function(){
            var self = this;

            self.editableDiv.on('click', function(e){
                self.reloadButtons();
                if($(this).is(':focus'))
                    self.wrapper.trigger('editorial:cursorChange');
            });

            self.editableDiv.on('focus', function(e){
                self.wrapper.addClass('focused');
                self.wrapper.trigger('editorial:focus');
            });

            self.editableDiv.on('blur', function(e){
                self.wrapper.removeClass('focused');
                self.reloadButtons(true);
                self.wrapper.trigger('editorial:blur');
            });

            self.editableDiv.on('keyup', function(){
                self.editorTextarea.val($(this).html());
                self.wrapper.trigger('editorial:change');
            });
        },

        //Private function.
        //
        //Register all default buttons.
        _registerDefaultButtons: function(){
            var self = this;
            var defaultButtons = this.options.buttons;

            $.each(defaultButtons, function(key, tags){
                name = $.trim(key);
                self.addButton(name, tags, Plugin.defaultButtonsCallbacks[key])
            })
        },

        //Public function.
        //
        //Add a single button to the editor.
        addButton: function(name, tagString, callback){
            var self = this;

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
                    callback.call(self);
                    self.reloadButtons();
                    return false;
                });
            } else {
                this._log('Editorial.js: addButton callback has to be a function.');
            }
        },

        //Public function.
        //
        //Reload editor buttons, add class ".active" to those which are active on current selection.
        reloadButtons: function(deactivate){
            var self = this;
            self.buttonsWrapper.children('.button').each(function(){
                $(this).removeClass('active');
            });

            if (deactivate)
                return; 

            var selectionParents = self._getSelectionParents();

            $.each(selectionParents, function(key, value){
                self.buttonsWrapper.children('.tagname-' + value).addClass('active');
            });
        },

        //http://stackoverflow.com/questions/5442091/how-do-i-know-which-element-is-modifying-in-contenteditable-case/5446726#5446726
        //Function to determine in which element the caret is located right know.
        //Returns an array of parent elements.
        _getSelectionParents: function(start) {
            var self = this;
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
    Plugin.defaultButtonsCallbacks = {

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
                var self = $.data(this, pluginName);
                if (self instanceof Plugin && typeof self[options] === 'function') {
                    returns = self[options].apply( self, Array.prototype.slice.call( args, 1 ) );
                }

                if (options === 'destroy') {
                  $.data(this, pluginName, null);
                }
            });

            return returns !== undefined ? returns : this;
        }
    }

})( jQuery, window, document );