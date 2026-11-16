/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps2 API docs.
 */

import { assert } from 'console';
import { Interval } from './interval.js';
import { IntervalSet, IntervalConflictError, makeIntervalSet } from './intervalset.js';

/**
 * A mutable set of labeled intervals, where each label is associated with one or more non-overlapping
 * half-open intervals [start, end). Neither intervals with the same label nor with different labels
 * may overlap.
 *
 * For example, { "A"=[[0,10)], "B"=[[20,30)] } is a multi-interval set where the labels are strings
 * "A" and "B". We could add "A"=[10,20) to that set to obtain { "A"=[[0,10),[10,20)], "B"=[[20,30)] }.
 *
 * Labels are of arbitrary type Label and are compared for equality using ===. They may not be null,
 * undefined, or NaN.
 *
 * PS2 instructions: this is a required ADT.
 * You may not change the specifications or add new methods.
 *
 * @typeParam Label type of labels in this set, compared for equality using ===
 */
export class MultiIntervalSet<Label> {

    private readonly sets: Array<IntervalSet<Label>> = [];

    // Abstraction function:
    //    AF(sets) = the multi-interval set where each label l is associated with the intervals
    //    { sets[i].interval(l) | 0 <= i < sets.length and l ∈ sets[i].labels() }
    //    e.g. sets = [{A=[0,5), B=[5,10)}, {A=[10,15)}] represents { A=[[0,5),[10,15)], B=[[5,10)] } 
    // Representation invariant:
    //   for each intervalSet in sets there must not be a dublicated Label,
    //   for whole intervalSet in sets there must not be overlapping index.
    // Safety from rep exposure:
    //   sets is private readonly and never returned
    //   constructor create a copy of initial if exist into a new Set so the client cannot mutate our Set
    //   add() take immutable bigint, labels() return new Set, intervals() return a new interval Set
    //   clear() only clear our set and not mutating the initial set of the client 

    /**
     * Create a new multi-interval set containing the given labeled intervals; or empty if none
     *
     * @param initial optional initial contents of the new multi-interval set
     */
    public constructor(initial?: IntervalSet<Label>) {
        if(initial) {
            for(const l of initial.labels()) {
                const iv = initial.interval(l)!;
                this.add(iv.start, iv.end, l);
            }
        }
        this.checkRep();
    }

    private checkRep() {
        if(this.sets.length !== 0) {
            for(const set of this.sets) {
                assert(set !== undefined);
            }
            for(const [, iv] of this.all()) {
                for(let i=0; i<this.all.length; i++) {
                    if(this.isOverLap(iv.start, iv.end)) {
                        throw new IntervalConflictError();
                    }
                }
            }
        }
    }

    // helper to get all labels and intervals in seperate array
    private all(): Array<[Label, Interval]> {
        const result: Array<[Label, Interval]> = [];
        for(const set of this.sets) {
            for(const l of set.labels()) {
                result.push([l, set.interval(l)!]);
            }
        }
        return result;
    }
    // helper to check overLap condition
    private isOverLap(start:bigint, end:bigint): boolean {
        for(const [ , interval] of this.all()) {
            const startOld = interval.start;
            const endOld = interval.end;
            if(start<endOld && startOld<end) {
                return true;
            }
        }
        return false;
    }
    // helper to check is label exist or not, and how many time. for ex: if A exist 1 so if we need 
    // to insert another interval for A we insert it in index 1 not 0, if A exist twice so we insert it at index 2 ..
    private countLabel(label:Label): number {
        let count = 0;
        for(const [l, ] of this.all()){
            if(label === l) {
                count = count + 1;
            }
        }
        return count;
    }
    // helper to check if the interval already exist
    private isSameLabelAndSameInterval(start:bigint, end:bigint, label:Label): boolean {
        for(const [l, interval] of this.all()) {
            if(start === interval.start && end === interval.end && label === l) {
                return true;
            } 
        }
        return false;
    }

    /**
     * Add a labeled interval to this set, if it is not already present and it does not conflict with
     * existing intervals.
     *
     * Labeled intervals conflict if:
     * - they have the same label with different, overlapping intervals; or
     * - they have different labels with overlapping intervals.
     *
     * For example, if this set is { "A"=[[0,10),[20,30)] },
     * - add("A"=[0,10)) has no effect
     * - add("B"=[10,20)) adds "B"=[[10,20)]
     * - add("C"=[20,30)) throws IntervalConflictError
     *
     * @param start low end of the interval, inclusive
     * @param end high end of the interval, exclusive, must be greater than start
     * @param label label to add
     * @throws an {@link IntervalConflictError} if label is already in this set and is associated with
     *         an interval other than [start,end) that overlaps [start,end), or if an interval in this set
     *         with a different label overlaps [start,end)
     */
    public add(start: bigint, end: bigint, label: Label): void {
        if(this.isSameLabelAndSameInterval(start,end,label)) {
            return;
        }
        if(this.isOverLap(start, end)) {
            throw new IntervalConflictError();
        }
        const k = this.countLabel(label); 
        const layer = this.sets[k];
        if(layer !== undefined) {
            layer.add(start, end, label); // if layer already exist add to it at index[k]
        }
        else {
            const set = makeIntervalSet<Label>(); // if layer not exist create a new one and push in array
            set.add(start, end, label);
            this.sets.push(set);
        }
        this.checkRep();
    }

    /**
     * Remove all intervals from this set.
     *
     * @returns true if this set was non-empty, and false otherwise
     */
    public clear(): boolean {
        if(this.sets.length !== 0) {
            for(let i=0; i<this.sets.length; i++) {
                this.sets.pop();
            }
            this.sets.length = 0;
            return true;
        }
        return false;
    }

    /**
     * Get the labels in this set.
     *
     * @returns the labels in this set
     */
    public labels(): Set<Label> {
        const result = new Set<Label>();
        for(const [l,] of this.all()) {
            result.add(l);
        }
        return result;
    }

    /**
     * Get all the intervals in this set associated with a given label, if any. The returned set has
     * integer labels that act as indices: label 0 is associated with the lowest interval, 1 the next,
     * and so on, for all the intervals in this set that have the provided label.
     *
     * For example, if this set is { "A"=[[0,10),[20,30)], "B"=[[10,20)] },
     * - intervals("A") returns { 0=[0,10), 1=[20,30) }
     *
     * @param label the label
     * @returns a new interval set that associates integer indices with the in-order intervals of
     *          label in this set
     */
    public intervals(label: Label): IntervalSet<number> {
        const result: IntervalSet<number> = makeIntervalSet();
        if(this.countLabel(label) === 0) {
            return result;
        }
        const ivs = this.all().filter(([l,]) => l === label).map(([,iv])=> iv);
        ivs.sort((a,b) => a.start < b.start ? -1: a.start > b.start ? 1:0);
        ivs.forEach((iv, i) => result.add(iv.start, iv.end, i));
        return result;
    }

    /**
     * @inheritdoc
     */
    public toString() {
        let result : string = "{";
        for(const [l, iv] of this.all()) {
            result = result + l;
            result = result + "=";
            result = result + iv;
            result = result + ", ";
        }
        result = result.slice(0, result.length - 2);
        result = result + "}";
        return result;
    }
    
}
