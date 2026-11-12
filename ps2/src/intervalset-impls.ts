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
export class RepMapIntervalSet implements IntervalSet<string> {

    private readonly startMap: Map<string, bigint> = new Map();
    private readonly endMap: Map<bigint, bigint> = new Map();

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
        assert(this.startMap);
        assert(this.endMap);
    }

    /** @inheritdoc */
    public add(start: bigint, end: bigint, label: string): void {
        throw new Error('not implemented');
    }

    /** @inheritdoc */
    public interval(label: string): Interval | undefined {
        throw new Error('not implemented');
    }

    /** @inheritdoc */
    public labels(): Set<string> {
        throw new Error('not implemented');
    }

    // TODO toString
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
