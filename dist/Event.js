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
import Event from '@chickendinosaur/eventemitter/Event';

const pauseEvent = new Event('pause');
const errorEvent = new Event(404);

@class Event
@constructor
@param {string|number} type
*/

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Event;
function Event(type) {
    /**
    Id of the event.
    
    @property type
    @type {string|number}
    */
    this.type = type;

    /**
    Owner of the event.
    
    @property target
    @type {*}
    */
    this.target = null;

    /**
    Meant to hold any data that needs to be passed to listeners.
    
    @property payload
    @type {*}
    */
    this.payload = null;
}

Event.prototype = {
    /**
    Used for object pooling.
    
    @method init
    @param {string|number} type
    */
    init: function init(type) {
        this.type = type;
    },

    /**
    Used for object pooling.
     
    @method release
    */
    release: function release() {
        this.type = null;
        this.target = null;
        this.payload = null;
    }
};