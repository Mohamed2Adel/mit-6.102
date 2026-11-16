/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study.
 */

import assert from 'node:assert';
import { MultiIntervalSet } from '../src/multiintervalset.js';
import { IntervalConflictError, makeIntervalSet} from '../src/intervalset.js';
import { Interval } from '../src/interval.js';

/*
 * Tests for the MultiIntervalSet abstract data type.
 * These tests must be legal clients of the MultiIntervalSet spec.
 */
describe('MultiIntervalSet', function () {

    // Testing strategy
    /**
     *  Testing strategy on 
     *    *  constructor: with initial, without initial, mutating initial has no effect on out multiIntervalSet 
     *    *  add(start, end, label): void:
     *       partition on this: empty, non-empty
     *       partition on label: new label, already exist
     *       partition on start, end: overlapping intervals
     *       partition on label x intervals: same label with same interval -> no effect, 
     *                                       same label with different interval -> added
     *                                       same label with overlapping interval -> throw
     *                                       different label with different interval -> added
     *                                       different label with overlapping interval -> throw
     *    *  clear(): boolean:
     *       partition on output: true, false
     *    *  labels(): Set<Label>:
     *       partition on output: empty set, have 1 Label, more than 1 Label
     *    *  intervals(label: Label): IntervalSet<number>:
     *       partition on label: not exist, exist
     *       partition on output: empty set, not empty and = 1 interval, not empty and more than 1 interval
     */

    it('covers empty set', function () {
        const set = new MultiIntervalSet<string>();
        assert.deepStrictEqual(set.labels(), new Set());
    });

    it('covers add and get interval', function () {
        const set = new MultiIntervalSet<string>();
        set.add(0n, 5n, 'A');
        assert.deepStrictEqual(set.intervals('A').labels(), new Set([0]));
        assert.deepStrictEqual(set.intervals('A').interval(0), new Interval(0n, 5n));
    });

    it('covers add same label with same interval', function () {
        const set = new MultiIntervalSet<string>();
        set.add(10n, 20n, "A");
        assert.deepStrictEqual(set.labels(), new Set(["A"]));
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(10n, 20n));
        set.add(10n, 20n, "A");
        assert.deepStrictEqual(set.labels(), new Set(["A"]));
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0]));
    });

    it('covers add same label with different interval', function () {
        const set = new MultiIntervalSet<string>();
        set.add(10n, 20n, "A");
        assert.deepStrictEqual(set.labels(), new Set(["A"]));
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(10n, 20n));
        set.add(25n, 30n, "A");
        assert.deepStrictEqual(set.labels(), new Set(["A"]));
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0, 1]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(10n, 20n));
        assert.deepStrictEqual(set.intervals("A").interval(1), new Interval(25n, 30n));
    });

    it('covers add different label with different interval', function () {
        const set = new MultiIntervalSet<string>();
        set.add(10n, 20n, "A");
        assert.deepStrictEqual(set.labels(), new Set(["A"]));
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(10n, 20n));
        set.add(20n, 30n, "B");
        assert.deepStrictEqual(set.labels(), new Set(["A", "B"]));
        assert.deepStrictEqual(set.intervals("B").labels(), new Set([0]));
        assert.deepStrictEqual(set.intervals("B").interval(0), new Interval(20n, 30n));
    });

    it('covers add same or different label with overlapping interval', function () {
        const set = new MultiIntervalSet<string>();
        set.add(10n, 20n, "A");
        assert.deepStrictEqual(set.labels(), new Set(["A"]));
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(10n, 20n));
        assert.throws(() => set.add(5n, 25n, "A"), IntervalConflictError);
        assert.throws(() => set.add(5n, 25n, "C"), IntervalConflictError);
    });

    it('covers clear on empty set', function () {
        const set = new MultiIntervalSet<string>();
        assert.strictEqual(set.clear(), false);
    });

    it('covers clear on non-empty set', function () {
        const set = new MultiIntervalSet<string>();
        set.add(0n, 5n, "A");
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(0n, 5n));
        assert.strictEqual(set.clear(), true);
        assert.deepStrictEqual(set.labels(), new Set());
    });

    it('covers intervals on non-existing label', function () {
        const set = new MultiIntervalSet<string>();
        set.add(0n, 5n, 'A');
        assert.deepStrictEqual(set.intervals('B').labels(), new Set());
    });

    it('covers intervals on existing label and have more than 1 interval', function () {
        const set = new MultiIntervalSet<string>();
        set.add(0n, 5n, "A");
        set.add(5n, 20n, "A");
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0,1]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(0n, 5n));
        assert.deepStrictEqual(set.intervals("A").interval(1), new Interval(5n, 20n));
    });

    it('covers intervals out of order and check index 0 is the lowest', function () {
        const set = new MultiIntervalSet<string>();
        set.add(50n, 60n, "A");
        set.add(15n, 20n, "A");
        assert.deepStrictEqual(set.intervals("A").labels(), new Set([0,1]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(15n, 20n));
        assert.deepStrictEqual(set.intervals("A").interval(1), new Interval(50n, 60n));
    });

    // covers constructor: initial empty
    it('covers constructor with empty initial', function () {
        const set = new MultiIntervalSet<string>(makeIntervalSet<string>());
        assert.deepStrictEqual(set.labels(), new Set());
    });

    // covers constructor: initial non-empty, more than 1 label
    it('covers constructor with non-empty initial', function () {
        const initial = makeIntervalSet<string>();
        initial.add(0n, 10n, "A");
        initial.add(20n, 30n, "B");
        const set = new MultiIntervalSet<string>(initial);
        assert.deepStrictEqual(set.labels(), new Set(["A", "B"]));
        assert.deepStrictEqual(set.intervals("A").interval(0), new Interval(0n, 10n));
        assert.deepStrictEqual(set.intervals("B").interval(0), new Interval(20n, 30n));
    });

    // covers constructor: mutating initial afterwards does not affect this
    it('covers constructor copies initial (no aliasing)', function () {
        const initial = makeIntervalSet<string>();
        initial.add(0n, 10n, "A");
        const set = new MultiIntervalSet<string>(initial);
        initial.add(20n, 30n, "B");
        assert.deepStrictEqual(set.labels(), new Set(["A"]));
    });
});
