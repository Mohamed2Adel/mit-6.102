/*
 * Reconstructed starter code for 6.102 Spring 2026 ps1 (Specific Graphics).
 * Specs are copied from the public ps1 API docs.
 *
 * Rules from the handout:
 *  - Don't WEAKEN the specs here: your final specs must be STRONGER than what is provided.
 *  - Don't export anything new from this file.
 *
 * Advice from the handout (problem 6a):
 *  bezierInterpolate:
 *   - consider weakening its statically-checked precondition on renameMe (and rename that parameter)
 *   - avoid weakening its provided exceptional-case postcondition
 *   - it must be generally useful, and useful as a helper to implement bezierPath
 *  bezierPath:
 *   - consider weakening its statically-checked precondition on renameMe by using a UNION type
 *     (and rename that parameter)
 *   - then consider your postcondition when `undefined` is provided for that parameter,
 *     since you cannot add exceptional cases
 */

/**
 * A point on the Cartesian plane.
 */
export type Point = { x: number, y: number };

/**
 * TODO: you determine the detailed spec, which must be stronger than what is provided
 *
 * @param controlPoints TODO
 * @param renameMe TODO
 * @returns TODO
 * @throws Error if and only if controlPoints is empty
 */
export function bezierInterpolate(controlPoints: Array<Point>, renameMe: 0): Point {
    // PS1 problem 6(b): implement
    throw new Error('not implemented yet');
}

/**
 * Given a Bézier curve and an easing function, produce a sequence of points suitable for
 * animating the eased movement along the curve.
 * See https://en.wikipedia.org/wiki/Bézier_curve for an explanation of Bézier curves.
 *
 * The easing function must satisfy:
 *  - easing(0) = 0 and easing(1) = 1, so that the interpolation goes from P_0 to P_n
 *  - easing(t) is always in [0, 1], so that the interpolation stays on the curve
 *
 * @param controlPoints Bézier curve control points P_0 through P_n, nonempty
 * @param easing function mapping input interpolation parameter ti, 0 <= ti <= 1,
 *               to an applied interpolation parameter, as constrained above
 * @param renameMe TODO: you determine the detailed precondition, including a weaker static type
 * @returns TODO: you determine the detailed postcondition, but you may NOT add "throws" cases
 */
export function bezierPath(controlPoints: Array<Point>, easing: (ti: number) => number, renameMe: undefined): Array<Point> {
    // PS1 problem 6(b): implement
    throw new Error('not implemented yet');
}
