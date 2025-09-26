# Odyssey Lift-off II: Resolvers


1. Journey of a GraphQL Query

* A GraphQL query follows this flow:

  1. **Parsing & Validation** → checked against the schema.
  2. **Execution** → each requested field is matched with a resolver.
  3. **Resolvers** fetch or compute data (from DB, REST APIs, etc.).
  4. **Response Assembly** → collected results are returned as JSON.
* Resolvers act as the **bridge between schema and actual data**.

2. Resolver Functions

* General form of a resolver:

  ```js
  fieldName(parent, args, context, info) {
    // logic to fetch/return data
  }
  ```

* Parameters:

  * **parent** → result from previous resolver (or root object).
  * **args** → arguments passed in the query (e.g., `id`, `filter`).
  * **context** → shared object across resolvers (auth, data sources).
  * **info** → query metadata (field name, AST, path).

* Resolvers can return:

  * Primitive values (string, int, boolean)
  * Objects
  * Promises (async operations)
  * Nested fields resolved via other resolvers

3. Default Resolution Behavior

* If no resolver is provided for a field:

  * GraphQL uses a **default resolver**.
  * It simply looks for a property on the **parent object** with the same field name.

Example:
If `track.title` exists in the returned object, no custom resolver is needed for `title`.

Custom resolvers are required when:

* Field names differ from backend data fields.
* Data needs transformation.
* Field requires fetching from another data source.

4. RESTDataSource Integration

* Apollo provides **`RESTDataSource`** class for connecting GraphQL to REST APIs.
* Benefits:

  * Built-in **caching & deduplication**.
  * Cleaner abstraction (no raw `fetch/axios` in resolvers).
  * Simple methods like `this.get()`, `this.post()`.
  
Example:
Define a data source `TrackAPI` that extends `RESTDataSource` with methods like `getAllTracks()`, `getTrackById(id)`.

5. Query Resolvers in Practice

* Schema fields map directly to resolvers:

  ```js
  const resolvers = {
    Query: {
      tracksForHome: (_, __, { dataSources }) =>
        dataSources.trackAPI.getAllTracks(),

      track: (_, { id }, { dataSources }) =>
        dataSources.trackAPI.getTrackById(id),
    }
  };
  ```

* Points to note:

  * `dataSources.trackAPI` is the RESTDataSource instance.
  * `args` (`{ id }`) are used to filter or fetch specific data.
  * Asynchronous operations are handled naturally with Promises.

6. Apollo Server Setup

Resolvers, schema, and data sources are combined in `ApolloServer`:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    trackAPI: new TrackAPI(),
  }),
  context: ({ req }) => ({
    // auth, user info, etc.
  }),
});
```

* `dataSources()` is called per request to create instances.
* `context` object is shared across resolvers (useful for auth).

---

7. Error Handling

* Common sources of errors:

  * Throwing errors inside resolvers.
  * Returning `null` for non-nullable schema fields.
  * REST API failures (network issues).
  * Parent object missing required property for default resolution.

* Apollo captures errors and includes them in the response under an `errors` field.

* Can be customized with `try/catch` in resolvers or by formatting errors in server config.


8. Summary

* Resolvers define **how schema fields map to real data**.
* Default resolvers handle direct property lookups, while custom resolvers handle transformations, external API calls, or relationships.
* `RESTDataSource` simplifies integration with REST APIs.
* Apollo Server ties together schema, resolvers, and data sources.
* Error handling is essential for stable query execution.


