# Testing Discipline

**Unit tests:** `node --test` files alongside every pure module. Known-answer tables for `euclid`, `rng`, `scales`, `melody`, `mutate`, `codec`, `scenes`, `wav`, `midi`, `oklch`, `geometry`.

**Audio verification:** **Verified by ear in a browser, never by a test suite, never by curl.** Rules §9 forbid simulated features. Everything audible must genuinely work:
- Listen to each voice as it lands.
- Play for ten minutes and confirm no crackle, no slowdown, no clock drift.
- Listen to an exported WAV and confirm it matches what you heard live.
- Tab-switch test: play, leave for 30 s, return, confirm it's still in time.

**Never verify audio with a test that just checks that the function ran.** That is how you end up at 22:00 Sunday with eight thousand lines of silent code.