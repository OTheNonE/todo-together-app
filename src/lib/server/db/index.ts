
import { env } from "$env/dynamic/private"
import SQLite from "better-sqlite3"
import { Kysely, SqliteDialect, CamelCasePlugin } from "kysely"
import { UnionExpressionNode, type DB as Schema } from "kysely-codegen"
import SQLSchema from "./schema.sql?raw"

const database = new SQLite(env.DATABASE_URL)

database.pragma('foreign_keys = ON')

const kysely = new Kysely<Schema>({ 
    dialect: new SqliteDialect({ database }),
    plugins: [new CamelCasePlugin()]
})

database.exec(SQLSchema)

export const db = kysely