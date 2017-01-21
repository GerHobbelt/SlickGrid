/*!
 * jquery.event.drag - v2.2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
// Created: 2008-06-04
// Updated: 2012-05-21
// Updated: 2013-01-08
// Updated: 2013-02-25 (richardscarrott)
// REQUIRES: jquery 1.8+

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(root.jQuery);
    }
}(this, function ($) {
// Events: draginit, dragstart, drag, dragend

// add the jquery instance method
$.fn.drag = function ( str, arg, opts ) {
    // figure out the event type
    var type = typeof str === "string" ? str : "";
    // figure out the event handler...
    var fn = $.isFunction( str ) ? str : $.isFunction( arg ) ? arg : null;
    // fix the event type
    if ( type.indexOf("drag") !== 0 ) {
        type = "drag" + type;
    }
    // were options passed
    opts = ( str === fn ? arg : opts ) || {};
    // trigger or bind event handler
    return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};

// local refs (increase compression)
var $event = $.event;
var $special = $event.special;
// configure the drag special event
var drag = $special.drag = {
    // these are the default settings
    defaults: {
        which: 1,           // mouse button pressed to start drag sequence
        distance: 1,        // distance dragged before dragstart
        not: ':input',      // selector to suppress dragging on target elements
        handle: null,       // selector to match handle target elements
        relative: false,    // true to use "position", false to use "offset"
        drop: true,         // false to suppress drop events, true or selector to allow
        click: false,       // false to suppress click events after dragend (no proxy)
        axis: null          // "x" or "y" to indicate which axis the drag event is interested in and consequently whether
                            // scrolling on touch devices will be prevented
    },

    // the key name for stored drag data
    datakey: "dragdata",

    // prevent bubbling for better performance
    noBubble: true,

    // count bound related events
    add: function ( obj ) {
        // read the interaction data
        var data = $.data( this, drag.datakey );
        // read any passed options
        var opts = obj.data || {};
        // count another related event
        data.related += 1;
        // extend data options bound with this event
        // don't iterate "opts" in case it is a node
        $.each( drag.defaults, function ( key, def ) {
            if ( opts[ key ] !== undefined ) {
                data[ key ] = opts[ key ];
            }
        });
    },

    // forget unbound related events
    remove: function () {
        // read the interaction data
        var data = $.data( this, drag.datakey );
        // forget another related event
        data.related -= 1;
    },

    // configure interaction, capture settings
    setup: function () {
        // check for related events
        if ( $.data( this, drag.datakey ) ) {
            return;
        }
        // initialize the drag data with copied defaults
        var data = $.extend({ related: 0 }, drag.defaults );
        // store the interaction data
        $.data( this, drag.datakey, data );
        // bind the mousedown event, which starts drag interactions
        $event.add( this, "touchstart mousedown MSPointerDown", drag.init, data );
        // prevent image dragging in IE...
        if ( this.attachEvent ) {
            this.attachEvent( "ondragstart", drag.dontstart );
        }
    },

    // destroy the configured interaction
    teardown: function () {
        var data = $.data( this, drag.datakey ) || {};
        // check for related events
        if ( data.related ) {
            return;
        }
        // remove the stored data
        $.removeData( this, drag.datakey );
        // remove the mousedown event
        $event.remove( this, "touchstart mousedown MSPointerDown", drag.init );
        // enable text selection
        drag.textselect( true );
        // un-prevent image dragging in IE...
        if ( this.detachEvent ) {
            this.detachEvent( "ondragstart", drag.dontstart );
        }
    },

    // initialize the interaction
    init: function ( event ) {
        // sorry, only one touch at a time
        if ( drag.touched ) {
            return;
        }
        // the drag/drop interaction data
        var dd = event.data, results;
        // check the which directive
        if ( event.which !== 0 && dd.which > 0 && event.which !== dd.which ) {
            return;
        }
        // check for suppressed selector
        if ( $( event.target ).is( dd.not ) ) {
            return;
        }
        // check for handle selector
        if ( dd.handle && !$( event.target ).closest( dd.handle, event.currentTarget ).length ) {
            return;
        }

        drag.touched = (event.type === 'touchstart' || event.type === 'MSPointerDown') ? this : null;
        drag.touchedMSPointer = event.type === 'MSPointerDown';
        dd.propagates = 1;
        dd.mousedown = this;
        dd.interactions = [ drag.interaction( this, dd ) ];
        dd.target = event.target;
        dd.pageX = event.pageX;
        dd.pageY = event.pageY;
        dd.startEvent = event;
        dd.dragging = null;
        // handle draginit event...
        results = drag.hijack( event, "draginit", dd );
        // early cancel
        if ( !dd.propagates ) {
            return;
        }
        // flatten the result set
        results = drag.flatten( results );
        // insert new interaction elements
        if ( results && results.length ) {
            dd.interactions = [];
            $.each( results, function () {
                dd.interactions.push( drag.interaction( this, dd ) );
            });
        }
        // remember how many interactions are propagating
        dd.propagates = dd.interactions.length;
        // locate and init the drop targets
        if ( dd.drop !== false && $special.drop ) {
            $special.drop.handler( event, dd );
        }
        // disable text selection
        drag.textselect( false );
        // bind additional events...
        if ( drag.touchedMSPointer ) {
            $event.add( document, "MSPointerMove MSPointerUp MSPointerCancel", drag.handler, dd );
        } else if ( drag.touched ) {
            $event.add( drag.touched, "touchmove touchend", drag.handler, dd );
        } else {
            $event.add( document, "mousemove mouseup", drag.handler, dd );
        }
        // helps prevent text selection or scrolling
        if ( !drag.touched || dd.live ) {
            return false;
        }
    },

    // returns an interaction object
    interaction: function ( elem, dd ) {
        var offset = $( elem )[ dd.relative ? "position" : "offset" ]() || { top: 0, left: 0 };
        return {
            drag: elem,
            drop: null,
            callback: new drag.callback(),
            droppable: [],
            offset: offset,
            proxy: null,
            results: [],
            cancelled: false
        };
    },

    // handle drag-related DOM events
    handler: function ( event ) {
        // read the data before hijacking anything
        var dd = event.data;
        // handle various events
        switch ( event.type ){
            // mousemove, check distance, start dragging
            case !dd.dragging && 'touchmove':
            case !dd.dragging && 'MSPointerMove':
                event.preventDefault();
                dd.startEvent.preventDefault();
                //! fall through!
            case !dd.dragging && 'mousemove':
                //  drag tolerance, x² + y² = distance²
                if ( Math.pow( event.pageX - dd.pageX, 2 ) + Math.pow( event.pageY - dd.pageY, 2 ) < Math.pow( dd.distance, 2 ) ) {
                    break; // distance tolerance not reached
                }
                event.target = dd.target; // force target from "mousedown" event (fix distance issue)
                // make sure dragstart event carries the coordinates, etc. from the original mousedown/touchstart that started the drag:
                var start_event = new jQuery.Event( dd.startEvent.type, dd.startEvent );
                // forget the event result from when it was used in draginit, for recycling
                delete start_event.result;
                drag.hijack( start_event, "dragstart", dd ); // trigger "dragstart"
                if ( dd.propagates ) {   // "dragstart" not rejected
                    dd.dragging = true; // activate interaction
                }
                //! fall through!
            // mousemove, dragging
            case 'MSPointerMove':
            case 'touchmove':
                if (dd.axis === 'x') {
                    if (Math.abs(event.pageX - dd.pageX) >= Math.abs(event.pageY - dd.pageY)) {
                        event.preventDefault();
                    }
                }
                else if (dd.axis === 'y') {
                    if (Math.abs(event.pageX - dd.pageX) <= Math.abs(event.pageY - dd.pageY)) {
                        event.preventDefault();
                    }
                }
                else {
                    event.preventDefault();
                }
                //! fall through!
            case 'mousemove':
                if ( dd.dragging ) {
                    // trigger "drag"
                    drag.hijack( event, "drag", dd );
                    if ( dd.propagates ) {
                        // manage drop events
                        if ( dd.drop !== false && $special.drop ) {
                            $special.drop.handler( event, dd ); // "dropstart", "dropend"
                        }
                        break; // "drag" not rejected, stop
                    }
                    event.type = "mouseup"; // helps "drop" handler behave
                }
                //! fall through!
            // mouseup, stop dragging
            case 'MSPointerUp':
            case 'MSPointerCancel':
            case 'touchend':
            case 'mouseup':
            default:
                if ( drag.touchedMSPointer ) {
                    $event.remove( document, "MSPointerMove MSPointerUp MSPointerCancel", drag.handler ); // remove touch events
                } else if ( drag.touched && !drag.touchedMSPointer ) {
                    $event.remove( drag.touched, "touchmove touchend", drag.handler ); // remove touch events
                } else {
                    $event.remove( document, "mousemove mouseup", drag.handler ); // remove page events
                }
                if ( dd.dragging ) {
                    if ( dd.drop !== false && $special.drop ) {
                        $special.drop.handler( event, dd ); // "drop"
                    }
                    drag.hijack( event, "dragend", dd ); // trigger "dragend"
                }
                drag.textselect( true ); // enable text selection
                // if suppressing click events...
                if ( dd.click === false && dd.dragging ) {
                    $.data( dd.mousedown, "suppress.click", event.timeStamp || (event.originalEvent && event.originalEvent.timeStamp) || (new Date().getTime() + 5) );
                }
                dd.dragging = drag.touched = drag.touchedMSPointer = false; // deactivate element
                break;
        }
    },

    // re-use event object for custom events
    //
    // Note: hijack() is expected to *always* return an Array, even if only an empty one!
    hijack: function ( event, type, dd, x, elem ) {
        // not configured
        if ( !dd ) {
            return [];
        }
        // remember the original event and type
        var orig = {
            event: event.originalEvent,
            type: event.type
        },
        // is the event drag related or drog related?
        mode = type.indexOf("drop") ? "drag" : "drop",
        // iteration vars
        i = x || 0,
        ia, $elems, callback,
        len = !isNaN( x ) ? x : dd.interactions.length;
        // modify the event type
        event.type = type;
        // remove the original event
        event.originalEvent = null;
        // initialize the results
        dd.results = [];
        // handle each interacted element
        do {
            if ( ia = dd.interactions[ i ] ) {
                // validate the interaction
                if ( type !== "dragend" && ia.cancelled ) {
                    continue;
                }
                // set the dragdrop properties on the event object
                callback = drag.properties( event, dd, ia );
                // prepare for more results
                ia.results = [];
                // handle each element
                $( elem || ia[ mode ] || dd.droppable ).each(function ( p, subject ) {
                    var result;
                    // identify drag or drop targets individually
                    callback.target = subject;
                    // force propagation of the custom event
                    event.isPropagationStopped = function () {
                        return false;
                    };
                    event.isImmediatePropagationStopped = function () {
                        return false;
                    };
                    // handle the event
                    result = subject ? $event.dispatch.call( subject, event, callback ) : null;
                    // stop the drag interaction for this element
                    if ( result === false ) {
                        if ( mode === "drag" ) {
                            ia.cancelled = true;
                            dd.propagates -= 1;
                        }
                        if ( type === "drop" ) {
                            ia[ mode ][p] = null;
                        }
                    }
                    // assign any dropinit elements
                    else if ( type === "dropinit" ) {
                        ia.droppable.push( drag.element( result ) || subject );
                    }
                    // accept a returned proxy element
                    if ( type === "dragstart" ) {
                        ia.proxy = $( drag.element( result ) || ia.drag )[0];
                    }
                    // remember this result
                    ia.results.push( drag.element( result ) || subject );
                    // forget the event result, for recycling
                    delete event.result;
                    // break on cancelled handler
                    if ( type !== "dropinit" ) {
                        return result;
                    }
                    return true;
                });
                // flatten the results
                dd.results[ i ] = drag.flatten( ia.results );
                // accept a set of valid drop targets
                if ( type === "dropinit" ) {
                    ia.droppable = drag.flatten( ia.droppable );
                }
                // locate drop targets
                if ( type === "dragstart" && !ia.cancelled ) {
                    callback.update();
                }
            }
        } while ( ++i < len );
        // restore the original event & type
        event.type = orig.type;
        event.originalEvent = orig.event;
        // return all handler results
        return drag.flatten( dd.results );
    },

    // extend the callback object with drag/drop properties...
    properties: function ( event, dd, ia ) {
        var obj = ia.callback;
        // elements
        obj.drag = ia.drag;
        obj.proxy = ia.proxy || ia.drag;
        // starting mouse position
        obj.startX = dd.pageX;
        obj.startY = dd.pageY;
        // current distance dragged
        obj.deltaX = event.pageX - dd.pageX;
        obj.deltaY = event.pageY - dd.pageY;
        // original element position
        obj.originalX = ia.offset.left;
        obj.originalY = ia.offset.top;
        // adjusted element position
        obj.offsetX = obj.originalX + obj.deltaX;
        obj.offsetY = obj.originalY + obj.deltaY;
        // assign the drop targets information
        obj.drop = drag.flatten( ( ia.drop || [] ).slice() );
        obj.available = drag.flatten( ( ia.droppable || [] ).slice() );
        return obj;
    },

    // Determine if the argument is an element or jquery instance 
    // and only pass it through when it is, otherwise produce `undefined` instead
    element: function ( arg ) {
        if ( arg && ( arg.jquery || arg.nodeType === 1 ) ) {
            return arg;
        }
        return undefined;
    },

    // flatten nested jquery objects and arrays into a single dimension array
    flatten: function ( arr ) {
        return $.map( arr, function ( member ) {
            return member && member.jquery ? $.makeArray( member ) :
                member && member.length ? drag.flatten( member ) : member;
        });
    },

    // toggles text selection attributes ON (true) or OFF (false)
    textselect: function ( bool ) {
        $( document )[ bool ? "unbind" : "bind" ]( "selectstart", drag.dontstart )
        .css("MozUserSelect", bool ? "" : "none" );
        // .attr("unselectable", bool ? "off" : "on" );
        document.unselectable = bool ? "off" : "on";
    },

    // suppress "selectstart" and "ondragstart" events
    dontstart: function () {
        return false;
    },

    // a callback instance contructor
    callback: function () {
    }
};

// callback methods
drag.callback.prototype = {
    update: function () {
        if ( $special.drop && this.available.length ) {
            $.each( this.available, function ( i ) {
                $special.drop.locate( this, i );
            });
        }
    }
};

if ( !$special.click ) { $special.click = {}; }

var $clickPreDispatch = $special.click.preDispatch;

$special.click.preDispatch = function ( event ) {
    // Hook to allow supression of clicks after a drag.
    var evt_ts = (event.timeStamp || (event.originalEvent && event.originalEvent.timeStamp) || (new Date().getTime()) ) - 50;
    if ( $.data( this, "suppress.click" ) >= evt_ts ) {
        $.removeData( this, "suppress.click" );
        return false;
    }

    if ( $clickPreDispatch ) {
        return $clickPreDispatch.apply( this, arguments );
    }
};


// event fix hooks for MS pointer (IE10) events...
var msPointerHooks =
$event.fixHooks.MSPointerMove =
$event.fixHooks.MSPointerUp =
$event.fixHooks.MSPointerDown = {
    props: "clientX clientY pageX pageY screenX screenY".split( " " ),
    filter: function ( event, orig ) {
        if ( orig ) {
            $.each( msPointerHooks.props, function ( i, prop ) {
                event[ prop ] = orig[ prop ];
            });
        }
        return event;
    }
};

// event fix hooks for touch events...
var touchHooks =
$event.fixHooks.touchstart =
$event.fixHooks.touchmove =
$event.fixHooks.touchend =
$event.fixHooks.touchcancel = {
    props: "clientX clientY pageX pageY screenX screenY".split( " " ),
    filter: function ( event, orig ) {
        if ( orig ) {
            var touched = ( orig.touches && orig.touches[0] )
                || ( orig.changedTouches && orig.changedTouches[0] )
                || null;
            // iOS webkit: touchstart, touchmove, touchend
            if ( touched ) {
                $.each( touchHooks.props, function ( i, prop ) {
                    event[ prop ] = touched[ prop ];
                });
            }
        }
        return event;
    }
};

// share the same special event configuration with related events...
$special.draginit = $special.dragstart = $special.dragend = drag;

}));        // UMD wrapper end
