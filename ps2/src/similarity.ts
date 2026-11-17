/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps2 API docs.
 */

import assert from 'assert';
import { MultiIntervalSet } from './multiintervalset.js';
import { Interval } from './interval.js';

/**
 * A 3-tuple associating a string pair with a number.
 */
export type LabelSimilarity = [string, string, number];

/**
 * Measure similarity between multi-interval sets with string labels.
 *
 * Uses a client-provided definition of label similarities, where 0 is least- and 1 is most-similar.
 *
 * The similarity between two multi-interval sets, where at least one is nonempty, is the ratio:
 *
 *     (sum of piecewise-matching between the sets) / (span of the sets)
 *
 * where the span is the length of the smallest interval that contains all the intervals from both
 * sets, and the amount of piecewise-matching for any unit interval [i, i+1) is:
 * - 0 if neither set has a label on that interval
 * - 0 if only one set has a label on that interval
 * - otherwise, the similarity between labels as defined by the client, explained below
 *
 * Two empty sets have similarity 0.
 *
 * For example, suppose you have multi-interval sets that use labels "happy", "sad", and "meh"; and
 * similarity between labels is defined as:
 * - 1 if both are "happy", both "sad", or both "meh"
 * - 0.5 if one is meh and the other is "happy" or "sad"
 * - 0 otherwise
 *
 * Then the similarity between these two sets:
 *
 *     { "happy" = [[0, 1), [2,4)], "sad" = [[1,2)] }
 *     { "sad" = [[1, 2)], "meh" = [[2,3)], "happy" = [[3,4)] }
 *
 * ... would be: (0 + 1 + 0.5 + 1) / (4 - 0) = 0.625
 *
 * Label similarities are provided as an array of tuples, where the first two elements give a pair of
 * labels, and the third element gives the similarity between them, between 0 and 1 inclusive.
 * Similarity between labels is symmetric, so the order of labels in each tuple is irrelevant, and a
 * pair of labels may not appear more than once. The similarity between all other pairs of labels is:
 * - 1 iff they are the same string, and
 * - 0 otherwise
 *
 * For example, the following gives the similarity values used above:
 *
 *     [ ["happy","meh",0.5], ["meh","sad",0.5] ]
 *
 * When the individual piecewise-matching terms, the sum of piecewise-matching between the sets, and
 * the span of the sets can be represented as number values with high precision, the returned value
 * will have similar precision. Otherwise, it may be similarly imprecise.
 *
 * PS2 instructions: this is a required function.
 * You may strengthen its specification, but may NOT weaken it.
 *
 * @param similarities label similarity definition as described above
 * @param setA multi-interval set with string labels
 * @param setB multi-interval set with string labels
 * @returns similarity between setA and setB as defined above
 */
export function similarity(
    similarities: Array<LabelSimilarity>,
    setA: MultiIntervalSet<string>,
    setB: MultiIntervalSet<string>,
): number {
    
    const table = new LabelSimilarityTable(similarities);

    // flatten the set into Array of [label, intervals]
    const listA: Array<[string, Interval]> = [];
    const listB: Array<[string, Interval]> = [];
    for(const a of setA.labels()) {
        for(const ia of setA.intervals(a).labels()) {
            listA.push([a, setA.intervals(a).interval(ia)!]);
        }
    }
    for(const b of setB.labels()) {
        for(const ib of setB.intervals(b).labels()) {
            listB.push([b, setB.intervals(b).interval(ib)!]);
        }
    }

    // compute span
    let min: bigint | undefined = undefined;
    let max: bigint | undefined = undefined;
    for(const [, ia] of listA) {
        if(min === undefined || ia.start < min) {
            min = ia.start;
        }
        if(max === undefined || ia.end > max) {
            max = ia.end;
        }
    }
    for(const [, ib] of listB) {
        if(min === undefined || ib.start < min) {
            min = ib.start;
        }
        if(max === undefined || ib.end > max) {
            max = ib.end;
        }
    }
    if(min === undefined || max === undefined) {
        return 0;
    }
    const span = max - min;
    // compute sum
    let sum = 0;
    // sum = (shared length interval between setA and setB) x (sim(a,b))
    // overlap = min(end1, end2) - max(start1, start2)
    // if overlap > 0, then there is shared interval 
    // sum = overlap x sim(a, b)
    // else overlap <= 0, then there is no shared interval
    // sum = 0 x sim(a, b) = 0
    for(const [a , ia] of listA) {
        for(const [b, ib] of listB) {
            const minEnd = ia.end < ib.end ? ia.end: ib.end;
            const maxStart = ia.start > ib.start ? ia.start: ib.start;
            const overlap = minEnd - maxStart;
            if(overlap > 0) {
                sum = sum + (Number(overlap) * table.get(a, b));
            }
        }
    }

    // compute sim = sum / span
    const sim: number = sum / Number(span) ;
    return sim;
}


/**
 * Immutable lookup table for similarities, default 1 (same), 0 (different).
 * 
 * AF: AF(similarities:Array<LabelSimilarity>)= symmtetric function sim(a, b)= value in [0, 1],
 *     eg. similarities[[string, string, value],[string, string, value],...] 
 * RI: every value is in [0, 1], and no unordered pair appear twice
 * SRE: our array is readonly and we copied the client's array so not to mutate it,
 *      get method return a immutable number.
 */
export class LabelSimilarityTable {

    private readonly similarities:Array<LabelSimilarity>;
    /**
     * 
     * @param similarities array of [string, string, value] tuples; each value is in [0, 1]
     */
    constructor(similarities:Array<LabelSimilarity>){
        this.similarities = similarities.map(([a, b, v]) => [a, b, v]);
        this.checkRep();
    }

    private checkRep(){
        for(const tuple of this.similarities) {
            assert(0 <= tuple[2] && tuple[2] <= 1);
        }
    }

    /**
     * public method to get the similarity between two strings
     * @param a string 
     * @param b string  
     * @returns similarity between a and b or b and a the order doesn't matter, return by default 1 
     *          if a === b, and 0 if a !==b and there is no similarity between them. Type:number
     */
    public get(a:string, b:string):number {
        this.checkRep();
        // search for the similarity in the Array
        for(const tuble of this.similarities) {
            if((tuble[0] === a && tuble[1] === b) || (tuble[0] === b && tuble[1] === a)) {
                return tuble[2];
            }
        }
        // return 1 if two strings are identical 
        if(a === b) {
            return 1;
        }
        // if not in the Array and not identical then return 0
        return 0;
    }
}