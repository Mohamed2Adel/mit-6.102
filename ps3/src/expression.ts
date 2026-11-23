/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 API docs.
 */

// This file may import from expressionparser.ts and expression-impls.ts (see Problem 1,
// option 2), but should NOT import ImageLibrary for Problems 1 and 2.
import { parseExpression } from './expressionparser.ts';
import { ImageLibrary } from './imagelibrary.ts';

/**
 * An immutable data type representing an image meme expression, as defined in the PS3 handout.
 *
 * PS3 instructions: this is a required ADT interface.
 * You MUST NOT change its name or package or the names or type signatures of existing methods.
 * You MAY strengthen the specs of existing methods, and you MAY add new methods
 * (e.g. the size and image operations of Problems 3 and 4).
 * Declare concrete variants of MemeExpression in their own module (expression-impls.ts).
 */
export interface MemeExpression {

    // Data type definition is in expression-impls.ts

    /**
     * @returns a parsable representation of this expression, such that
     *          for all expr: MemeExpression, expr.equalValue(parse(expr.toString()))
     */
    toString(): string;

    /**
     * @param that any MemeExpression
     * @returns true if and only if this and that are structurally-equal MemeExpressions,
     *          as defined in the PS3 handout; grouping is part of the structure, so
     *          (A | B) | C and A | (B | C) are not equal
     */
    equalValue(that: MemeExpression): boolean;

    // TODO Problem 3.1: size operation (takes an ImageLibrary)
    /**
     * 
     * @param library an imageLibrary
     * @returns the size of the image {width, height} this expression generate.
     * @throws when the filename is not in the library.
     */
    size(library: ImageLibrary): {readonly width:number, readonly height:number};

    // TODO Problem 4.1: image operation (takes an ImageLibrary, returns a Canvas)

}

/**
 * Parse an expression.
 *
 * PS3 instructions: this is a required function.
 * You MUST NOT change its name or package or the names or type signature.
 * You MAY strengthen its spec. Keep it extremely simple: just glue code that calls
 * parseExpression() in expressionparser.ts.
 *
 * @param input expression to parse, as defined in the PS3 handout
 * @returns expression AST for the input, where operators of the same kind group left to right:
 *          A | B | C means (A | B) | C, and A @ 1x2 @ 3x4 means (A @ 1x2) @ 3x4
 * @throws Error if the expression is syntactically invalid, including a width or height of 0
 */
export function parse(input: string): MemeExpression {
    return parseExpression(input);
}
