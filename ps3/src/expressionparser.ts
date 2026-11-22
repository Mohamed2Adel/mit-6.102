/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout and the Reading 12 example code.
 */

/**
 * Parser for image meme expressions.
 * @module
 */

import assert from 'node:assert';
import { type Parser, type ParseTree, compile, visualizeAsUrl } from 'parserlib';
import type { MemeExpression } from './expression.ts';
import { Filename, SideBySide, Resize } from './expression-impls.ts';

// Problem 2.1: extend this grammar to the full language (captions, ---, ^, _, @ with ?).
// This starting grammar recognizes only filenames, side-by-side gluing |, and @-resizing
// with numbers (not ?).
//
// The filename regex is already adequate for the language: letters, digits, periods,
// plus - and _ anywhere except the first character.
const grammar = `
@skip whitespace {
    expression ::= resize ('|' resize)*;
    resize ::= primitive ('@' number 'x' number)*;
    primitive ::= filename | '(' expression ')';
}
filename ::= [A-Za-z0-9.][A-Za-z0-9._-]*;
number ::= [0-9]+;
whitespace ::= [ \\t\\r\\n]+;  // <-- note that backslashes must be escaped
`;

// the nonterminals of the grammar
enum ExpressionGrammar {
    Expression, Resize, Primitive, Filename, Number, Whitespace,
}

// compile the grammar into a parser
const parser: Parser<ExpressionGrammar> = compile(grammar, ExpressionGrammar, ExpressionGrammar.Expression);

/**
 * Parse a string into an expression.
 *
 * @param input string to parse
 * @returns MemeExpression parsed from the string
 * @throws ParseError if the string doesn't match the meme expression grammar
 */
export function parseExpression(input: string): MemeExpression {
    // parse the example into a parse tree
    const parseTree: ParseTree<ExpressionGrammar> = parser.parse(input);

    // display the parse tree in various ways, for debugging only
    // console.log("parse tree " + parseTree);
    // console.log(visualizeAsUrl(parseTree, ExpressionGrammar));
    void visualizeAsUrl;

    // make an AST from the parse tree
    const expression: MemeExpression = makeAbstractSyntaxTree(parseTree);
    // console.log("abstract syntax tree " + expression);

    return expression;
}

/**
 * Convert a parse tree into an abstract syntax tree.
 *
 * @param parseTree constructed according to the grammar in this file
 * @returns abstract syntax tree corresponding to parseTree
 */
function makeAbstractSyntaxTree(parseTree: ParseTree<ExpressionGrammar>): MemeExpression {
    if (parseTree.name === ExpressionGrammar.Expression) {
        // expression ::= resize ('|' resize)*;
        const children = parseTree.childrenByName(ExpressionGrammar.Resize);
        const subexprs = children.map(makeAbstractSyntaxTree);
        const expr: MemeExpression = subexprs.reduce((left, right) => new SideBySide(left, right));
        return expr;

    } else if (parseTree.name === ExpressionGrammar.Resize) {
        // resize ::= primitive ('@' number 'x' number)*;
        const primitive = makeAbstractSyntaxTree(parseTree.childrenByName(ExpressionGrammar.Primitive)[0]
                                                 ?? assert.fail('missing primitive'));
        const numbers = parseTree.childrenByName(ExpressionGrammar.Number).map(child => parseInt(child.text));
        let result: MemeExpression = primitive;
        for (let i = 0; i < numbers.length; i += 2) {
            const width = numbers[i];
            const height = numbers[i + 1];
            if(width === 0 || width === undefined || height === undefined) {
                throw new Error('width and height must be > 0');
            }
            result = new Resize(result, width, height);
        }
        return result;

    } else if (parseTree.name === ExpressionGrammar.Primitive) {
        // primitive ::= filename | '(' expression ')';
        const child: ParseTree<ExpressionGrammar> = parseTree.children[0] ?? assert.fail('missing child');
        // check which alternative (filename or expression) was actually matched
        switch (child.name) {
        case ExpressionGrammar.Filename:
        case ExpressionGrammar.Expression:
            return makeAbstractSyntaxTree(child);
        default:
            assert.fail(`Primitive node unexpected child ${ExpressionGrammar[child.name]}`);
        }

    } else if (parseTree.name === ExpressionGrammar.Filename) {
        // filename ::= [A-Za-z0-9.][A-Za-z0-9._-]*;
        const filename: string = parseTree.text;
        return new Filename(filename);

    } else {
        assert.fail(`cannot make AST for ${ExpressionGrammar[parseTree.name]} node`);
    }
}
