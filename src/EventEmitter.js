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
comicEvent.target = window || this;  

eventemitter.addEventListener('bang', function(e, payload) {
    console.log(`Callback scope: ${this}`);
    console.log(`Event: ${e.type}`);
    console.log(`Event target: ${e.target}`);
    console.log(`${e.superhero} (POW!), ${e.sidekick} (BOOM!)`);
    console.log(`Data: ${payload}`);
});

// triggerEvent is meant to take an Event object which should be extended
// for a custom event.

let payload = {
    city: 'Gotham'
};  

eventemitter.triggerEvent(ev, payload);
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

EventEmitter.prototype = {
    /**
    Execute all event listeners tied to the emitted event type.
    
    @method triggerEvent
    @param {Event|object} event
    */
    triggerEvent: function(event) {
        const eventHandlers = this._eventListeners[event.type];

        if (eventHandlers !== undefined) {
            if (typeof eventHandlers === 'function') {
                eventHandlers.apply(this, arguments);
            } else {
                const n = eventHandlers.length;
                let i = 0;

                for (; i < n; i++) {
                    eventHandlers[i].apply(this, arguments);
                }
            }
        }
    },

    /**
    Adds a single event callback to the listeners container of the event type.
    Creates and new callbacks container (array) if there has not been any callbacks added to the event yet.
    
    @method addEventListener
    @param {string|number} type
    @param {function} callback
    */
    addEventListener: function(type, callback) {
        let eventHandlers = this._eventListeners[type];

        // Create listener container on the fly if there isn't one.
        // Only reference the callback if it's the first listener.
        if (eventHandlers === undefined) {
            eventHandlers = this._eventListeners[type] = callback;
        } else if (typeof eventHandlers === 'function') {
            eventHandlers = this._eventListeners[type] = [eventHandlers, callback];
        } else {
            eventHandlers.push(callback);
        }
    },

    /**
    Removes a single callback from the listener container of the event type.
     
    @method removeEventListener
    @param {string|number} type
    @param {function} callback
    */
    removeEventListener: function(type, callback) {
        const eventListeners = this._eventListeners[type];

        if (eventListeners !== undefined) {
            if (typeof eventListeners === 'function') {
                this._eventListeners[type] = undefined;
            } else {
                const n = eventListeners.length;
                let i = 0;

                for (; i < n; i++) {
                    if (callback === eventListeners[i]) {
                        eventListeners.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },

    /**
    Removes all listeners from a single event.
    
    @method removeAllEventListeners
    @param {string} type - Event name.
    */
    removeAllEventListeners: function(type) {
        const eventListeners = this._eventListeners[type];

        if (eventListeners !== undefined) {
            if (typeof eventListeners === 'function') {
                this._eventListeners[type] = undefined;
            } else {
                const n = eventListeners.length;
                let i = 0;

                for (; i < n; i++) {
                    eventListeners.pop();
                }
            }
        }
    },

    /**
    Access the number of listeners for an event.

    @method eventListenerCount
    @param {string} type
    */
    eventListenerCount: function(type) {
        const eventListeners = this._eventListeners[type];

        if (typeof eventListeners === 'function') {
            return 1;
        }
        if (Object.prototype.toString.call(eventListeners) === '[object Array]') {
            return eventListeners.length;
        }

        return 0;
    },

    /**
    Used for object pooling.
    
    @method init
    */
    init: function() {
        this._eventListeners = {};
    },

    /**
    Used for object pooling.
     
    @method release
    */
    release: function() {
        this._eventListeners = null;
    }
};

/**
Alias of addEventListener.

@method on
*/
EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;