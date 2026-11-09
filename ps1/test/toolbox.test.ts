/*
 * Tests for your toolbox functions in src/toolbox.ts (PS1 problem 7c).
 * Goal: find bugs in THESE functions, not in other code.
 * No tests are needed for handoutExampleOne / handoutExampleTwo.
 * Re-exported utils.ts functions are tested in utils.test.ts, not here.
 */

import assert from 'node:assert';
import { framerate, Frame } from '../lib/animate.js';
import { Point } from '../src/curves.js';
import { makeAnimation, translate } from '../src/toolbox.js';
import { assertApproxEqual } from '../src/utils.js';

describe('makeAnimation', function () {
    /*
     * Testing strategy for makeAnimation:
     *
     * partition on N = seconds × framerate:
     *   N = 2 (minimum), N > 2
     * partition on seconds:
     *   integer, non-integer (but N is still an integer)
     * partition on invalid input (must throw):
     *   seconds < 0, seconds = 0, N not an integer, N = 1
     * partition on the output:
     *   frame i is exactly what frameAt returned for the i-th time
     *
     * Covered by:
     *   seconds = 1          N = 24 > 2, integer seconds; check length and t = i / 23
     *   seconds = 2          N = 48 > 2, integer seconds; check length, first t = 0, last t = 1
     *   seconds = 0.5        N = 12, non-integer seconds
     *   seconds = 2/24       N = 2 (minimum); t values are exactly 0 then 1
     *   seconds = 1          frames[i] is the very frame object frameAt returned
     *   seconds = -1         throws
     *   seconds = 0          throws
     *   seconds = 0.01       N = 0.24 not an integer, throws
     *   seconds = 1/24       N = 1, throws
     */

    /**
     * A fake frameAt that records every t it is called with, in order.
     *
     * @param calls array that each t is appended to
     * @returns a frameAt function returning a one-polyline frame that remembers its t
     */
    function recordingFrameAt(calls: Array<number>): (t: number) => Frame {
        return (t: number): Frame => {
            calls.push(t);
            return [{ color: [0, 0, 0], points: [{ x: t, y: 0 }] }];
        };
    }

    it('covers seconds = 1: 24 frames, frame i at t = i / 23', function () {
        const calls: Array<number> = [];
        const frames = makeAnimation(1, recordingFrameAt(calls));
        assert.strictEqual(frames.length, framerate);
        assert.strictEqual(calls.length, framerate, 'frameAt called once per frame');
        for (let i = 0; i < calls.length; i++) {
            assertApproxEqual(calls[i], i / (framerate - 1), `t of frame ${i}`);
        }
    });

    it('covers seconds = 2: 48 frames, first t = 0, last t = 1', function () {
        const calls: Array<number> = [];
        const frames = makeAnimation(2, recordingFrameAt(calls));
        assert.strictEqual(frames.length, 2 * framerate);
        assertApproxEqual(calls[0] ?? NaN, 0, 'first t');
        assertApproxEqual(calls[calls.length - 1] ?? NaN, 1, 'last t');
    });

    it('covers non-integer seconds = 0.5: 12 frames', function () {
        const calls: Array<number> = [];
        const frames = makeAnimation(0.5, recordingFrameAt(calls));
        assert.strictEqual(frames.length, 12);
        assert.strictEqual(calls.length, 12);
    });

    it('covers minimum N = 2: t is 0 then 1', function () {
        const calls: Array<number> = [];
        const frames = makeAnimation(2 / framerate, recordingFrameAt(calls));
        assert.strictEqual(frames.length, 2);
        assert.strictEqual(calls.length, 2);
        assertApproxEqual(calls[0] ?? NaN, 0, 'first t');
        assertApproxEqual(calls[1] ?? NaN, 1, 'second t');
    });

    it('covers frames[i] is exactly the frame frameAt returned for frame i', function () {
        const returned: Array<Frame> = [];
        const frames = makeAnimation(1, (t: number): Frame => {
            const frame: Frame = [{ color: [0, 0, 0], points: [{ x: t, y: t }] }];
            returned.push(frame);
            return frame;
        });
        assert.strictEqual(frames.length, returned.length);
        for (let i = 0; i < frames.length; i++) {
            assert.strictEqual(frames[i], returned[i], `frame ${i}`);
        }
    });

    it('covers seconds < 0: throws', function () {
        assert.throws(() => makeAnimation(-1, recordingFrameAt([])), Error);
    });

    it('covers seconds = 0: throws', function () {
        assert.throws(() => makeAnimation(0, recordingFrameAt([])), Error);
    });

    it('covers seconds × framerate not an integer: throws', function () {
        assert.throws(() => makeAnimation(0.01, recordingFrameAt([])), Error);
    });

    it('covers N = 1 (seconds = 1/framerate): throws', function () {
        assert.throws(() => makeAnimation(1 / framerate, recordingFrameAt([])), Error);
    });
});

describe('translate', function () {
    /*
     * Testing strategy for translate:
     *
     * (assumes the postcondition: a new array of the same length and order, where point i is
     *  { x: points[i].x + offset.x, y: points[i].y + offset.y }, and points is not mutated)
     *
     * partition on points.length: 0, 1, > 1
     * partition on offset: zero (0,0), positive, negative, mixed signs
     * partition on mutation: points is unchanged after the call
     *
     * Covered by:
     *   ([], (5,5))                          length 0
     *   ([(1,2)], (0,0))                     length 1, zero offset
     *   ([(1,2),(3,4),(-5,6)], (10,20))      length > 1, positive offset
     *   ([(1,2),(3,4)], (-1,-4))             length > 1, negative offset
     *   ([(10,10),(20,17)], (40.5,-3))       length > 1, mixed signs, non-integer
     *   ([(1,2),(3,4)], (7,8))               points is not mutated
     */

    it('covers empty points', function () {
        assert.deepStrictEqual(translate([], { x: 5, y: 5 }), []);
    });

    it('covers one point, zero offset', function () {
        assertPointsApproxEqual(translate([{ x: 1, y: 2 }], { x: 0, y: 0 }), [{ x: 1, y: 2 }]);
    });

    it('covers many points, positive offset', function () {
        const moved = translate([{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: -5, y: 6 }], { x: 10, y: 20 });
        assertPointsApproxEqual(moved, [{ x: 11, y: 22 }, { x: 13, y: 24 }, { x: 5, y: 26 }]);
    });

    it('covers many points, negative offset', function () {
        const moved = translate([{ x: 1, y: 2 }, { x: 3, y: 4 }], { x: -1, y: -4 });
        assertPointsApproxEqual(moved, [{ x: 0, y: -2 }, { x: 2, y: 0 }]);
    });

    it('covers mixed-sign, non-integer offset', function () {
        const moved = translate([{ x: 10, y: 10 }, { x: 20, y: 17 }], { x: 40.5, y: -3 });
        assertPointsApproxEqual(moved, [{ x: 50.5, y: 7 }, { x: 60.5, y: 14 }]);
    });

    it('covers input points are not mutated', function () {
        const points = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
        translate(points, { x: 7, y: 8 });
        assert.deepStrictEqual(points, [{ x: 1, y: 2 }, { x: 3, y: 4 }]);
    });
});

/**
 * Assert that two arrays of points have the same length and approximately equal points, in order.
 *
 * @param actual points returned by the function being tested
 * @param expected expected points
 */
function assertPointsApproxEqual(actual: Array<Point>, expected: Array<Point>): void {
    assert.strictEqual(actual.length, expected.length, 'number of points');
    for (let i = 0; i < expected.length; i++) {
        assertApproxEqual(actual[i]?.x ?? NaN, expected[i]?.x ?? NaN, `point ${i} x`);
        assertApproxEqual(actual[i]?.y ?? NaN, expected[i]?.y ?? NaN, `point ${i} y`);
    }
}
