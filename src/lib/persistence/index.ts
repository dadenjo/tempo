/**
 * @file-summary
 * @capability tempo.persistence
 * @hash sha256-c284783db430052b56ce9aaede56051ec8531504d4e2644c2a20953b5f7551d0
 * @generated 2026-05-26T21:17:51.047Z
 *
 * This is a barrel/re-export module for the `tempo.persistence` capability. It re-exports two symbols, `getDB` and `resetDB`, from the local `./db` module. A JSDoc comment describes the file as a local-first persistence layer covering IndexedDB schema, migrations, and raw store accessors, though no implementation is present in this file itself.
 *
 * @exports getDB, resetDB
 * @imports ./db (getDB, resetDB)
 * @key-functions
 * @evidence src/lib/persistence/index.ts:1-6, src/lib/persistence/index.ts:6
 */
/**
 * @amber-capability tempo.persistence
 * Local-first persistence layer — IndexedDB schema, migrations, and raw
 * store accessors. All higher-level domain modules read/write through here.
 */
export { getDB, resetDB } from "./db";
