/*
 * Tests for curves.ts (reconstructed starter).
 *
 * PS1 problem 6(a): strengthen the specs in src/curves.ts FIRST, then test YOUR strengthened specs.
 * Add/commit/push at each spec and testing sub-step.
 *
 * Handy data from the handout:
 *  - control points (0,9), (10,-6), (20,16), (30,0): the point at t = 1/3 is approximately (10, 3.56)
 *  - control points (0,9), (50,9), (0,0), (30,1): 10 points quadratically spaced in t
 */

import assert from 'node:assert';
import { Point, bezierInterpolate, bezierPath } from '../src/curves.js';
import { assertApproxEqual } from '../src/utils.js';

describe('bezierInterpolate', function () {
    /*
     * Testing strategy for bezierInterpolate:
     *   TODO: partitions
     *   partition on n: n=0, n=1, n=2, n>2
     *   partition on t: t=0, t=1, 0<t<1
     *   covered by: n=0 and t=0
     *   ([],0) -> error
     *   covered by: n=1 and t=0.5
     *   ([(2,3)],0.5) -> (2,3)
     *   covered by: n=2 and t=1
     *   ([(3,5),(1,6)],1) -> (1,6)
     *   covered by: n=3 and t=1/3
     *   ([(1,2),(3,6),(5,4)],1/3) -> (7/3, 4)
     *   covered by: 4 control points and 0<t<1 (handout example)
     *   ([(0,9),(10,-6),(20,16),(30,0)],1/3) -> (10, 32/9)
     *   covered by: 5 control points and t=0.5 (heart curve from example 2)
     *   ([(50,25),(34,42),(2,36),(0,0),(50,-40)],0.5) -> (15.5, 23.0625)
     *   covered by: 5 control points and t=0
     *   ([(50,25),(34,42),(2,36),(0,0),(50,-40)],0) -> (50, 25)
     */

    it('bezierInterpolate covers empty controlPoints', function () {
        assert.throws(() => bezierInterpolate([], 0), Error);
    });
    it('bezierInterpolate covers n=1 return same point', function () {
    const p = bezierInterpolate([{ x: 2, y: 3 }], 0.5);
    assertApproxEqual(p.x, 2);
    assertApproxEqual(p.y, 3);
    });
    it('bezierInterpolate covers n=2, t=1 return last point', function () {
    const p = bezierInterpolate([{ x: 3, y: 5 }, {x: 1, y: 6}], 1);
    assertApproxEqual(p.x, 1);
    assertApproxEqual(p.y, 6);
    });
    it('bezierInterpolate covers n=3, t=1/3', function () {
    const p = bezierInterpolate([{ x: 1, y: 2 }, { x: 3, y: 6 }, { x: 5, y: 4 }], 1/3);
    assertApproxEqual(p.x, 7/3);
    assertApproxEqual(p.y, 4);
    });
    it('bezierInterpolate covers 4 control points, 0<t<1 (handout example)', function () {
        const p = bezierInterpolate([{ x: 0, y: 9 }, { x: 10, y: -6 }, { x: 20, y: 16 }, { x: 30, y: 0 }], 1/3);
        assertApproxEqual(p.x, 10);
        assertApproxEqual(p.y, 32/9);   // ≈ 3.556
    });
    it('bezierInterpolate covers 5 control points, t=0.5', function () {
        const heart = [{ x: 50, y: 25 }, { x: 34, y: 42 }, { x: 2, y: 36 }, { x: 0, y: 0 }, { x: 50, y: -40 }];
        const p = bezierInterpolate(heart, 0.5);
        assertApproxEqual(p.x, 15.5);      // (50 + 4·34 + 6·2 + 4·0 + 50) / 16
        assertApproxEqual(p.y, 23.0625);   // (25 + 4·42 + 6·36 + 4·0 − 40) / 16
    });
    it('bezierInterpolate covers 5 control points, t=0 returns P_0', function () {
        const heart = [{ x: 50, y: 25 }, { x: 34, y: 42 }, { x: 2, y: 36 }, { x: 0, y: 0 }, { x: 50, y: -40 }];
        const p = bezierInterpolate(heart, 0);
        assertApproxEqual(p.x, 50);
        assertApproxEqual(p.y, 25);
    });
});

describe('bezierPath', function () {
    /*
     * Testing strategy for bezierPath:
     *   TODO: partitions (the provided postcondition is TODO, so there's no example test yet)
     *   partition on easing: linear t=>t, nonlinear t=>t*t, 
     *   partition on numPoints: undefined, =2, >2
     *   partition on controlPoints: n=1, n=2, n>2
     *
     *   (assumes the postcondition: exactly numPoints points, or 24 if undefined, where point i is
     *    the curve point at easing(i / (numPoints - 1)) for i = 0 .. numPoints-1)
     *
     *   covered by: 2 control points, linear, numPoints=3
     *   ([(0,0),(10,20)], t=>t, 3) -> (0,0), (5,10), (10,20)
     *   covered by: 2 control points, nonlinear, numPoints=3
     *   ([(0,0),(10,20)], t=>t*t, 3) -> (0,0), (2.5,5), (10,20)
     *   covered by: 3 control points, nonlinear, numPoints=3
     *   ([(1,2),(3,6),(5,4)], t=>t*t, 3) -> (1,2), (2,3.625), (5,4)
     *   covered by: 4 control points, linear, numPoints=2
     *   ([(0,9),(10,-6),(20,16),(30,0)], t=>t, 2) -> (0,9), (30,0)
     *   covered by: 4 control points, nonlinear, numPoints=undefined
     *   ([(0,9),(10,-6),(20,16),(30,0)], t=>t*t, undefined) -> 24 points, first (0,9), last (30,0)
     *   covered by: 1 control point, linear, numPoints=4
     *   ([(7,-3)], t=>t, 4) -> (7,-3) four times
     */

    // TODO: tests
    it('bezierPath covers 2 control points, linear easing, numPoints=3', function () {
    // a straight line from (0,0) to (10,20); evenly spaced inputs 0, 0.5, 1
    const path = bezierPath([{ x: 0, y: 0 }, { x: 10, y: 20 }], t => t, 3);
    assertPathApproxEqual(path,[{ x: 0, y: 0 }, { x: 5, y: 10 }, { x: 10, y: 20 }]);
    });
    it('bezierPath covers 2 control points, nonlinear easing, numPoints=3', function () {
        // easing turns the inputs 0, 0.5, 1 into 0, 0.25, 1
        const path = bezierPath([{ x: 0, y: 0 }, { x: 10, y: 20 }], t => t * t, 3);
        assertPathApproxEqual(path, [{ x: 0, y: 0 }, { x: 2.5, y: 5 }, { x: 10, y: 20 }]);
    });
    it('bezierPath covers 3 control points, nonlinear easing, numPoints=3', function () {
        // middle point is the curve at easing(0.5) = 0.25:
        // weights (1-t)^2 = 0.5625, 2(1-t)t = 0.375, t^2 = 0.0625
        const path = bezierPath([{ x: 1, y: 2 }, { x: 3, y: 6 }, { x: 5, y: 4 }], t => t * t, 3);
        assertPathApproxEqual(path, [{ x: 1, y: 2 }, { x: 2, y: 3.625 }, { x: 5, y: 4 }]);
    });
    it('bezierPath covers 4 control points, linear easing, numPoints=2 (minimum)', function () {
        const path = bezierPath([{ x: 0, y: 9 }, { x: 10, y: -6 }, { x: 20, y: 16 }, { x: 30, y: 0 }], t => t, 2);
        assertPathApproxEqual(path, [{ x: 0, y: 9 }, { x: 30, y: 0 }]);
    });
    it('bezierPath covers 4 control points, nonlinear easing, numPoints=undefined (default 24)', function () {
        const path = bezierPath([{ x: 0, y: 9 }, { x: 10, y: -6 }, { x: 20, y: 16 }, { x: 30, y: 0 }], t => t * t, undefined);
        assert.strictEqual(path.length, 24);
        assertApproxEqual(path[0].x, 0, 'first point x');
        assertApproxEqual(path[0].y, 9, 'first point y');
        assertApproxEqual(path[23].x, 30, 'last point x');
        assertApproxEqual(path[23].y, 0, 'last point y');
    });
    it('bezierPath covers 1 control point, linear easing, numPoints=4', function () {
        // a 1-point "curve" is that point for every t
        const path = bezierPath([{ x: 7, y: -3 }], t => t, 4);
        assertPathApproxEqual(path, [{ x: 7, y: -3 }, { x: 7, y: -3 }, { x: 7, y: -3 }, { x: 7, y: -3 }]);
    });
});

/**
 * Assert that two paths have the same length and approximately equal points, in order.
 *
 * @param actual path returned by the function being tested
 * @param expected expected path
 */
function assertPathApproxEqual(actual: Array<Point>, expected: Array<Point>): void {
    assert.strictEqual(actual.length, expected.length, 'path length');
    for (let i = 0; i < expected.length; i++) {
        assertApproxEqual(actual[i].x, expected[i].x, `point ${i} x`);
        assertApproxEqual(actual[i].y, expected[i].y, `point ${i} y`);
    }
}
