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
    //   AF(Map<Label, bigint>, Map<bigint, bigint>) = the interval set: 
    //            a Label label interval set with many interval Ex: [x,y) with label z
    //            ex: x=0, y=5, z="A"
    //  ["A":[0,5), "B":[10,15)]
    // Representation invariant:
    //   Map<Label, bigint> x Map<bigint, bigint>, start Map x end Map
    //   the start index < end index, and the entries of endMap is non-overlapping.
    //   the values of startMap equal to the keys of the endMap
    // Safety from rep exposure:
    //   all fields are private and their type is immutable
    //   interval() return new Interval 
    //   labels() return new Set
    //   add() take immutable bigint and a generic Label

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
            result = result + ", ";
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
    //   AF(labelList:Array<Label>, valueList:Array<bigint>) = intervalSet where label_i = labelList[i] 
    //      and it's interval = [valueList[2i], valueList[2i+1]) for each i
    // Representation invariant:
    //   for each label_i: valueList[2i] < valueList[2i+1]
    //   for labelList: non-repeated Label
    //   for valueList: non-overlapping intervals !(start_new < end_old && start_old < end_new)
    //   valueList.length == 2*labelList.length
    // Safety from rep exposure:
    //   interval() return new interval
    //   add take immutable bigint
    //   labels return new Set()

    /**
     * Create an empty interval set.
     */
    public constructor() {
        this.checkRep();
    }

    private checkRep(): void {
        // length of value array equal double of label array
        assert(this.valueList.length === 2*this.labelList.length); 
        // non-repeated labels
        for(let i=0; i<this.labelList.length; i++) {
            const label = this.labelList[i];
            for(let j=i+1; j<this.labelList.length; j++) {
                assert(label !== this.labelList[j]); 
            }
        }
        // valueList[2i] < valueList[2i+1]
        for(let i = 0; i<this.labelList.length; i++) {
            assert(this.valueList[2*i]! < this.valueList[2*i + 1]!);
        }
        // no overlap 
        for(let i=this.labelList.length-1; i>=0; i--) {
            const startNew = this.valueList[2*i];
            const endNew = this.valueList[2*i + 1];
            for(let j=0; j<i; j++) {
                const startOld = this.valueList[2*j];
                const endOld = this.valueList[2*j + 1];
                assert(!(startNew! < endOld! && startOld! < endNew!));
            }
        }
    }

    private isOverLap (start:bigint, end:bigint): boolean {
        for(let j=0; j<this.labelList.length; j++) {
                const startOld = this.valueList[2*j];
                const endOld = this.valueList[2*j + 1];
                if(start < endOld! && startOld! < end) {
                    return true;
                }
            }
        return false;
    }

    /** @inheritdoc */
    public add(start: bigint, end: bigint, label: Label): void {
        this.checkRep();
        const i = this.labelList.indexOf(label);
        if(i !== -1) {
            if(this.valueList[2*i] === start && this.valueList[2*i +1]=== end) {
                return;
            } // same intervals -> do nothing
        }
        if(this.labelList.includes(label)) {
            throw new IntervalConflictError(); // different interval but same label -> throw
        }
        if(this.isOverLap(start, end)) {
            throw new IntervalConflictError(); // overlap intervals
        }
        this.labelList.push(label);
        this.valueList.push(start);
        this.valueList.push(end);
        this.checkRep();
    }

    /** @inheritdoc */
    public interval(label: Label): Interval | undefined {
        if(!this.labelList.includes(label)) {
            return undefined;
        }
        const i = this.labelList.indexOf(label);
        return new Interval(this.valueList[2*i]!, this.valueList[2*i+1]!);
    }

    /** @inheritdoc */
    public labels(): Set<Label> {
        const result: Set<Label>= new Set();
        for(const i of this.labelList) {
            result.add(i);
        }
        return result;
    }

    /**
     * @inheritdoc
     */
    public toString() {
        let result : string = "{";
        for(const label of this.labelList) {
            result = result + label;
            result = result + "=";
            result = result + this.interval(label);
            result = result + ", ";
        }
        result = result + "}";
        return result;
    }
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
//type IntervalSetCtor = new <Label extends string>() => IntervalSet<string>; // remove this line in Problem 2.3
type IntervalSetCtor = new <Label>() => IntervalSet<Label>;
