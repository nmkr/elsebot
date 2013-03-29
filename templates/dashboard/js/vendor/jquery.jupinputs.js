;(function ( $, window, document, undefined ) {

    var pluginName = 'jupinputs',
        defaults = {
            debug: true,
            checkbox: {
                checkedClass: '',
                uncheckedClass: ''
            },
            radio: {
                checkedClass: '',
                uncheckedClass: ''
            },
            select: {
                toggleClass: '',
                toggleValueClass: '',
                toggleHandle: false,
                toggleHandleClass: ''
            }
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
        
        init: function(){
            var instance = this;
            var elementTagName = $(this.element).prop('tagName');

            if($(this.element).is('select') || $(this.element).is('input')){
                this.replaceElement(this.element);
            } else {
                var childrenElement = $(this.element).children('select, input');

                if(childrenElement.length > 0){
                    childrenElement.each(function(){
                        this.replaceElement(this);
                    });
                }
            }
        },

        replaceElement: function(element){
            switch($(element).prop('tagName')) {
            case 'SELECT':
                this.createSelect(element);
                break;
            case 'INPUT':
                var inputType = $(element).attr('type');

                if(inputType === 'checkbox'){
                    this.createCheck(element);
                } else if( inputType === 'radio' ) {
                    this.createRadio(element);
                }

                break;
            default:

            }
        },

        createSelect: function(element){
            var instance = this;
            var select = element;
            var $select = $(select);
            var options = $select.children('option');
            var defaultOption = $select.children('option:selected').length > 0 ? $select.children('option:selected')[0] : $select.children('option').first();

            $select.css('display', 'none');
            $select.data('jupinput-select-default', defaultOption);

            var selectContainer = $('<div class="jupinput-container jupinput-select"></div>');
            var selectToggle = $('<div class="jupinput-select-toggle"></div>').addClass(this.options.select.toggleClass);

            var toggleValue = $('<div class="jupinput-select-toggle-value"></div>').addClass(this.options.select.toggleValueClass);
            selectToggle.append(toggleValue);

            if(this.options.select.toggleHandle){
                var toggleHandle = $('<div class="jupinput-select-toggle-handle"></div>').addClass(this.options.select.toggleHandleClass);
                selectToggle.append(toggleHandle);
            }

            var optionsWrap = $('<ul class="jupinput-select-options"></ul>');
            selectContainer.append(selectToggle);

            $(document).on('jupinput.select.close', function(){
                if(optionsWrap.hasClass('opened')){
                    optionsWrap.removeClass('opened');
                }
            });

            selectToggle.on('click.jupinput.toggle', function(e){
                e.stopPropagation();

                $(document).trigger('jupinput.select.close');

                if(optionsWrap.hasClass('opened')){
                    optionsWrap.removeClass('opened');
                } else {
                    optionsWrap.addClass('opened');
                    $('html').bind('click.jupinput.hide', function(e){
                        e.stopPropagation();
                        $('.jupinput-select-options.opened').removeClass('opened');
                        $('html').unbind('click.jupinput.hide');
                    });
                }
            });

            $select.on('change.source', function(){
                if($select.hasClass('autosubmit')){
                    instance._log('The value has changed');
                    $(this).closest('form').submit();
                }

                if($select.hasClass('jumpdefault')){
                    options.each(function(){
                        $(this).prop('selected', false);
                        $(defaultOption).prop('selected', true);
                        
                        var option = $(defaultOption).data('jupinput-option');
                        toggleValue.html(option.html());
                        option.addClass('selected');
                    });
                }                
            });
            
            options.each(function(){
                var optionContent = $(this).html();
                var optionValue = $(this).attr('value');
                var optionValueClass = optionValue ? ' jupinput-option-' + optionValue : '';

                var option = $('<li class="jupinput-option' + optionValueClass + '">' + optionContent + '</li>');
                option.data('jupinput-option-value', optionValue);
                $(this).data('jupinput-option', option);

                if(optionValue === $(defaultOption).val()){
                    toggleValue.html(optionContent);
                    option.addClass('selected');
                }

                option.on('click', function(){
                    var option = $(this);
                    toggleValue.html(option.html());
                    optionsWrap.children('.selected').removeClass('selected');

                    options.each(function(){
                        $(this).prop('selected', false);

                        if($(this).val() === option.data('jupinput-option-value') && $(this).prop('selected') !== true){
                            $(this).prop('selected', true);
                            option.addClass('selected');

                            selectToggle.data('jupinput-current-value', option.data('jupinput-option-value'));
                            $select.data('jupinput-current-value', $(this).val());
                            $select.trigger('change.source');
                        }
                    });
                });

                optionsWrap.append(option);
            })

            selectContainer.append(optionsWrap);
            $select.after(selectContainer);
        },

        createCheck: function(element){
            var checkbox = element;
            var $checkbox = $(checkbox);
            var checked = $checkbox.prop('checked');

            $checkbox.css('display', 'none');

            var checkboxContainer = $('<div class="jupinput-container jupinput-checkbox"></div>'); 
            var checkboxChecked = $('<div class="jupinput-checkbox-checked"></div>').addClass(this.options.checkbox.checkedClass);
            var checkboxUnchecked = $('<div class="jupinput-checkbox-unchecked"></div>').addClass(this.options.checkbox.uncheckedClass);

            checkboxContainer.append(checkboxChecked);
            checkboxContainer.append(checkboxUnchecked);

            if(checked){
                checkboxContainer.addClass('checked');
            }

            $checkbox.on('change', function(){
                if($(this).prop('checked')){
                    checkboxContainer.addClass('checked');
                } else {
                    checkboxContainer.removeClass('checked');
                }
            });

            checkboxContainer.on('click.jupinput.checkbox', function(e){
                e.stopPropagation();
                var checkboxContainer = $(this);

                if(checkboxContainer.hasClass('checked')){
                    checkboxContainer.removeClass('checked');
                    $checkbox.prop('checked', false);
                    $checkbox.trigger('change');
                } else {
                    checkboxContainer.addClass('checked');
                    $checkbox.prop('checked', true);
                    $checkbox.trigger('change');
                }
            });

            $checkbox.after(checkboxContainer);
        },

        createRadio: function(){

        },

        shortcuts: function(){
            var instance = this;

            if (!$.hotkeys)
                return;

            
        },

        _log: function() {
            if (this.options.debug !== true) {
                return;
            }

            //Log time
            var now = new Date();
            var timestamp = now.getHours() + ':' + ("0" + now.getMinutes()).slice(-2) + ':' + ("0" + now.getSeconds()).slice(-2) + ':' + now.getMilliseconds();

            if (window.console) {
                console.log(timestamp, this._name + ':', Array.prototype.slice.call(arguments));
            }
        }
    };

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