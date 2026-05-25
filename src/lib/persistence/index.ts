/**
 * @amber-capability tempo.persistence
 * Local-first persistence layer — IndexedDB schema, migrations, and raw
 * store accessors. All higher-level domain modules read/write through here.
 */
export { getDB, resetDB } from "./db";
