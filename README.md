# generator-maxijonson

My personnal yeoman generator(s) for creating all kind of projects that tend to have a similar structure.

## 🤚 DO NOT USE 🛑

This generator is not meant to be used by anyone but me. It is only used for my "solo" personnal projects. You are welcome to use it of course (since it's public!), but this has one goal: suit **my** needs. These generators are highly opinionated and might not fit your development needs. The first opinionated thing you'll notice is the fact that not only do all generators generate TypeScript projects, but the generators themselves are also all written in TypeScript. Safety starts at the very beginning!

Some of the language used below might sound like I'm talking to you, but I'm actually talking to myself (my future self!) 🙃.

## Installation

```bash
# 1. Install yeoman, if you haven't already
npm install -g yo

# 2. Install this generator
npm install -g generator-maxijonson
```

## Generators

### App (default)

Creates a basic TypeScript + Node application. This generator creates a project folder, so no need to create it manually.

This is a dead simple setup. It should be used when writing a small app to accomplish a small task rapidly. It's like a scratchpad! Use it when you have an idea that pops in your mind, a small problem to solve or just need a rough draft and not sure how to go about it.

#### Usage

```bash
yo maxijonson [project-name] [--dependencies=<comma,separated>] [--devDependencies=<comma,separated>]
```

### CLI

Scaffolds the structure for an app intended to work as a CLI (with NPM).

#### Usage

**Note: includes the same options as App**

```bash
yo maxijonson:cli [project-name]
```

### React

⚠ This generator still requires some field testing and might not be complete ⚠

Creates a React app using a UI library chosen by the user.

Currently, the generator supports the following UI libraries:
- [Mantine](https://mantine.dev/)

#### Usage

**Note: includes the same options as App**


```bash
yo maxijonson:react [project-name] [--framework=<framework-name>]
```

## Testing

To test your generator, you can follow these steps:

```bash
# 1. Run `npm test`. This will take care of building, preparing the test folder and `npm link` the generator locally.
npm test

# 2. Go to the "test" folder
cd test

# 3. Run your generator
yo maxijonson[:generator-name] [...args]

# 4. Go to your new project folder
cd <project-folder>

# 5. Test your generated files!
npm start
```

For convenience, I usually have 3 terminals open, one for running `npm test`, one for running the generator and one for running the generated project.