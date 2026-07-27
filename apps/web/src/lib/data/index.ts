// Single seam for content data. Today everything reads local JSON fixtures
// (see src/data/*.json); migrating to the real API later means rewriting the
// bodies of these functions to call apps/api instead — call sites don't change.
export * from "./local";
export * from "./photo";
