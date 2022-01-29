# generator-maxijonson

My personnal yeoman generator(s) for creating all kind of projects that tend to have a similar structure.

## 🤚 DO NOT USE 🛑

This generator is not meant to be used by anyone but me. It is only used for my "solo" personnal projects. You are welcome to use it of course (since it's public!), but this has one goal: suit **my** needs. These generators are highly opinionated and might not fit your development needs. The first opinionated thing you'll notice is the fact that not only do all generators generate TypeScript projects, but the generators themselves are also all written in TypeScript. Safety starts at the very beginning!

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

#### Usage

```bash
yo maxijonson [project-name]
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