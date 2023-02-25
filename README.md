# zod-factory
Typescript compiler API factory abstractions for creating zod validation schemas.

# Motivation
Working directly with the Typescript compiler API for code generation can be a difficult task. For example, a zod schema such as the following, would yield about 18 lines worth of code of TS compiler API calls to generate a corresponding Typescript AST node.

```typescript
z.object({
  name: z.string(),
  age: z.number(),
});
```

The corresponding Typescript compiler API expression for this is:  

<details open>
<summary>TS Compiler API factory Definition</summary>
  
  ```typescript
factory.createExpressionStatement(factory.createCallExpression(
  factory.createPropertyAccessExpression(
    factory.createIdentifier("z"),
    factory.createIdentifier("object")
  ),
  undefined,
  [factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment(
        factory.createIdentifier("name"),
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier("z"),
            factory.createIdentifier("string")
          ),
          undefined,
          []
        )
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier("age"),
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier("z"),
            factory.createIdentifier("number")
          ),
          undefined,
          []
        )
      )
    ],
    true
  )]
))
  ```
  
</details>

This is not very easy to work with directly, and also not condusive for programmatically generating schemas.


# Features

## API
This library introduces some abstractions and explores some alternative APIs for generating zod validation. For example the above zod expression can be generated using this library in a number of different ways:

### `zf` - zod-factory core
This exposes helper methods for generating the corresponding AST nodes that map to a zod schema. 

```typescript
zf.object({
  name: zf.string(),
  age: zf.numberMethods.min(zf.number(), 18),
});
```

Here, methods that can be accessed directly on the `zod` object can also be accessed directly on the `zf` object to generate their AST node equivalent.

Methods that are accessed not-directly on zod (e.g `min`, `max`, `email` etc.) are accessibly on an `xyzMethods` key, where `xyz` is the name of the zod property they are accessible on. This could be subject to change if there is a better experience for this.

### `zfs` - zod-factory 'serialized'
This API builds on top of the core, and accepts more 'serial' arguments:
```typescript
zfs([
  ['object', {
    name: zfs([['string']]),
    age: zfs([['number'], ['max', 10]]),
  }]
])
```

### `zfl` - zod-factory 'lazy'
And then finally, an API which has an API closest to zod itself, and executes 'lazily'. Under the hood, all arguments necessary to create the AST are accumulated until a call to `create` is made:
```typescript
zfl().object({
  name: zfl().string().create(),
  age: zfl().number().min(18).create(),
}).create()
```

# Applications
For the moment library has applicaitons primarily in code generation. In the `playground` directory, I experiment with some code generation tasks, including directly from expressions generated by `zf`, `zfs` and `zfl` above, and then also from schemas generated indirectly through a "custom-format".

This "custom-format" is not fully featured, but is a POC for code generation from other serliazed formats (e.g OpenAPI) or Google Protobufs (yet to be explored directly).

To run playground codegen script, run:
```
cd playground
ts-node codegen.ts <file:variableNameRegex>
```

For the experimental custom format, run:
To run playground codegen script, run:
```
cd playground
ts-node codegen-custom-format.ts <file:variableNameRegex>
```


# Acknowledgements
This library is being put together as part of an Independent Study project I am undertaking with my advisor, professor Garret Morris in the Computer Science department at the University of Iowa.





