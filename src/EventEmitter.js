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

eventemitter.addEventListener('bang', function(e) {
    console.log(`this = ${this}`);
    console.log(`Event: ${e.type}`);
    console.log(`Event target: ${e.target}`);
    console.log(`${e.superhero} (POW!), ${e.sidekick} (BOOM!)`);
});

// emitEvent is meant to take an Event object which should be extended
// for a custom event.
  
eventemitter.emitEvent(ev);
eventemitter.removeAllEventListeners('bang');
eventemitter.emitEvent(ev);
      
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
    Execute all handlers tied to the emitted event type.
    
    @method emitEvent
    @param {object} event - Event object that contains a the type of event along with other event data.
    */
    emitEvent: function(event) {
        const eventHandlers = this._eventListeners[event.type];

        if (eventHandlers !== undefined) {
            if (typeof eventHandlers === 'function') {
                eventHandlers.call(this, event);
            } else {
                const n = eventHandlers.length;
                let i = 0;

                for (; i < n; i++) {
                    eventHandlers[i].call(this, event);
                }
            }
        }
    },

    /**
    Adds a single event handler to the handlers container of the event type.
    Creates and new handlers container (array) if there has not been any handlers added to the event yet.
    
    @method addEventListener
    @param {string|number} type - Type key.
    @param {function} handler - Handler callback.
    */
    addEventListener: function(type, handler) {
        let eventHandlers = this._eventListeners[type];

        // Create handler container on the fly if there isn't one.
        // Only reference the handler if it's the first listener.
        if (eventHandlers === undefined) {
            eventHandlers = this._eventListeners[type] = handler;
        } else if (typeof eventHandlers === 'function') {
            eventHandlers = this._eventListeners[type] = [eventHandlers, handler];
        } else {
            eventHandlers.push(handler);
        }
    },

    /**
    Removes a single event handler from the handlers container of the event type.
     
    @method removeEventListener
    @param {string|number} type - Type key.
    @param {function} handler - Handler reference.
    */
    removeEventListener: function(type, handler) {
        const eventHandlers = this._eventListeners[type];

        if (eventHandlers !== undefined) {
            if (typeof eventHandlers === 'function') {
                this._eventListeners[type] = undefined;
            } else {
                const n = eventHandlers.length;
                let i = 0;

                for (; i < n; i++) {
                    if (handler === eventHandlers[i]) {
                        eventHandlers.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },

    /**
    Removes all handler callbacks from a single event.
    
    @method removeAllEventListeners
    @param {string} type - Event name.
    */
    removeAllEventListeners: function(type) {
        const eventHandlers = this._eventListeners[type];

        if (eventHandlers !== undefined) {
            if (typeof eventHandlers === 'function') {
                this._eventListeners[type] = undefined;
            } else {
                const n = eventHandlers.length;
                let i = 0;

                for (; i < n; i++) {
                    eventHandlers.pop();
                }
            }
        }
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
}