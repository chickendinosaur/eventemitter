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
export default function EventEmitter() {
    /**
    Contains event keys mapped to listeners.
     
    @property _eventListeners
    @type {object}
    */
    this._eventListeners = {};
}

EventEmitter.prototype.constructor = EventEmitter;

/**
Execute all event listeners tied to the emitted event type.
    
@method triggerEvent
@param {Event|object} event
*/
EventEmitter.prototype.triggerEvent = function(event) {
    const eventHandlers = this._eventListeners[event.type];

    if (eventHandlers !== undefined) {
        if (typeof eventHandlers === 'function') {
            eventHandlers.call(this, event);
        } else {
            const n = eventHandlers.length;
            let i = 0;

            for (; i < n;) {
                eventHandlers[i].call(this, event);

                ++i;
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
EventEmitter.prototype.addEventListener = function(type, callback) {
    let eventHandlers = this._eventListeners[type];

    // Create listener container on the fly if there isn't one.
    // Only reference the callback if it's the first listener.
    if (eventHandlers === undefined) {
        this._eventListeners[type] = callback;
    } else if (typeof eventHandlers === 'function') {
        this._eventListeners[type] = [eventHandlers, callback];
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
EventEmitter.prototype.removeEventListener = function(type, callback) {
    const eventListeners = this._eventListeners[type];

    if (eventListeners !== undefined) {
        if (typeof eventListeners === 'function') {
            this._eventListeners[type] = undefined;
        } else {
            let i = eventListeners.length;

            for (; i > 0;) {
                if (callback === eventListeners[i]) {
                    eventListeners.splice(i, 1);
                    break;
                }

                --i;
            }
        }
    }
};

/**
Removes all listeners from a single event.
    
@method removeAllEventListeners
@param {string} type - Event name.
*/
EventEmitter.prototype.removeAllEventListeners = function(type) {
    const eventListeners = this._eventListeners[type];

    if (eventListeners !== undefined) {
        if (typeof eventListeners === 'function') {
            this._eventListeners[type] = undefined;
        } else {
            let i = eventListeners.length;

            for (; i > 0;) {
                eventListeners.pop();

                --i;
            }
        }
    }
};

/**
Access the number of listeners for an event.

@method getEventListenerCount
@param {string} type
*/
EventEmitter.prototype.getEventListenerCount = function(type) {
    const eventListeners = this._eventListeners[type];

    if (eventListeners === undefined) {
        return 0;
    }

    if (typeof eventListeners === 'function') {
        return 1;
    }

    return eventListeners.length;
};

/**
Used for object pooling.
    
@method init
*/
EventEmitter.prototype.init = function() {
    this._eventListeners = {};
};

/**
Used for object pooling.
 
@method dispose
*/
EventEmitter.prototype.dispose = function() {
    this._eventListeners = null;
};