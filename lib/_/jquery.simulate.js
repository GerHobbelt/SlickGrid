 /*!
 * jQuery Simulate v@VERSION - simulate browser mouse and keyboard events
 * https://github.com/jquery/jquery-simulate
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: @DATE
 */

(function (root, doc, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], function(jQuery) {
            factory(root, doc, jQuery);
        });
    } else {
        // Browser globals
        factory(root, doc, root.jQuery);
    }
}(this, document, function (window, document, $, undefined) {

var rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click|drag(?:start|end|over|leave|enter)|drop/,
	currentElementUnderMouse;

$.fn.simulate = function( type, options ) {
	return this.each(function() {
		new $.simulate( this, type, options );
	});
};

$.simulate = function( elem, type, options ) {
	var method = $.camelCase( "simulate-" + type );

	this.target = elem;
	this.options = options;

	if ( this[ method ] ) {
		this[ method ]();
	} else {
		this.simulateEvent( elem, type, options );
	}
};

$.extend( $.simulate, {

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	},

	buttonCode: {
		LEFT: 0,
		MIDDLE: 1,
		RIGHT: 2
	}
});

$.extend( $.simulate.prototype, {

	simulateEvent: function( elem, type, options ) {
		var event = this.createEvent( type, options );
		this.dispatchEvent( elem, type, event, options );
	},

	createEvent: function( type, options ) {
		if ( rkeyEvent.test( type ) ) {
			return this.keyEvent( type, options );
		}

		if ( rmouseEvent.test( type ) ) {
			return this.mouseEvent( type, options );
		}

		// we'll throw error if we couldn't match event type
		throw new Error("Could not create event of type: " + type);
	},

	mouseEvent: function( type, options ) {
		var event, eventDoc, doc, body, configurable = false;
		options = $.extend({
			bubbles: true,
			cancelable: (type !== "mousemove"),
			view: window,
			detail: 0,
			screenX: 0,
			screenY: 0,
			clientX: 1,
			clientY: 1,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			button: 0,
			relatedTarget: undefined
		}, options );

		if ( document.createEvent ) {
			event = document.createEvent( "MouseEvents" );
			event.initMouseEvent( type, options.bubbles, options.cancelable,
				options.view, options.detail,
				options.screenX, options.screenY, options.clientX, options.clientY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
				options.button, options.relatedTarget || document.body.parentNode );

			// IE 9+ creates events with pageX and pageY set to 0.
			// Trying to modify the properties throws an error,
			// so we define getters to return the correct values.
			if ( Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor( event, "pageX" ).configurable && Object.defineProperty ) {
				configurable = true;
			}
			if ( event.pageX === 0 && event.pageY === 0 && configurable ) {
				eventDoc = event.relatedTarget.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				Object.defineProperty( event, "pageX", {
					get: function() {
						return options.clientX +
							( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
							( doc && doc.clientLeft || body && body.clientLeft || 0 );
					}
				});
				Object.defineProperty( event, "pageY", {
					get: function() {
						return options.clientY +
							( doc && doc.scrollTop || body && body.scrollTop || 0 ) -
							( doc && doc.clientTop || body && body.clientTop || 0 );
					}
				});
			}
		} else if ( document.createEventObject ) {
			event = document.createEventObject();
			$.extend( event, options );
			// standards event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ff974877(v=vs.85).aspx
			// old IE event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ms533544(v=vs.85).aspx
			// so we actually need to map the standard back to oldIE
			event.button = {
				0: 1,
				1: 4,
				2: 2
			}[ event.button ] || ( event.button === -1 ? 0 : event.button );
		}

		return event;
	},

	keyEvent: function( type, options ) {
		var event;
		options = $.extend({
			bubbles: true,
			cancelable: true,
			view: window,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			keyCode: 0,
			charCode: undefined
		}, options );

		if ( document.createEvent ) {
			try {
				event = document.createEvent( "KeyEvents" );
				event.initKeyEvent( type, options.bubbles, options.cancelable, options.view,
					options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
					options.keyCode, options.charCode );
			// initKeyEvent throws an exception in WebKit
			// see: http://stackoverflow.com/questions/6406784/initkeyevent-keypress-only-works-in-firefox-need-a-cross-browser-solution
			// and also https://bugs.webkit.org/show_bug.cgi?id=13368
			// fall back to a generic event until we decide to implement initKeyboardEvent
			} catch( err ) {
				event = document.createEvent( "Events" );
				event.initEvent( type, options.bubbles, options.cancelable );
				$.extend( event, {
					view: options.view,
					ctrlKey: options.ctrlKey,
					altKey: options.altKey,
					shiftKey: options.shiftKey,
					metaKey: options.metaKey,
					keyCode: options.keyCode,
					charCode: options.charCode
				});
			}
		} else if ( document.createEventObject ) {
			event = document.createEventObject();
			$.extend( event, options );
		}

		if ( !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() ) || (({}).toString.call( window.opera ) === "[object Opera]") ) {
			event.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
			event.charCode = undefined;
		}

		return event;
	},

	dispatchEvent: function( elem, type, event ) {
		var useNativeMethod = false;

		if ( elem.type && "checkbox radio".search( elem.type ) > -1 && !( event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.keyCode )) {
			useNativeMethod = true;
		}

		if ( useNativeMethod && type === "click" && elem[ type ] ) {
			// HTMLElement click don't focus the element
			elem.focus();
			// IE8 needs the native HTMLElement click function to change checkbox/radio state
			elem[ type ]();
		} else if ( elem.dispatchEvent ) {
			elem.dispatchEvent( event );
		} else if ( elem.fireEvent ) {
			elem.fireEvent( "on" + type, event );
		}
	},

	simulateFocus: function() {
		var focusinEvent,
			triggered = false,
			element = $( this.target );

		function trigger() {
			triggered = true;
		}

		element.bind( "focus", trigger );
		element[ 0 ].focus();

		if ( !triggered ) {
			focusinEvent = $.Event( "focusin" );
			focusinEvent.preventDefault();
			element.trigger( focusinEvent );
			element.triggerHandler( "focus" );
		}
		element.unbind( "focus", trigger );
	},

	simulateBlur: function() {
		var focusoutEvent,
			triggered = false,
			element = $( this.target );

		function trigger() {
			triggered = true;
		}

		element.bind( "blur", trigger );
		element[ 0 ].blur();

		// blur events are async in IE
		setTimeout(function() {
			// IE won't let the blur occur if the window is inactive
			if ( element[ 0 ].ownerDocument.activeElement === element[ 0 ] ) {
				element[ 0 ].ownerDocument.body.focus();
			}

			// Firefox won't trigger events if the window is inactive
			// IE doesn't trigger events if we had to manually focus the body
			if ( !triggered ) {
				focusoutEvent = $.Event( "focusout" );
				focusoutEvent.preventDefault();
				element.trigger( focusoutEvent );
				element.triggerHandler( "blur" );
			}
			element.unbind( "blur", trigger );
		}, 1 );
	},

	simulateMousemove: function() {
		var elementUnderMouse;

		// What element will come to be underneath the mouse after the move?
		elementUnderMouse = document.elementFromPoint( this.options.clientX, this.options.clientY );

		if( elementUnderMouse !== currentElementUnderMouse ) {
			if( currentElementUnderMouse ) {
				// Fire mouseout on the previous element
				this.simulateEvent( currentElementUnderMouse, "mouseout", this.options );
			}

			if( elementUnderMouse && !$( "body" ).is( elementUnderMouse ) ) {
				// Fire mouseover on the new element
				this.simulateEvent( elementUnderMouse, "mouseover", this.options );
			}
		}

		// Fire the mousemove event on the document
		this.simulateEvent( document, "mousemove", this.options );

		// Store the element under the mouse for the next move
		currentElementUnderMouse = elementUnderMouse;
	}
});

/** complex events **/

function findCenter( elem ) {
	var offset,
		document = $( elem.ownerDocument );
	elem = $( elem );
	offset = elem.offset();

	return {
		x: offset.left + elem.outerWidth() / 2 - document.scrollLeft(),
		y: offset.top + elem.outerHeight() / 2 - document.scrollTop()
	};
}

function findCorner( elem ) {
	var offset,
		document = $( elem.ownerDocument );
	elem = $( elem );
	offset = elem.offset();

	return {
		x: offset.left - document.scrollLeft(),
		y: offset.top - document.scrollTop()
	};
}

$.extend( $.simulate.prototype, {
	simulateDrag: function() {
		var dragger = this.makeDragger();
		dragger.start(this.target, {
            clientX: this.options.clientX,
            clientY: this.options.clientY
        });
		dragger.move(this.options);
		dragger.end();
	},
	makeDragger: function () {
		return new $.simulate.dragger(this);
	}
});

$.simulate.dragger = function (simulator) {
	this.started = false;
	this.ended = false;
	this.simulator = simulator;
};
$.extend( $.simulate.dragger.prototype, {
	start: function (target, options) {
		if ( this.started || this.ended ) {
			return;
		}

        options = options || {};

		this.started = true;
		this.target = target;
        this.document = target.ownerDocument || document;
        
		var center = options.handle === "corner" ? findCorner( target ) : findCenter( target );
		this.coord = {
			clientX: options.clientX || Math.floor( center.x ),
			clientY: options.clientY || Math.floor( center.y )
		};

		this.simulator.simulateEvent( target, "mousedown", this.coord );
	},
	move: function (delta) {
		if (!this.started || this.ended) {
			return;
		}

		var moves = delta.steps || 3,
			dx = Math.floor(delta.dx || 0),
			dy = Math.floor(delta.dy || 0),
			final_coord = {
				clientX: this.coord.clientX + dx,
				clientY: this.coord.clientY + dy
			},
            i,
            x = this.coord.clientX,
            y = this.coord.clientY,
            coord;

		for ( i = 0 ; i < moves - 1 ; i++ ) {
			x += (dx / moves);
			y += (dy / moves);
			coord = {
				clientX: Math.round( x ),
				clientY: Math.round( y )
			};

			this.simulator.simulateEvent( this.document, "mousemove", coord );
		}

		this.simulator.simulateEvent( this.document, "mousemove", final_coord );
		this.coord = final_coord;

	},
	end: function (delta) {
		if (!this.started || this.ended) {
			return;
		}
		if ( delta ) {
			this.move(delta);
		}

		this.ended = true;

		if ( $.contains( document, this.target ) ) {
			this.simulator.simulateEvent( this.target, "mouseup", this.coord );
			this.simulator.simulateEvent( this.target, "click", this.coord );
		} else {
			this.simulator.simulateEvent( this.target, "mouseup", this.coord );
		}
	}
});

}));        // UMD wrapper end

