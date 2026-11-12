/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study.
 */

import assert from 'node:assert';
import { IntervalSet, IntervalConflictError } from '../src/intervalset.js';
import { Interval } from '../src/interval.js';
import { implementationsForTesting } from '../src/intervalset-impls.js';

/*
 * Tests for the IntervalSet abstract data type.
 *
 * PS2 instructions:
 * - use `new SomeIntervalSet<string>()` to get fresh empty sets;
 *   do NOT use makeIntervalSet() or call a specific implementation's constructor
 * - these tests must be legal clients of the IntervalSet spec
 * - toString() has a very weak spec, so you do not need to test it
 */
for (const SomeIntervalSet of implementationsForTesting()) {
describe(SomeIntervalSet.name, function () { // PS2 instructions: do not change this line

    // Testing strategy
    //   TODO partition each operation's inputs (including `this`) and outputs
    /**
     *   Testing strategy on
     *   
     *   add(start, end, label): void:
     *   partition on this: empty
     *   partition on start: start=0, start>0
     *   partition on start and end: conflict occur (throw IntervalConflictError)
     *   partition on label: in this (throw IntervalConflictError), not in this (so add it)
     *  
     *   interval(label: Label): Interval | undefined:
     *   label: in this (return the interval [start,end)), not in this (return undefined)
     * 
     *   labels(): Set<Label>:
     *   this: empty set, only 1 label, >1 labels
     *   output: return empty set, set["one-label"], >1 labels
     */
    
    // covers labels() empty set
    it('covers empty set', function () {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        assert.deepStrictEqual(set.labels(), new Set());
    });

    it('covers add then get interval', function () {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        set.add(0n, 10n, 'A');
        assert.deepStrictEqual(set.interval('A'), new Interval(0n, 10n));
        assert.throws(() => { set.add(5n, 15n, 'B'); }, IntervalConflictError);
    });

    // TODO more tests
    // covers add A and B and throw when conflict occur
    it('covers add partitions adding A on [0,5) and B on [10,20) and then conflict when adding on intervals [15,30) and conflict when adding "A" again on [20,30)', function() {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        set.add(0n, 5n, "A");
        assert.deepStrictEqual(set.interval("A"), new Interval(0n, 5n));
        set.add(10n, 20n, "B");
        assert.deepStrictEqual(set.interval("B"), new Interval(10n, 20n));
        assert.throws(() => { set.add(15n, 30n, "C"); }, IntervalConflictError);
        assert.throws(() => { set.add(20n, 30n, "A"); }, IntervalConflictError);
        set.add(0n, 5n, "A");
        assert.deepStrictEqual(set.interval("A"), new Interval(0n, 5n))
    });
    
    // cover interval() -> undefined
    it('covers getting interval not in this', function () {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        set.add(0n, 10n, 'A');
        assert.deepStrictEqual(set.interval('B'), undefined);
    });

    // cover labels() of one or more label
    it('covers labels() return 0 or 1 or more', function () {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        assert.deepStrictEqual(set.labels(),new Set());
        set.add(0n, 10n, "A");
        assert.deepStrictEqual(set.labels(), new Set(["A"]));
        set.add(10n, 20n, "B");
        assert.deepStrictEqual(set.labels(), new Set(["A","B"]));
    });

    it('covers conflict overlapping interval', function () {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        set.add(0n, 100n, 'A');
        assert.deepStrictEqual(set.interval('A'), new Interval(0n, 100n));
        assert.throws(() => set.add(10n, 90n, "B"), IntervalConflictError);
    });

    it('covers conflict wrapping interval', function () {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        set.add(20n, 80n, 'A');
        assert.deepStrictEqual(set.interval('A'), new Interval(20n, 80n));
        assert.throws(() => set.add(10n, 90n, "B"), IntervalConflictError);
    });

});
}
