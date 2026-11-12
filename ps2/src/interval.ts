/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps2 API docs.
 */

import assert from 'node:assert';

/**
 * Represents an immutable half-open interval.
 *
 * PS2 instructions: do NOT change this class.
 */
export class Interval {

    /**
     * Make an interval [start, end).
     *
     * @param start low end of the interval, inclusive
     * @param end high end of the interval, exclusive, must be greater than start
     */
    public constructor(
        /** low end of the interval, inclusive */
        public readonly start: bigint,
        /** high end of the interval, exclusive, must be greater than start */
        public readonly end: bigint,
    ) {
        assert(start < end, `Interval: start ${start} must be less than end ${end}`);
    }

    /** @inheritdoc */
    public toString(): string {
        return `[${this.start},${this.end})`;
    }
}
