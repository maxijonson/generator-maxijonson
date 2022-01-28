# generator-maxijonson

My personnal yeoman generator(s) for creating all kind of projects that tend to have a similar structure.

## Disclaimer

This generator is not meant to be used by anyone but me. It is only used for my "solo" personnal projects. You are welcome to use it of course (since it's public!), but this has one goal: suit **my** needs. These generators are highly opinionated and might not fit your development needs. The first opinionated thing you'll notice is the fact that not only do all generators generate TypeScript projects, but the generators themselves are also all written in TypeScript. Safety starts at the very beginning!

## Generators

### App (default)

Creates a basic TypeScript + Node application. This is meant to replace `npm init`, so you should run this in an empty directory where your project will live. This is done to work well with my usual routine which is usually to create a project folder using `gh repo create`, `cd` into it and run `npm init` in it.

#### Usage

```bash
yo maxijonson
```
