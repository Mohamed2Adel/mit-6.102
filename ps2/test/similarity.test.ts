/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study.
 */

import assert from 'node:assert';
import { similarity, LabelSimilarityTable, LabelSimilarity } from '../src/similarity.js';
import { MultiIntervalSet } from '../src/multiintervalset.js';

/*
 * Tests for similarity(..) and for your Problem 5.2 helper ADT.
 * These tests must be legal clients of your spec of similarity.
 */
describe('similarity', function () {

    // Testing strategy
    /**
     *   partition on setA, setB: both emtpy, both non-empty, one empty and one not empty
     *   partition on similarities: empty array, one tuple, several tuple, reversed order
     *   partition on sim(output): =1 identical, 0, partial 0<out<1
     *   partition on span: start at 0, start > 0, has gaps
     *   partition on precision: small value so exact result, bigint value so approx result
     */

    it('covers two empty sets', function () {
        assert.strictEqual(similarity([], new MultiIntervalSet<string>(), new MultiIntervalSet<string>()), 0);
    });
    
    it('covers one empty sets', function () {
        const set = new MultiIntervalSet<string>();
        set.add(0n, 10n, "A");
        assert.strictEqual(similarity([], new MultiIntervalSet<string>(), set), 0);
    });

    it('covers non are empty sets and similarities is empty array', function () {
        const setA = new MultiIntervalSet<string>();
        const setB = new MultiIntervalSet<string>();
        setA.add(0n, 10n, "A");
        setB.add(0n, 8n, "A");
        assert.strictEqual(similarity([], setA, setB), 0.8);
    });

    it('covers sim out = 1', function () {
        const setA = new MultiIntervalSet<string>();
        const setB = new MultiIntervalSet<string>();
        setA.add(0n, 10n, "A");
        setB.add(0n, 10n, "A");
        assert.strictEqual(similarity([], setA, setB), 1);
    });

    it('covers sim out = 0', function () {
        const setA = new MultiIntervalSet<string>();
        const setB = new MultiIntervalSet<string>();
        setA.add(0n, 10n, "A");
        setB.add(0n, 10n, "B");
        assert.strictEqual(similarity([], setA, setB), 0);
    });

    it('covers one tuple of similarities and span start>0', function () {
        const setA = new MultiIntervalSet<string>();
        const setB = new MultiIntervalSet<string>();
        setA.add(5n, 10n, "A");
        setB.add(5n, 10n, "B");
        assert.strictEqual(similarity([["A","B",0.5]], setA, setB), 0.5);
    });

    it('covers similarities with reversed order', function () {
        const setA = new MultiIntervalSet<string>();
        const setB = new MultiIntervalSet<string>();
        setA.add(5n, 10n, "A");
        setB.add(5n, 15n, "B");
        assert.strictEqual(similarity([["B","A",0.5]], setA, setB), 0.25);
    });


    it('covers several tuple of similarities and span start=0', function () {
        const setA = new MultiIntervalSet<string>();
        const setB = new MultiIntervalSet<string>();
        setA.add(0n, 10n, "A");
        setA.add(10n, 20n, "B");
        setB.add(0n, 10n, "C");
        setB.add(10n, 20n, "D");
        assert.strictEqual(similarity([["A","C",0.25],["B","D",0.25]], setA, setB), 0.25);
    });

    it('covers several tuple of similarities and span has gaps', function () {
        const setA = new MultiIntervalSet<string>();
        const setB = new MultiIntervalSet<string>();
        setA.add(0n, 10n, "A");
        setA.add(15n, 20n, "B");
        setA.add(20n, 30n, "C");
        setA.add(30n, 35n, "A");
        setB.add(5n, 10n, "D");
        setB.add(10n, 20n, "E");
        assert(Math.abs(similarity([["A","D",0.5],["B","E",0.25]], setA, setB) - 0.1071428571) < 1e-9);
    });

});


describe('LabelSimilarityTable', function(){
    // Testing strategy
    /** 
     * partition on a, b: a&b are same, a&b are different, a&b are in Table, are not in Table
     *                    cover a,b in different order.
     * partition on output: =1, =0, in
     */

    // covers a and b are same and output = 1
    it('covers a and b are same',function(){
        const similarities:Array<LabelSimilarity>=[
            ["A", "B", 0.6],
            ["C", "D", 0.2],
        ];
        const table = new LabelSimilarityTable(similarities);
        assert.strictEqual(table.get("same", "same"), 1);
    });

    // covers a and b are different and not in table and out=0
    it('covers a and b are different and not in table => out = 0',function(){
        const similarities:Array<LabelSimilarity>=[
            ["A", "B", 0.6],
            ["C", "D", 0.2],
        ];
        const table = new LabelSimilarityTable(similarities);
        assert.strictEqual(table.get("E", "F"), 0);
    });

    // covers a and b are different and in table, out in between
    it('covers a and b are different and in table',function(){
        const similarities:Array<LabelSimilarity>=[
            ["A", "B", 0.6],
            ["C", "D", 0.2],
        ];
        const table = new LabelSimilarityTable(similarities);
        assert.strictEqual(table.get("A", "B"), 0.6);
    });

    // covers a and b are in orders and swapped order
    it('covers a and b are in orders and swapped order',function(){
        const similarities:Array<LabelSimilarity>=[
            ["A", "B", 0.6],
            ["C", "D", 0.2],
        ];
        const table = new LabelSimilarityTable(similarities);
        assert.strictEqual(table.get("C", "D"), 0.2);
        assert.strictEqual(table.get("D", "C"), 0.2);
    });


}); 
