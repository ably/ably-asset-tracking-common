# Location History Data JSON Schemas

## Definitions

- A change from schema version $x$ to schema version $y$ is _backwards compatible_ if an object that conforms to schema version $y$ also conforms to schema version $x$.
- A change from schema version $x$ to schema version $y$ is _forwards compatible_ if an object that conforms to schema version $x$ also conforms to schema version $y$.
- A change of schema is _compatible_ if it is backwards compatible and forwards compatible.
- A change of schema is _incompatible_ if it is not compatible.

## Versioning

We follow the rules of [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html), here rewritten to make sense for a JSON schema:

> Given a schema version number MAJOR.MINOR.PATCH, increment the:
>
> - MAJOR version when you make incompatible schema changes
> - MINOR version when you make compatible schema changes
> - PATCH version when you make compatible schema changes that fix a mistake in the schema

## How we store our schemas

For each major version of the schema, we store its latest version in this directory with a file containing its version number, for example `version-2.3.1.json`.

## Version 1 of the schema

Version 1 of the schema was created before we adopted Semantic Versioning, and there only exists a single version of it, named `1`.
