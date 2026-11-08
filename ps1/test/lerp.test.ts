/*
 * Tests for lerp.ts (reconstructed starter).
 * Both implementations are reachable through forTestingOnly.
 */

import assert from 'node:assert';
import { forTestingOnly } from '../src/lerp.js';
import { assertApproxEqual } from '../src/utils.js';

const { lerpWeak, lerpStrong } = forTestingOnly;

describe('lerpWeak', function () {
    /*
     * PS1 problem 2(b): test YOUR lerpWeak spec. This is a very simple function:
     * keep the suite very small.
     *
     * Testing strategy for lerpWeak:
     *
     * partition on t: t = 0, 0 < t < 1, t = 1
     * partition on v0 vs v1: v0 < v1, v0 = v1, v0 > v1
     * partition on v0, v1: 0, between 0 and 255, 255
     * partition on the exact value v0 + t·(v1 − v0), before rounding:
     *   integer,
     *   fractional part < .5 (rounds down),
     *   fractional part = .5 (tie, rounds up),
     *   fractional part > .5 (rounds up)
     *
     * Covered by:
     *   (0, 0, 0)       t = 0, v0 = v1, v0 = v1 = 0, integer
     *   (0, 128, 0.5)   0 < t < 1, v0 < v1, v1 in between, integer (64)
     *   (128, 255, 1)   t = 1, v0 < v1, v1 = 255, integer
     *   (255, 0, 0.5)   0 < t < 1, v0 > v1, v0 = 255, tie (127.5 -> 128)
     *   (0, 255, 0.25)  0 < t < 1, v0 < v1, fraction > .5 (63.75 -> 64)
     *   NOT COVERED YET: fractional part < .5
     */

    // TODO: tests (each test case in its own it())
    it('covers t=0, v0=v1=0, integer', function () {
        assert.strictEqual(lerpWeak(0, 0, 0), 0);
    });
    it('covers 0<t<1, v0<v1, v1 in between, integer', function () {
        assert.strictEqual(lerpWeak(0, 128, 0.5), 64);
    });
    it('covers t=1, v0<v1, v1=255, integer', function () {
        assert.strictEqual(lerpWeak(128, 255, 1), 255);
    });
    it('covers 0<t<1, v0>v1, v0=255, tie', function () {
        assert.strictEqual(lerpWeak(255, 0, 0.5), 128);
    });
    it('covers 0<t<1, v0<v1, fraction>.5', function () {
        assert.strictEqual(lerpWeak(0, 255, 0.25), 64);
    });
});

describe('lerpStrong', function () {
    /*
     * PS1 problem 5(d): test YOUR lerpStrong spec. Still a very simple function:
     * keep the suite very small.
     *
     * Testing strategy for lerpStrong:
     *   TODO: partitions
     *   partition on t: t=0, t=1, 0<t<1
     *   partition on v0 vs v1: v0 = v1, v0 < v1, v0 > v1.
     * 
     *   covers 0<t<1, v0<v1
     *   (0, 10, 0.5^2) -> 2.5 rounded to 3
     *   covers t=1, v0=v1
     *   (4,4, 1) -> 4
     *   covers 0<t<1, v0>v1
     *   (10,0, 0.26) -> 7.4 rounded to 7 
     *   covers t=0, v0<v1
     *   (2, 6, 0) -> 2
     */

    // TODO: tests (each test case in its own it())
    it('lerpStrong cover, 0<t<1 v0<v1 and rounding up from 2.5 to 3',function(){
        assertApproxEqual(lerpStrong(0,10,0.5**2), 2.5);
    });
    it('lerpStrong cover t=1, v0=v1 and no rounding',function(){
        assert.strictEqual(lerpStrong(4,4,0.5), 4);
    });
    it('lerpStrong cover v0>v1 and rounding down from 7.4 to 7',function(){
        assertApproxEqual(lerpStrong(10,0,0.26), 7.4);
    });
    it('lerpStrong cover t=0, v0<v1',function(){
        assert.strictEqual(lerpStrong(2,6,0), 2);
    });
});
