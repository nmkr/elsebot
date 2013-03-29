;(function ( $, window, document, undefined ) {

    var pluginName = 'increditable',
        defaults = {
            debug: true,
            checkboxSelector: '.item-checkbox',
            reloaded: function(){}
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
            this.tableID = $(this.element).attr('id');
            this.tableForm = $(this.element).children('form');
            this.tableData = this.tableForm.children('table');

            if(this.tableForm.length > 0){
                this.tableForm.each(function(){
                    instance.enableFilter(this);
                })
            }

            this.tableForm.on('reloaded', function(){
                instance._log('Table data reloaded.');
                instance.options.reloaded.call(this, $(this));
                var tableRows = $(this).children('table').children('tbody').children('tr');

                tableRows.each(function(){
                    var row = $(this);

                    $('.checkbox').on('click', function(){
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

                    row.find('.delete').on('click', function(e){
                        $.get($(this).attr('href'), function(response){
                            row.remove();
                        })
                        return false;
                    });

                });
            });

            this.tableData.trigger('reloaded');
            this.shortcuts();
        },

        enableFilter: function(form){
            var instance = this; 

            $(form).on('submit', function(e){
                e.preventDefault();
                var form = $(this),
                    url = $(this).attr('action');
                    vars = form.serialize();

                $.post(url, vars, function(response){
                    var newData = $($.trim(response)).find('#' + instance.tableID).children('form');

                    if(newData.length > 0){
                        instance.tableForm.html(newData.html());
                        instance.tableForm.trigger('reloaded');
                    }
                });
            });
        },

        shortcuts: function(){
            var instance = this;

            if (!$.hotkeys)
                return;

            $(document).bind('click', function(){
                var rows = $(instance.tableData).children('tbody').children('tr');
                rows.each(function(){
                    $(this).find(instance.options.checkboxSelector).each(function(){
                        $(this).prop('checked', false);
                        $(this).trigger('change');
                    });
                });
                instance._log('Deselected all rows.');
            })

            $(document).bind('keydown', 'Ctrl+a', function(){
                var rows = $(instance.tableData).children('tbody').children('tr');
                rows.each(function(){
                    $(this).find(instance.options.checkboxSelector).each(function(){
                        $(this).prop('checked', true);
                        $(this).trigger('change');
                    });
                });

                instance._log('Selected all rows using Ctrl+A.');
            });
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