
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Theme
 * 
 */
export type Theme = $Result.DefaultSelection<Prisma.$ThemePayload>
/**
 * Model CoverTemplate
 * 
 */
export type CoverTemplate = $Result.DefaultSelection<Prisma.$CoverTemplatePayload>
/**
 * Model ProjectCoverAsset
 * 
 */
export type ProjectCoverAsset = $Result.DefaultSelection<Prisma.$ProjectCoverAssetPayload>
/**
 * Model RecentProject
 * 
 */
export type RecentProject = $Result.DefaultSelection<Prisma.$RecentProjectPayload>
/**
 * Model AppSetting
 * 
 */
export type AppSetting = $Result.DefaultSelection<Prisma.$AppSettingPayload>
/**
 * Model CachedFont
 * 
 */
export type CachedFont = $Result.DefaultSelection<Prisma.$CachedFontPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Projects
 * const projects = await prisma.project.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Projects
   * const projects = await prisma.project.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.theme`: Exposes CRUD operations for the **Theme** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Themes
    * const themes = await prisma.theme.findMany()
    * ```
    */
  get theme(): Prisma.ThemeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.coverTemplate`: Exposes CRUD operations for the **CoverTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CoverTemplates
    * const coverTemplates = await prisma.coverTemplate.findMany()
    * ```
    */
  get coverTemplate(): Prisma.CoverTemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectCoverAsset`: Exposes CRUD operations for the **ProjectCoverAsset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectCoverAssets
    * const projectCoverAssets = await prisma.projectCoverAsset.findMany()
    * ```
    */
  get projectCoverAsset(): Prisma.ProjectCoverAssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recentProject`: Exposes CRUD operations for the **RecentProject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RecentProjects
    * const recentProjects = await prisma.recentProject.findMany()
    * ```
    */
  get recentProject(): Prisma.RecentProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appSetting`: Exposes CRUD operations for the **AppSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppSettings
    * const appSettings = await prisma.appSetting.findMany()
    * ```
    */
  get appSetting(): Prisma.AppSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cachedFont`: Exposes CRUD operations for the **CachedFont** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CachedFonts
    * const cachedFonts = await prisma.cachedFont.findMany()
    * ```
    */
  get cachedFont(): Prisma.CachedFontDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Project: 'Project',
    Theme: 'Theme',
    CoverTemplate: 'CoverTemplate',
    ProjectCoverAsset: 'ProjectCoverAsset',
    RecentProject: 'RecentProject',
    AppSetting: 'AppSetting',
    CachedFont: 'CachedFont'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "project" | "theme" | "coverTemplate" | "projectCoverAsset" | "recentProject" | "appSetting" | "cachedFont"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Theme: {
        payload: Prisma.$ThemePayload<ExtArgs>
        fields: Prisma.ThemeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ThemeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ThemeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          findFirst: {
            args: Prisma.ThemeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ThemeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          findMany: {
            args: Prisma.ThemeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>[]
          }
          create: {
            args: Prisma.ThemeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          createMany: {
            args: Prisma.ThemeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ThemeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>[]
          }
          delete: {
            args: Prisma.ThemeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          update: {
            args: Prisma.ThemeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          deleteMany: {
            args: Prisma.ThemeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ThemeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ThemeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>[]
          }
          upsert: {
            args: Prisma.ThemeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          aggregate: {
            args: Prisma.ThemeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTheme>
          }
          groupBy: {
            args: Prisma.ThemeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ThemeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ThemeCountArgs<ExtArgs>
            result: $Utils.Optional<ThemeCountAggregateOutputType> | number
          }
        }
      }
      CoverTemplate: {
        payload: Prisma.$CoverTemplatePayload<ExtArgs>
        fields: Prisma.CoverTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CoverTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CoverTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>
          }
          findFirst: {
            args: Prisma.CoverTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CoverTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>
          }
          findMany: {
            args: Prisma.CoverTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>[]
          }
          create: {
            args: Prisma.CoverTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>
          }
          createMany: {
            args: Prisma.CoverTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CoverTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>[]
          }
          delete: {
            args: Prisma.CoverTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>
          }
          update: {
            args: Prisma.CoverTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>
          }
          deleteMany: {
            args: Prisma.CoverTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CoverTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CoverTemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>[]
          }
          upsert: {
            args: Prisma.CoverTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CoverTemplatePayload>
          }
          aggregate: {
            args: Prisma.CoverTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCoverTemplate>
          }
          groupBy: {
            args: Prisma.CoverTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<CoverTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.CoverTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<CoverTemplateCountAggregateOutputType> | number
          }
        }
      }
      ProjectCoverAsset: {
        payload: Prisma.$ProjectCoverAssetPayload<ExtArgs>
        fields: Prisma.ProjectCoverAssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectCoverAssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectCoverAssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>
          }
          findFirst: {
            args: Prisma.ProjectCoverAssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectCoverAssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>
          }
          findMany: {
            args: Prisma.ProjectCoverAssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>[]
          }
          create: {
            args: Prisma.ProjectCoverAssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>
          }
          createMany: {
            args: Prisma.ProjectCoverAssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCoverAssetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>[]
          }
          delete: {
            args: Prisma.ProjectCoverAssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>
          }
          update: {
            args: Prisma.ProjectCoverAssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>
          }
          deleteMany: {
            args: Prisma.ProjectCoverAssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectCoverAssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectCoverAssetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>[]
          }
          upsert: {
            args: Prisma.ProjectCoverAssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectCoverAssetPayload>
          }
          aggregate: {
            args: Prisma.ProjectCoverAssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectCoverAsset>
          }
          groupBy: {
            args: Prisma.ProjectCoverAssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectCoverAssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCoverAssetCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCoverAssetCountAggregateOutputType> | number
          }
        }
      }
      RecentProject: {
        payload: Prisma.$RecentProjectPayload<ExtArgs>
        fields: Prisma.RecentProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecentProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecentProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>
          }
          findFirst: {
            args: Prisma.RecentProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecentProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>
          }
          findMany: {
            args: Prisma.RecentProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>[]
          }
          create: {
            args: Prisma.RecentProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>
          }
          createMany: {
            args: Prisma.RecentProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecentProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>[]
          }
          delete: {
            args: Prisma.RecentProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>
          }
          update: {
            args: Prisma.RecentProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>
          }
          deleteMany: {
            args: Prisma.RecentProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecentProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecentProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>[]
          }
          upsert: {
            args: Prisma.RecentProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecentProjectPayload>
          }
          aggregate: {
            args: Prisma.RecentProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecentProject>
          }
          groupBy: {
            args: Prisma.RecentProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecentProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecentProjectCountArgs<ExtArgs>
            result: $Utils.Optional<RecentProjectCountAggregateOutputType> | number
          }
        }
      }
      AppSetting: {
        payload: Prisma.$AppSettingPayload<ExtArgs>
        fields: Prisma.AppSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          findFirst: {
            args: Prisma.AppSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          findMany: {
            args: Prisma.AppSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>[]
          }
          create: {
            args: Prisma.AppSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          createMany: {
            args: Prisma.AppSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>[]
          }
          delete: {
            args: Prisma.AppSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          update: {
            args: Prisma.AppSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          deleteMany: {
            args: Prisma.AppSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppSettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>[]
          }
          upsert: {
            args: Prisma.AppSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          aggregate: {
            args: Prisma.AppSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppSetting>
          }
          groupBy: {
            args: Prisma.AppSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppSettingCountArgs<ExtArgs>
            result: $Utils.Optional<AppSettingCountAggregateOutputType> | number
          }
        }
      }
      CachedFont: {
        payload: Prisma.$CachedFontPayload<ExtArgs>
        fields: Prisma.CachedFontFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CachedFontFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CachedFontFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>
          }
          findFirst: {
            args: Prisma.CachedFontFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CachedFontFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>
          }
          findMany: {
            args: Prisma.CachedFontFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>[]
          }
          create: {
            args: Prisma.CachedFontCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>
          }
          createMany: {
            args: Prisma.CachedFontCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CachedFontCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>[]
          }
          delete: {
            args: Prisma.CachedFontDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>
          }
          update: {
            args: Prisma.CachedFontUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>
          }
          deleteMany: {
            args: Prisma.CachedFontDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CachedFontUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CachedFontUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>[]
          }
          upsert: {
            args: Prisma.CachedFontUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CachedFontPayload>
          }
          aggregate: {
            args: Prisma.CachedFontAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCachedFont>
          }
          groupBy: {
            args: Prisma.CachedFontGroupByArgs<ExtArgs>
            result: $Utils.Optional<CachedFontGroupByOutputType>[]
          }
          count: {
            args: Prisma.CachedFontCountArgs<ExtArgs>
            result: $Utils.Optional<CachedFontCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    project?: ProjectOmit
    theme?: ThemeOmit
    coverTemplate?: CoverTemplateOmit
    projectCoverAsset?: ProjectCoverAssetOmit
    recentProject?: RecentProjectOmit
    appSetting?: AppSettingOmit
    cachedFont?: CachedFontOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    coverAssets: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    coverAssets?: boolean | ProjectCountOutputTypeCountCoverAssetsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountCoverAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectCoverAssetWhereInput
  }


  /**
   * Count Type ThemeCountOutputType
   */

  export type ThemeCountOutputType = {
    projects: number
  }

  export type ThemeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | ThemeCountOutputTypeCountProjectsArgs
  }

  // Custom InputTypes
  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeCountOutputType
     */
    select?: ThemeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }


  /**
   * Count Type CoverTemplateCountOutputType
   */

  export type CoverTemplateCountOutputType = {
    projects: number
  }

  export type CoverTemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | CoverTemplateCountOutputTypeCountProjectsArgs
  }

  // Custom InputTypes
  /**
   * CoverTemplateCountOutputType without action
   */
  export type CoverTemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplateCountOutputType
     */
    select?: CoverTemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CoverTemplateCountOutputType without action
   */
  export type CoverTemplateCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    filePath: string | null
    themeId: string | null
    hasCoverPage: boolean | null
    coverTitle: string | null
    coverSubtitle: string | null
    coverAuthor: string | null
    coverDate: string | null
    coverTemplateId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastOpenedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    filePath: string | null
    themeId: string | null
    hasCoverPage: boolean | null
    coverTitle: string | null
    coverSubtitle: string | null
    coverAuthor: string | null
    coverDate: string | null
    coverTemplateId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastOpenedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    filePath: number
    themeId: number
    hasCoverPage: number
    coverTitle: number
    coverSubtitle: number
    coverAuthor: number
    coverDate: number
    coverTemplateId: number
    createdAt: number
    updatedAt: number
    lastOpenedAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    filePath?: true
    themeId?: true
    hasCoverPage?: true
    coverTitle?: true
    coverSubtitle?: true
    coverAuthor?: true
    coverDate?: true
    coverTemplateId?: true
    createdAt?: true
    updatedAt?: true
    lastOpenedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    filePath?: true
    themeId?: true
    hasCoverPage?: true
    coverTitle?: true
    coverSubtitle?: true
    coverAuthor?: true
    coverDate?: true
    coverTemplateId?: true
    createdAt?: true
    updatedAt?: true
    lastOpenedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    filePath?: true
    themeId?: true
    hasCoverPage?: true
    coverTitle?: true
    coverSubtitle?: true
    coverAuthor?: true
    coverDate?: true
    coverTemplateId?: true
    createdAt?: true
    updatedAt?: true
    lastOpenedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    filePath: string
    themeId: string | null
    hasCoverPage: boolean
    coverTitle: string | null
    coverSubtitle: string | null
    coverAuthor: string | null
    coverDate: string | null
    coverTemplateId: string | null
    createdAt: Date
    updatedAt: Date
    lastOpenedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    filePath?: boolean
    themeId?: boolean
    hasCoverPage?: boolean
    coverTitle?: boolean
    coverSubtitle?: boolean
    coverAuthor?: boolean
    coverDate?: boolean
    coverTemplateId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastOpenedAt?: boolean
    theme?: boolean | Project$themeArgs<ExtArgs>
    coverTemplate?: boolean | Project$coverTemplateArgs<ExtArgs>
    coverAssets?: boolean | Project$coverAssetsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    filePath?: boolean
    themeId?: boolean
    hasCoverPage?: boolean
    coverTitle?: boolean
    coverSubtitle?: boolean
    coverAuthor?: boolean
    coverDate?: boolean
    coverTemplateId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastOpenedAt?: boolean
    theme?: boolean | Project$themeArgs<ExtArgs>
    coverTemplate?: boolean | Project$coverTemplateArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    filePath?: boolean
    themeId?: boolean
    hasCoverPage?: boolean
    coverTitle?: boolean
    coverSubtitle?: boolean
    coverAuthor?: boolean
    coverDate?: boolean
    coverTemplateId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastOpenedAt?: boolean
    theme?: boolean | Project$themeArgs<ExtArgs>
    coverTemplate?: boolean | Project$coverTemplateArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    filePath?: boolean
    themeId?: boolean
    hasCoverPage?: boolean
    coverTitle?: boolean
    coverSubtitle?: boolean
    coverAuthor?: boolean
    coverDate?: boolean
    coverTemplateId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastOpenedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "filePath" | "themeId" | "hasCoverPage" | "coverTitle" | "coverSubtitle" | "coverAuthor" | "coverDate" | "coverTemplateId" | "createdAt" | "updatedAt" | "lastOpenedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    theme?: boolean | Project$themeArgs<ExtArgs>
    coverTemplate?: boolean | Project$coverTemplateArgs<ExtArgs>
    coverAssets?: boolean | Project$coverAssetsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    theme?: boolean | Project$themeArgs<ExtArgs>
    coverTemplate?: boolean | Project$coverTemplateArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    theme?: boolean | Project$themeArgs<ExtArgs>
    coverTemplate?: boolean | Project$coverTemplateArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      theme: Prisma.$ThemePayload<ExtArgs> | null
      coverTemplate: Prisma.$CoverTemplatePayload<ExtArgs> | null
      coverAssets: Prisma.$ProjectCoverAssetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      filePath: string
      themeId: string | null
      hasCoverPage: boolean
      coverTitle: string | null
      coverSubtitle: string | null
      coverAuthor: string | null
      coverDate: string | null
      coverTemplateId: string | null
      createdAt: Date
      updatedAt: Date
      lastOpenedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    theme<T extends Project$themeArgs<ExtArgs> = {}>(args?: Subset<T, Project$themeArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    coverTemplate<T extends Project$coverTemplateArgs<ExtArgs> = {}>(args?: Subset<T, Project$coverTemplateArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    coverAssets<T extends Project$coverAssetsArgs<ExtArgs> = {}>(args?: Subset<T, Project$coverAssetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly filePath: FieldRef<"Project", 'String'>
    readonly themeId: FieldRef<"Project", 'String'>
    readonly hasCoverPage: FieldRef<"Project", 'Boolean'>
    readonly coverTitle: FieldRef<"Project", 'String'>
    readonly coverSubtitle: FieldRef<"Project", 'String'>
    readonly coverAuthor: FieldRef<"Project", 'String'>
    readonly coverDate: FieldRef<"Project", 'String'>
    readonly coverTemplateId: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
    readonly lastOpenedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.theme
   */
  export type Project$themeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    where?: ThemeWhereInput
  }

  /**
   * Project.coverTemplate
   */
  export type Project$coverTemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    where?: CoverTemplateWhereInput
  }

  /**
   * Project.coverAssets
   */
  export type Project$coverAssetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    where?: ProjectCoverAssetWhereInput
    orderBy?: ProjectCoverAssetOrderByWithRelationInput | ProjectCoverAssetOrderByWithRelationInput[]
    cursor?: ProjectCoverAssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectCoverAssetScalarFieldEnum | ProjectCoverAssetScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Theme
   */

  export type AggregateTheme = {
    _count: ThemeCountAggregateOutputType | null
    _avg: ThemeAvgAggregateOutputType | null
    _sum: ThemeSumAggregateOutputType | null
    _min: ThemeMinAggregateOutputType | null
    _max: ThemeMaxAggregateOutputType | null
  }

  export type ThemeAvgAggregateOutputType = {
    h1Size: number | null
    h2Size: number | null
    h3Size: number | null
    h4Size: number | null
    h5Size: number | null
    h6Size: number | null
    bodySize: number | null
    kerning: number | null
    leading: number | null
    pageWidth: number | null
    pageHeight: number | null
    marginTop: number | null
    marginBottom: number | null
    marginLeft: number | null
    marginRight: number | null
  }

  export type ThemeSumAggregateOutputType = {
    h1Size: number | null
    h2Size: number | null
    h3Size: number | null
    h4Size: number | null
    h5Size: number | null
    h6Size: number | null
    bodySize: number | null
    kerning: number | null
    leading: number | null
    pageWidth: number | null
    pageHeight: number | null
    marginTop: number | null
    marginBottom: number | null
    marginLeft: number | null
    marginRight: number | null
  }

  export type ThemeMinAggregateOutputType = {
    id: string | null
    name: string | null
    isBuiltIn: boolean | null
    headingFont: string | null
    bodyFont: string | null
    h1Size: number | null
    h2Size: number | null
    h3Size: number | null
    h4Size: number | null
    h5Size: number | null
    h6Size: number | null
    bodySize: number | null
    kerning: number | null
    leading: number | null
    pageWidth: number | null
    pageHeight: number | null
    marginTop: number | null
    marginBottom: number | null
    marginLeft: number | null
    marginRight: number | null
    backgroundColor: string | null
    textColor: string | null
    headingColor: string | null
    linkColor: string | null
    codeBackground: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ThemeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isBuiltIn: boolean | null
    headingFont: string | null
    bodyFont: string | null
    h1Size: number | null
    h2Size: number | null
    h3Size: number | null
    h4Size: number | null
    h5Size: number | null
    h6Size: number | null
    bodySize: number | null
    kerning: number | null
    leading: number | null
    pageWidth: number | null
    pageHeight: number | null
    marginTop: number | null
    marginBottom: number | null
    marginLeft: number | null
    marginRight: number | null
    backgroundColor: string | null
    textColor: string | null
    headingColor: string | null
    linkColor: string | null
    codeBackground: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ThemeCountAggregateOutputType = {
    id: number
    name: number
    isBuiltIn: number
    headingFont: number
    bodyFont: number
    h1Size: number
    h2Size: number
    h3Size: number
    h4Size: number
    h5Size: number
    h6Size: number
    bodySize: number
    kerning: number
    leading: number
    pageWidth: number
    pageHeight: number
    marginTop: number
    marginBottom: number
    marginLeft: number
    marginRight: number
    backgroundColor: number
    textColor: number
    headingColor: number
    linkColor: number
    codeBackground: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ThemeAvgAggregateInputType = {
    h1Size?: true
    h2Size?: true
    h3Size?: true
    h4Size?: true
    h5Size?: true
    h6Size?: true
    bodySize?: true
    kerning?: true
    leading?: true
    pageWidth?: true
    pageHeight?: true
    marginTop?: true
    marginBottom?: true
    marginLeft?: true
    marginRight?: true
  }

  export type ThemeSumAggregateInputType = {
    h1Size?: true
    h2Size?: true
    h3Size?: true
    h4Size?: true
    h5Size?: true
    h6Size?: true
    bodySize?: true
    kerning?: true
    leading?: true
    pageWidth?: true
    pageHeight?: true
    marginTop?: true
    marginBottom?: true
    marginLeft?: true
    marginRight?: true
  }

  export type ThemeMinAggregateInputType = {
    id?: true
    name?: true
    isBuiltIn?: true
    headingFont?: true
    bodyFont?: true
    h1Size?: true
    h2Size?: true
    h3Size?: true
    h4Size?: true
    h5Size?: true
    h6Size?: true
    bodySize?: true
    kerning?: true
    leading?: true
    pageWidth?: true
    pageHeight?: true
    marginTop?: true
    marginBottom?: true
    marginLeft?: true
    marginRight?: true
    backgroundColor?: true
    textColor?: true
    headingColor?: true
    linkColor?: true
    codeBackground?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ThemeMaxAggregateInputType = {
    id?: true
    name?: true
    isBuiltIn?: true
    headingFont?: true
    bodyFont?: true
    h1Size?: true
    h2Size?: true
    h3Size?: true
    h4Size?: true
    h5Size?: true
    h6Size?: true
    bodySize?: true
    kerning?: true
    leading?: true
    pageWidth?: true
    pageHeight?: true
    marginTop?: true
    marginBottom?: true
    marginLeft?: true
    marginRight?: true
    backgroundColor?: true
    textColor?: true
    headingColor?: true
    linkColor?: true
    codeBackground?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ThemeCountAggregateInputType = {
    id?: true
    name?: true
    isBuiltIn?: true
    headingFont?: true
    bodyFont?: true
    h1Size?: true
    h2Size?: true
    h3Size?: true
    h4Size?: true
    h5Size?: true
    h6Size?: true
    bodySize?: true
    kerning?: true
    leading?: true
    pageWidth?: true
    pageHeight?: true
    marginTop?: true
    marginBottom?: true
    marginLeft?: true
    marginRight?: true
    backgroundColor?: true
    textColor?: true
    headingColor?: true
    linkColor?: true
    codeBackground?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ThemeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Theme to aggregate.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Themes
    **/
    _count?: true | ThemeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ThemeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ThemeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ThemeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ThemeMaxAggregateInputType
  }

  export type GetThemeAggregateType<T extends ThemeAggregateArgs> = {
        [P in keyof T & keyof AggregateTheme]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTheme[P]>
      : GetScalarType<T[P], AggregateTheme[P]>
  }




  export type ThemeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThemeWhereInput
    orderBy?: ThemeOrderByWithAggregationInput | ThemeOrderByWithAggregationInput[]
    by: ThemeScalarFieldEnum[] | ThemeScalarFieldEnum
    having?: ThemeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ThemeCountAggregateInputType | true
    _avg?: ThemeAvgAggregateInputType
    _sum?: ThemeSumAggregateInputType
    _min?: ThemeMinAggregateInputType
    _max?: ThemeMaxAggregateInputType
  }

  export type ThemeGroupByOutputType = {
    id: string
    name: string
    isBuiltIn: boolean
    headingFont: string
    bodyFont: string
    h1Size: number
    h2Size: number
    h3Size: number
    h4Size: number
    h5Size: number
    h6Size: number
    bodySize: number
    kerning: number
    leading: number
    pageWidth: number
    pageHeight: number
    marginTop: number
    marginBottom: number
    marginLeft: number
    marginRight: number
    backgroundColor: string
    textColor: string
    headingColor: string
    linkColor: string
    codeBackground: string
    createdAt: Date
    updatedAt: Date
    _count: ThemeCountAggregateOutputType | null
    _avg: ThemeAvgAggregateOutputType | null
    _sum: ThemeSumAggregateOutputType | null
    _min: ThemeMinAggregateOutputType | null
    _max: ThemeMaxAggregateOutputType | null
  }

  type GetThemeGroupByPayload<T extends ThemeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ThemeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ThemeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ThemeGroupByOutputType[P]>
            : GetScalarType<T[P], ThemeGroupByOutputType[P]>
        }
      >
    >


  export type ThemeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isBuiltIn?: boolean
    headingFont?: boolean
    bodyFont?: boolean
    h1Size?: boolean
    h2Size?: boolean
    h3Size?: boolean
    h4Size?: boolean
    h5Size?: boolean
    h6Size?: boolean
    bodySize?: boolean
    kerning?: boolean
    leading?: boolean
    pageWidth?: boolean
    pageHeight?: boolean
    marginTop?: boolean
    marginBottom?: boolean
    marginLeft?: boolean
    marginRight?: boolean
    backgroundColor?: boolean
    textColor?: boolean
    headingColor?: boolean
    linkColor?: boolean
    codeBackground?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | Theme$projectsArgs<ExtArgs>
    _count?: boolean | ThemeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["theme"]>

  export type ThemeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isBuiltIn?: boolean
    headingFont?: boolean
    bodyFont?: boolean
    h1Size?: boolean
    h2Size?: boolean
    h3Size?: boolean
    h4Size?: boolean
    h5Size?: boolean
    h6Size?: boolean
    bodySize?: boolean
    kerning?: boolean
    leading?: boolean
    pageWidth?: boolean
    pageHeight?: boolean
    marginTop?: boolean
    marginBottom?: boolean
    marginLeft?: boolean
    marginRight?: boolean
    backgroundColor?: boolean
    textColor?: boolean
    headingColor?: boolean
    linkColor?: boolean
    codeBackground?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["theme"]>

  export type ThemeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isBuiltIn?: boolean
    headingFont?: boolean
    bodyFont?: boolean
    h1Size?: boolean
    h2Size?: boolean
    h3Size?: boolean
    h4Size?: boolean
    h5Size?: boolean
    h6Size?: boolean
    bodySize?: boolean
    kerning?: boolean
    leading?: boolean
    pageWidth?: boolean
    pageHeight?: boolean
    marginTop?: boolean
    marginBottom?: boolean
    marginLeft?: boolean
    marginRight?: boolean
    backgroundColor?: boolean
    textColor?: boolean
    headingColor?: boolean
    linkColor?: boolean
    codeBackground?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["theme"]>

  export type ThemeSelectScalar = {
    id?: boolean
    name?: boolean
    isBuiltIn?: boolean
    headingFont?: boolean
    bodyFont?: boolean
    h1Size?: boolean
    h2Size?: boolean
    h3Size?: boolean
    h4Size?: boolean
    h5Size?: boolean
    h6Size?: boolean
    bodySize?: boolean
    kerning?: boolean
    leading?: boolean
    pageWidth?: boolean
    pageHeight?: boolean
    marginTop?: boolean
    marginBottom?: boolean
    marginLeft?: boolean
    marginRight?: boolean
    backgroundColor?: boolean
    textColor?: boolean
    headingColor?: boolean
    linkColor?: boolean
    codeBackground?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ThemeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "isBuiltIn" | "headingFont" | "bodyFont" | "h1Size" | "h2Size" | "h3Size" | "h4Size" | "h5Size" | "h6Size" | "bodySize" | "kerning" | "leading" | "pageWidth" | "pageHeight" | "marginTop" | "marginBottom" | "marginLeft" | "marginRight" | "backgroundColor" | "textColor" | "headingColor" | "linkColor" | "codeBackground" | "createdAt" | "updatedAt", ExtArgs["result"]["theme"]>
  export type ThemeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | Theme$projectsArgs<ExtArgs>
    _count?: boolean | ThemeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ThemeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ThemeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ThemePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Theme"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isBuiltIn: boolean
      headingFont: string
      bodyFont: string
      h1Size: number
      h2Size: number
      h3Size: number
      h4Size: number
      h5Size: number
      h6Size: number
      bodySize: number
      kerning: number
      leading: number
      pageWidth: number
      pageHeight: number
      marginTop: number
      marginBottom: number
      marginLeft: number
      marginRight: number
      backgroundColor: string
      textColor: string
      headingColor: string
      linkColor: string
      codeBackground: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["theme"]>
    composites: {}
  }

  type ThemeGetPayload<S extends boolean | null | undefined | ThemeDefaultArgs> = $Result.GetResult<Prisma.$ThemePayload, S>

  type ThemeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ThemeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ThemeCountAggregateInputType | true
    }

  export interface ThemeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Theme'], meta: { name: 'Theme' } }
    /**
     * Find zero or one Theme that matches the filter.
     * @param {ThemeFindUniqueArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ThemeFindUniqueArgs>(args: SelectSubset<T, ThemeFindUniqueArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Theme that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ThemeFindUniqueOrThrowArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ThemeFindUniqueOrThrowArgs>(args: SelectSubset<T, ThemeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Theme that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindFirstArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ThemeFindFirstArgs>(args?: SelectSubset<T, ThemeFindFirstArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Theme that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindFirstOrThrowArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ThemeFindFirstOrThrowArgs>(args?: SelectSubset<T, ThemeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Themes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Themes
     * const themes = await prisma.theme.findMany()
     * 
     * // Get first 10 Themes
     * const themes = await prisma.theme.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const themeWithIdOnly = await prisma.theme.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ThemeFindManyArgs>(args?: SelectSubset<T, ThemeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Theme.
     * @param {ThemeCreateArgs} args - Arguments to create a Theme.
     * @example
     * // Create one Theme
     * const Theme = await prisma.theme.create({
     *   data: {
     *     // ... data to create a Theme
     *   }
     * })
     * 
     */
    create<T extends ThemeCreateArgs>(args: SelectSubset<T, ThemeCreateArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Themes.
     * @param {ThemeCreateManyArgs} args - Arguments to create many Themes.
     * @example
     * // Create many Themes
     * const theme = await prisma.theme.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ThemeCreateManyArgs>(args?: SelectSubset<T, ThemeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Themes and returns the data saved in the database.
     * @param {ThemeCreateManyAndReturnArgs} args - Arguments to create many Themes.
     * @example
     * // Create many Themes
     * const theme = await prisma.theme.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Themes and only return the `id`
     * const themeWithIdOnly = await prisma.theme.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ThemeCreateManyAndReturnArgs>(args?: SelectSubset<T, ThemeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Theme.
     * @param {ThemeDeleteArgs} args - Arguments to delete one Theme.
     * @example
     * // Delete one Theme
     * const Theme = await prisma.theme.delete({
     *   where: {
     *     // ... filter to delete one Theme
     *   }
     * })
     * 
     */
    delete<T extends ThemeDeleteArgs>(args: SelectSubset<T, ThemeDeleteArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Theme.
     * @param {ThemeUpdateArgs} args - Arguments to update one Theme.
     * @example
     * // Update one Theme
     * const theme = await prisma.theme.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ThemeUpdateArgs>(args: SelectSubset<T, ThemeUpdateArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Themes.
     * @param {ThemeDeleteManyArgs} args - Arguments to filter Themes to delete.
     * @example
     * // Delete a few Themes
     * const { count } = await prisma.theme.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ThemeDeleteManyArgs>(args?: SelectSubset<T, ThemeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Themes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Themes
     * const theme = await prisma.theme.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ThemeUpdateManyArgs>(args: SelectSubset<T, ThemeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Themes and returns the data updated in the database.
     * @param {ThemeUpdateManyAndReturnArgs} args - Arguments to update many Themes.
     * @example
     * // Update many Themes
     * const theme = await prisma.theme.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Themes and only return the `id`
     * const themeWithIdOnly = await prisma.theme.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ThemeUpdateManyAndReturnArgs>(args: SelectSubset<T, ThemeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Theme.
     * @param {ThemeUpsertArgs} args - Arguments to update or create a Theme.
     * @example
     * // Update or create a Theme
     * const theme = await prisma.theme.upsert({
     *   create: {
     *     // ... data to create a Theme
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Theme we want to update
     *   }
     * })
     */
    upsert<T extends ThemeUpsertArgs>(args: SelectSubset<T, ThemeUpsertArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Themes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeCountArgs} args - Arguments to filter Themes to count.
     * @example
     * // Count the number of Themes
     * const count = await prisma.theme.count({
     *   where: {
     *     // ... the filter for the Themes we want to count
     *   }
     * })
    **/
    count<T extends ThemeCountArgs>(
      args?: Subset<T, ThemeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThemeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Theme.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThemeAggregateArgs>(args: Subset<T, ThemeAggregateArgs>): Prisma.PrismaPromise<GetThemeAggregateType<T>>

    /**
     * Group by Theme.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ThemeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ThemeGroupByArgs['orderBy'] }
        : { orderBy?: ThemeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ThemeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThemeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Theme model
   */
  readonly fields: ThemeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Theme.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ThemeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends Theme$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Theme$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Theme model
   */
  interface ThemeFieldRefs {
    readonly id: FieldRef<"Theme", 'String'>
    readonly name: FieldRef<"Theme", 'String'>
    readonly isBuiltIn: FieldRef<"Theme", 'Boolean'>
    readonly headingFont: FieldRef<"Theme", 'String'>
    readonly bodyFont: FieldRef<"Theme", 'String'>
    readonly h1Size: FieldRef<"Theme", 'Float'>
    readonly h2Size: FieldRef<"Theme", 'Float'>
    readonly h3Size: FieldRef<"Theme", 'Float'>
    readonly h4Size: FieldRef<"Theme", 'Float'>
    readonly h5Size: FieldRef<"Theme", 'Float'>
    readonly h6Size: FieldRef<"Theme", 'Float'>
    readonly bodySize: FieldRef<"Theme", 'Float'>
    readonly kerning: FieldRef<"Theme", 'Float'>
    readonly leading: FieldRef<"Theme", 'Float'>
    readonly pageWidth: FieldRef<"Theme", 'Float'>
    readonly pageHeight: FieldRef<"Theme", 'Float'>
    readonly marginTop: FieldRef<"Theme", 'Float'>
    readonly marginBottom: FieldRef<"Theme", 'Float'>
    readonly marginLeft: FieldRef<"Theme", 'Float'>
    readonly marginRight: FieldRef<"Theme", 'Float'>
    readonly backgroundColor: FieldRef<"Theme", 'String'>
    readonly textColor: FieldRef<"Theme", 'String'>
    readonly headingColor: FieldRef<"Theme", 'String'>
    readonly linkColor: FieldRef<"Theme", 'String'>
    readonly codeBackground: FieldRef<"Theme", 'String'>
    readonly createdAt: FieldRef<"Theme", 'DateTime'>
    readonly updatedAt: FieldRef<"Theme", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Theme findUnique
   */
  export type ThemeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme findUniqueOrThrow
   */
  export type ThemeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme findFirst
   */
  export type ThemeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Themes.
     */
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme findFirstOrThrow
   */
  export type ThemeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Themes.
     */
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme findMany
   */
  export type ThemeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Themes to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme create
   */
  export type ThemeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The data needed to create a Theme.
     */
    data: XOR<ThemeCreateInput, ThemeUncheckedCreateInput>
  }

  /**
   * Theme createMany
   */
  export type ThemeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Themes.
     */
    data: ThemeCreateManyInput | ThemeCreateManyInput[]
  }

  /**
   * Theme createManyAndReturn
   */
  export type ThemeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * The data used to create many Themes.
     */
    data: ThemeCreateManyInput | ThemeCreateManyInput[]
  }

  /**
   * Theme update
   */
  export type ThemeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The data needed to update a Theme.
     */
    data: XOR<ThemeUpdateInput, ThemeUncheckedUpdateInput>
    /**
     * Choose, which Theme to update.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme updateMany
   */
  export type ThemeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Themes.
     */
    data: XOR<ThemeUpdateManyMutationInput, ThemeUncheckedUpdateManyInput>
    /**
     * Filter which Themes to update
     */
    where?: ThemeWhereInput
    /**
     * Limit how many Themes to update.
     */
    limit?: number
  }

  /**
   * Theme updateManyAndReturn
   */
  export type ThemeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * The data used to update Themes.
     */
    data: XOR<ThemeUpdateManyMutationInput, ThemeUncheckedUpdateManyInput>
    /**
     * Filter which Themes to update
     */
    where?: ThemeWhereInput
    /**
     * Limit how many Themes to update.
     */
    limit?: number
  }

  /**
   * Theme upsert
   */
  export type ThemeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The filter to search for the Theme to update in case it exists.
     */
    where: ThemeWhereUniqueInput
    /**
     * In case the Theme found by the `where` argument doesn't exist, create a new Theme with this data.
     */
    create: XOR<ThemeCreateInput, ThemeUncheckedCreateInput>
    /**
     * In case the Theme was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ThemeUpdateInput, ThemeUncheckedUpdateInput>
  }

  /**
   * Theme delete
   */
  export type ThemeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter which Theme to delete.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme deleteMany
   */
  export type ThemeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Themes to delete
     */
    where?: ThemeWhereInput
    /**
     * Limit how many Themes to delete.
     */
    limit?: number
  }

  /**
   * Theme.projects
   */
  export type Theme$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Theme without action
   */
  export type ThemeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Theme
     */
    omit?: ThemeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
  }


  /**
   * Model CoverTemplate
   */

  export type AggregateCoverTemplate = {
    _count: CoverTemplateCountAggregateOutputType | null
    _min: CoverTemplateMinAggregateOutputType | null
    _max: CoverTemplateMaxAggregateOutputType | null
  }

  export type CoverTemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    isBuiltIn: boolean | null
    layoutJson: string | null
    hasLogoSlot: boolean | null
    hasBackgroundSlot: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CoverTemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isBuiltIn: boolean | null
    layoutJson: string | null
    hasLogoSlot: boolean | null
    hasBackgroundSlot: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CoverTemplateCountAggregateOutputType = {
    id: number
    name: number
    isBuiltIn: number
    layoutJson: number
    hasLogoSlot: number
    hasBackgroundSlot: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CoverTemplateMinAggregateInputType = {
    id?: true
    name?: true
    isBuiltIn?: true
    layoutJson?: true
    hasLogoSlot?: true
    hasBackgroundSlot?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CoverTemplateMaxAggregateInputType = {
    id?: true
    name?: true
    isBuiltIn?: true
    layoutJson?: true
    hasLogoSlot?: true
    hasBackgroundSlot?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CoverTemplateCountAggregateInputType = {
    id?: true
    name?: true
    isBuiltIn?: true
    layoutJson?: true
    hasLogoSlot?: true
    hasBackgroundSlot?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CoverTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CoverTemplate to aggregate.
     */
    where?: CoverTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CoverTemplates to fetch.
     */
    orderBy?: CoverTemplateOrderByWithRelationInput | CoverTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CoverTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CoverTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CoverTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CoverTemplates
    **/
    _count?: true | CoverTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CoverTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CoverTemplateMaxAggregateInputType
  }

  export type GetCoverTemplateAggregateType<T extends CoverTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateCoverTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCoverTemplate[P]>
      : GetScalarType<T[P], AggregateCoverTemplate[P]>
  }




  export type CoverTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CoverTemplateWhereInput
    orderBy?: CoverTemplateOrderByWithAggregationInput | CoverTemplateOrderByWithAggregationInput[]
    by: CoverTemplateScalarFieldEnum[] | CoverTemplateScalarFieldEnum
    having?: CoverTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CoverTemplateCountAggregateInputType | true
    _min?: CoverTemplateMinAggregateInputType
    _max?: CoverTemplateMaxAggregateInputType
  }

  export type CoverTemplateGroupByOutputType = {
    id: string
    name: string
    isBuiltIn: boolean
    layoutJson: string
    hasLogoSlot: boolean
    hasBackgroundSlot: boolean
    createdAt: Date
    updatedAt: Date
    _count: CoverTemplateCountAggregateOutputType | null
    _min: CoverTemplateMinAggregateOutputType | null
    _max: CoverTemplateMaxAggregateOutputType | null
  }

  type GetCoverTemplateGroupByPayload<T extends CoverTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CoverTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CoverTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CoverTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], CoverTemplateGroupByOutputType[P]>
        }
      >
    >


  export type CoverTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isBuiltIn?: boolean
    layoutJson?: boolean
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | CoverTemplate$projectsArgs<ExtArgs>
    _count?: boolean | CoverTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coverTemplate"]>

  export type CoverTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isBuiltIn?: boolean
    layoutJson?: boolean
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["coverTemplate"]>

  export type CoverTemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isBuiltIn?: boolean
    layoutJson?: boolean
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["coverTemplate"]>

  export type CoverTemplateSelectScalar = {
    id?: boolean
    name?: boolean
    isBuiltIn?: boolean
    layoutJson?: boolean
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CoverTemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "isBuiltIn" | "layoutJson" | "hasLogoSlot" | "hasBackgroundSlot" | "createdAt" | "updatedAt", ExtArgs["result"]["coverTemplate"]>
  export type CoverTemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | CoverTemplate$projectsArgs<ExtArgs>
    _count?: boolean | CoverTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CoverTemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CoverTemplateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CoverTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CoverTemplate"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isBuiltIn: boolean
      layoutJson: string
      hasLogoSlot: boolean
      hasBackgroundSlot: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["coverTemplate"]>
    composites: {}
  }

  type CoverTemplateGetPayload<S extends boolean | null | undefined | CoverTemplateDefaultArgs> = $Result.GetResult<Prisma.$CoverTemplatePayload, S>

  type CoverTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CoverTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CoverTemplateCountAggregateInputType | true
    }

  export interface CoverTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CoverTemplate'], meta: { name: 'CoverTemplate' } }
    /**
     * Find zero or one CoverTemplate that matches the filter.
     * @param {CoverTemplateFindUniqueArgs} args - Arguments to find a CoverTemplate
     * @example
     * // Get one CoverTemplate
     * const coverTemplate = await prisma.coverTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CoverTemplateFindUniqueArgs>(args: SelectSubset<T, CoverTemplateFindUniqueArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CoverTemplate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CoverTemplateFindUniqueOrThrowArgs} args - Arguments to find a CoverTemplate
     * @example
     * // Get one CoverTemplate
     * const coverTemplate = await prisma.coverTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CoverTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, CoverTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CoverTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoverTemplateFindFirstArgs} args - Arguments to find a CoverTemplate
     * @example
     * // Get one CoverTemplate
     * const coverTemplate = await prisma.coverTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CoverTemplateFindFirstArgs>(args?: SelectSubset<T, CoverTemplateFindFirstArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CoverTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoverTemplateFindFirstOrThrowArgs} args - Arguments to find a CoverTemplate
     * @example
     * // Get one CoverTemplate
     * const coverTemplate = await prisma.coverTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CoverTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, CoverTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CoverTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoverTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CoverTemplates
     * const coverTemplates = await prisma.coverTemplate.findMany()
     * 
     * // Get first 10 CoverTemplates
     * const coverTemplates = await prisma.coverTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const coverTemplateWithIdOnly = await prisma.coverTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CoverTemplateFindManyArgs>(args?: SelectSubset<T, CoverTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CoverTemplate.
     * @param {CoverTemplateCreateArgs} args - Arguments to create a CoverTemplate.
     * @example
     * // Create one CoverTemplate
     * const CoverTemplate = await prisma.coverTemplate.create({
     *   data: {
     *     // ... data to create a CoverTemplate
     *   }
     * })
     * 
     */
    create<T extends CoverTemplateCreateArgs>(args: SelectSubset<T, CoverTemplateCreateArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CoverTemplates.
     * @param {CoverTemplateCreateManyArgs} args - Arguments to create many CoverTemplates.
     * @example
     * // Create many CoverTemplates
     * const coverTemplate = await prisma.coverTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CoverTemplateCreateManyArgs>(args?: SelectSubset<T, CoverTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CoverTemplates and returns the data saved in the database.
     * @param {CoverTemplateCreateManyAndReturnArgs} args - Arguments to create many CoverTemplates.
     * @example
     * // Create many CoverTemplates
     * const coverTemplate = await prisma.coverTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CoverTemplates and only return the `id`
     * const coverTemplateWithIdOnly = await prisma.coverTemplate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CoverTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, CoverTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CoverTemplate.
     * @param {CoverTemplateDeleteArgs} args - Arguments to delete one CoverTemplate.
     * @example
     * // Delete one CoverTemplate
     * const CoverTemplate = await prisma.coverTemplate.delete({
     *   where: {
     *     // ... filter to delete one CoverTemplate
     *   }
     * })
     * 
     */
    delete<T extends CoverTemplateDeleteArgs>(args: SelectSubset<T, CoverTemplateDeleteArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CoverTemplate.
     * @param {CoverTemplateUpdateArgs} args - Arguments to update one CoverTemplate.
     * @example
     * // Update one CoverTemplate
     * const coverTemplate = await prisma.coverTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CoverTemplateUpdateArgs>(args: SelectSubset<T, CoverTemplateUpdateArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CoverTemplates.
     * @param {CoverTemplateDeleteManyArgs} args - Arguments to filter CoverTemplates to delete.
     * @example
     * // Delete a few CoverTemplates
     * const { count } = await prisma.coverTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CoverTemplateDeleteManyArgs>(args?: SelectSubset<T, CoverTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CoverTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoverTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CoverTemplates
     * const coverTemplate = await prisma.coverTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CoverTemplateUpdateManyArgs>(args: SelectSubset<T, CoverTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CoverTemplates and returns the data updated in the database.
     * @param {CoverTemplateUpdateManyAndReturnArgs} args - Arguments to update many CoverTemplates.
     * @example
     * // Update many CoverTemplates
     * const coverTemplate = await prisma.coverTemplate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CoverTemplates and only return the `id`
     * const coverTemplateWithIdOnly = await prisma.coverTemplate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CoverTemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, CoverTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CoverTemplate.
     * @param {CoverTemplateUpsertArgs} args - Arguments to update or create a CoverTemplate.
     * @example
     * // Update or create a CoverTemplate
     * const coverTemplate = await prisma.coverTemplate.upsert({
     *   create: {
     *     // ... data to create a CoverTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CoverTemplate we want to update
     *   }
     * })
     */
    upsert<T extends CoverTemplateUpsertArgs>(args: SelectSubset<T, CoverTemplateUpsertArgs<ExtArgs>>): Prisma__CoverTemplateClient<$Result.GetResult<Prisma.$CoverTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CoverTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoverTemplateCountArgs} args - Arguments to filter CoverTemplates to count.
     * @example
     * // Count the number of CoverTemplates
     * const count = await prisma.coverTemplate.count({
     *   where: {
     *     // ... the filter for the CoverTemplates we want to count
     *   }
     * })
    **/
    count<T extends CoverTemplateCountArgs>(
      args?: Subset<T, CoverTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CoverTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CoverTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoverTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CoverTemplateAggregateArgs>(args: Subset<T, CoverTemplateAggregateArgs>): Prisma.PrismaPromise<GetCoverTemplateAggregateType<T>>

    /**
     * Group by CoverTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoverTemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CoverTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CoverTemplateGroupByArgs['orderBy'] }
        : { orderBy?: CoverTemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CoverTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCoverTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CoverTemplate model
   */
  readonly fields: CoverTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CoverTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CoverTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends CoverTemplate$projectsArgs<ExtArgs> = {}>(args?: Subset<T, CoverTemplate$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CoverTemplate model
   */
  interface CoverTemplateFieldRefs {
    readonly id: FieldRef<"CoverTemplate", 'String'>
    readonly name: FieldRef<"CoverTemplate", 'String'>
    readonly isBuiltIn: FieldRef<"CoverTemplate", 'Boolean'>
    readonly layoutJson: FieldRef<"CoverTemplate", 'String'>
    readonly hasLogoSlot: FieldRef<"CoverTemplate", 'Boolean'>
    readonly hasBackgroundSlot: FieldRef<"CoverTemplate", 'Boolean'>
    readonly createdAt: FieldRef<"CoverTemplate", 'DateTime'>
    readonly updatedAt: FieldRef<"CoverTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CoverTemplate findUnique
   */
  export type CoverTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CoverTemplate to fetch.
     */
    where: CoverTemplateWhereUniqueInput
  }

  /**
   * CoverTemplate findUniqueOrThrow
   */
  export type CoverTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CoverTemplate to fetch.
     */
    where: CoverTemplateWhereUniqueInput
  }

  /**
   * CoverTemplate findFirst
   */
  export type CoverTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CoverTemplate to fetch.
     */
    where?: CoverTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CoverTemplates to fetch.
     */
    orderBy?: CoverTemplateOrderByWithRelationInput | CoverTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CoverTemplates.
     */
    cursor?: CoverTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CoverTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CoverTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CoverTemplates.
     */
    distinct?: CoverTemplateScalarFieldEnum | CoverTemplateScalarFieldEnum[]
  }

  /**
   * CoverTemplate findFirstOrThrow
   */
  export type CoverTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CoverTemplate to fetch.
     */
    where?: CoverTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CoverTemplates to fetch.
     */
    orderBy?: CoverTemplateOrderByWithRelationInput | CoverTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CoverTemplates.
     */
    cursor?: CoverTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CoverTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CoverTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CoverTemplates.
     */
    distinct?: CoverTemplateScalarFieldEnum | CoverTemplateScalarFieldEnum[]
  }

  /**
   * CoverTemplate findMany
   */
  export type CoverTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CoverTemplates to fetch.
     */
    where?: CoverTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CoverTemplates to fetch.
     */
    orderBy?: CoverTemplateOrderByWithRelationInput | CoverTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CoverTemplates.
     */
    cursor?: CoverTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CoverTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CoverTemplates.
     */
    skip?: number
    distinct?: CoverTemplateScalarFieldEnum | CoverTemplateScalarFieldEnum[]
  }

  /**
   * CoverTemplate create
   */
  export type CoverTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a CoverTemplate.
     */
    data: XOR<CoverTemplateCreateInput, CoverTemplateUncheckedCreateInput>
  }

  /**
   * CoverTemplate createMany
   */
  export type CoverTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CoverTemplates.
     */
    data: CoverTemplateCreateManyInput | CoverTemplateCreateManyInput[]
  }

  /**
   * CoverTemplate createManyAndReturn
   */
  export type CoverTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * The data used to create many CoverTemplates.
     */
    data: CoverTemplateCreateManyInput | CoverTemplateCreateManyInput[]
  }

  /**
   * CoverTemplate update
   */
  export type CoverTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a CoverTemplate.
     */
    data: XOR<CoverTemplateUpdateInput, CoverTemplateUncheckedUpdateInput>
    /**
     * Choose, which CoverTemplate to update.
     */
    where: CoverTemplateWhereUniqueInput
  }

  /**
   * CoverTemplate updateMany
   */
  export type CoverTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CoverTemplates.
     */
    data: XOR<CoverTemplateUpdateManyMutationInput, CoverTemplateUncheckedUpdateManyInput>
    /**
     * Filter which CoverTemplates to update
     */
    where?: CoverTemplateWhereInput
    /**
     * Limit how many CoverTemplates to update.
     */
    limit?: number
  }

  /**
   * CoverTemplate updateManyAndReturn
   */
  export type CoverTemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * The data used to update CoverTemplates.
     */
    data: XOR<CoverTemplateUpdateManyMutationInput, CoverTemplateUncheckedUpdateManyInput>
    /**
     * Filter which CoverTemplates to update
     */
    where?: CoverTemplateWhereInput
    /**
     * Limit how many CoverTemplates to update.
     */
    limit?: number
  }

  /**
   * CoverTemplate upsert
   */
  export type CoverTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the CoverTemplate to update in case it exists.
     */
    where: CoverTemplateWhereUniqueInput
    /**
     * In case the CoverTemplate found by the `where` argument doesn't exist, create a new CoverTemplate with this data.
     */
    create: XOR<CoverTemplateCreateInput, CoverTemplateUncheckedCreateInput>
    /**
     * In case the CoverTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CoverTemplateUpdateInput, CoverTemplateUncheckedUpdateInput>
  }

  /**
   * CoverTemplate delete
   */
  export type CoverTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
    /**
     * Filter which CoverTemplate to delete.
     */
    where: CoverTemplateWhereUniqueInput
  }

  /**
   * CoverTemplate deleteMany
   */
  export type CoverTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CoverTemplates to delete
     */
    where?: CoverTemplateWhereInput
    /**
     * Limit how many CoverTemplates to delete.
     */
    limit?: number
  }

  /**
   * CoverTemplate.projects
   */
  export type CoverTemplate$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * CoverTemplate without action
   */
  export type CoverTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoverTemplate
     */
    select?: CoverTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CoverTemplate
     */
    omit?: CoverTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CoverTemplateInclude<ExtArgs> | null
  }


  /**
   * Model ProjectCoverAsset
   */

  export type AggregateProjectCoverAsset = {
    _count: ProjectCoverAssetCountAggregateOutputType | null
    _avg: ProjectCoverAssetAvgAggregateOutputType | null
    _sum: ProjectCoverAssetSumAggregateOutputType | null
    _min: ProjectCoverAssetMinAggregateOutputType | null
    _max: ProjectCoverAssetMaxAggregateOutputType | null
  }

  export type ProjectCoverAssetAvgAggregateOutputType = {
    fileSize: number | null
    width: number | null
    height: number | null
  }

  export type ProjectCoverAssetSumAggregateOutputType = {
    fileSize: number | null
    width: number | null
    height: number | null
  }

  export type ProjectCoverAssetMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    assetType: string | null
    originalFileName: string | null
    filePath: string | null
    fileSize: number | null
    mimeType: string | null
    width: number | null
    height: number | null
    createdAt: Date | null
  }

  export type ProjectCoverAssetMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    assetType: string | null
    originalFileName: string | null
    filePath: string | null
    fileSize: number | null
    mimeType: string | null
    width: number | null
    height: number | null
    createdAt: Date | null
  }

  export type ProjectCoverAssetCountAggregateOutputType = {
    id: number
    projectId: number
    assetType: number
    originalFileName: number
    filePath: number
    fileSize: number
    mimeType: number
    width: number
    height: number
    createdAt: number
    _all: number
  }


  export type ProjectCoverAssetAvgAggregateInputType = {
    fileSize?: true
    width?: true
    height?: true
  }

  export type ProjectCoverAssetSumAggregateInputType = {
    fileSize?: true
    width?: true
    height?: true
  }

  export type ProjectCoverAssetMinAggregateInputType = {
    id?: true
    projectId?: true
    assetType?: true
    originalFileName?: true
    filePath?: true
    fileSize?: true
    mimeType?: true
    width?: true
    height?: true
    createdAt?: true
  }

  export type ProjectCoverAssetMaxAggregateInputType = {
    id?: true
    projectId?: true
    assetType?: true
    originalFileName?: true
    filePath?: true
    fileSize?: true
    mimeType?: true
    width?: true
    height?: true
    createdAt?: true
  }

  export type ProjectCoverAssetCountAggregateInputType = {
    id?: true
    projectId?: true
    assetType?: true
    originalFileName?: true
    filePath?: true
    fileSize?: true
    mimeType?: true
    width?: true
    height?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectCoverAssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectCoverAsset to aggregate.
     */
    where?: ProjectCoverAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectCoverAssets to fetch.
     */
    orderBy?: ProjectCoverAssetOrderByWithRelationInput | ProjectCoverAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectCoverAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectCoverAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectCoverAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectCoverAssets
    **/
    _count?: true | ProjectCoverAssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectCoverAssetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectCoverAssetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectCoverAssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectCoverAssetMaxAggregateInputType
  }

  export type GetProjectCoverAssetAggregateType<T extends ProjectCoverAssetAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectCoverAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectCoverAsset[P]>
      : GetScalarType<T[P], AggregateProjectCoverAsset[P]>
  }




  export type ProjectCoverAssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectCoverAssetWhereInput
    orderBy?: ProjectCoverAssetOrderByWithAggregationInput | ProjectCoverAssetOrderByWithAggregationInput[]
    by: ProjectCoverAssetScalarFieldEnum[] | ProjectCoverAssetScalarFieldEnum
    having?: ProjectCoverAssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCoverAssetCountAggregateInputType | true
    _avg?: ProjectCoverAssetAvgAggregateInputType
    _sum?: ProjectCoverAssetSumAggregateInputType
    _min?: ProjectCoverAssetMinAggregateInputType
    _max?: ProjectCoverAssetMaxAggregateInputType
  }

  export type ProjectCoverAssetGroupByOutputType = {
    id: string
    projectId: string
    assetType: string
    originalFileName: string
    filePath: string
    fileSize: number
    mimeType: string
    width: number | null
    height: number | null
    createdAt: Date
    _count: ProjectCoverAssetCountAggregateOutputType | null
    _avg: ProjectCoverAssetAvgAggregateOutputType | null
    _sum: ProjectCoverAssetSumAggregateOutputType | null
    _min: ProjectCoverAssetMinAggregateOutputType | null
    _max: ProjectCoverAssetMaxAggregateOutputType | null
  }

  type GetProjectCoverAssetGroupByPayload<T extends ProjectCoverAssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectCoverAssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectCoverAssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectCoverAssetGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectCoverAssetGroupByOutputType[P]>
        }
      >
    >


  export type ProjectCoverAssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    assetType?: boolean
    originalFileName?: boolean
    filePath?: boolean
    fileSize?: boolean
    mimeType?: boolean
    width?: boolean
    height?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectCoverAsset"]>

  export type ProjectCoverAssetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    assetType?: boolean
    originalFileName?: boolean
    filePath?: boolean
    fileSize?: boolean
    mimeType?: boolean
    width?: boolean
    height?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectCoverAsset"]>

  export type ProjectCoverAssetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    assetType?: boolean
    originalFileName?: boolean
    filePath?: boolean
    fileSize?: boolean
    mimeType?: boolean
    width?: boolean
    height?: boolean
    createdAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectCoverAsset"]>

  export type ProjectCoverAssetSelectScalar = {
    id?: boolean
    projectId?: boolean
    assetType?: boolean
    originalFileName?: boolean
    filePath?: boolean
    fileSize?: boolean
    mimeType?: boolean
    width?: boolean
    height?: boolean
    createdAt?: boolean
  }

  export type ProjectCoverAssetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "assetType" | "originalFileName" | "filePath" | "fileSize" | "mimeType" | "width" | "height" | "createdAt", ExtArgs["result"]["projectCoverAsset"]>
  export type ProjectCoverAssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectCoverAssetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectCoverAssetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectCoverAssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectCoverAsset"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      assetType: string
      originalFileName: string
      filePath: string
      fileSize: number
      mimeType: string
      width: number | null
      height: number | null
      createdAt: Date
    }, ExtArgs["result"]["projectCoverAsset"]>
    composites: {}
  }

  type ProjectCoverAssetGetPayload<S extends boolean | null | undefined | ProjectCoverAssetDefaultArgs> = $Result.GetResult<Prisma.$ProjectCoverAssetPayload, S>

  type ProjectCoverAssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectCoverAssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCoverAssetCountAggregateInputType | true
    }

  export interface ProjectCoverAssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectCoverAsset'], meta: { name: 'ProjectCoverAsset' } }
    /**
     * Find zero or one ProjectCoverAsset that matches the filter.
     * @param {ProjectCoverAssetFindUniqueArgs} args - Arguments to find a ProjectCoverAsset
     * @example
     * // Get one ProjectCoverAsset
     * const projectCoverAsset = await prisma.projectCoverAsset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectCoverAssetFindUniqueArgs>(args: SelectSubset<T, ProjectCoverAssetFindUniqueArgs<ExtArgs>>): Prisma__ProjectCoverAssetClient<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectCoverAsset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectCoverAssetFindUniqueOrThrowArgs} args - Arguments to find a ProjectCoverAsset
     * @example
     * // Get one ProjectCoverAsset
     * const projectCoverAsset = await prisma.projectCoverAsset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectCoverAssetFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectCoverAssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectCoverAssetClient<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectCoverAsset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCoverAssetFindFirstArgs} args - Arguments to find a ProjectCoverAsset
     * @example
     * // Get one ProjectCoverAsset
     * const projectCoverAsset = await prisma.projectCoverAsset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectCoverAssetFindFirstArgs>(args?: SelectSubset<T, ProjectCoverAssetFindFirstArgs<ExtArgs>>): Prisma__ProjectCoverAssetClient<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectCoverAsset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCoverAssetFindFirstOrThrowArgs} args - Arguments to find a ProjectCoverAsset
     * @example
     * // Get one ProjectCoverAsset
     * const projectCoverAsset = await prisma.projectCoverAsset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectCoverAssetFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectCoverAssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectCoverAssetClient<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectCoverAssets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCoverAssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectCoverAssets
     * const projectCoverAssets = await prisma.projectCoverAsset.findMany()
     * 
     * // Get first 10 ProjectCoverAssets
     * const projectCoverAssets = await prisma.projectCoverAsset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectCoverAssetWithIdOnly = await prisma.projectCoverAsset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectCoverAssetFindManyArgs>(args?: SelectSubset<T, ProjectCoverAssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectCoverAsset.
     * @param {ProjectCoverAssetCreateArgs} args - Arguments to create a ProjectCoverAsset.
     * @example
     * // Create one ProjectCoverAsset
     * const ProjectCoverAsset = await prisma.projectCoverAsset.create({
     *   data: {
     *     // ... data to create a ProjectCoverAsset
     *   }
     * })
     * 
     */
    create<T extends ProjectCoverAssetCreateArgs>(args: SelectSubset<T, ProjectCoverAssetCreateArgs<ExtArgs>>): Prisma__ProjectCoverAssetClient<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectCoverAssets.
     * @param {ProjectCoverAssetCreateManyArgs} args - Arguments to create many ProjectCoverAssets.
     * @example
     * // Create many ProjectCoverAssets
     * const projectCoverAsset = await prisma.projectCoverAsset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCoverAssetCreateManyArgs>(args?: SelectSubset<T, ProjectCoverAssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectCoverAssets and returns the data saved in the database.
     * @param {ProjectCoverAssetCreateManyAndReturnArgs} args - Arguments to create many ProjectCoverAssets.
     * @example
     * // Create many ProjectCoverAssets
     * const projectCoverAsset = await prisma.projectCoverAsset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectCoverAssets and only return the `id`
     * const projectCoverAssetWithIdOnly = await prisma.projectCoverAsset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCoverAssetCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCoverAssetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectCoverAsset.
     * @param {ProjectCoverAssetDeleteArgs} args - Arguments to delete one ProjectCoverAsset.
     * @example
     * // Delete one ProjectCoverAsset
     * const ProjectCoverAsset = await prisma.projectCoverAsset.delete({
     *   where: {
     *     // ... filter to delete one ProjectCoverAsset
     *   }
     * })
     * 
     */
    delete<T extends ProjectCoverAssetDeleteArgs>(args: SelectSubset<T, ProjectCoverAssetDeleteArgs<ExtArgs>>): Prisma__ProjectCoverAssetClient<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectCoverAsset.
     * @param {ProjectCoverAssetUpdateArgs} args - Arguments to update one ProjectCoverAsset.
     * @example
     * // Update one ProjectCoverAsset
     * const projectCoverAsset = await prisma.projectCoverAsset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectCoverAssetUpdateArgs>(args: SelectSubset<T, ProjectCoverAssetUpdateArgs<ExtArgs>>): Prisma__ProjectCoverAssetClient<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectCoverAssets.
     * @param {ProjectCoverAssetDeleteManyArgs} args - Arguments to filter ProjectCoverAssets to delete.
     * @example
     * // Delete a few ProjectCoverAssets
     * const { count } = await prisma.projectCoverAsset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectCoverAssetDeleteManyArgs>(args?: SelectSubset<T, ProjectCoverAssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectCoverAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCoverAssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectCoverAssets
     * const projectCoverAsset = await prisma.projectCoverAsset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectCoverAssetUpdateManyArgs>(args: SelectSubset<T, ProjectCoverAssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectCoverAssets and returns the data updated in the database.
     * @param {ProjectCoverAssetUpdateManyAndReturnArgs} args - Arguments to update many ProjectCoverAssets.
     * @example
     * // Update many ProjectCoverAssets
     * const projectCoverAsset = await prisma.projectCoverAsset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectCoverAssets and only return the `id`
     * const projectCoverAssetWithIdOnly = await prisma.projectCoverAsset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectCoverAssetUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectCoverAssetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectCoverAsset.
     * @param {ProjectCoverAssetUpsertArgs} args - Arguments to update or create a ProjectCoverAsset.
     * @example
     * // Update or create a ProjectCoverAsset
     * const projectCoverAsset = await prisma.projectCoverAsset.upsert({
     *   create: {
     *     // ... data to create a ProjectCoverAsset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectCoverAsset we want to update
     *   }
     * })
     */
    upsert<T extends ProjectCoverAssetUpsertArgs>(args: SelectSubset<T, ProjectCoverAssetUpsertArgs<ExtArgs>>): Prisma__ProjectCoverAssetClient<$Result.GetResult<Prisma.$ProjectCoverAssetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectCoverAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCoverAssetCountArgs} args - Arguments to filter ProjectCoverAssets to count.
     * @example
     * // Count the number of ProjectCoverAssets
     * const count = await prisma.projectCoverAsset.count({
     *   where: {
     *     // ... the filter for the ProjectCoverAssets we want to count
     *   }
     * })
    **/
    count<T extends ProjectCoverAssetCountArgs>(
      args?: Subset<T, ProjectCoverAssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCoverAssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectCoverAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCoverAssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectCoverAssetAggregateArgs>(args: Subset<T, ProjectCoverAssetAggregateArgs>): Prisma.PrismaPromise<GetProjectCoverAssetAggregateType<T>>

    /**
     * Group by ProjectCoverAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCoverAssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectCoverAssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectCoverAssetGroupByArgs['orderBy'] }
        : { orderBy?: ProjectCoverAssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectCoverAssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectCoverAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectCoverAsset model
   */
  readonly fields: ProjectCoverAssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectCoverAsset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectCoverAssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectCoverAsset model
   */
  interface ProjectCoverAssetFieldRefs {
    readonly id: FieldRef<"ProjectCoverAsset", 'String'>
    readonly projectId: FieldRef<"ProjectCoverAsset", 'String'>
    readonly assetType: FieldRef<"ProjectCoverAsset", 'String'>
    readonly originalFileName: FieldRef<"ProjectCoverAsset", 'String'>
    readonly filePath: FieldRef<"ProjectCoverAsset", 'String'>
    readonly fileSize: FieldRef<"ProjectCoverAsset", 'Int'>
    readonly mimeType: FieldRef<"ProjectCoverAsset", 'String'>
    readonly width: FieldRef<"ProjectCoverAsset", 'Int'>
    readonly height: FieldRef<"ProjectCoverAsset", 'Int'>
    readonly createdAt: FieldRef<"ProjectCoverAsset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectCoverAsset findUnique
   */
  export type ProjectCoverAssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * Filter, which ProjectCoverAsset to fetch.
     */
    where: ProjectCoverAssetWhereUniqueInput
  }

  /**
   * ProjectCoverAsset findUniqueOrThrow
   */
  export type ProjectCoverAssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * Filter, which ProjectCoverAsset to fetch.
     */
    where: ProjectCoverAssetWhereUniqueInput
  }

  /**
   * ProjectCoverAsset findFirst
   */
  export type ProjectCoverAssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * Filter, which ProjectCoverAsset to fetch.
     */
    where?: ProjectCoverAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectCoverAssets to fetch.
     */
    orderBy?: ProjectCoverAssetOrderByWithRelationInput | ProjectCoverAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectCoverAssets.
     */
    cursor?: ProjectCoverAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectCoverAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectCoverAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectCoverAssets.
     */
    distinct?: ProjectCoverAssetScalarFieldEnum | ProjectCoverAssetScalarFieldEnum[]
  }

  /**
   * ProjectCoverAsset findFirstOrThrow
   */
  export type ProjectCoverAssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * Filter, which ProjectCoverAsset to fetch.
     */
    where?: ProjectCoverAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectCoverAssets to fetch.
     */
    orderBy?: ProjectCoverAssetOrderByWithRelationInput | ProjectCoverAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectCoverAssets.
     */
    cursor?: ProjectCoverAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectCoverAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectCoverAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectCoverAssets.
     */
    distinct?: ProjectCoverAssetScalarFieldEnum | ProjectCoverAssetScalarFieldEnum[]
  }

  /**
   * ProjectCoverAsset findMany
   */
  export type ProjectCoverAssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * Filter, which ProjectCoverAssets to fetch.
     */
    where?: ProjectCoverAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectCoverAssets to fetch.
     */
    orderBy?: ProjectCoverAssetOrderByWithRelationInput | ProjectCoverAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectCoverAssets.
     */
    cursor?: ProjectCoverAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectCoverAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectCoverAssets.
     */
    skip?: number
    distinct?: ProjectCoverAssetScalarFieldEnum | ProjectCoverAssetScalarFieldEnum[]
  }

  /**
   * ProjectCoverAsset create
   */
  export type ProjectCoverAssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectCoverAsset.
     */
    data: XOR<ProjectCoverAssetCreateInput, ProjectCoverAssetUncheckedCreateInput>
  }

  /**
   * ProjectCoverAsset createMany
   */
  export type ProjectCoverAssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectCoverAssets.
     */
    data: ProjectCoverAssetCreateManyInput | ProjectCoverAssetCreateManyInput[]
  }

  /**
   * ProjectCoverAsset createManyAndReturn
   */
  export type ProjectCoverAssetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectCoverAssets.
     */
    data: ProjectCoverAssetCreateManyInput | ProjectCoverAssetCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectCoverAsset update
   */
  export type ProjectCoverAssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectCoverAsset.
     */
    data: XOR<ProjectCoverAssetUpdateInput, ProjectCoverAssetUncheckedUpdateInput>
    /**
     * Choose, which ProjectCoverAsset to update.
     */
    where: ProjectCoverAssetWhereUniqueInput
  }

  /**
   * ProjectCoverAsset updateMany
   */
  export type ProjectCoverAssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectCoverAssets.
     */
    data: XOR<ProjectCoverAssetUpdateManyMutationInput, ProjectCoverAssetUncheckedUpdateManyInput>
    /**
     * Filter which ProjectCoverAssets to update
     */
    where?: ProjectCoverAssetWhereInput
    /**
     * Limit how many ProjectCoverAssets to update.
     */
    limit?: number
  }

  /**
   * ProjectCoverAsset updateManyAndReturn
   */
  export type ProjectCoverAssetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * The data used to update ProjectCoverAssets.
     */
    data: XOR<ProjectCoverAssetUpdateManyMutationInput, ProjectCoverAssetUncheckedUpdateManyInput>
    /**
     * Filter which ProjectCoverAssets to update
     */
    where?: ProjectCoverAssetWhereInput
    /**
     * Limit how many ProjectCoverAssets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectCoverAsset upsert
   */
  export type ProjectCoverAssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectCoverAsset to update in case it exists.
     */
    where: ProjectCoverAssetWhereUniqueInput
    /**
     * In case the ProjectCoverAsset found by the `where` argument doesn't exist, create a new ProjectCoverAsset with this data.
     */
    create: XOR<ProjectCoverAssetCreateInput, ProjectCoverAssetUncheckedCreateInput>
    /**
     * In case the ProjectCoverAsset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectCoverAssetUpdateInput, ProjectCoverAssetUncheckedUpdateInput>
  }

  /**
   * ProjectCoverAsset delete
   */
  export type ProjectCoverAssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
    /**
     * Filter which ProjectCoverAsset to delete.
     */
    where: ProjectCoverAssetWhereUniqueInput
  }

  /**
   * ProjectCoverAsset deleteMany
   */
  export type ProjectCoverAssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectCoverAssets to delete
     */
    where?: ProjectCoverAssetWhereInput
    /**
     * Limit how many ProjectCoverAssets to delete.
     */
    limit?: number
  }

  /**
   * ProjectCoverAsset without action
   */
  export type ProjectCoverAssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCoverAsset
     */
    select?: ProjectCoverAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectCoverAsset
     */
    omit?: ProjectCoverAssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectCoverAssetInclude<ExtArgs> | null
  }


  /**
   * Model RecentProject
   */

  export type AggregateRecentProject = {
    _count: RecentProjectCountAggregateOutputType | null
    _avg: RecentProjectAvgAggregateOutputType | null
    _sum: RecentProjectSumAggregateOutputType | null
    _min: RecentProjectMinAggregateOutputType | null
    _max: RecentProjectMaxAggregateOutputType | null
  }

  export type RecentProjectAvgAggregateOutputType = {
    position: number | null
  }

  export type RecentProjectSumAggregateOutputType = {
    position: number | null
  }

  export type RecentProjectMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    position: number | null
    accessedAt: Date | null
  }

  export type RecentProjectMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    position: number | null
    accessedAt: Date | null
  }

  export type RecentProjectCountAggregateOutputType = {
    id: number
    projectId: number
    position: number
    accessedAt: number
    _all: number
  }


  export type RecentProjectAvgAggregateInputType = {
    position?: true
  }

  export type RecentProjectSumAggregateInputType = {
    position?: true
  }

  export type RecentProjectMinAggregateInputType = {
    id?: true
    projectId?: true
    position?: true
    accessedAt?: true
  }

  export type RecentProjectMaxAggregateInputType = {
    id?: true
    projectId?: true
    position?: true
    accessedAt?: true
  }

  export type RecentProjectCountAggregateInputType = {
    id?: true
    projectId?: true
    position?: true
    accessedAt?: true
    _all?: true
  }

  export type RecentProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecentProject to aggregate.
     */
    where?: RecentProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentProjects to fetch.
     */
    orderBy?: RecentProjectOrderByWithRelationInput | RecentProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecentProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RecentProjects
    **/
    _count?: true | RecentProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecentProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecentProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecentProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecentProjectMaxAggregateInputType
  }

  export type GetRecentProjectAggregateType<T extends RecentProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateRecentProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecentProject[P]>
      : GetScalarType<T[P], AggregateRecentProject[P]>
  }




  export type RecentProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecentProjectWhereInput
    orderBy?: RecentProjectOrderByWithAggregationInput | RecentProjectOrderByWithAggregationInput[]
    by: RecentProjectScalarFieldEnum[] | RecentProjectScalarFieldEnum
    having?: RecentProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecentProjectCountAggregateInputType | true
    _avg?: RecentProjectAvgAggregateInputType
    _sum?: RecentProjectSumAggregateInputType
    _min?: RecentProjectMinAggregateInputType
    _max?: RecentProjectMaxAggregateInputType
  }

  export type RecentProjectGroupByOutputType = {
    id: string
    projectId: string
    position: number
    accessedAt: Date
    _count: RecentProjectCountAggregateOutputType | null
    _avg: RecentProjectAvgAggregateOutputType | null
    _sum: RecentProjectSumAggregateOutputType | null
    _min: RecentProjectMinAggregateOutputType | null
    _max: RecentProjectMaxAggregateOutputType | null
  }

  type GetRecentProjectGroupByPayload<T extends RecentProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecentProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecentProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecentProjectGroupByOutputType[P]>
            : GetScalarType<T[P], RecentProjectGroupByOutputType[P]>
        }
      >
    >


  export type RecentProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    position?: boolean
    accessedAt?: boolean
  }, ExtArgs["result"]["recentProject"]>

  export type RecentProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    position?: boolean
    accessedAt?: boolean
  }, ExtArgs["result"]["recentProject"]>

  export type RecentProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    position?: boolean
    accessedAt?: boolean
  }, ExtArgs["result"]["recentProject"]>

  export type RecentProjectSelectScalar = {
    id?: boolean
    projectId?: boolean
    position?: boolean
    accessedAt?: boolean
  }

  export type RecentProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "position" | "accessedAt", ExtArgs["result"]["recentProject"]>

  export type $RecentProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RecentProject"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      position: number
      accessedAt: Date
    }, ExtArgs["result"]["recentProject"]>
    composites: {}
  }

  type RecentProjectGetPayload<S extends boolean | null | undefined | RecentProjectDefaultArgs> = $Result.GetResult<Prisma.$RecentProjectPayload, S>

  type RecentProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecentProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecentProjectCountAggregateInputType | true
    }

  export interface RecentProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RecentProject'], meta: { name: 'RecentProject' } }
    /**
     * Find zero or one RecentProject that matches the filter.
     * @param {RecentProjectFindUniqueArgs} args - Arguments to find a RecentProject
     * @example
     * // Get one RecentProject
     * const recentProject = await prisma.recentProject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecentProjectFindUniqueArgs>(args: SelectSubset<T, RecentProjectFindUniqueArgs<ExtArgs>>): Prisma__RecentProjectClient<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RecentProject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecentProjectFindUniqueOrThrowArgs} args - Arguments to find a RecentProject
     * @example
     * // Get one RecentProject
     * const recentProject = await prisma.recentProject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecentProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, RecentProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecentProjectClient<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecentProject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentProjectFindFirstArgs} args - Arguments to find a RecentProject
     * @example
     * // Get one RecentProject
     * const recentProject = await prisma.recentProject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecentProjectFindFirstArgs>(args?: SelectSubset<T, RecentProjectFindFirstArgs<ExtArgs>>): Prisma__RecentProjectClient<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecentProject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentProjectFindFirstOrThrowArgs} args - Arguments to find a RecentProject
     * @example
     * // Get one RecentProject
     * const recentProject = await prisma.recentProject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecentProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, RecentProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecentProjectClient<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RecentProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RecentProjects
     * const recentProjects = await prisma.recentProject.findMany()
     * 
     * // Get first 10 RecentProjects
     * const recentProjects = await prisma.recentProject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recentProjectWithIdOnly = await prisma.recentProject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecentProjectFindManyArgs>(args?: SelectSubset<T, RecentProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RecentProject.
     * @param {RecentProjectCreateArgs} args - Arguments to create a RecentProject.
     * @example
     * // Create one RecentProject
     * const RecentProject = await prisma.recentProject.create({
     *   data: {
     *     // ... data to create a RecentProject
     *   }
     * })
     * 
     */
    create<T extends RecentProjectCreateArgs>(args: SelectSubset<T, RecentProjectCreateArgs<ExtArgs>>): Prisma__RecentProjectClient<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RecentProjects.
     * @param {RecentProjectCreateManyArgs} args - Arguments to create many RecentProjects.
     * @example
     * // Create many RecentProjects
     * const recentProject = await prisma.recentProject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecentProjectCreateManyArgs>(args?: SelectSubset<T, RecentProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RecentProjects and returns the data saved in the database.
     * @param {RecentProjectCreateManyAndReturnArgs} args - Arguments to create many RecentProjects.
     * @example
     * // Create many RecentProjects
     * const recentProject = await prisma.recentProject.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RecentProjects and only return the `id`
     * const recentProjectWithIdOnly = await prisma.recentProject.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecentProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, RecentProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RecentProject.
     * @param {RecentProjectDeleteArgs} args - Arguments to delete one RecentProject.
     * @example
     * // Delete one RecentProject
     * const RecentProject = await prisma.recentProject.delete({
     *   where: {
     *     // ... filter to delete one RecentProject
     *   }
     * })
     * 
     */
    delete<T extends RecentProjectDeleteArgs>(args: SelectSubset<T, RecentProjectDeleteArgs<ExtArgs>>): Prisma__RecentProjectClient<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RecentProject.
     * @param {RecentProjectUpdateArgs} args - Arguments to update one RecentProject.
     * @example
     * // Update one RecentProject
     * const recentProject = await prisma.recentProject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecentProjectUpdateArgs>(args: SelectSubset<T, RecentProjectUpdateArgs<ExtArgs>>): Prisma__RecentProjectClient<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RecentProjects.
     * @param {RecentProjectDeleteManyArgs} args - Arguments to filter RecentProjects to delete.
     * @example
     * // Delete a few RecentProjects
     * const { count } = await prisma.recentProject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecentProjectDeleteManyArgs>(args?: SelectSubset<T, RecentProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecentProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RecentProjects
     * const recentProject = await prisma.recentProject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecentProjectUpdateManyArgs>(args: SelectSubset<T, RecentProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecentProjects and returns the data updated in the database.
     * @param {RecentProjectUpdateManyAndReturnArgs} args - Arguments to update many RecentProjects.
     * @example
     * // Update many RecentProjects
     * const recentProject = await prisma.recentProject.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RecentProjects and only return the `id`
     * const recentProjectWithIdOnly = await prisma.recentProject.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RecentProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, RecentProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RecentProject.
     * @param {RecentProjectUpsertArgs} args - Arguments to update or create a RecentProject.
     * @example
     * // Update or create a RecentProject
     * const recentProject = await prisma.recentProject.upsert({
     *   create: {
     *     // ... data to create a RecentProject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RecentProject we want to update
     *   }
     * })
     */
    upsert<T extends RecentProjectUpsertArgs>(args: SelectSubset<T, RecentProjectUpsertArgs<ExtArgs>>): Prisma__RecentProjectClient<$Result.GetResult<Prisma.$RecentProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RecentProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentProjectCountArgs} args - Arguments to filter RecentProjects to count.
     * @example
     * // Count the number of RecentProjects
     * const count = await prisma.recentProject.count({
     *   where: {
     *     // ... the filter for the RecentProjects we want to count
     *   }
     * })
    **/
    count<T extends RecentProjectCountArgs>(
      args?: Subset<T, RecentProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecentProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RecentProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecentProjectAggregateArgs>(args: Subset<T, RecentProjectAggregateArgs>): Prisma.PrismaPromise<GetRecentProjectAggregateType<T>>

    /**
     * Group by RecentProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecentProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecentProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecentProjectGroupByArgs['orderBy'] }
        : { orderBy?: RecentProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecentProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecentProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RecentProject model
   */
  readonly fields: RecentProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RecentProject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecentProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RecentProject model
   */
  interface RecentProjectFieldRefs {
    readonly id: FieldRef<"RecentProject", 'String'>
    readonly projectId: FieldRef<"RecentProject", 'String'>
    readonly position: FieldRef<"RecentProject", 'Int'>
    readonly accessedAt: FieldRef<"RecentProject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RecentProject findUnique
   */
  export type RecentProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * Filter, which RecentProject to fetch.
     */
    where: RecentProjectWhereUniqueInput
  }

  /**
   * RecentProject findUniqueOrThrow
   */
  export type RecentProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * Filter, which RecentProject to fetch.
     */
    where: RecentProjectWhereUniqueInput
  }

  /**
   * RecentProject findFirst
   */
  export type RecentProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * Filter, which RecentProject to fetch.
     */
    where?: RecentProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentProjects to fetch.
     */
    orderBy?: RecentProjectOrderByWithRelationInput | RecentProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecentProjects.
     */
    cursor?: RecentProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecentProjects.
     */
    distinct?: RecentProjectScalarFieldEnum | RecentProjectScalarFieldEnum[]
  }

  /**
   * RecentProject findFirstOrThrow
   */
  export type RecentProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * Filter, which RecentProject to fetch.
     */
    where?: RecentProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentProjects to fetch.
     */
    orderBy?: RecentProjectOrderByWithRelationInput | RecentProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecentProjects.
     */
    cursor?: RecentProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecentProjects.
     */
    distinct?: RecentProjectScalarFieldEnum | RecentProjectScalarFieldEnum[]
  }

  /**
   * RecentProject findMany
   */
  export type RecentProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * Filter, which RecentProjects to fetch.
     */
    where?: RecentProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecentProjects to fetch.
     */
    orderBy?: RecentProjectOrderByWithRelationInput | RecentProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RecentProjects.
     */
    cursor?: RecentProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecentProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecentProjects.
     */
    skip?: number
    distinct?: RecentProjectScalarFieldEnum | RecentProjectScalarFieldEnum[]
  }

  /**
   * RecentProject create
   */
  export type RecentProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * The data needed to create a RecentProject.
     */
    data: XOR<RecentProjectCreateInput, RecentProjectUncheckedCreateInput>
  }

  /**
   * RecentProject createMany
   */
  export type RecentProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RecentProjects.
     */
    data: RecentProjectCreateManyInput | RecentProjectCreateManyInput[]
  }

  /**
   * RecentProject createManyAndReturn
   */
  export type RecentProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * The data used to create many RecentProjects.
     */
    data: RecentProjectCreateManyInput | RecentProjectCreateManyInput[]
  }

  /**
   * RecentProject update
   */
  export type RecentProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * The data needed to update a RecentProject.
     */
    data: XOR<RecentProjectUpdateInput, RecentProjectUncheckedUpdateInput>
    /**
     * Choose, which RecentProject to update.
     */
    where: RecentProjectWhereUniqueInput
  }

  /**
   * RecentProject updateMany
   */
  export type RecentProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RecentProjects.
     */
    data: XOR<RecentProjectUpdateManyMutationInput, RecentProjectUncheckedUpdateManyInput>
    /**
     * Filter which RecentProjects to update
     */
    where?: RecentProjectWhereInput
    /**
     * Limit how many RecentProjects to update.
     */
    limit?: number
  }

  /**
   * RecentProject updateManyAndReturn
   */
  export type RecentProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * The data used to update RecentProjects.
     */
    data: XOR<RecentProjectUpdateManyMutationInput, RecentProjectUncheckedUpdateManyInput>
    /**
     * Filter which RecentProjects to update
     */
    where?: RecentProjectWhereInput
    /**
     * Limit how many RecentProjects to update.
     */
    limit?: number
  }

  /**
   * RecentProject upsert
   */
  export type RecentProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * The filter to search for the RecentProject to update in case it exists.
     */
    where: RecentProjectWhereUniqueInput
    /**
     * In case the RecentProject found by the `where` argument doesn't exist, create a new RecentProject with this data.
     */
    create: XOR<RecentProjectCreateInput, RecentProjectUncheckedCreateInput>
    /**
     * In case the RecentProject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecentProjectUpdateInput, RecentProjectUncheckedUpdateInput>
  }

  /**
   * RecentProject delete
   */
  export type RecentProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
    /**
     * Filter which RecentProject to delete.
     */
    where: RecentProjectWhereUniqueInput
  }

  /**
   * RecentProject deleteMany
   */
  export type RecentProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecentProjects to delete
     */
    where?: RecentProjectWhereInput
    /**
     * Limit how many RecentProjects to delete.
     */
    limit?: number
  }

  /**
   * RecentProject without action
   */
  export type RecentProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecentProject
     */
    select?: RecentProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecentProject
     */
    omit?: RecentProjectOmit<ExtArgs> | null
  }


  /**
   * Model AppSetting
   */

  export type AggregateAppSetting = {
    _count: AppSettingCountAggregateOutputType | null
    _min: AppSettingMinAggregateOutputType | null
    _max: AppSettingMaxAggregateOutputType | null
  }

  export type AppSettingMinAggregateOutputType = {
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type AppSettingMaxAggregateOutputType = {
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type AppSettingCountAggregateOutputType = {
    key: number
    value: number
    updatedAt: number
    _all: number
  }


  export type AppSettingMinAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
  }

  export type AppSettingMaxAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
  }

  export type AppSettingCountAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
    _all?: true
  }

  export type AppSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppSetting to aggregate.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppSettings
    **/
    _count?: true | AppSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppSettingMaxAggregateInputType
  }

  export type GetAppSettingAggregateType<T extends AppSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateAppSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppSetting[P]>
      : GetScalarType<T[P], AggregateAppSetting[P]>
  }




  export type AppSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppSettingWhereInput
    orderBy?: AppSettingOrderByWithAggregationInput | AppSettingOrderByWithAggregationInput[]
    by: AppSettingScalarFieldEnum[] | AppSettingScalarFieldEnum
    having?: AppSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppSettingCountAggregateInputType | true
    _min?: AppSettingMinAggregateInputType
    _max?: AppSettingMaxAggregateInputType
  }

  export type AppSettingGroupByOutputType = {
    key: string
    value: string
    updatedAt: Date
    _count: AppSettingCountAggregateOutputType | null
    _min: AppSettingMinAggregateOutputType | null
    _max: AppSettingMaxAggregateOutputType | null
  }

  type GetAppSettingGroupByPayload<T extends AppSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppSettingGroupByOutputType[P]>
            : GetScalarType<T[P], AppSettingGroupByOutputType[P]>
        }
      >
    >


  export type AppSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appSetting"]>

  export type AppSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appSetting"]>

  export type AppSettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appSetting"]>

  export type AppSettingSelectScalar = {
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }

  export type AppSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"key" | "value" | "updatedAt", ExtArgs["result"]["appSetting"]>

  export type $AppSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      value: string
      updatedAt: Date
    }, ExtArgs["result"]["appSetting"]>
    composites: {}
  }

  type AppSettingGetPayload<S extends boolean | null | undefined | AppSettingDefaultArgs> = $Result.GetResult<Prisma.$AppSettingPayload, S>

  type AppSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppSettingCountAggregateInputType | true
    }

  export interface AppSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppSetting'], meta: { name: 'AppSetting' } }
    /**
     * Find zero or one AppSetting that matches the filter.
     * @param {AppSettingFindUniqueArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppSettingFindUniqueArgs>(args: SelectSubset<T, AppSettingFindUniqueArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AppSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppSettingFindUniqueOrThrowArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, AppSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindFirstArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppSettingFindFirstArgs>(args?: SelectSubset<T, AppSettingFindFirstArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindFirstOrThrowArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, AppSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AppSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppSettings
     * const appSettings = await prisma.appSetting.findMany()
     * 
     * // Get first 10 AppSettings
     * const appSettings = await prisma.appSetting.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const appSettingWithKeyOnly = await prisma.appSetting.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends AppSettingFindManyArgs>(args?: SelectSubset<T, AppSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AppSetting.
     * @param {AppSettingCreateArgs} args - Arguments to create a AppSetting.
     * @example
     * // Create one AppSetting
     * const AppSetting = await prisma.appSetting.create({
     *   data: {
     *     // ... data to create a AppSetting
     *   }
     * })
     * 
     */
    create<T extends AppSettingCreateArgs>(args: SelectSubset<T, AppSettingCreateArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AppSettings.
     * @param {AppSettingCreateManyArgs} args - Arguments to create many AppSettings.
     * @example
     * // Create many AppSettings
     * const appSetting = await prisma.appSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppSettingCreateManyArgs>(args?: SelectSubset<T, AppSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AppSettings and returns the data saved in the database.
     * @param {AppSettingCreateManyAndReturnArgs} args - Arguments to create many AppSettings.
     * @example
     * // Create many AppSettings
     * const appSetting = await prisma.appSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AppSettings and only return the `key`
     * const appSettingWithKeyOnly = await prisma.appSetting.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, AppSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AppSetting.
     * @param {AppSettingDeleteArgs} args - Arguments to delete one AppSetting.
     * @example
     * // Delete one AppSetting
     * const AppSetting = await prisma.appSetting.delete({
     *   where: {
     *     // ... filter to delete one AppSetting
     *   }
     * })
     * 
     */
    delete<T extends AppSettingDeleteArgs>(args: SelectSubset<T, AppSettingDeleteArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AppSetting.
     * @param {AppSettingUpdateArgs} args - Arguments to update one AppSetting.
     * @example
     * // Update one AppSetting
     * const appSetting = await prisma.appSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppSettingUpdateArgs>(args: SelectSubset<T, AppSettingUpdateArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AppSettings.
     * @param {AppSettingDeleteManyArgs} args - Arguments to filter AppSettings to delete.
     * @example
     * // Delete a few AppSettings
     * const { count } = await prisma.appSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppSettingDeleteManyArgs>(args?: SelectSubset<T, AppSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppSettings
     * const appSetting = await prisma.appSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppSettingUpdateManyArgs>(args: SelectSubset<T, AppSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppSettings and returns the data updated in the database.
     * @param {AppSettingUpdateManyAndReturnArgs} args - Arguments to update many AppSettings.
     * @example
     * // Update many AppSettings
     * const appSetting = await prisma.appSetting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AppSettings and only return the `key`
     * const appSettingWithKeyOnly = await prisma.appSetting.updateManyAndReturn({
     *   select: { key: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppSettingUpdateManyAndReturnArgs>(args: SelectSubset<T, AppSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AppSetting.
     * @param {AppSettingUpsertArgs} args - Arguments to update or create a AppSetting.
     * @example
     * // Update or create a AppSetting
     * const appSetting = await prisma.appSetting.upsert({
     *   create: {
     *     // ... data to create a AppSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppSetting we want to update
     *   }
     * })
     */
    upsert<T extends AppSettingUpsertArgs>(args: SelectSubset<T, AppSettingUpsertArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AppSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingCountArgs} args - Arguments to filter AppSettings to count.
     * @example
     * // Count the number of AppSettings
     * const count = await prisma.appSetting.count({
     *   where: {
     *     // ... the filter for the AppSettings we want to count
     *   }
     * })
    **/
    count<T extends AppSettingCountArgs>(
      args?: Subset<T, AppSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppSettingAggregateArgs>(args: Subset<T, AppSettingAggregateArgs>): Prisma.PrismaPromise<GetAppSettingAggregateType<T>>

    /**
     * Group by AppSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppSettingGroupByArgs['orderBy'] }
        : { orderBy?: AppSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppSetting model
   */
  readonly fields: AppSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppSetting model
   */
  interface AppSettingFieldRefs {
    readonly key: FieldRef<"AppSetting", 'String'>
    readonly value: FieldRef<"AppSetting", 'String'>
    readonly updatedAt: FieldRef<"AppSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppSetting findUnique
   */
  export type AppSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting findUniqueOrThrow
   */
  export type AppSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting findFirst
   */
  export type AppSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppSettings.
     */
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting findFirstOrThrow
   */
  export type AppSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppSettings.
     */
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting findMany
   */
  export type AppSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSettings to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting create
   */
  export type AppSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a AppSetting.
     */
    data: XOR<AppSettingCreateInput, AppSettingUncheckedCreateInput>
  }

  /**
   * AppSetting createMany
   */
  export type AppSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppSettings.
     */
    data: AppSettingCreateManyInput | AppSettingCreateManyInput[]
  }

  /**
   * AppSetting createManyAndReturn
   */
  export type AppSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The data used to create many AppSettings.
     */
    data: AppSettingCreateManyInput | AppSettingCreateManyInput[]
  }

  /**
   * AppSetting update
   */
  export type AppSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a AppSetting.
     */
    data: XOR<AppSettingUpdateInput, AppSettingUncheckedUpdateInput>
    /**
     * Choose, which AppSetting to update.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting updateMany
   */
  export type AppSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppSettings.
     */
    data: XOR<AppSettingUpdateManyMutationInput, AppSettingUncheckedUpdateManyInput>
    /**
     * Filter which AppSettings to update
     */
    where?: AppSettingWhereInput
    /**
     * Limit how many AppSettings to update.
     */
    limit?: number
  }

  /**
   * AppSetting updateManyAndReturn
   */
  export type AppSettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The data used to update AppSettings.
     */
    data: XOR<AppSettingUpdateManyMutationInput, AppSettingUncheckedUpdateManyInput>
    /**
     * Filter which AppSettings to update
     */
    where?: AppSettingWhereInput
    /**
     * Limit how many AppSettings to update.
     */
    limit?: number
  }

  /**
   * AppSetting upsert
   */
  export type AppSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the AppSetting to update in case it exists.
     */
    where: AppSettingWhereUniqueInput
    /**
     * In case the AppSetting found by the `where` argument doesn't exist, create a new AppSetting with this data.
     */
    create: XOR<AppSettingCreateInput, AppSettingUncheckedCreateInput>
    /**
     * In case the AppSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppSettingUpdateInput, AppSettingUncheckedUpdateInput>
  }

  /**
   * AppSetting delete
   */
  export type AppSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter which AppSetting to delete.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting deleteMany
   */
  export type AppSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppSettings to delete
     */
    where?: AppSettingWhereInput
    /**
     * Limit how many AppSettings to delete.
     */
    limit?: number
  }

  /**
   * AppSetting without action
   */
  export type AppSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
  }


  /**
   * Model CachedFont
   */

  export type AggregateCachedFont = {
    _count: CachedFontCountAggregateOutputType | null
    _avg: CachedFontAvgAggregateOutputType | null
    _sum: CachedFontSumAggregateOutputType | null
    _min: CachedFontMinAggregateOutputType | null
    _max: CachedFontMaxAggregateOutputType | null
  }

  export type CachedFontAvgAggregateOutputType = {
    fileSize: number | null
  }

  export type CachedFontSumAggregateOutputType = {
    fileSize: number | null
  }

  export type CachedFontMinAggregateOutputType = {
    id: string | null
    family: string | null
    variant: string | null
    filePath: string | null
    fileSize: number | null
    downloadedAt: Date | null
  }

  export type CachedFontMaxAggregateOutputType = {
    id: string | null
    family: string | null
    variant: string | null
    filePath: string | null
    fileSize: number | null
    downloadedAt: Date | null
  }

  export type CachedFontCountAggregateOutputType = {
    id: number
    family: number
    variant: number
    filePath: number
    fileSize: number
    downloadedAt: number
    _all: number
  }


  export type CachedFontAvgAggregateInputType = {
    fileSize?: true
  }

  export type CachedFontSumAggregateInputType = {
    fileSize?: true
  }

  export type CachedFontMinAggregateInputType = {
    id?: true
    family?: true
    variant?: true
    filePath?: true
    fileSize?: true
    downloadedAt?: true
  }

  export type CachedFontMaxAggregateInputType = {
    id?: true
    family?: true
    variant?: true
    filePath?: true
    fileSize?: true
    downloadedAt?: true
  }

  export type CachedFontCountAggregateInputType = {
    id?: true
    family?: true
    variant?: true
    filePath?: true
    fileSize?: true
    downloadedAt?: true
    _all?: true
  }

  export type CachedFontAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedFont to aggregate.
     */
    where?: CachedFontWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedFonts to fetch.
     */
    orderBy?: CachedFontOrderByWithRelationInput | CachedFontOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CachedFontWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedFonts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedFonts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CachedFonts
    **/
    _count?: true | CachedFontCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CachedFontAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CachedFontSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CachedFontMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CachedFontMaxAggregateInputType
  }

  export type GetCachedFontAggregateType<T extends CachedFontAggregateArgs> = {
        [P in keyof T & keyof AggregateCachedFont]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCachedFont[P]>
      : GetScalarType<T[P], AggregateCachedFont[P]>
  }




  export type CachedFontGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CachedFontWhereInput
    orderBy?: CachedFontOrderByWithAggregationInput | CachedFontOrderByWithAggregationInput[]
    by: CachedFontScalarFieldEnum[] | CachedFontScalarFieldEnum
    having?: CachedFontScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CachedFontCountAggregateInputType | true
    _avg?: CachedFontAvgAggregateInputType
    _sum?: CachedFontSumAggregateInputType
    _min?: CachedFontMinAggregateInputType
    _max?: CachedFontMaxAggregateInputType
  }

  export type CachedFontGroupByOutputType = {
    id: string
    family: string
    variant: string
    filePath: string
    fileSize: number
    downloadedAt: Date
    _count: CachedFontCountAggregateOutputType | null
    _avg: CachedFontAvgAggregateOutputType | null
    _sum: CachedFontSumAggregateOutputType | null
    _min: CachedFontMinAggregateOutputType | null
    _max: CachedFontMaxAggregateOutputType | null
  }

  type GetCachedFontGroupByPayload<T extends CachedFontGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CachedFontGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CachedFontGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CachedFontGroupByOutputType[P]>
            : GetScalarType<T[P], CachedFontGroupByOutputType[P]>
        }
      >
    >


  export type CachedFontSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    family?: boolean
    variant?: boolean
    filePath?: boolean
    fileSize?: boolean
    downloadedAt?: boolean
  }, ExtArgs["result"]["cachedFont"]>

  export type CachedFontSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    family?: boolean
    variant?: boolean
    filePath?: boolean
    fileSize?: boolean
    downloadedAt?: boolean
  }, ExtArgs["result"]["cachedFont"]>

  export type CachedFontSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    family?: boolean
    variant?: boolean
    filePath?: boolean
    fileSize?: boolean
    downloadedAt?: boolean
  }, ExtArgs["result"]["cachedFont"]>

  export type CachedFontSelectScalar = {
    id?: boolean
    family?: boolean
    variant?: boolean
    filePath?: boolean
    fileSize?: boolean
    downloadedAt?: boolean
  }

  export type CachedFontOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "family" | "variant" | "filePath" | "fileSize" | "downloadedAt", ExtArgs["result"]["cachedFont"]>

  export type $CachedFontPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CachedFont"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      family: string
      variant: string
      filePath: string
      fileSize: number
      downloadedAt: Date
    }, ExtArgs["result"]["cachedFont"]>
    composites: {}
  }

  type CachedFontGetPayload<S extends boolean | null | undefined | CachedFontDefaultArgs> = $Result.GetResult<Prisma.$CachedFontPayload, S>

  type CachedFontCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CachedFontFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CachedFontCountAggregateInputType | true
    }

  export interface CachedFontDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CachedFont'], meta: { name: 'CachedFont' } }
    /**
     * Find zero or one CachedFont that matches the filter.
     * @param {CachedFontFindUniqueArgs} args - Arguments to find a CachedFont
     * @example
     * // Get one CachedFont
     * const cachedFont = await prisma.cachedFont.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CachedFontFindUniqueArgs>(args: SelectSubset<T, CachedFontFindUniqueArgs<ExtArgs>>): Prisma__CachedFontClient<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CachedFont that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CachedFontFindUniqueOrThrowArgs} args - Arguments to find a CachedFont
     * @example
     * // Get one CachedFont
     * const cachedFont = await prisma.cachedFont.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CachedFontFindUniqueOrThrowArgs>(args: SelectSubset<T, CachedFontFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CachedFontClient<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedFont that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedFontFindFirstArgs} args - Arguments to find a CachedFont
     * @example
     * // Get one CachedFont
     * const cachedFont = await prisma.cachedFont.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CachedFontFindFirstArgs>(args?: SelectSubset<T, CachedFontFindFirstArgs<ExtArgs>>): Prisma__CachedFontClient<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CachedFont that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedFontFindFirstOrThrowArgs} args - Arguments to find a CachedFont
     * @example
     * // Get one CachedFont
     * const cachedFont = await prisma.cachedFont.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CachedFontFindFirstOrThrowArgs>(args?: SelectSubset<T, CachedFontFindFirstOrThrowArgs<ExtArgs>>): Prisma__CachedFontClient<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CachedFonts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedFontFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CachedFonts
     * const cachedFonts = await prisma.cachedFont.findMany()
     * 
     * // Get first 10 CachedFonts
     * const cachedFonts = await prisma.cachedFont.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cachedFontWithIdOnly = await prisma.cachedFont.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CachedFontFindManyArgs>(args?: SelectSubset<T, CachedFontFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CachedFont.
     * @param {CachedFontCreateArgs} args - Arguments to create a CachedFont.
     * @example
     * // Create one CachedFont
     * const CachedFont = await prisma.cachedFont.create({
     *   data: {
     *     // ... data to create a CachedFont
     *   }
     * })
     * 
     */
    create<T extends CachedFontCreateArgs>(args: SelectSubset<T, CachedFontCreateArgs<ExtArgs>>): Prisma__CachedFontClient<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CachedFonts.
     * @param {CachedFontCreateManyArgs} args - Arguments to create many CachedFonts.
     * @example
     * // Create many CachedFonts
     * const cachedFont = await prisma.cachedFont.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CachedFontCreateManyArgs>(args?: SelectSubset<T, CachedFontCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CachedFonts and returns the data saved in the database.
     * @param {CachedFontCreateManyAndReturnArgs} args - Arguments to create many CachedFonts.
     * @example
     * // Create many CachedFonts
     * const cachedFont = await prisma.cachedFont.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CachedFonts and only return the `id`
     * const cachedFontWithIdOnly = await prisma.cachedFont.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CachedFontCreateManyAndReturnArgs>(args?: SelectSubset<T, CachedFontCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CachedFont.
     * @param {CachedFontDeleteArgs} args - Arguments to delete one CachedFont.
     * @example
     * // Delete one CachedFont
     * const CachedFont = await prisma.cachedFont.delete({
     *   where: {
     *     // ... filter to delete one CachedFont
     *   }
     * })
     * 
     */
    delete<T extends CachedFontDeleteArgs>(args: SelectSubset<T, CachedFontDeleteArgs<ExtArgs>>): Prisma__CachedFontClient<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CachedFont.
     * @param {CachedFontUpdateArgs} args - Arguments to update one CachedFont.
     * @example
     * // Update one CachedFont
     * const cachedFont = await prisma.cachedFont.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CachedFontUpdateArgs>(args: SelectSubset<T, CachedFontUpdateArgs<ExtArgs>>): Prisma__CachedFontClient<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CachedFonts.
     * @param {CachedFontDeleteManyArgs} args - Arguments to filter CachedFonts to delete.
     * @example
     * // Delete a few CachedFonts
     * const { count } = await prisma.cachedFont.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CachedFontDeleteManyArgs>(args?: SelectSubset<T, CachedFontDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedFonts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedFontUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CachedFonts
     * const cachedFont = await prisma.cachedFont.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CachedFontUpdateManyArgs>(args: SelectSubset<T, CachedFontUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CachedFonts and returns the data updated in the database.
     * @param {CachedFontUpdateManyAndReturnArgs} args - Arguments to update many CachedFonts.
     * @example
     * // Update many CachedFonts
     * const cachedFont = await prisma.cachedFont.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CachedFonts and only return the `id`
     * const cachedFontWithIdOnly = await prisma.cachedFont.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CachedFontUpdateManyAndReturnArgs>(args: SelectSubset<T, CachedFontUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CachedFont.
     * @param {CachedFontUpsertArgs} args - Arguments to update or create a CachedFont.
     * @example
     * // Update or create a CachedFont
     * const cachedFont = await prisma.cachedFont.upsert({
     *   create: {
     *     // ... data to create a CachedFont
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CachedFont we want to update
     *   }
     * })
     */
    upsert<T extends CachedFontUpsertArgs>(args: SelectSubset<T, CachedFontUpsertArgs<ExtArgs>>): Prisma__CachedFontClient<$Result.GetResult<Prisma.$CachedFontPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CachedFonts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedFontCountArgs} args - Arguments to filter CachedFonts to count.
     * @example
     * // Count the number of CachedFonts
     * const count = await prisma.cachedFont.count({
     *   where: {
     *     // ... the filter for the CachedFonts we want to count
     *   }
     * })
    **/
    count<T extends CachedFontCountArgs>(
      args?: Subset<T, CachedFontCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CachedFontCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CachedFont.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedFontAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CachedFontAggregateArgs>(args: Subset<T, CachedFontAggregateArgs>): Prisma.PrismaPromise<GetCachedFontAggregateType<T>>

    /**
     * Group by CachedFont.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CachedFontGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CachedFontGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CachedFontGroupByArgs['orderBy'] }
        : { orderBy?: CachedFontGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CachedFontGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCachedFontGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CachedFont model
   */
  readonly fields: CachedFontFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CachedFont.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CachedFontClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CachedFont model
   */
  interface CachedFontFieldRefs {
    readonly id: FieldRef<"CachedFont", 'String'>
    readonly family: FieldRef<"CachedFont", 'String'>
    readonly variant: FieldRef<"CachedFont", 'String'>
    readonly filePath: FieldRef<"CachedFont", 'String'>
    readonly fileSize: FieldRef<"CachedFont", 'Int'>
    readonly downloadedAt: FieldRef<"CachedFont", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CachedFont findUnique
   */
  export type CachedFontFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * Filter, which CachedFont to fetch.
     */
    where: CachedFontWhereUniqueInput
  }

  /**
   * CachedFont findUniqueOrThrow
   */
  export type CachedFontFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * Filter, which CachedFont to fetch.
     */
    where: CachedFontWhereUniqueInput
  }

  /**
   * CachedFont findFirst
   */
  export type CachedFontFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * Filter, which CachedFont to fetch.
     */
    where?: CachedFontWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedFonts to fetch.
     */
    orderBy?: CachedFontOrderByWithRelationInput | CachedFontOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedFonts.
     */
    cursor?: CachedFontWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedFonts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedFonts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedFonts.
     */
    distinct?: CachedFontScalarFieldEnum | CachedFontScalarFieldEnum[]
  }

  /**
   * CachedFont findFirstOrThrow
   */
  export type CachedFontFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * Filter, which CachedFont to fetch.
     */
    where?: CachedFontWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedFonts to fetch.
     */
    orderBy?: CachedFontOrderByWithRelationInput | CachedFontOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CachedFonts.
     */
    cursor?: CachedFontWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedFonts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedFonts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CachedFonts.
     */
    distinct?: CachedFontScalarFieldEnum | CachedFontScalarFieldEnum[]
  }

  /**
   * CachedFont findMany
   */
  export type CachedFontFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * Filter, which CachedFonts to fetch.
     */
    where?: CachedFontWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CachedFonts to fetch.
     */
    orderBy?: CachedFontOrderByWithRelationInput | CachedFontOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CachedFonts.
     */
    cursor?: CachedFontWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CachedFonts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CachedFonts.
     */
    skip?: number
    distinct?: CachedFontScalarFieldEnum | CachedFontScalarFieldEnum[]
  }

  /**
   * CachedFont create
   */
  export type CachedFontCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * The data needed to create a CachedFont.
     */
    data: XOR<CachedFontCreateInput, CachedFontUncheckedCreateInput>
  }

  /**
   * CachedFont createMany
   */
  export type CachedFontCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CachedFonts.
     */
    data: CachedFontCreateManyInput | CachedFontCreateManyInput[]
  }

  /**
   * CachedFont createManyAndReturn
   */
  export type CachedFontCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * The data used to create many CachedFonts.
     */
    data: CachedFontCreateManyInput | CachedFontCreateManyInput[]
  }

  /**
   * CachedFont update
   */
  export type CachedFontUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * The data needed to update a CachedFont.
     */
    data: XOR<CachedFontUpdateInput, CachedFontUncheckedUpdateInput>
    /**
     * Choose, which CachedFont to update.
     */
    where: CachedFontWhereUniqueInput
  }

  /**
   * CachedFont updateMany
   */
  export type CachedFontUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CachedFonts.
     */
    data: XOR<CachedFontUpdateManyMutationInput, CachedFontUncheckedUpdateManyInput>
    /**
     * Filter which CachedFonts to update
     */
    where?: CachedFontWhereInput
    /**
     * Limit how many CachedFonts to update.
     */
    limit?: number
  }

  /**
   * CachedFont updateManyAndReturn
   */
  export type CachedFontUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * The data used to update CachedFonts.
     */
    data: XOR<CachedFontUpdateManyMutationInput, CachedFontUncheckedUpdateManyInput>
    /**
     * Filter which CachedFonts to update
     */
    where?: CachedFontWhereInput
    /**
     * Limit how many CachedFonts to update.
     */
    limit?: number
  }

  /**
   * CachedFont upsert
   */
  export type CachedFontUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * The filter to search for the CachedFont to update in case it exists.
     */
    where: CachedFontWhereUniqueInput
    /**
     * In case the CachedFont found by the `where` argument doesn't exist, create a new CachedFont with this data.
     */
    create: XOR<CachedFontCreateInput, CachedFontUncheckedCreateInput>
    /**
     * In case the CachedFont was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CachedFontUpdateInput, CachedFontUncheckedUpdateInput>
  }

  /**
   * CachedFont delete
   */
  export type CachedFontDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
    /**
     * Filter which CachedFont to delete.
     */
    where: CachedFontWhereUniqueInput
  }

  /**
   * CachedFont deleteMany
   */
  export type CachedFontDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CachedFonts to delete
     */
    where?: CachedFontWhereInput
    /**
     * Limit how many CachedFonts to delete.
     */
    limit?: number
  }

  /**
   * CachedFont without action
   */
  export type CachedFontDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CachedFont
     */
    select?: CachedFontSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CachedFont
     */
    omit?: CachedFontOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    filePath: 'filePath',
    themeId: 'themeId',
    hasCoverPage: 'hasCoverPage',
    coverTitle: 'coverTitle',
    coverSubtitle: 'coverSubtitle',
    coverAuthor: 'coverAuthor',
    coverDate: 'coverDate',
    coverTemplateId: 'coverTemplateId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastOpenedAt: 'lastOpenedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const ThemeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isBuiltIn: 'isBuiltIn',
    headingFont: 'headingFont',
    bodyFont: 'bodyFont',
    h1Size: 'h1Size',
    h2Size: 'h2Size',
    h3Size: 'h3Size',
    h4Size: 'h4Size',
    h5Size: 'h5Size',
    h6Size: 'h6Size',
    bodySize: 'bodySize',
    kerning: 'kerning',
    leading: 'leading',
    pageWidth: 'pageWidth',
    pageHeight: 'pageHeight',
    marginTop: 'marginTop',
    marginBottom: 'marginBottom',
    marginLeft: 'marginLeft',
    marginRight: 'marginRight',
    backgroundColor: 'backgroundColor',
    textColor: 'textColor',
    headingColor: 'headingColor',
    linkColor: 'linkColor',
    codeBackground: 'codeBackground',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ThemeScalarFieldEnum = (typeof ThemeScalarFieldEnum)[keyof typeof ThemeScalarFieldEnum]


  export const CoverTemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isBuiltIn: 'isBuiltIn',
    layoutJson: 'layoutJson',
    hasLogoSlot: 'hasLogoSlot',
    hasBackgroundSlot: 'hasBackgroundSlot',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CoverTemplateScalarFieldEnum = (typeof CoverTemplateScalarFieldEnum)[keyof typeof CoverTemplateScalarFieldEnum]


  export const ProjectCoverAssetScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    assetType: 'assetType',
    originalFileName: 'originalFileName',
    filePath: 'filePath',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    width: 'width',
    height: 'height',
    createdAt: 'createdAt'
  };

  export type ProjectCoverAssetScalarFieldEnum = (typeof ProjectCoverAssetScalarFieldEnum)[keyof typeof ProjectCoverAssetScalarFieldEnum]


  export const RecentProjectScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    position: 'position',
    accessedAt: 'accessedAt'
  };

  export type RecentProjectScalarFieldEnum = (typeof RecentProjectScalarFieldEnum)[keyof typeof RecentProjectScalarFieldEnum]


  export const AppSettingScalarFieldEnum: {
    key: 'key',
    value: 'value',
    updatedAt: 'updatedAt'
  };

  export type AppSettingScalarFieldEnum = (typeof AppSettingScalarFieldEnum)[keyof typeof AppSettingScalarFieldEnum]


  export const CachedFontScalarFieldEnum: {
    id: 'id',
    family: 'family',
    variant: 'variant',
    filePath: 'filePath',
    fileSize: 'fileSize',
    downloadedAt: 'downloadedAt'
  };

  export type CachedFontScalarFieldEnum = (typeof CachedFontScalarFieldEnum)[keyof typeof CachedFontScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    filePath?: StringFilter<"Project"> | string
    themeId?: StringNullableFilter<"Project"> | string | null
    hasCoverPage?: BoolFilter<"Project"> | boolean
    coverTitle?: StringNullableFilter<"Project"> | string | null
    coverSubtitle?: StringNullableFilter<"Project"> | string | null
    coverAuthor?: StringNullableFilter<"Project"> | string | null
    coverDate?: StringNullableFilter<"Project"> | string | null
    coverTemplateId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    lastOpenedAt?: DateTimeFilter<"Project"> | Date | string
    theme?: XOR<ThemeNullableScalarRelationFilter, ThemeWhereInput> | null
    coverTemplate?: XOR<CoverTemplateNullableScalarRelationFilter, CoverTemplateWhereInput> | null
    coverAssets?: ProjectCoverAssetListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    themeId?: SortOrderInput | SortOrder
    hasCoverPage?: SortOrder
    coverTitle?: SortOrderInput | SortOrder
    coverSubtitle?: SortOrderInput | SortOrder
    coverAuthor?: SortOrderInput | SortOrder
    coverDate?: SortOrderInput | SortOrder
    coverTemplateId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastOpenedAt?: SortOrder
    theme?: ThemeOrderByWithRelationInput
    coverTemplate?: CoverTemplateOrderByWithRelationInput
    coverAssets?: ProjectCoverAssetOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    filePath?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    themeId?: StringNullableFilter<"Project"> | string | null
    hasCoverPage?: BoolFilter<"Project"> | boolean
    coverTitle?: StringNullableFilter<"Project"> | string | null
    coverSubtitle?: StringNullableFilter<"Project"> | string | null
    coverAuthor?: StringNullableFilter<"Project"> | string | null
    coverDate?: StringNullableFilter<"Project"> | string | null
    coverTemplateId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    lastOpenedAt?: DateTimeFilter<"Project"> | Date | string
    theme?: XOR<ThemeNullableScalarRelationFilter, ThemeWhereInput> | null
    coverTemplate?: XOR<CoverTemplateNullableScalarRelationFilter, CoverTemplateWhereInput> | null
    coverAssets?: ProjectCoverAssetListRelationFilter
  }, "id" | "filePath">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    themeId?: SortOrderInput | SortOrder
    hasCoverPage?: SortOrder
    coverTitle?: SortOrderInput | SortOrder
    coverSubtitle?: SortOrderInput | SortOrder
    coverAuthor?: SortOrderInput | SortOrder
    coverDate?: SortOrderInput | SortOrder
    coverTemplateId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastOpenedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    filePath?: StringWithAggregatesFilter<"Project"> | string
    themeId?: StringNullableWithAggregatesFilter<"Project"> | string | null
    hasCoverPage?: BoolWithAggregatesFilter<"Project"> | boolean
    coverTitle?: StringNullableWithAggregatesFilter<"Project"> | string | null
    coverSubtitle?: StringNullableWithAggregatesFilter<"Project"> | string | null
    coverAuthor?: StringNullableWithAggregatesFilter<"Project"> | string | null
    coverDate?: StringNullableWithAggregatesFilter<"Project"> | string | null
    coverTemplateId?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    lastOpenedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type ThemeWhereInput = {
    AND?: ThemeWhereInput | ThemeWhereInput[]
    OR?: ThemeWhereInput[]
    NOT?: ThemeWhereInput | ThemeWhereInput[]
    id?: StringFilter<"Theme"> | string
    name?: StringFilter<"Theme"> | string
    isBuiltIn?: BoolFilter<"Theme"> | boolean
    headingFont?: StringFilter<"Theme"> | string
    bodyFont?: StringFilter<"Theme"> | string
    h1Size?: FloatFilter<"Theme"> | number
    h2Size?: FloatFilter<"Theme"> | number
    h3Size?: FloatFilter<"Theme"> | number
    h4Size?: FloatFilter<"Theme"> | number
    h5Size?: FloatFilter<"Theme"> | number
    h6Size?: FloatFilter<"Theme"> | number
    bodySize?: FloatFilter<"Theme"> | number
    kerning?: FloatFilter<"Theme"> | number
    leading?: FloatFilter<"Theme"> | number
    pageWidth?: FloatFilter<"Theme"> | number
    pageHeight?: FloatFilter<"Theme"> | number
    marginTop?: FloatFilter<"Theme"> | number
    marginBottom?: FloatFilter<"Theme"> | number
    marginLeft?: FloatFilter<"Theme"> | number
    marginRight?: FloatFilter<"Theme"> | number
    backgroundColor?: StringFilter<"Theme"> | string
    textColor?: StringFilter<"Theme"> | string
    headingColor?: StringFilter<"Theme"> | string
    linkColor?: StringFilter<"Theme"> | string
    codeBackground?: StringFilter<"Theme"> | string
    createdAt?: DateTimeFilter<"Theme"> | Date | string
    updatedAt?: DateTimeFilter<"Theme"> | Date | string
    projects?: ProjectListRelationFilter
  }

  export type ThemeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    headingFont?: SortOrder
    bodyFont?: SortOrder
    h1Size?: SortOrder
    h2Size?: SortOrder
    h3Size?: SortOrder
    h4Size?: SortOrder
    h5Size?: SortOrder
    h6Size?: SortOrder
    bodySize?: SortOrder
    kerning?: SortOrder
    leading?: SortOrder
    pageWidth?: SortOrder
    pageHeight?: SortOrder
    marginTop?: SortOrder
    marginBottom?: SortOrder
    marginLeft?: SortOrder
    marginRight?: SortOrder
    backgroundColor?: SortOrder
    textColor?: SortOrder
    headingColor?: SortOrder
    linkColor?: SortOrder
    codeBackground?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
  }

  export type ThemeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ThemeWhereInput | ThemeWhereInput[]
    OR?: ThemeWhereInput[]
    NOT?: ThemeWhereInput | ThemeWhereInput[]
    isBuiltIn?: BoolFilter<"Theme"> | boolean
    headingFont?: StringFilter<"Theme"> | string
    bodyFont?: StringFilter<"Theme"> | string
    h1Size?: FloatFilter<"Theme"> | number
    h2Size?: FloatFilter<"Theme"> | number
    h3Size?: FloatFilter<"Theme"> | number
    h4Size?: FloatFilter<"Theme"> | number
    h5Size?: FloatFilter<"Theme"> | number
    h6Size?: FloatFilter<"Theme"> | number
    bodySize?: FloatFilter<"Theme"> | number
    kerning?: FloatFilter<"Theme"> | number
    leading?: FloatFilter<"Theme"> | number
    pageWidth?: FloatFilter<"Theme"> | number
    pageHeight?: FloatFilter<"Theme"> | number
    marginTop?: FloatFilter<"Theme"> | number
    marginBottom?: FloatFilter<"Theme"> | number
    marginLeft?: FloatFilter<"Theme"> | number
    marginRight?: FloatFilter<"Theme"> | number
    backgroundColor?: StringFilter<"Theme"> | string
    textColor?: StringFilter<"Theme"> | string
    headingColor?: StringFilter<"Theme"> | string
    linkColor?: StringFilter<"Theme"> | string
    codeBackground?: StringFilter<"Theme"> | string
    createdAt?: DateTimeFilter<"Theme"> | Date | string
    updatedAt?: DateTimeFilter<"Theme"> | Date | string
    projects?: ProjectListRelationFilter
  }, "id" | "name">

  export type ThemeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    headingFont?: SortOrder
    bodyFont?: SortOrder
    h1Size?: SortOrder
    h2Size?: SortOrder
    h3Size?: SortOrder
    h4Size?: SortOrder
    h5Size?: SortOrder
    h6Size?: SortOrder
    bodySize?: SortOrder
    kerning?: SortOrder
    leading?: SortOrder
    pageWidth?: SortOrder
    pageHeight?: SortOrder
    marginTop?: SortOrder
    marginBottom?: SortOrder
    marginLeft?: SortOrder
    marginRight?: SortOrder
    backgroundColor?: SortOrder
    textColor?: SortOrder
    headingColor?: SortOrder
    linkColor?: SortOrder
    codeBackground?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ThemeCountOrderByAggregateInput
    _avg?: ThemeAvgOrderByAggregateInput
    _max?: ThemeMaxOrderByAggregateInput
    _min?: ThemeMinOrderByAggregateInput
    _sum?: ThemeSumOrderByAggregateInput
  }

  export type ThemeScalarWhereWithAggregatesInput = {
    AND?: ThemeScalarWhereWithAggregatesInput | ThemeScalarWhereWithAggregatesInput[]
    OR?: ThemeScalarWhereWithAggregatesInput[]
    NOT?: ThemeScalarWhereWithAggregatesInput | ThemeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Theme"> | string
    name?: StringWithAggregatesFilter<"Theme"> | string
    isBuiltIn?: BoolWithAggregatesFilter<"Theme"> | boolean
    headingFont?: StringWithAggregatesFilter<"Theme"> | string
    bodyFont?: StringWithAggregatesFilter<"Theme"> | string
    h1Size?: FloatWithAggregatesFilter<"Theme"> | number
    h2Size?: FloatWithAggregatesFilter<"Theme"> | number
    h3Size?: FloatWithAggregatesFilter<"Theme"> | number
    h4Size?: FloatWithAggregatesFilter<"Theme"> | number
    h5Size?: FloatWithAggregatesFilter<"Theme"> | number
    h6Size?: FloatWithAggregatesFilter<"Theme"> | number
    bodySize?: FloatWithAggregatesFilter<"Theme"> | number
    kerning?: FloatWithAggregatesFilter<"Theme"> | number
    leading?: FloatWithAggregatesFilter<"Theme"> | number
    pageWidth?: FloatWithAggregatesFilter<"Theme"> | number
    pageHeight?: FloatWithAggregatesFilter<"Theme"> | number
    marginTop?: FloatWithAggregatesFilter<"Theme"> | number
    marginBottom?: FloatWithAggregatesFilter<"Theme"> | number
    marginLeft?: FloatWithAggregatesFilter<"Theme"> | number
    marginRight?: FloatWithAggregatesFilter<"Theme"> | number
    backgroundColor?: StringWithAggregatesFilter<"Theme"> | string
    textColor?: StringWithAggregatesFilter<"Theme"> | string
    headingColor?: StringWithAggregatesFilter<"Theme"> | string
    linkColor?: StringWithAggregatesFilter<"Theme"> | string
    codeBackground?: StringWithAggregatesFilter<"Theme"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Theme"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Theme"> | Date | string
  }

  export type CoverTemplateWhereInput = {
    AND?: CoverTemplateWhereInput | CoverTemplateWhereInput[]
    OR?: CoverTemplateWhereInput[]
    NOT?: CoverTemplateWhereInput | CoverTemplateWhereInput[]
    id?: StringFilter<"CoverTemplate"> | string
    name?: StringFilter<"CoverTemplate"> | string
    isBuiltIn?: BoolFilter<"CoverTemplate"> | boolean
    layoutJson?: StringFilter<"CoverTemplate"> | string
    hasLogoSlot?: BoolFilter<"CoverTemplate"> | boolean
    hasBackgroundSlot?: BoolFilter<"CoverTemplate"> | boolean
    createdAt?: DateTimeFilter<"CoverTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"CoverTemplate"> | Date | string
    projects?: ProjectListRelationFilter
  }

  export type CoverTemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    layoutJson?: SortOrder
    hasLogoSlot?: SortOrder
    hasBackgroundSlot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
  }

  export type CoverTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CoverTemplateWhereInput | CoverTemplateWhereInput[]
    OR?: CoverTemplateWhereInput[]
    NOT?: CoverTemplateWhereInput | CoverTemplateWhereInput[]
    isBuiltIn?: BoolFilter<"CoverTemplate"> | boolean
    layoutJson?: StringFilter<"CoverTemplate"> | string
    hasLogoSlot?: BoolFilter<"CoverTemplate"> | boolean
    hasBackgroundSlot?: BoolFilter<"CoverTemplate"> | boolean
    createdAt?: DateTimeFilter<"CoverTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"CoverTemplate"> | Date | string
    projects?: ProjectListRelationFilter
  }, "id" | "name">

  export type CoverTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    layoutJson?: SortOrder
    hasLogoSlot?: SortOrder
    hasBackgroundSlot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CoverTemplateCountOrderByAggregateInput
    _max?: CoverTemplateMaxOrderByAggregateInput
    _min?: CoverTemplateMinOrderByAggregateInput
  }

  export type CoverTemplateScalarWhereWithAggregatesInput = {
    AND?: CoverTemplateScalarWhereWithAggregatesInput | CoverTemplateScalarWhereWithAggregatesInput[]
    OR?: CoverTemplateScalarWhereWithAggregatesInput[]
    NOT?: CoverTemplateScalarWhereWithAggregatesInput | CoverTemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CoverTemplate"> | string
    name?: StringWithAggregatesFilter<"CoverTemplate"> | string
    isBuiltIn?: BoolWithAggregatesFilter<"CoverTemplate"> | boolean
    layoutJson?: StringWithAggregatesFilter<"CoverTemplate"> | string
    hasLogoSlot?: BoolWithAggregatesFilter<"CoverTemplate"> | boolean
    hasBackgroundSlot?: BoolWithAggregatesFilter<"CoverTemplate"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CoverTemplate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CoverTemplate"> | Date | string
  }

  export type ProjectCoverAssetWhereInput = {
    AND?: ProjectCoverAssetWhereInput | ProjectCoverAssetWhereInput[]
    OR?: ProjectCoverAssetWhereInput[]
    NOT?: ProjectCoverAssetWhereInput | ProjectCoverAssetWhereInput[]
    id?: StringFilter<"ProjectCoverAsset"> | string
    projectId?: StringFilter<"ProjectCoverAsset"> | string
    assetType?: StringFilter<"ProjectCoverAsset"> | string
    originalFileName?: StringFilter<"ProjectCoverAsset"> | string
    filePath?: StringFilter<"ProjectCoverAsset"> | string
    fileSize?: IntFilter<"ProjectCoverAsset"> | number
    mimeType?: StringFilter<"ProjectCoverAsset"> | string
    width?: IntNullableFilter<"ProjectCoverAsset"> | number | null
    height?: IntNullableFilter<"ProjectCoverAsset"> | number | null
    createdAt?: DateTimeFilter<"ProjectCoverAsset"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectCoverAssetOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    assetType?: SortOrder
    originalFileName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectCoverAssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectCoverAssetWhereInput | ProjectCoverAssetWhereInput[]
    OR?: ProjectCoverAssetWhereInput[]
    NOT?: ProjectCoverAssetWhereInput | ProjectCoverAssetWhereInput[]
    projectId?: StringFilter<"ProjectCoverAsset"> | string
    assetType?: StringFilter<"ProjectCoverAsset"> | string
    originalFileName?: StringFilter<"ProjectCoverAsset"> | string
    filePath?: StringFilter<"ProjectCoverAsset"> | string
    fileSize?: IntFilter<"ProjectCoverAsset"> | number
    mimeType?: StringFilter<"ProjectCoverAsset"> | string
    width?: IntNullableFilter<"ProjectCoverAsset"> | number | null
    height?: IntNullableFilter<"ProjectCoverAsset"> | number | null
    createdAt?: DateTimeFilter<"ProjectCoverAsset"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id">

  export type ProjectCoverAssetOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    assetType?: SortOrder
    originalFileName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ProjectCoverAssetCountOrderByAggregateInput
    _avg?: ProjectCoverAssetAvgOrderByAggregateInput
    _max?: ProjectCoverAssetMaxOrderByAggregateInput
    _min?: ProjectCoverAssetMinOrderByAggregateInput
    _sum?: ProjectCoverAssetSumOrderByAggregateInput
  }

  export type ProjectCoverAssetScalarWhereWithAggregatesInput = {
    AND?: ProjectCoverAssetScalarWhereWithAggregatesInput | ProjectCoverAssetScalarWhereWithAggregatesInput[]
    OR?: ProjectCoverAssetScalarWhereWithAggregatesInput[]
    NOT?: ProjectCoverAssetScalarWhereWithAggregatesInput | ProjectCoverAssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectCoverAsset"> | string
    projectId?: StringWithAggregatesFilter<"ProjectCoverAsset"> | string
    assetType?: StringWithAggregatesFilter<"ProjectCoverAsset"> | string
    originalFileName?: StringWithAggregatesFilter<"ProjectCoverAsset"> | string
    filePath?: StringWithAggregatesFilter<"ProjectCoverAsset"> | string
    fileSize?: IntWithAggregatesFilter<"ProjectCoverAsset"> | number
    mimeType?: StringWithAggregatesFilter<"ProjectCoverAsset"> | string
    width?: IntNullableWithAggregatesFilter<"ProjectCoverAsset"> | number | null
    height?: IntNullableWithAggregatesFilter<"ProjectCoverAsset"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ProjectCoverAsset"> | Date | string
  }

  export type RecentProjectWhereInput = {
    AND?: RecentProjectWhereInput | RecentProjectWhereInput[]
    OR?: RecentProjectWhereInput[]
    NOT?: RecentProjectWhereInput | RecentProjectWhereInput[]
    id?: StringFilter<"RecentProject"> | string
    projectId?: StringFilter<"RecentProject"> | string
    position?: IntFilter<"RecentProject"> | number
    accessedAt?: DateTimeFilter<"RecentProject"> | Date | string
  }

  export type RecentProjectOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    position?: SortOrder
    accessedAt?: SortOrder
  }

  export type RecentProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId?: string
    AND?: RecentProjectWhereInput | RecentProjectWhereInput[]
    OR?: RecentProjectWhereInput[]
    NOT?: RecentProjectWhereInput | RecentProjectWhereInput[]
    position?: IntFilter<"RecentProject"> | number
    accessedAt?: DateTimeFilter<"RecentProject"> | Date | string
  }, "id" | "projectId">

  export type RecentProjectOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    position?: SortOrder
    accessedAt?: SortOrder
    _count?: RecentProjectCountOrderByAggregateInput
    _avg?: RecentProjectAvgOrderByAggregateInput
    _max?: RecentProjectMaxOrderByAggregateInput
    _min?: RecentProjectMinOrderByAggregateInput
    _sum?: RecentProjectSumOrderByAggregateInput
  }

  export type RecentProjectScalarWhereWithAggregatesInput = {
    AND?: RecentProjectScalarWhereWithAggregatesInput | RecentProjectScalarWhereWithAggregatesInput[]
    OR?: RecentProjectScalarWhereWithAggregatesInput[]
    NOT?: RecentProjectScalarWhereWithAggregatesInput | RecentProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RecentProject"> | string
    projectId?: StringWithAggregatesFilter<"RecentProject"> | string
    position?: IntWithAggregatesFilter<"RecentProject"> | number
    accessedAt?: DateTimeWithAggregatesFilter<"RecentProject"> | Date | string
  }

  export type AppSettingWhereInput = {
    AND?: AppSettingWhereInput | AppSettingWhereInput[]
    OR?: AppSettingWhereInput[]
    NOT?: AppSettingWhereInput | AppSettingWhereInput[]
    key?: StringFilter<"AppSetting"> | string
    value?: StringFilter<"AppSetting"> | string
    updatedAt?: DateTimeFilter<"AppSetting"> | Date | string
  }

  export type AppSettingOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: AppSettingWhereInput | AppSettingWhereInput[]
    OR?: AppSettingWhereInput[]
    NOT?: AppSettingWhereInput | AppSettingWhereInput[]
    value?: StringFilter<"AppSetting"> | string
    updatedAt?: DateTimeFilter<"AppSetting"> | Date | string
  }, "key">

  export type AppSettingOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    _count?: AppSettingCountOrderByAggregateInput
    _max?: AppSettingMaxOrderByAggregateInput
    _min?: AppSettingMinOrderByAggregateInput
  }

  export type AppSettingScalarWhereWithAggregatesInput = {
    AND?: AppSettingScalarWhereWithAggregatesInput | AppSettingScalarWhereWithAggregatesInput[]
    OR?: AppSettingScalarWhereWithAggregatesInput[]
    NOT?: AppSettingScalarWhereWithAggregatesInput | AppSettingScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<"AppSetting"> | string
    value?: StringWithAggregatesFilter<"AppSetting"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"AppSetting"> | Date | string
  }

  export type CachedFontWhereInput = {
    AND?: CachedFontWhereInput | CachedFontWhereInput[]
    OR?: CachedFontWhereInput[]
    NOT?: CachedFontWhereInput | CachedFontWhereInput[]
    id?: StringFilter<"CachedFont"> | string
    family?: StringFilter<"CachedFont"> | string
    variant?: StringFilter<"CachedFont"> | string
    filePath?: StringFilter<"CachedFont"> | string
    fileSize?: IntFilter<"CachedFont"> | number
    downloadedAt?: DateTimeFilter<"CachedFont"> | Date | string
  }

  export type CachedFontOrderByWithRelationInput = {
    id?: SortOrder
    family?: SortOrder
    variant?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    downloadedAt?: SortOrder
  }

  export type CachedFontWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    family?: string
    AND?: CachedFontWhereInput | CachedFontWhereInput[]
    OR?: CachedFontWhereInput[]
    NOT?: CachedFontWhereInput | CachedFontWhereInput[]
    variant?: StringFilter<"CachedFont"> | string
    filePath?: StringFilter<"CachedFont"> | string
    fileSize?: IntFilter<"CachedFont"> | number
    downloadedAt?: DateTimeFilter<"CachedFont"> | Date | string
  }, "id" | "family">

  export type CachedFontOrderByWithAggregationInput = {
    id?: SortOrder
    family?: SortOrder
    variant?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    downloadedAt?: SortOrder
    _count?: CachedFontCountOrderByAggregateInput
    _avg?: CachedFontAvgOrderByAggregateInput
    _max?: CachedFontMaxOrderByAggregateInput
    _min?: CachedFontMinOrderByAggregateInput
    _sum?: CachedFontSumOrderByAggregateInput
  }

  export type CachedFontScalarWhereWithAggregatesInput = {
    AND?: CachedFontScalarWhereWithAggregatesInput | CachedFontScalarWhereWithAggregatesInput[]
    OR?: CachedFontScalarWhereWithAggregatesInput[]
    NOT?: CachedFontScalarWhereWithAggregatesInput | CachedFontScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CachedFont"> | string
    family?: StringWithAggregatesFilter<"CachedFont"> | string
    variant?: StringWithAggregatesFilter<"CachedFont"> | string
    filePath?: StringWithAggregatesFilter<"CachedFont"> | string
    fileSize?: IntWithAggregatesFilter<"CachedFont"> | number
    downloadedAt?: DateTimeWithAggregatesFilter<"CachedFont"> | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    filePath: string
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
    theme?: ThemeCreateNestedOneWithoutProjectsInput
    coverTemplate?: CoverTemplateCreateNestedOneWithoutProjectsInput
    coverAssets?: ProjectCoverAssetCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    name: string
    filePath: string
    themeId?: string | null
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    coverTemplateId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
    coverAssets?: ProjectCoverAssetUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneWithoutProjectsNestedInput
    coverTemplate?: CoverTemplateUpdateOneWithoutProjectsNestedInput
    coverAssets?: ProjectCoverAssetUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    coverTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coverAssets?: ProjectCoverAssetUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    name: string
    filePath: string
    themeId?: string | null
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    coverTemplateId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    coverTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemeCreateInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    headingFont: string
    bodyFont: string
    h1Size?: number
    h2Size?: number
    h3Size?: number
    h4Size?: number
    h5Size?: number
    h6Size?: number
    bodySize?: number
    kerning?: number
    leading?: number
    pageWidth?: number
    pageHeight?: number
    marginTop?: number
    marginBottom?: number
    marginLeft?: number
    marginRight?: number
    backgroundColor?: string
    textColor?: string
    headingColor?: string
    linkColor?: string
    codeBackground?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutThemeInput
  }

  export type ThemeUncheckedCreateInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    headingFont: string
    bodyFont: string
    h1Size?: number
    h2Size?: number
    h3Size?: number
    h4Size?: number
    h5Size?: number
    h6Size?: number
    bodySize?: number
    kerning?: number
    leading?: number
    pageWidth?: number
    pageHeight?: number
    marginTop?: number
    marginBottom?: number
    marginLeft?: number
    marginRight?: number
    backgroundColor?: string
    textColor?: string
    headingColor?: string
    linkColor?: string
    codeBackground?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutThemeInput
  }

  export type ThemeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    headingFont?: StringFieldUpdateOperationsInput | string
    bodyFont?: StringFieldUpdateOperationsInput | string
    h1Size?: FloatFieldUpdateOperationsInput | number
    h2Size?: FloatFieldUpdateOperationsInput | number
    h3Size?: FloatFieldUpdateOperationsInput | number
    h4Size?: FloatFieldUpdateOperationsInput | number
    h5Size?: FloatFieldUpdateOperationsInput | number
    h6Size?: FloatFieldUpdateOperationsInput | number
    bodySize?: FloatFieldUpdateOperationsInput | number
    kerning?: FloatFieldUpdateOperationsInput | number
    leading?: FloatFieldUpdateOperationsInput | number
    pageWidth?: FloatFieldUpdateOperationsInput | number
    pageHeight?: FloatFieldUpdateOperationsInput | number
    marginTop?: FloatFieldUpdateOperationsInput | number
    marginBottom?: FloatFieldUpdateOperationsInput | number
    marginLeft?: FloatFieldUpdateOperationsInput | number
    marginRight?: FloatFieldUpdateOperationsInput | number
    backgroundColor?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    headingColor?: StringFieldUpdateOperationsInput | string
    linkColor?: StringFieldUpdateOperationsInput | string
    codeBackground?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutThemeNestedInput
  }

  export type ThemeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    headingFont?: StringFieldUpdateOperationsInput | string
    bodyFont?: StringFieldUpdateOperationsInput | string
    h1Size?: FloatFieldUpdateOperationsInput | number
    h2Size?: FloatFieldUpdateOperationsInput | number
    h3Size?: FloatFieldUpdateOperationsInput | number
    h4Size?: FloatFieldUpdateOperationsInput | number
    h5Size?: FloatFieldUpdateOperationsInput | number
    h6Size?: FloatFieldUpdateOperationsInput | number
    bodySize?: FloatFieldUpdateOperationsInput | number
    kerning?: FloatFieldUpdateOperationsInput | number
    leading?: FloatFieldUpdateOperationsInput | number
    pageWidth?: FloatFieldUpdateOperationsInput | number
    pageHeight?: FloatFieldUpdateOperationsInput | number
    marginTop?: FloatFieldUpdateOperationsInput | number
    marginBottom?: FloatFieldUpdateOperationsInput | number
    marginLeft?: FloatFieldUpdateOperationsInput | number
    marginRight?: FloatFieldUpdateOperationsInput | number
    backgroundColor?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    headingColor?: StringFieldUpdateOperationsInput | string
    linkColor?: StringFieldUpdateOperationsInput | string
    codeBackground?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutThemeNestedInput
  }

  export type ThemeCreateManyInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    headingFont: string
    bodyFont: string
    h1Size?: number
    h2Size?: number
    h3Size?: number
    h4Size?: number
    h5Size?: number
    h6Size?: number
    bodySize?: number
    kerning?: number
    leading?: number
    pageWidth?: number
    pageHeight?: number
    marginTop?: number
    marginBottom?: number
    marginLeft?: number
    marginRight?: number
    backgroundColor?: string
    textColor?: string
    headingColor?: string
    linkColor?: string
    codeBackground?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThemeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    headingFont?: StringFieldUpdateOperationsInput | string
    bodyFont?: StringFieldUpdateOperationsInput | string
    h1Size?: FloatFieldUpdateOperationsInput | number
    h2Size?: FloatFieldUpdateOperationsInput | number
    h3Size?: FloatFieldUpdateOperationsInput | number
    h4Size?: FloatFieldUpdateOperationsInput | number
    h5Size?: FloatFieldUpdateOperationsInput | number
    h6Size?: FloatFieldUpdateOperationsInput | number
    bodySize?: FloatFieldUpdateOperationsInput | number
    kerning?: FloatFieldUpdateOperationsInput | number
    leading?: FloatFieldUpdateOperationsInput | number
    pageWidth?: FloatFieldUpdateOperationsInput | number
    pageHeight?: FloatFieldUpdateOperationsInput | number
    marginTop?: FloatFieldUpdateOperationsInput | number
    marginBottom?: FloatFieldUpdateOperationsInput | number
    marginLeft?: FloatFieldUpdateOperationsInput | number
    marginRight?: FloatFieldUpdateOperationsInput | number
    backgroundColor?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    headingColor?: StringFieldUpdateOperationsInput | string
    linkColor?: StringFieldUpdateOperationsInput | string
    codeBackground?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    headingFont?: StringFieldUpdateOperationsInput | string
    bodyFont?: StringFieldUpdateOperationsInput | string
    h1Size?: FloatFieldUpdateOperationsInput | number
    h2Size?: FloatFieldUpdateOperationsInput | number
    h3Size?: FloatFieldUpdateOperationsInput | number
    h4Size?: FloatFieldUpdateOperationsInput | number
    h5Size?: FloatFieldUpdateOperationsInput | number
    h6Size?: FloatFieldUpdateOperationsInput | number
    bodySize?: FloatFieldUpdateOperationsInput | number
    kerning?: FloatFieldUpdateOperationsInput | number
    leading?: FloatFieldUpdateOperationsInput | number
    pageWidth?: FloatFieldUpdateOperationsInput | number
    pageHeight?: FloatFieldUpdateOperationsInput | number
    marginTop?: FloatFieldUpdateOperationsInput | number
    marginBottom?: FloatFieldUpdateOperationsInput | number
    marginLeft?: FloatFieldUpdateOperationsInput | number
    marginRight?: FloatFieldUpdateOperationsInput | number
    backgroundColor?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    headingColor?: StringFieldUpdateOperationsInput | string
    linkColor?: StringFieldUpdateOperationsInput | string
    codeBackground?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoverTemplateCreateInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    layoutJson: string
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutCoverTemplateInput
  }

  export type CoverTemplateUncheckedCreateInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    layoutJson: string
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutCoverTemplateInput
  }

  export type CoverTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    layoutJson?: StringFieldUpdateOperationsInput | string
    hasLogoSlot?: BoolFieldUpdateOperationsInput | boolean
    hasBackgroundSlot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutCoverTemplateNestedInput
  }

  export type CoverTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    layoutJson?: StringFieldUpdateOperationsInput | string
    hasLogoSlot?: BoolFieldUpdateOperationsInput | boolean
    hasBackgroundSlot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutCoverTemplateNestedInput
  }

  export type CoverTemplateCreateManyInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    layoutJson: string
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CoverTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    layoutJson?: StringFieldUpdateOperationsInput | string
    hasLogoSlot?: BoolFieldUpdateOperationsInput | boolean
    hasBackgroundSlot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoverTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    layoutJson?: StringFieldUpdateOperationsInput | string
    hasLogoSlot?: BoolFieldUpdateOperationsInput | boolean
    hasBackgroundSlot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCoverAssetCreateInput = {
    id?: string
    assetType: string
    originalFileName: string
    filePath: string
    fileSize: number
    mimeType: string
    width?: number | null
    height?: number | null
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutCoverAssetsInput
  }

  export type ProjectCoverAssetUncheckedCreateInput = {
    id?: string
    projectId: string
    assetType: string
    originalFileName: string
    filePath: string
    fileSize: number
    mimeType: string
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type ProjectCoverAssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetType?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutCoverAssetsNestedInput
  }

  export type ProjectCoverAssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    assetType?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCoverAssetCreateManyInput = {
    id?: string
    projectId: string
    assetType: string
    originalFileName: string
    filePath: string
    fileSize: number
    mimeType: string
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type ProjectCoverAssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetType?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCoverAssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    assetType?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentProjectCreateInput = {
    id?: string
    projectId: string
    position: number
    accessedAt?: Date | string
  }

  export type RecentProjectUncheckedCreateInput = {
    id?: string
    projectId: string
    position: number
    accessedAt?: Date | string
  }

  export type RecentProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    accessedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    accessedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentProjectCreateManyInput = {
    id?: string
    projectId: string
    position: number
    accessedAt?: Date | string
  }

  export type RecentProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    accessedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecentProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    accessedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingCreateInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type AppSettingUncheckedCreateInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type AppSettingUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingCreateManyInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type AppSettingUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedFontCreateInput = {
    id?: string
    family: string
    variant: string
    filePath: string
    fileSize: number
    downloadedAt?: Date | string
  }

  export type CachedFontUncheckedCreateInput = {
    id?: string
    family: string
    variant: string
    filePath: string
    fileSize: number
    downloadedAt?: Date | string
  }

  export type CachedFontUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    family?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    downloadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedFontUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    family?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    downloadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedFontCreateManyInput = {
    id?: string
    family: string
    variant: string
    filePath: string
    fileSize: number
    downloadedAt?: Date | string
  }

  export type CachedFontUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    family?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    downloadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CachedFontUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    family?: StringFieldUpdateOperationsInput | string
    variant?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    downloadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ThemeNullableScalarRelationFilter = {
    is?: ThemeWhereInput | null
    isNot?: ThemeWhereInput | null
  }

  export type CoverTemplateNullableScalarRelationFilter = {
    is?: CoverTemplateWhereInput | null
    isNot?: CoverTemplateWhereInput | null
  }

  export type ProjectCoverAssetListRelationFilter = {
    every?: ProjectCoverAssetWhereInput
    some?: ProjectCoverAssetWhereInput
    none?: ProjectCoverAssetWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectCoverAssetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    themeId?: SortOrder
    hasCoverPage?: SortOrder
    coverTitle?: SortOrder
    coverSubtitle?: SortOrder
    coverAuthor?: SortOrder
    coverDate?: SortOrder
    coverTemplateId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastOpenedAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    themeId?: SortOrder
    hasCoverPage?: SortOrder
    coverTitle?: SortOrder
    coverSubtitle?: SortOrder
    coverAuthor?: SortOrder
    coverDate?: SortOrder
    coverTemplateId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastOpenedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    filePath?: SortOrder
    themeId?: SortOrder
    hasCoverPage?: SortOrder
    coverTitle?: SortOrder
    coverSubtitle?: SortOrder
    coverAuthor?: SortOrder
    coverDate?: SortOrder
    coverTemplateId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastOpenedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ThemeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    headingFont?: SortOrder
    bodyFont?: SortOrder
    h1Size?: SortOrder
    h2Size?: SortOrder
    h3Size?: SortOrder
    h4Size?: SortOrder
    h5Size?: SortOrder
    h6Size?: SortOrder
    bodySize?: SortOrder
    kerning?: SortOrder
    leading?: SortOrder
    pageWidth?: SortOrder
    pageHeight?: SortOrder
    marginTop?: SortOrder
    marginBottom?: SortOrder
    marginLeft?: SortOrder
    marginRight?: SortOrder
    backgroundColor?: SortOrder
    textColor?: SortOrder
    headingColor?: SortOrder
    linkColor?: SortOrder
    codeBackground?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThemeAvgOrderByAggregateInput = {
    h1Size?: SortOrder
    h2Size?: SortOrder
    h3Size?: SortOrder
    h4Size?: SortOrder
    h5Size?: SortOrder
    h6Size?: SortOrder
    bodySize?: SortOrder
    kerning?: SortOrder
    leading?: SortOrder
    pageWidth?: SortOrder
    pageHeight?: SortOrder
    marginTop?: SortOrder
    marginBottom?: SortOrder
    marginLeft?: SortOrder
    marginRight?: SortOrder
  }

  export type ThemeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    headingFont?: SortOrder
    bodyFont?: SortOrder
    h1Size?: SortOrder
    h2Size?: SortOrder
    h3Size?: SortOrder
    h4Size?: SortOrder
    h5Size?: SortOrder
    h6Size?: SortOrder
    bodySize?: SortOrder
    kerning?: SortOrder
    leading?: SortOrder
    pageWidth?: SortOrder
    pageHeight?: SortOrder
    marginTop?: SortOrder
    marginBottom?: SortOrder
    marginLeft?: SortOrder
    marginRight?: SortOrder
    backgroundColor?: SortOrder
    textColor?: SortOrder
    headingColor?: SortOrder
    linkColor?: SortOrder
    codeBackground?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThemeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    headingFont?: SortOrder
    bodyFont?: SortOrder
    h1Size?: SortOrder
    h2Size?: SortOrder
    h3Size?: SortOrder
    h4Size?: SortOrder
    h5Size?: SortOrder
    h6Size?: SortOrder
    bodySize?: SortOrder
    kerning?: SortOrder
    leading?: SortOrder
    pageWidth?: SortOrder
    pageHeight?: SortOrder
    marginTop?: SortOrder
    marginBottom?: SortOrder
    marginLeft?: SortOrder
    marginRight?: SortOrder
    backgroundColor?: SortOrder
    textColor?: SortOrder
    headingColor?: SortOrder
    linkColor?: SortOrder
    codeBackground?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThemeSumOrderByAggregateInput = {
    h1Size?: SortOrder
    h2Size?: SortOrder
    h3Size?: SortOrder
    h4Size?: SortOrder
    h5Size?: SortOrder
    h6Size?: SortOrder
    bodySize?: SortOrder
    kerning?: SortOrder
    leading?: SortOrder
    pageWidth?: SortOrder
    pageHeight?: SortOrder
    marginTop?: SortOrder
    marginBottom?: SortOrder
    marginLeft?: SortOrder
    marginRight?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type CoverTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    layoutJson?: SortOrder
    hasLogoSlot?: SortOrder
    hasBackgroundSlot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CoverTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    layoutJson?: SortOrder
    hasLogoSlot?: SortOrder
    hasBackgroundSlot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CoverTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isBuiltIn?: SortOrder
    layoutJson?: SortOrder
    hasLogoSlot?: SortOrder
    hasBackgroundSlot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ProjectCoverAssetCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    assetType?: SortOrder
    originalFileName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    width?: SortOrder
    height?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectCoverAssetAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type ProjectCoverAssetMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    assetType?: SortOrder
    originalFileName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    width?: SortOrder
    height?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectCoverAssetMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    assetType?: SortOrder
    originalFileName?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    width?: SortOrder
    height?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectCoverAssetSumOrderByAggregateInput = {
    fileSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type RecentProjectCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    position?: SortOrder
    accessedAt?: SortOrder
  }

  export type RecentProjectAvgOrderByAggregateInput = {
    position?: SortOrder
  }

  export type RecentProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    position?: SortOrder
    accessedAt?: SortOrder
  }

  export type RecentProjectMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    position?: SortOrder
    accessedAt?: SortOrder
  }

  export type RecentProjectSumOrderByAggregateInput = {
    position?: SortOrder
  }

  export type AppSettingCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingMaxOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingMinOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type CachedFontCountOrderByAggregateInput = {
    id?: SortOrder
    family?: SortOrder
    variant?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    downloadedAt?: SortOrder
  }

  export type CachedFontAvgOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type CachedFontMaxOrderByAggregateInput = {
    id?: SortOrder
    family?: SortOrder
    variant?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    downloadedAt?: SortOrder
  }

  export type CachedFontMinOrderByAggregateInput = {
    id?: SortOrder
    family?: SortOrder
    variant?: SortOrder
    filePath?: SortOrder
    fileSize?: SortOrder
    downloadedAt?: SortOrder
  }

  export type CachedFontSumOrderByAggregateInput = {
    fileSize?: SortOrder
  }

  export type ThemeCreateNestedOneWithoutProjectsInput = {
    create?: XOR<ThemeCreateWithoutProjectsInput, ThemeUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutProjectsInput
    connect?: ThemeWhereUniqueInput
  }

  export type CoverTemplateCreateNestedOneWithoutProjectsInput = {
    create?: XOR<CoverTemplateCreateWithoutProjectsInput, CoverTemplateUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: CoverTemplateCreateOrConnectWithoutProjectsInput
    connect?: CoverTemplateWhereUniqueInput
  }

  export type ProjectCoverAssetCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectCoverAssetCreateWithoutProjectInput, ProjectCoverAssetUncheckedCreateWithoutProjectInput> | ProjectCoverAssetCreateWithoutProjectInput[] | ProjectCoverAssetUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectCoverAssetCreateOrConnectWithoutProjectInput | ProjectCoverAssetCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectCoverAssetCreateManyProjectInputEnvelope
    connect?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
  }

  export type ProjectCoverAssetUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectCoverAssetCreateWithoutProjectInput, ProjectCoverAssetUncheckedCreateWithoutProjectInput> | ProjectCoverAssetCreateWithoutProjectInput[] | ProjectCoverAssetUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectCoverAssetCreateOrConnectWithoutProjectInput | ProjectCoverAssetCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectCoverAssetCreateManyProjectInputEnvelope
    connect?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ThemeUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<ThemeCreateWithoutProjectsInput, ThemeUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutProjectsInput
    upsert?: ThemeUpsertWithoutProjectsInput
    disconnect?: ThemeWhereInput | boolean
    delete?: ThemeWhereInput | boolean
    connect?: ThemeWhereUniqueInput
    update?: XOR<XOR<ThemeUpdateToOneWithWhereWithoutProjectsInput, ThemeUpdateWithoutProjectsInput>, ThemeUncheckedUpdateWithoutProjectsInput>
  }

  export type CoverTemplateUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<CoverTemplateCreateWithoutProjectsInput, CoverTemplateUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: CoverTemplateCreateOrConnectWithoutProjectsInput
    upsert?: CoverTemplateUpsertWithoutProjectsInput
    disconnect?: CoverTemplateWhereInput | boolean
    delete?: CoverTemplateWhereInput | boolean
    connect?: CoverTemplateWhereUniqueInput
    update?: XOR<XOR<CoverTemplateUpdateToOneWithWhereWithoutProjectsInput, CoverTemplateUpdateWithoutProjectsInput>, CoverTemplateUncheckedUpdateWithoutProjectsInput>
  }

  export type ProjectCoverAssetUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectCoverAssetCreateWithoutProjectInput, ProjectCoverAssetUncheckedCreateWithoutProjectInput> | ProjectCoverAssetCreateWithoutProjectInput[] | ProjectCoverAssetUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectCoverAssetCreateOrConnectWithoutProjectInput | ProjectCoverAssetCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectCoverAssetUpsertWithWhereUniqueWithoutProjectInput | ProjectCoverAssetUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectCoverAssetCreateManyProjectInputEnvelope
    set?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
    disconnect?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
    delete?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
    connect?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
    update?: ProjectCoverAssetUpdateWithWhereUniqueWithoutProjectInput | ProjectCoverAssetUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectCoverAssetUpdateManyWithWhereWithoutProjectInput | ProjectCoverAssetUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectCoverAssetScalarWhereInput | ProjectCoverAssetScalarWhereInput[]
  }

  export type ProjectCoverAssetUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectCoverAssetCreateWithoutProjectInput, ProjectCoverAssetUncheckedCreateWithoutProjectInput> | ProjectCoverAssetCreateWithoutProjectInput[] | ProjectCoverAssetUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectCoverAssetCreateOrConnectWithoutProjectInput | ProjectCoverAssetCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectCoverAssetUpsertWithWhereUniqueWithoutProjectInput | ProjectCoverAssetUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectCoverAssetCreateManyProjectInputEnvelope
    set?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
    disconnect?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
    delete?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
    connect?: ProjectCoverAssetWhereUniqueInput | ProjectCoverAssetWhereUniqueInput[]
    update?: ProjectCoverAssetUpdateWithWhereUniqueWithoutProjectInput | ProjectCoverAssetUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectCoverAssetUpdateManyWithWhereWithoutProjectInput | ProjectCoverAssetUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectCoverAssetScalarWhereInput | ProjectCoverAssetScalarWhereInput[]
  }

  export type ProjectCreateNestedManyWithoutThemeInput = {
    create?: XOR<ProjectCreateWithoutThemeInput, ProjectUncheckedCreateWithoutThemeInput> | ProjectCreateWithoutThemeInput[] | ProjectUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutThemeInput | ProjectCreateOrConnectWithoutThemeInput[]
    createMany?: ProjectCreateManyThemeInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutThemeInput = {
    create?: XOR<ProjectCreateWithoutThemeInput, ProjectUncheckedCreateWithoutThemeInput> | ProjectCreateWithoutThemeInput[] | ProjectUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutThemeInput | ProjectCreateOrConnectWithoutThemeInput[]
    createMany?: ProjectCreateManyThemeInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateManyWithoutThemeNestedInput = {
    create?: XOR<ProjectCreateWithoutThemeInput, ProjectUncheckedCreateWithoutThemeInput> | ProjectCreateWithoutThemeInput[] | ProjectUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutThemeInput | ProjectCreateOrConnectWithoutThemeInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutThemeInput | ProjectUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: ProjectCreateManyThemeInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutThemeInput | ProjectUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutThemeInput | ProjectUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutThemeNestedInput = {
    create?: XOR<ProjectCreateWithoutThemeInput, ProjectUncheckedCreateWithoutThemeInput> | ProjectCreateWithoutThemeInput[] | ProjectUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutThemeInput | ProjectCreateOrConnectWithoutThemeInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutThemeInput | ProjectUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: ProjectCreateManyThemeInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutThemeInput | ProjectUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutThemeInput | ProjectUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectCreateNestedManyWithoutCoverTemplateInput = {
    create?: XOR<ProjectCreateWithoutCoverTemplateInput, ProjectUncheckedCreateWithoutCoverTemplateInput> | ProjectCreateWithoutCoverTemplateInput[] | ProjectUncheckedCreateWithoutCoverTemplateInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCoverTemplateInput | ProjectCreateOrConnectWithoutCoverTemplateInput[]
    createMany?: ProjectCreateManyCoverTemplateInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutCoverTemplateInput = {
    create?: XOR<ProjectCreateWithoutCoverTemplateInput, ProjectUncheckedCreateWithoutCoverTemplateInput> | ProjectCreateWithoutCoverTemplateInput[] | ProjectUncheckedCreateWithoutCoverTemplateInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCoverTemplateInput | ProjectCreateOrConnectWithoutCoverTemplateInput[]
    createMany?: ProjectCreateManyCoverTemplateInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUpdateManyWithoutCoverTemplateNestedInput = {
    create?: XOR<ProjectCreateWithoutCoverTemplateInput, ProjectUncheckedCreateWithoutCoverTemplateInput> | ProjectCreateWithoutCoverTemplateInput[] | ProjectUncheckedCreateWithoutCoverTemplateInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCoverTemplateInput | ProjectCreateOrConnectWithoutCoverTemplateInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutCoverTemplateInput | ProjectUpsertWithWhereUniqueWithoutCoverTemplateInput[]
    createMany?: ProjectCreateManyCoverTemplateInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutCoverTemplateInput | ProjectUpdateWithWhereUniqueWithoutCoverTemplateInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutCoverTemplateInput | ProjectUpdateManyWithWhereWithoutCoverTemplateInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutCoverTemplateNestedInput = {
    create?: XOR<ProjectCreateWithoutCoverTemplateInput, ProjectUncheckedCreateWithoutCoverTemplateInput> | ProjectCreateWithoutCoverTemplateInput[] | ProjectUncheckedCreateWithoutCoverTemplateInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCoverTemplateInput | ProjectCreateOrConnectWithoutCoverTemplateInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutCoverTemplateInput | ProjectUpsertWithWhereUniqueWithoutCoverTemplateInput[]
    createMany?: ProjectCreateManyCoverTemplateInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutCoverTemplateInput | ProjectUpdateWithWhereUniqueWithoutCoverTemplateInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutCoverTemplateInput | ProjectUpdateManyWithWhereWithoutCoverTemplateInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutCoverAssetsInput = {
    create?: XOR<ProjectCreateWithoutCoverAssetsInput, ProjectUncheckedCreateWithoutCoverAssetsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCoverAssetsInput
    connect?: ProjectWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutCoverAssetsNestedInput = {
    create?: XOR<ProjectCreateWithoutCoverAssetsInput, ProjectUncheckedCreateWithoutCoverAssetsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCoverAssetsInput
    upsert?: ProjectUpsertWithoutCoverAssetsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutCoverAssetsInput, ProjectUpdateWithoutCoverAssetsInput>, ProjectUncheckedUpdateWithoutCoverAssetsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ThemeCreateWithoutProjectsInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    headingFont: string
    bodyFont: string
    h1Size?: number
    h2Size?: number
    h3Size?: number
    h4Size?: number
    h5Size?: number
    h6Size?: number
    bodySize?: number
    kerning?: number
    leading?: number
    pageWidth?: number
    pageHeight?: number
    marginTop?: number
    marginBottom?: number
    marginLeft?: number
    marginRight?: number
    backgroundColor?: string
    textColor?: string
    headingColor?: string
    linkColor?: string
    codeBackground?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThemeUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    headingFont: string
    bodyFont: string
    h1Size?: number
    h2Size?: number
    h3Size?: number
    h4Size?: number
    h5Size?: number
    h6Size?: number
    bodySize?: number
    kerning?: number
    leading?: number
    pageWidth?: number
    pageHeight?: number
    marginTop?: number
    marginBottom?: number
    marginLeft?: number
    marginRight?: number
    backgroundColor?: string
    textColor?: string
    headingColor?: string
    linkColor?: string
    codeBackground?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThemeCreateOrConnectWithoutProjectsInput = {
    where: ThemeWhereUniqueInput
    create: XOR<ThemeCreateWithoutProjectsInput, ThemeUncheckedCreateWithoutProjectsInput>
  }

  export type CoverTemplateCreateWithoutProjectsInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    layoutJson: string
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CoverTemplateUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
    isBuiltIn?: boolean
    layoutJson: string
    hasLogoSlot?: boolean
    hasBackgroundSlot?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CoverTemplateCreateOrConnectWithoutProjectsInput = {
    where: CoverTemplateWhereUniqueInput
    create: XOR<CoverTemplateCreateWithoutProjectsInput, CoverTemplateUncheckedCreateWithoutProjectsInput>
  }

  export type ProjectCoverAssetCreateWithoutProjectInput = {
    id?: string
    assetType: string
    originalFileName: string
    filePath: string
    fileSize: number
    mimeType: string
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type ProjectCoverAssetUncheckedCreateWithoutProjectInput = {
    id?: string
    assetType: string
    originalFileName: string
    filePath: string
    fileSize: number
    mimeType: string
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type ProjectCoverAssetCreateOrConnectWithoutProjectInput = {
    where: ProjectCoverAssetWhereUniqueInput
    create: XOR<ProjectCoverAssetCreateWithoutProjectInput, ProjectCoverAssetUncheckedCreateWithoutProjectInput>
  }

  export type ProjectCoverAssetCreateManyProjectInputEnvelope = {
    data: ProjectCoverAssetCreateManyProjectInput | ProjectCoverAssetCreateManyProjectInput[]
  }

  export type ThemeUpsertWithoutProjectsInput = {
    update: XOR<ThemeUpdateWithoutProjectsInput, ThemeUncheckedUpdateWithoutProjectsInput>
    create: XOR<ThemeCreateWithoutProjectsInput, ThemeUncheckedCreateWithoutProjectsInput>
    where?: ThemeWhereInput
  }

  export type ThemeUpdateToOneWithWhereWithoutProjectsInput = {
    where?: ThemeWhereInput
    data: XOR<ThemeUpdateWithoutProjectsInput, ThemeUncheckedUpdateWithoutProjectsInput>
  }

  export type ThemeUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    headingFont?: StringFieldUpdateOperationsInput | string
    bodyFont?: StringFieldUpdateOperationsInput | string
    h1Size?: FloatFieldUpdateOperationsInput | number
    h2Size?: FloatFieldUpdateOperationsInput | number
    h3Size?: FloatFieldUpdateOperationsInput | number
    h4Size?: FloatFieldUpdateOperationsInput | number
    h5Size?: FloatFieldUpdateOperationsInput | number
    h6Size?: FloatFieldUpdateOperationsInput | number
    bodySize?: FloatFieldUpdateOperationsInput | number
    kerning?: FloatFieldUpdateOperationsInput | number
    leading?: FloatFieldUpdateOperationsInput | number
    pageWidth?: FloatFieldUpdateOperationsInput | number
    pageHeight?: FloatFieldUpdateOperationsInput | number
    marginTop?: FloatFieldUpdateOperationsInput | number
    marginBottom?: FloatFieldUpdateOperationsInput | number
    marginLeft?: FloatFieldUpdateOperationsInput | number
    marginRight?: FloatFieldUpdateOperationsInput | number
    backgroundColor?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    headingColor?: StringFieldUpdateOperationsInput | string
    linkColor?: StringFieldUpdateOperationsInput | string
    codeBackground?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemeUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    headingFont?: StringFieldUpdateOperationsInput | string
    bodyFont?: StringFieldUpdateOperationsInput | string
    h1Size?: FloatFieldUpdateOperationsInput | number
    h2Size?: FloatFieldUpdateOperationsInput | number
    h3Size?: FloatFieldUpdateOperationsInput | number
    h4Size?: FloatFieldUpdateOperationsInput | number
    h5Size?: FloatFieldUpdateOperationsInput | number
    h6Size?: FloatFieldUpdateOperationsInput | number
    bodySize?: FloatFieldUpdateOperationsInput | number
    kerning?: FloatFieldUpdateOperationsInput | number
    leading?: FloatFieldUpdateOperationsInput | number
    pageWidth?: FloatFieldUpdateOperationsInput | number
    pageHeight?: FloatFieldUpdateOperationsInput | number
    marginTop?: FloatFieldUpdateOperationsInput | number
    marginBottom?: FloatFieldUpdateOperationsInput | number
    marginLeft?: FloatFieldUpdateOperationsInput | number
    marginRight?: FloatFieldUpdateOperationsInput | number
    backgroundColor?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    headingColor?: StringFieldUpdateOperationsInput | string
    linkColor?: StringFieldUpdateOperationsInput | string
    codeBackground?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoverTemplateUpsertWithoutProjectsInput = {
    update: XOR<CoverTemplateUpdateWithoutProjectsInput, CoverTemplateUncheckedUpdateWithoutProjectsInput>
    create: XOR<CoverTemplateCreateWithoutProjectsInput, CoverTemplateUncheckedCreateWithoutProjectsInput>
    where?: CoverTemplateWhereInput
  }

  export type CoverTemplateUpdateToOneWithWhereWithoutProjectsInput = {
    where?: CoverTemplateWhereInput
    data: XOR<CoverTemplateUpdateWithoutProjectsInput, CoverTemplateUncheckedUpdateWithoutProjectsInput>
  }

  export type CoverTemplateUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    layoutJson?: StringFieldUpdateOperationsInput | string
    hasLogoSlot?: BoolFieldUpdateOperationsInput | boolean
    hasBackgroundSlot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CoverTemplateUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isBuiltIn?: BoolFieldUpdateOperationsInput | boolean
    layoutJson?: StringFieldUpdateOperationsInput | string
    hasLogoSlot?: BoolFieldUpdateOperationsInput | boolean
    hasBackgroundSlot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCoverAssetUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectCoverAssetWhereUniqueInput
    update: XOR<ProjectCoverAssetUpdateWithoutProjectInput, ProjectCoverAssetUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectCoverAssetCreateWithoutProjectInput, ProjectCoverAssetUncheckedCreateWithoutProjectInput>
  }

  export type ProjectCoverAssetUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectCoverAssetWhereUniqueInput
    data: XOR<ProjectCoverAssetUpdateWithoutProjectInput, ProjectCoverAssetUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectCoverAssetUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectCoverAssetScalarWhereInput
    data: XOR<ProjectCoverAssetUpdateManyMutationInput, ProjectCoverAssetUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectCoverAssetScalarWhereInput = {
    AND?: ProjectCoverAssetScalarWhereInput | ProjectCoverAssetScalarWhereInput[]
    OR?: ProjectCoverAssetScalarWhereInput[]
    NOT?: ProjectCoverAssetScalarWhereInput | ProjectCoverAssetScalarWhereInput[]
    id?: StringFilter<"ProjectCoverAsset"> | string
    projectId?: StringFilter<"ProjectCoverAsset"> | string
    assetType?: StringFilter<"ProjectCoverAsset"> | string
    originalFileName?: StringFilter<"ProjectCoverAsset"> | string
    filePath?: StringFilter<"ProjectCoverAsset"> | string
    fileSize?: IntFilter<"ProjectCoverAsset"> | number
    mimeType?: StringFilter<"ProjectCoverAsset"> | string
    width?: IntNullableFilter<"ProjectCoverAsset"> | number | null
    height?: IntNullableFilter<"ProjectCoverAsset"> | number | null
    createdAt?: DateTimeFilter<"ProjectCoverAsset"> | Date | string
  }

  export type ProjectCreateWithoutThemeInput = {
    id?: string
    name: string
    filePath: string
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
    coverTemplate?: CoverTemplateCreateNestedOneWithoutProjectsInput
    coverAssets?: ProjectCoverAssetCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutThemeInput = {
    id?: string
    name: string
    filePath: string
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    coverTemplateId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
    coverAssets?: ProjectCoverAssetUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutThemeInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutThemeInput, ProjectUncheckedCreateWithoutThemeInput>
  }

  export type ProjectCreateManyThemeInputEnvelope = {
    data: ProjectCreateManyThemeInput | ProjectCreateManyThemeInput[]
  }

  export type ProjectUpsertWithWhereUniqueWithoutThemeInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutThemeInput, ProjectUncheckedUpdateWithoutThemeInput>
    create: XOR<ProjectCreateWithoutThemeInput, ProjectUncheckedCreateWithoutThemeInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutThemeInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutThemeInput, ProjectUncheckedUpdateWithoutThemeInput>
  }

  export type ProjectUpdateManyWithWhereWithoutThemeInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutThemeInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    filePath?: StringFilter<"Project"> | string
    themeId?: StringNullableFilter<"Project"> | string | null
    hasCoverPage?: BoolFilter<"Project"> | boolean
    coverTitle?: StringNullableFilter<"Project"> | string | null
    coverSubtitle?: StringNullableFilter<"Project"> | string | null
    coverAuthor?: StringNullableFilter<"Project"> | string | null
    coverDate?: StringNullableFilter<"Project"> | string | null
    coverTemplateId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    lastOpenedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type ProjectCreateWithoutCoverTemplateInput = {
    id?: string
    name: string
    filePath: string
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
    theme?: ThemeCreateNestedOneWithoutProjectsInput
    coverAssets?: ProjectCoverAssetCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutCoverTemplateInput = {
    id?: string
    name: string
    filePath: string
    themeId?: string | null
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
    coverAssets?: ProjectCoverAssetUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutCoverTemplateInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCoverTemplateInput, ProjectUncheckedCreateWithoutCoverTemplateInput>
  }

  export type ProjectCreateManyCoverTemplateInputEnvelope = {
    data: ProjectCreateManyCoverTemplateInput | ProjectCreateManyCoverTemplateInput[]
  }

  export type ProjectUpsertWithWhereUniqueWithoutCoverTemplateInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutCoverTemplateInput, ProjectUncheckedUpdateWithoutCoverTemplateInput>
    create: XOR<ProjectCreateWithoutCoverTemplateInput, ProjectUncheckedCreateWithoutCoverTemplateInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutCoverTemplateInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutCoverTemplateInput, ProjectUncheckedUpdateWithoutCoverTemplateInput>
  }

  export type ProjectUpdateManyWithWhereWithoutCoverTemplateInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutCoverTemplateInput>
  }

  export type ProjectCreateWithoutCoverAssetsInput = {
    id?: string
    name: string
    filePath: string
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
    theme?: ThemeCreateNestedOneWithoutProjectsInput
    coverTemplate?: CoverTemplateCreateNestedOneWithoutProjectsInput
  }

  export type ProjectUncheckedCreateWithoutCoverAssetsInput = {
    id?: string
    name: string
    filePath: string
    themeId?: string | null
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    coverTemplateId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
  }

  export type ProjectCreateOrConnectWithoutCoverAssetsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCoverAssetsInput, ProjectUncheckedCreateWithoutCoverAssetsInput>
  }

  export type ProjectUpsertWithoutCoverAssetsInput = {
    update: XOR<ProjectUpdateWithoutCoverAssetsInput, ProjectUncheckedUpdateWithoutCoverAssetsInput>
    create: XOR<ProjectCreateWithoutCoverAssetsInput, ProjectUncheckedCreateWithoutCoverAssetsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutCoverAssetsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutCoverAssetsInput, ProjectUncheckedUpdateWithoutCoverAssetsInput>
  }

  export type ProjectUpdateWithoutCoverAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneWithoutProjectsNestedInput
    coverTemplate?: CoverTemplateUpdateOneWithoutProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutCoverAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    coverTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCoverAssetCreateManyProjectInput = {
    id?: string
    assetType: string
    originalFileName: string
    filePath: string
    fileSize: number
    mimeType: string
    width?: number | null
    height?: number | null
    createdAt?: Date | string
  }

  export type ProjectCoverAssetUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetType?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCoverAssetUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetType?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCoverAssetUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetType?: StringFieldUpdateOperationsInput | string
    originalFileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateManyThemeInput = {
    id?: string
    name: string
    filePath: string
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    coverTemplateId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
  }

  export type ProjectUpdateWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coverTemplate?: CoverTemplateUpdateOneWithoutProjectsNestedInput
    coverAssets?: ProjectCoverAssetUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    coverTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coverAssets?: ProjectCoverAssetUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    coverTemplateId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateManyCoverTemplateInput = {
    id?: string
    name: string
    filePath: string
    themeId?: string | null
    hasCoverPage?: boolean
    coverTitle?: string | null
    coverSubtitle?: string | null
    coverAuthor?: string | null
    coverDate?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastOpenedAt?: Date | string
  }

  export type ProjectUpdateWithoutCoverTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneWithoutProjectsNestedInput
    coverAssets?: ProjectCoverAssetUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutCoverTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coverAssets?: ProjectCoverAssetUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutCoverTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    themeId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverPage?: BoolFieldUpdateOperationsInput | boolean
    coverTitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverSubtitle?: NullableStringFieldUpdateOperationsInput | string | null
    coverAuthor?: NullableStringFieldUpdateOperationsInput | string | null
    coverDate?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastOpenedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}