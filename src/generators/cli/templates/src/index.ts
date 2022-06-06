#!/usr/bin/env node
<% if (yargs) { %>import yargs from "yargs";
import { hideBin } from "yargs/helpers";<% } %>
<% if (inquirer) { %>import inquirer from 'inquirer';<% } %>

<% if (!yargs && !inquirer) { %>
console.info("Hello World!");
<% } %>

<% if (yargs) { %>
const serve = (port: number) => { console.info("Serving on", port) };
yargs(hideBin(process.argv))
    .command('serve [port]', 'start the server', (yargs) => {
        return yargs
        .positional('port', {
            describe: 'port to bind on',
            default: 5000
        })
    }, (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`)
        serve(argv.port)
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .parse()
<% } %>

<% if (inquirer) { %>
const questions: inquirer.QuestionCollection = [
  {
    type: "input",
    name: "first_name",
    message: "What's your first name",
    default: "John",
  },
  {
    type: "input",
    name: "last_name",
    message: "What's your last name",
    default: () => {
      return "Doe";
    },
  },
  {
    type: "input",
    name: "fav_color",
    message: "What's your favorite color",
    transformer(color, _answers, flags) {
      const text = `${color}`;
      if (flags.isFinal) {
        return text + "!";
      }

      return text;
    },
  },
  {
    type: "input",
    name: "phone",
    message: "What's your phone number",
    validate(value) {
      const pass = value.match(
        /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
      );
      if (pass) {
        return true;
      }

      return "Please enter a valid phone number";
    },
  },
];

inquirer.prompt(questions).then((answers) => {
  console.log(JSON.stringify(answers, null, "  "));
});

<% } %>