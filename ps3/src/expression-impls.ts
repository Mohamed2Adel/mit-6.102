/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 */

import assert from 'node:assert';
import type { MemeExpression } from './expression.ts';

// Problem 1.1: the concrete variants of MemeExpression go in this file,
// one class per kind of expression (filename, caption, each operator, ...).
//
// Data type definition
//    MemeExpression = TODO
//
// For each variant class: TypeDoc comments on the class and every method, AF, RI,
// safety from rep exposure, checkRep(), and @inheritDoc on methods specified in MemeExpression.
//
// Rules from the handout:
//   - immutable and recursive; no concrete syntax (parentheses, whitespace) in the AST
//   - must be legal to build an AST for a filename that is not in any image library
//   - toString() recursive and WITHOUT instanceof
//   - equalValue() recursive and WITH instanceof (see "Equality" in Reading 11)
//   - size and image operations (Problems 3, 4) recursive and WITHOUT instanceof

// keep the import used until you write your variants (delete this line then)
void assert;
