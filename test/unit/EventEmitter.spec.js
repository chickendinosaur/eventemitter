var EventEmitter = require('./../../dist/EventEmitter').default;
var Event = require('./../../dist/Event').default;

// Create a custom event to test.
function CountEvent(type) {
    Event.call(this, type);

    this.increment = 1;
    this.count = 10;
}

CountEvent.prototype = Object.create(Event.prototype);

describe('EventEmitter', function() {
    var ee = new EventEmitter();
    var count = 0;
    var count2 = 0;
    // Object to test event.target and this against.
    function testScope() {}
    function testScope2() {}

    var ev1 = new CountEvent('count');
    ev1.target = testScope2;

    var handler1 = function(e) {
        count += e.increment;
        count2 = e.count;
    };

    beforeEach(function() {
        ee = new EventEmitter();
        count = 0;
        count2 = 0;
    });

    describe('addEventListener', function() {
        it('Event references a function on one listener.', function() {
            ee.addEventListener('count', function() {});
            expect(typeof ee._eventListeners['count']).toBe('function');
        });
        it('Event references an array on more than one listener.', function() {
            ee.addEventListener('count', function() {});
            ee.addEventListener('count', handler1);
            expect(ee._eventListeners['count'].length).toBe(2);
        });
    });

    describe('removeEventListener', function() {
        it('Resets event handlers for an event back to undefined on one listener available.', function() {
            ee.addEventListener('count', function() {});
            ee.removeEventListener('count', handler1);
            expect(ee._eventListeners['count']).toBe(undefined);
        });
        it('Removes single handler from event listeners container.', function() {
            ee.addEventListener('count', function() {});
            ee.addEventListener('count', handler1);
            ee.removeEventListener('count', handler1);
            expect(ee._eventListeners['count'].length).toBe(1);
        });
    });

    describe('removeAllEventListeners', function() {
        it('Resets event handlers for an event back to undefined on one listener available.', function() {
            ee.addEventListener('count', function() {});
            ee.removeAllEventListeners('count');
            expect(ee._eventListeners['count']).toBe(undefined);
        });
        it('Removes all handlers from event listeners container.', function() {
            ee.addEventListener('count', function() {});
            ee.addEventListener('count', handler1);
            ee.removeAllEventListeners('count');
            expect(ee._eventListeners['count'].length).toBe(0);
        });
    });

    describe('emitEvent', function() {
        it('Test base event propteries', function() {
            ee.addEventListener('count', function(event) {
                expect(this).toEqual(ee);
                expect(event.target).toEqual(testScope2);
                expect(event.type).toBe('count');
            });
            ee.emitEvent(ev1);
        });
        it('Execute listeners when only one for an event.', function() {
            ee.addEventListener('count', handler1);
            ee.emitEvent(ev1);
            expect(count).toBe(1);
            expect(count2).toBe(10);
        });
        it('Execute all listeners when more than one for an event.', function() {
            ee.addEventListener('count', handler1);
            ee.addEventListener('count', handler1);
            ee.emitEvent(ev1);
            expect(count).toBe(2);
            expect(count2).toBe(10);
        });
    });
});
