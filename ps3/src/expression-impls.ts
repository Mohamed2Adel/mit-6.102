/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 */

import assert from 'node:assert';
import type { MemeExpression } from './expression.ts';

// Problem 1.1: the concrete variants of MemeExpression go in this file,
// one class per kind of expression (filename, caption, each operator, ...).
//
// Data type definition
//    MemeExpression = Filename(name:string) + Resize(expr:MemeExpression, newWidth: number, newHeight: number)
//                     + SideBySide(left:MemeExpression, right:MemeExpression).
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

const regex = /^[A-Za-z0-9.][A-Za-z0-9._-]*$/; 

/**
 * Represents a filename in the meme language
 */
export class Filename implements MemeExpression {

    private readonly name:string;

    // AF: AF(name:string) = a image loaded from a file named with name:string.
    // RI: rules of the legal name, non-empty, could have digits and letters and - and _ and . 
    //     but dont start with _ or -. 
    // SRE: our field is private readonly, and string is of immutable type.

    /**
     * 
     * @param name file name of type string that could have letters, digits, ., -, _, 
     *             and the first character isn't - or _, throw if invalid
     */
    public constructor(name:string) {
        this.name = name;
        this.checkRep();
    }

    private checkRep() {
        assert(regex.test(this.name));
    }

    /**
     * @inheritDoc
     */
    public equalValue(that: MemeExpression): boolean {
        return that instanceof Filename && this.name === that.name;
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return this.name;
    }
}



/**
 * An immutable meme expression that resizes another expression to newWidth × newHeight.
 */
export class Resize implements MemeExpression {

    private readonly newWidth:number;
    private readonly newHeight:number;
    private readonly exp: MemeExpression;

    // AF: AF(exp:MemeExpression,newWidth: number, newHeight:number) = an image of exp resized with 
    //     newWidth x newHeight.
    // RI: newWidth and newHeight must be a positive integer
    // SRE: our field is private readonly, and number is of immutable type, and MemeExpression
    //      is immutable datatype.

    /**
     * 
     * @param width new width that image will be resized to, must be positive integer
     * @param height new height that image will be resized to, must be positive integer
     */
    public constructor(exp:MemeExpression, width:number, height:number) {
        this.exp = exp;
        this.newWidth = width;
        this.newHeight = height;
        this.checkRep();
    }

    private checkRep() {
        assert(this.newHeight > 0, 'height must be > 0');
        assert(this.newWidth > 0, 'width must be > 0');
        assert(Number.isInteger(this.newHeight));
        assert(Number.isInteger(this.newWidth));
    }

    /**
     * @inheritDoc
     */
    public equalValue(that: MemeExpression): boolean {
        return that instanceof Resize && this.newHeight === that.newHeight 
        && this.newWidth === that.newWidth && this.exp.equalValue(that.exp);
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return '(' + this.exp.toString() + ')' + '@' + this.newWidth + 'x' + this.newHeight;
    }
}


/**
 * Represents a new shape of images putted together side-by-side
 */
export class SideBySide implements MemeExpression {

    private readonly left:MemeExpression;
    private readonly right:MemeExpression;

    // AF: AF(left:MemeExpression, right:MemeExpression) = the expression left | right, 
    // i.e. left's image placed to the left of right's image.
    // RI: true.
    // SRE: MemeExpression is immutable datatype.

    /**
     * 
     * @param left the left image, must not be empty
     * @param right the right image, must not be empty
     */
    public constructor(left:MemeExpression, right:MemeExpression) {
        this.left = left;
        this.right = right;
        this.checkRep();
    }

    private checkRep() {}

    /**
     * @inheritDoc
     */
    public equalValue(that: MemeExpression): boolean {
        return that instanceof SideBySide
        && this.left.equalValue(that.left)
        && this.right.equalValue(that.right);
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return '(' + this.left.toString() + '|' + this.right.toString() + ')';
    }
}
