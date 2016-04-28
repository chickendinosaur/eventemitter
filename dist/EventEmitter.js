/**
@license
The MIT License (MIT)

Copyright (c) 2016 John Pittman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

/**
@example
import EventEmitter from '@chickendinosaur/eventemitter';
import Event from '@chickendinosaur/eventemitter/Event.js';

class ComicEvent extends Event {
	constructor(type) {
		super(type);

		this.superhero = 'The Nameless Man';
		this.sidekick = null;
	}
}

const eventemitter = new EventEmitter();

const comicEvent = new ComicEvent('comic');
comicEvent.superhero = 'Batman';
comicEvent.sidekick = 'Robin';

eventemitter.addEventListener('comic', function (event) {
	console.log(`Callback scope: ${this.constructor.name}`);
	console.log(`Event: ${event.type}`);
	console.log(`${event.superhero} (POW!), ${event.sidekick} (BOOM!)`);
});

// Ability pipe all events to a listener.
eventemitter.pipe(function (event) {
	if (event.type === 'comic') {
		console.log(`Piped the ${event.type} event.`);
	}
});

console.log(`Listener count: ${eventemitter.getEventListenerCount('comic')}`);
console.log(`Piped listener count: ${eventemitter.getPipedEventListenerCount()}`);

// triggerEvent is meant to take an Event object which should be extended
// for a custom event or at least contain a 'type' property.

eventemitter.triggerEvent(comicEvent);

eventemitter.removeAllEventListeners('comic');
eventemitter.triggerEvent(comicEvent);

eventemitter.unpipeAll();
eventemitter.triggerEvent(comicEvent);

@class EventEmitter
@constructor
*/

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = EventEmitter;
function EventEmitter() {
	/**
 Contains event keys mapped to listeners.
 
 @property _eventHandlers
 @type {object}
 */
	this._eventHandlers = {};

	/**
 @property _pipedEventHandlers
 @type {array}
 */
	this._pipedEventHandlers = null;
}

EventEmitter.prototype.constructor = EventEmitter;

/**
Execute all event listeners tied to the emitted event type.

@method triggerEvent
@param {Event|object} event
*/
EventEmitter.prototype.triggerEvent = function (event) {
	var eventHandlers = this._eventHandlers[event.type];

	if (eventHandlers !== undefined) {
		if (eventHandlers.constructor === Function) {
			eventHandlers.call(this, event);
		} else {
			var n = eventHandlers.length;
			var i = 0;

			while (i < n) {
				eventHandlers[i].call(this, event);

				++i;
			}
		}
	}

	// Run all piped listeners that will get passed every event.
	if (this._pipedEventHandlers !== null) {
		var pipedEventHandlers = this._pipedEventHandlers;

		if (pipedEventHandlers.constructor === Function) {
			pipedEventHandlers.call(this, event);
		} else {
			var _n = pipedEventHandlers.length;
			var _i = 0;

			while (_i < _n) {
				pipedEventHandlers[_i].call(this, event);

				++_i;
			}
		}
	}
};

/**
Adds a single event callback to the listeners container of the event type.
Creates and new callbacks container (array) if there has not been any callbacks added to the event yet.

@method addEventListener
@param {string|number} type
@param {function} callback
*/
EventEmitter.prototype.addEventListener = function (type, callback) {
	var eventHandlers = this._eventHandlers[type];

	// Create listener container on the fly if there isn't one.
	// Only reference the callback if it's the first listener.
	if (eventHandlers === undefined) {
		this._eventHandlers[type] = callback;
	} else if (eventHandlers.constructor === Function) {
		this._eventHandlers[type] = [eventHandlers, callback];
	} else {
		eventHandlers.push(callback);
	}
};

/**
Alias of addEventListener.

@method on
*/
EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;

/**
Removes a single callback from the listener container of the event type.

@method removeEventListener
@param {string|number} type
@param {function} callback
*/
EventEmitter.prototype.removeEventListener = function (type, callback) {
	var eventHandlers = this._eventHandlers[type];

	if (eventHandlers !== undefined) {
		if (eventHandlers.constructor === Function) {
			this._eventHandlers[type] = undefined;
		} else {
			var n = eventHandlers.length;
			var i = 0;

			while (i < n) {
				if (callback === eventHandlers[i]) {
					eventHandlers.splice(i, 1);
					break;
				}

				++i;
			}
		}
	}
};

/**
Removes all listeners from a single event.

@method removeAllEventListeners
@param {string} type - Event name.
*/
EventEmitter.prototype.removeAllEventListeners = function (type) {
	var eventHandlers = this._eventHandlers[type];

	if (eventHandlers !== undefined) {
		if (eventHandlers.constructor === Function) {
			this._eventHandlers[type] = undefined;
		} else {
			while (eventHandlers.length > 0) {
				eventHandlers.pop();
			}
		}
	}
};

/**
Access the number of listeners for an event.

@method getEventListenerCount
@param {string} type
*/
EventEmitter.prototype.getEventListenerCount = function (type) {
	var eventHandlers = this._eventHandlers[type];

	if (eventHandlers === undefined) {
		return 0;
	}

	if (eventHandlers.constructor === Function) {
		return 1;
	}

	return eventHandlers.length;
};

/**
@method pipe
@param {function} callback
*/
EventEmitter.prototype.pipe = function (callback) {
	var pipedEventHandlers = this._pipedEventHandlers;

	if (pipedEventHandlers === null) {
		this._pipedEventHandlers = callback;
	} else if (pipedEventHandlers.constructor === Function) {
		this._pipedEventHandlers = [pipedEventHandlers, callback];
	} else {
		pipedEventHandlers.push(callback);
	}
};

/**
@method unpipe
@param {function} callback
*/
EventEmitter.prototype.unpipe = function (callback) {
	var pipedEventHandlers = this._pipedEventHandlers;

	if (pipedEventHandlers !== null) {
		if (pipedEventHandlers.constructor === Function) {
			this._pipedEventHandlers = null;
		} else {
			var n = pipedEventHandlers.length;
			var i = 0;

			while (i < n) {
				if (callback === pipedEventHandlers[i]) {
					pipedEventHandlers.splice(i, 1);
					break;
				}

				++i;
			}
		}
	}
};

/**
@method unpipeAll
*/
EventEmitter.prototype.unpipeAll = function () {
	var pipedEventHandlers = this._pipedEventHandlers;

	if (pipedEventHandlers !== null) {
		if (pipedEventHandlers.constructor === Function) {
			this._pipedEventHandlers = null;
		} else {
			while (pipedEventHandlers.length > 0) {
				pipedEventHandlers.pop();
			}
		}
	}
};

/**
@method getPipedEventListenerCount
*/
EventEmitter.prototype.getPipedEventListenerCount = function () {
	var pipedEventHandlers = this._pipedEventHandlers;

	if (pipedEventHandlers === null) {
		return 0;
	}

	if (pipedEventHandlers.constructor === Function) {
		return 1;
	}

	return pipedEventHandlers.length;
};

/**
Used for object pooling.

@method init
*/
EventEmitter.prototype.init = function () {
	this._eventHandlers = {};
};

/**
Used for object pooling.

@method dispose
*/
EventEmitter.prototype.dispose = function () {
	this._eventHandlers = null;
	this._pipedEventHandlers = null;
};