
import { LiteralNode, UnionExpressionNode, type Config } from "kysely-codegen"
import { LIST_MEMBER_ROLES } from "./src/lib/server/db/table.ts"

function createLiteralUnionFromEnum(enumType: Readonly<Array<string>>) {
  return new UnionExpressionNode(enumType.map((value) => new LiteralNode(value)));
}

const config: Config = {
    camelCase: true,
    // customImports: {},
    // dateParser: "timestamp",
    // defaultSchemas: [], // ["public"] for PostgreSQL,
    dialect: "sqlite",
    // domains: true,
    envFile: ".env",
    // excludePattern: null,
    // includePattern: null,
    // logLevel: "warn",
    // numericParser: "string",
    outFile: "./node_modules/kysely-codegen/dist/db.d.ts",
    overrides: {
        columns: {
            "member_of_list.role": createLiteralUnionFromEnum(LIST_MEMBER_ROLES)
        }
    },
    // partitions: false,
    // print: false,
    // runtimeEnums: false,
    // singularize: false,
    // typeMapping: {},
    typeOnlyImports: true,
    url: "env(DATABASE_URL)",
    verify: false,
}

export default config