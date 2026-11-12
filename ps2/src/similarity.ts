/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps2 API docs.
 */

import { MultiIntervalSet } from './multiintervalset.js';

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
    throw new Error('not implemented');
}

// TODO Problem 5.2: specify (and later implement) your helper ADT as a class here.
