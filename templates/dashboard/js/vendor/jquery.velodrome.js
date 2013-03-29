;(function ( $, window, document, undefined ) {
    var pluginName = 'velodrome',
        defaults = {
            debug: false,
            plugin: {
                enabled: true,
                enabledIE: false,
                enabledUntested: false,
                untestedPlatforms: /android|webos|windows phone|blackberry/i
            },
            selectors: {
                link: 'a.velodrome',
                form: 'form.velodrome',
                placeholder: '#velodrome-placeholder',
            },    
            callbacks: {
                loaded: function(){}, //Plugin loaded callback
                requestStarted: function(){}, //Request started callback
                requestDone: function(){}, //Request done callback
                requestError: function(){} //Request error callback
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
            var opts = this.options;

            if (opts.plugin.enabled === true) {
                if (opts.plugin.enabledIE === false && !history.pushState) {
                    opts.plugin.enabled = false;
                } else if (opts.plugin.enabledUntested === false && opts.plugin.untestedPlatforms.test(navigator.userAgent.toLowerCase())) {
                    opts.plugin.enabled = false;
                }
            }

            if (opts.plugin.enabled === false) {
                opts.callbacks.requestDone.call(this, instance); 
                return;
            }
            
            this.usePushState = false;

            if(history.pushState){
                this.usePushState = true;
            }

            //Caching the init url
            this.initUrl = window.location.href;
            this.initRequest = true;


            this.queryString = undefined;
            this.origContent = undefined;
            this.currentLocation = undefined;

            this.partials = [];

            this._log('Plugin intialized.');
        },

        bindEvents: function(){
            var opts = this.options;

            //popState
            $(window).on('popstate', function(e) {
                e.preventDefault();
                //do not fire popstate on init
                if(e.originalEvent.state !== null){
                    instance._request(e.originalEvent.state.path, true);
                }

                instance._log('popState event fired.');
                return false;              
            });
             
            //Bind click event for all local links with specified class
            $(document).on('click', opts.selectors.link, function(e) {
                if (this.href !== window.location.href) {
                    if ($(this).attr('class')) {
                        if ($(this).attr('class').match(/partial-([\w'-]*)/g)) {   
                            var result = $(this).attr('class').match(/partial-([\w'-]*)/g);
                            for (var i = 0; i < result.length; i++) {
                                var partialName = result[i].split(/partial-/);
                                instance.reloadPartials[i] = partialName[1];
                            }
                        }

                        if ($(this).attr('class').match(/scroll-to-([\w'-]*)/g)) {   
                            var result = $(this).attr('class').match(/scroll-to-([\w'-]*)/g);
                            var scrollElementID = result[0].split(/scroll-to-/);
                            instance.scrollToElement = scrollElementID[1];
                        }
                    }
                    instance._request(this.href);
                }
                return false; 
            });
        },

        requestPage: function(){

        },

        processResponse: function(){

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

    Plugin.form = {}
    Plugin.form.prototype = {
        sendForm: function(){
            alert('hey');
        }
    }

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
                  $.data(this, pluginName + '.js: ', null);
                }
            });

            return returns !== undefined ? returns : this;
        }
    }

})( jQuery, window, document );