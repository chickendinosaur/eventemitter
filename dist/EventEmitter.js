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
import Event from '@chickendinosaur/eventemitter/Event';

class ComicEvent extends Event{
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

eventemitter.addEventListener('bang', function(e) {
    console.log(`Callback scope: ${this}`);
    console.log(`Event: ${e.type}`);
    console.log(`${e.superhero} (POW!), ${e.sidekick} (BOOM!)`);
});

console.log(`Listener count: ${eventemitter.getEventListenerCount('comic')}`);

// triggerEvent is meant to take an Event object which should be extended
// for a custom event or at least contain a 'type' property.

eventemitter.triggerEvent(ev);
eventemitter.removeAllEventListeners('bang');
eventemitter.triggerEvent(ev);
      
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
     
    @property _eventListeners
    @type {object}
    */
    this._eventListeners = {};

    /**
    @property _eventCallbacks
    @type {array}
    */
    this._eventCallbacks = null;
}

EventEmitter.prototype.constructor = EventEmitter;

/**
Execute all event listeners tied to the emitted event type.
    
@method triggerEvent
@param {Event|object} event
*/
EventEmitter.prototype.triggerEvent = function (event) {
    var eventListeners = this._eventListeners[event.type];

    if (eventListeners !== undefined) {
        if (typeof eventListeners === 'function') {
            eventListeners.call(this, event);
        } else {
            var i = eventListeners.length;

            while (i > 0) {
                --i;

                eventListeners[i].call(this, event);
            }
        }
    }

    // Run listeners that will get passed every event.
    if (this._eventCallbacks !== null) {
        var eventCallbacks = this._eventCallbacks;
        var i = eventCallbacks.length;

        while (i > 0) {
            --i;

            eventCallbacks[i].call(this, event);
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
    if (callback === undefined) {
        this._addEventCallback(type);
    } else {
        var eventHandlers = this._eventListeners[type];

        // Create listener container on the fly if there isn't one.
        // Only reference the callback if it's the first listener.
        if (eventHandlers === undefined) {
            this._eventListeners[type] = callback;
        } else if (typeof eventHandlers === 'function') {
            this._eventListeners[type] = [eventHandlers, callback];
        } else {
            eventHandlers.push(callback);
        }
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
    if (callback === undefined) {
        this._removeEventCallback(type);
    } else {
        var eventListeners = this._eventListeners[type];

        if (eventListeners !== undefined) {
            if (typeof eventListeners === 'function') {
                this._eventListeners[type] = undefined;
            } else {
                var i = eventListeners.length;

                while (i > 0) {
                    --i;

                    if (callback === eventListeners[i]) {
                        eventListeners.splice(i, 1);
                        break;
                    }
                }
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
    if (type === undefined) {
        this._removeAllEventCallbacks();
    } else {
        var eventListeners = this._eventListeners[type];

        if (eventListeners !== undefined) {
            if (typeof eventListeners === 'function') {
                this._eventListeners[type] = undefined;
            } else {
                while (eventListeners.length > 0) {
                    eventListeners.pop();
                }
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
    var result = 0;

    if (type === undefined) {
        this._getEventCallbackCount();
    } else {
        var eventListeners = this._eventListeners[type];

        if (typeof eventListeners === 'function') {
            result = 1;
        } else if (eventListeners !== undefined) {
            result = eventListeners.length;
        }
    }

    return result;
};

/**
@method _addEventCallback
@param {function} callback
*/
EventEmitter.prototype._addEventCallback = function (callback) {
    if (this._eventCallbacks === null) {
        this._eventCallbacks = [];
    }

    this._eventCallbacks.push(callback);
};

/**
@method _removeEventCallback
@param {function} callback
*/
EventEmitter.prototype._removeEventCallback = function (callback) {
    var eventCallbacks = this._eventCallbacks;
    var i = eventCallbacks.length;

    while (i > 0) {
        --i;

        if (callback === eventCallbacks[i]) {
            eventCallbacks.splice(i, 1);
            break;
        }
    }
};

/**
@method _removeAllEventCallbacks
*/
EventEmitter.prototype._removeAllEventCallbacks = function () {
    var eventCallbacks = this._eventCallbacks;

    while (eventCallbacks.length > 0) {
        eventCallbacks.pop();
    }
};

/**
@method _getEventCallbackCount
*/
EventEmitter.prototype._getEventCallbackCount = function () {
    var result = 0;

    if (this._eventCallbacks !== null) {
        result = this._eventCallbacks.length;
    }

    return result;
};

/**
Used for object pooling.
    
@method init
*/
EventEmitter.prototype.init = function () {
    this._eventListeners = {};
};

/**
Used for object pooling.
 
@method dispose
*/
EventEmitter.prototype.dispose = function () {
    this._eventListeners = null;
};