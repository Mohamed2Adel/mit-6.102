/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps2 API docs.
 */

import assert from 'node:assert';
import { Interval } from './interval.js';
import { IntervalSet, IntervalConflictError } from './intervalset.js';

/**
 * An implementation of IntervalSet.
 *
 * PS2 instructions: you must use the provided rep.
 * You may not change the spec of the constructor.
 */
export class RepMapIntervalSet<Label> implements IntervalSet<Label> {

    private readonly startMap: Map<Label, bigint> = new Map();
    private readonly endMap: Map<bigint, bigint> = new Map();

    // Abstraction function:
    //   AF(Map<string, bigint>, Map<bigint, bigint>) = the interval set: 
    //            a string label interval set with one interval [x,y) with label z
    //            ex: x=0, y=5, z="A"
    //  ["A":[0,5), "B":[10,15)]
    // Representation invariant:
    //   Map<string, bigint> x Map<bigint, bigint>, start Map x end Map
    //   start Map: string label to start index of the interval set
    //   end Map: start index of the interval set to the end index of the set
    //   where the start index < end index, and the entries of endMap is non-overlapping
    // Safety from rep exposure:
    //   all fields are private and their type is immutable

    /**
     * Create an empty interval set.
     */
    public constructor() {
        this.checkRep();
    }

    // TODO checkRep
    private checkRep(): void {
        // check start < end
        for(const start of this.startMap.values()) {
            const end = this.endMap.get(start);
            assert(end !== undefined);
            assert(start < end);
        }
        // check that every label in startMap is mapped to endMap interval
        assert.strictEqual(this.startMap.size, this.endMap.size);
        // check non-overlapping, and conflict on intervals
        const intervals = [...this.endMap.entries()];   // [start, end] pairs
        for (let i = 0; i < intervals.length; i++) {
            for (let j = i + 1; j < intervals.length; j++) {
                const [a, b] = intervals[i]!;
                const [c, d] = intervals[j]!;
                assert(!(a < d && c < b), `overlapping intervals [${a},${b}) and [${c},${d})`);
            }
        }
    }

    /**
     * helper method to check overlapping
     */
    private isOverLap (start:bigint, end:bigint): boolean {
        const intervals = [...this.endMap.entries()];   // [start, end] pairs
        for (let i = 0; i < intervals.length; i++) {
            const [c, d] = intervals[i]!;
            if(start < d && c < end) {
                return true;
            }
        }
        return false;
    }

    /** @inheritdoc */
    public add(start: bigint, end: bigint, label: Label): void {
        this.checkRep();
        const oldStart = this.startMap.get(label);
        if(oldStart !== undefined) {
            if(oldStart === start && this.endMap.get(oldStart) === end) { // same interval do nothing
                return
            }
            throw new IntervalConflictError(); // different interval but same label -> throw
        }
        if(this.isOverLap(start, end)) {
            throw new IntervalConflictError();
        }
        this.startMap.set(label, start);
        this.endMap.set(start, end);
        this.checkRep();
    }

    /** @inheritdoc */
    public interval(label: Label): Interval | undefined {
        const start = this.startMap.get(label);
        if(start === undefined) {
            return undefined;
        }
        const end = this.endMap.get(start);
        if(end === undefined) {
            return undefined;
        }
        this.checkRep();
        return new Interval(start, end);
    }

    /** @inheritdoc */
    public labels(): Set<Label> {
        const result: Set<Label> =new Set();
        this.checkRep();
        const keys = this.startMap.keys();
        for(const key of keys) {
            result.add(key);
        }
        return result;
    }

    // TODO toString
    /**
     * @inheritdoc
     */
    public toString() {
        let result : string = "{";
        const labels = this.labels();
        for(const label of labels) {
            result = result + label;
            result = result + "=";
            result = result + this.interval(label);
        }
        result = result + "}";
        return result;
    }
}

/**
 * An implementation of IntervalSet.
 *
 * PS2 instructions: you must use the provided rep.
 * You may not change the spec of the constructor.
 */
export class RepArrayIntervalSet<Label> implements IntervalSet<Label> {

    private readonly labelList: Array<Label> = [];
    private readonly valueList: Array<bigint> = [];

    // Abstraction function:
    //   TODO
    // Representation invariant:
    //   TODO
    // Safety from rep exposure:
    //   TODO

    /**
     * Create an empty interval set.
     */
    public constructor() {
        this.checkRep();
    }

    // TODO checkRep
    private checkRep(): void {
        assert(this.labelList);
        assert(this.valueList);
    }

    /** @inheritdoc */
    public add(start: bigint, end: bigint, label: Label): void {
        throw new Error('not implemented');
    }

    /** @inheritdoc */
    public interval(label: Label): Interval | undefined {
        throw new Error('not implemented');
    }

    /** @inheritdoc */
    public labels(): Set<Label> {
        throw new Error('not implemented');
    }

    // TODO toString
}

/**
 * PS2 instructions: both implementations are exported for testing purposes only.
 *
 * @returns IntervalSet implementations to test
 */
export function implementationsForTesting(): IntervalSetCtor[] {
    return [RepMapIntervalSet, RepArrayIntervalSet];
}

/** A constructor for an IntervalSet implementation, used by the tests. */
type IntervalSetCtor = new <Label extends string>() => IntervalSet<string>; // remove this line in Problem 2.3
// type IntervalSetCtor = new <Label>() => IntervalSet<Label>;
