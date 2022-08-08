import Generator from "yeoman-generator";
import path from "path";
import Inquirer from "../../features/cli/Inquirer";
import TSIndex from "../../features/TSIndex";
import Yargs from "../../features/cli/Yargs";
import GeneratorApp, { GeneratorOptions } from "../app";

class GeneratorCli extends GeneratorApp {
    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: GeneratorOptions
    ) {
        super(args, options);

        this.options.packageJson = {
            bin: "dist/cjs/index.js",
            scripts: {
                ig: "npm-run-all build && npm i -g .",
            },
        };
    }

    override async initializing() {
        await super.initializing();
        this.featureService
            .setGenerator(this, path.join(__dirname, "templates"))
            .addFeature(new Yargs())
            .addFeature(new Inquirer())
            .addHiddenFeature(new TSIndex(true));
    }

    override async prompting() {
        await super.prompting();
    }

    override async configuring() {
        await super.configuring();
    }

    override async writing() {
        await super.writing();
    }

    override async conflicts() {
        await super.conflicts();
    }

    override async install() {
        await super.install();
    }

    override async end() {
        await super.end();
    }
}

export default GeneratorCli;
