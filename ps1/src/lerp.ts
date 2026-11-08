/*
 * Reconstructed starter code for 6.102 Spring 2026 ps1 (Specific Graphics).
 *
 * Rules from the handout:
 *  - Don't change the function signatures in this file.
 *  - Don't export anything new from this file (only `lerp` and `forTestingOnly` are exported).
 *  - Small helpers are OK here, but don't export them.
 */

/**
 * Perform linear interpolation ... TODO ...
 *
 * PS1 problem 2(a): write a WEAK spec for lerpWeak that makes it understandable,
 * appropriate for implementing lerpColor(..), and as weak as possible.
 * ("Useful for lerpColor, but otherwise unnecessarily weak!")
 *
 * @param v0 TODO the value when t=0, start value 0<=v0<=255 and integer not fraction
 * @param v1 TODO the value when t=1, end value 0<=v1<=255 and integer not fraction
 * @param t TODO number where 0<=t<=1, fraction of the way from v0 to v1
 * @returns TODO return the linear interpolation between v0 and v1 
 *          v0 + t·(v1 − v0). 0<=return<=255 rounded to nearest integer
 */
function lerpWeak(v0: number, v1: number, t: number): number {
    // PS1 problem 2(c): implement
    //throw new Error('not implemented yet');
    return Math.round(v0*(1-t) + v1*t);
}

/**
 * Perform linear interpolation ... TODO ...
 *
 * PS1 problem 5(b): write a STRONG spec for lerpStrong that makes it applicable in all the
 * places you've used lerp so far, as well as for implementing interpolate(..). A useful spec!
 *
 * @param v0 TODO the start value when easing(t)=0 
 * @param v1 TODO the end value when easing(t)=1 
 * @param t TODO the easing(t)
 * @returns TODO return the v0*(1-t) + v1*t 
 *          
 */
function lerpStrong(v0: number, v1: number, t: number): number {
    // PS1 problem 5(e): implement
    // throw new Error('not implemented yet');
    return (v0*(1-t) + v1*t);
}

/**
 * Perform linear interpolation ... TODO ...
 * 
 * PS1 problem 5(f): change this line so `lerp` uses lerpStrong instead of lerpWeak.
 */
export const lerp = lerpStrong;

/**
 * PS1 instructions: both implementations are exported for PS1 testing purposes only.
 */
export const forTestingOnly = { lerpWeak, lerpStrong };

/*
 * PS1 problem 5(c): analyze the relationship between your lerpWeak and lerpStrong specs
 * in three sentences, one per question. (Your lerpWeak may be weaker than lerpStrong... or not!)
 * [Reconstructed wording: the exact questions are only in the github.mit.edu starter repo.]
 *
 * 1. Compare the PRECONDITIONS: is lerpStrong's precondition weaker than, stronger than,
 *    the same as, or incomparable to lerpWeak's? Why?
 *    TODO: precondition of lerpStrong is weaker than that of lerpWeak, because the bounded
 *    value of t in the lerpWeak is removed now since easing(t) could be <0 or >1. 
 *
 * 2. Compare the POSTCONDITIONS: is lerpStrong's postcondition stronger than, weaker than,
 *    the same as, or incomparable to lerpWeak's? Why?
 *    TODO: the postcondition is the same as it return the same formula
 *
 * 3. So is the lerpStrong spec stronger than, weaker than, the same as, or incomparable to
 *    the lerpWeak spec, and could lerpStrong's implementation replace lerpWeak's everywhere?
 *    TODO: stronger and could replace lerpWeak everywhere
 */
