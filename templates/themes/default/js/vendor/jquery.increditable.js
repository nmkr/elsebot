;(function ( $, window, document, undefined ) {

    var pluginName = 'increditable',
        defaults = {
            checkboxSelector: '.item-checkbox'
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
            
            var tableRows = $(this.element).children('tbody').children('tr');

            tableRows.each(function(){

                var row = this;

                $(this).on('click', function(){

                    var checkbox = $(row).find(instance.options.checkboxSelector);

                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        checkbox.prop('checked', false);
                    } else {
                        $(this).addClass('selected');
                        checkbox.prop('checked', true);
                    }

                    return false;

                });

            });

            this.shortcuts();
        },

        shortcuts: function(){
            var instance = this;

            if (!$.hotkeys)
                return;

            $(document).bind('click', function(){
                var selectedRows = $(instance.element).children('tbody').children('tr.selected');

                if(selectedRows.length > 0){
                    selectedRows.each(function(){
                        $(this).removeClass('selected');
                    })
                }
            })

            $(document).bind('keydown', 'Ctrl+a', function(){
                $(instance.element).children('tbody').children('tr').addClass('selected');
            });

            $(document).bind('keydown', 'del', function(){
                var selectedRows = $(instance.element).children('tbody').children('tr.selected');

                if(selectedRows.length > 0){
                    var confirmDelete = confirm('Are you sure you want to delete ' + selectedRows.length + ' items?');

                    if(confirmDelete){
                        $(instance.element).children('tbody').children('tr.selected').each(function(){
                            $(this).hide();
                        })
                    }
                }
            });
        }

        /* Add highlighting class to current subpage */

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