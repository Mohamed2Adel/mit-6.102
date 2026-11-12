/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps2 API docs.
 */

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

    // TODO fields (rep must use IntervalSet, obtained via makeIntervalSet())

    // Abstraction function:
    //   TODO
    // Representation invariant:
    //   TODO
    // Safety from rep exposure:
    //   TODO

    /**
     * Create a new multi-interval set containing the given labeled intervals; or empty if none
     *
     * @param initial optional initial contents of the new multi-interval set
     */
    public constructor(initial?: IntervalSet<Label>) {
        throw new Error('not implemented');
    }

    // TODO checkRep

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
        throw new Error('not implemented');
    }

    /**
     * Remove all intervals from this set.
     *
     * @returns true if this set was non-empty, and false otherwise
     */
    public clear(): boolean {
        throw new Error('not implemented');
    }

    /**
     * Get the labels in this set.
     *
     * @returns the labels in this set
     */
    public labels(): Set<Label> {
        throw new Error('not implemented');
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
        throw new Error('not implemented');
    }

    // TODO toString

}
