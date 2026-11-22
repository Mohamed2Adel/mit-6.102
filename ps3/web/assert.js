// Minimal browser stand-in for 'node:assert', so code that imports it also runs in the web UI.
// Covers the functions commonly used in src/ and by parserlib; NOT a full implementation.

class AssertionError extends Error {
    constructor(message) { super(message ?? 'assertion failed'); this.name = 'AssertionError'; }
}

function assert(value, message) { if (!value) { throw new AssertionError(message); } }

assert.ok = assert;
assert.fail = (message) => { throw new AssertionError(message ?? 'failed'); };
assert.equal = (a, b, message) => { if (a != b) { throw new AssertionError(message ?? `${a} != ${b}`); } };
assert.strictEqual = (a, b, message) => { if (!Object.is(a, b)) { throw new AssertionError(message ?? `${a} !== ${b}`); } };
assert.notStrictEqual = (a, b, message) => { if (Object.is(a, b)) { throw new AssertionError(message ?? `${a} === ${b}`); } };
assert.deepStrictEqual = (a, b, message) => {
    if (JSON.stringify(a) !== JSON.stringify(b)) { throw new AssertionError(message ?? 'not deep-equal'); }
};
assert.throws = (fn, _expected, message) => {
    try { fn(); } catch (_e) { return; }
    throw new AssertionError(message ?? 'missing expected exception');
};
assert.AssertionError = AssertionError;

export default assert;
export const { ok, fail, equal, strictEqual, notStrictEqual, deepStrictEqual, throws } = assert;
export { AssertionError };
