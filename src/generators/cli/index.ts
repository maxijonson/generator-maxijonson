import Generator from "yeoman-generator";
import path from "path";
import Inquirer from "../../features/Inquirer";
import TSIndex from "../../features/TSIndex";
import Yargs from "../../features/Yargs";
import GeneratorApp, { Arguments as AppArguments } from "../app";

class GeneratorCli extends GeneratorApp {
    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: AppArguments
    ) {
        super(args, options);

        this.options.packageJson = {
            bin: "dist/cjs/index.js",
            scripts: {
                ig: "npm-run-all build && npm i -g .",
            },
        };
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    override async initializing() {
        await super.initializing();
        this.featureService
            .setGenerator(this, path.join(__dirname, "templates"))
            .addFeature(new TSIndex())
            .addFeature(new Yargs())
            .addFeature(new Inquirer());
    }

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    override async prompting() {
        await super.prompting();
    }

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    override async configuring() {
        await super.configuring();
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    override async writing() {
        await super.writing();
    }

    /** Where conflicts are handled (used internally) */
    override async conflicts() {
        await super.conflicts();
    }

    /** Where installations are run (npm, bower) */
    override async install() {
        await super.install();
    }

    /** Called last, cleanup, say good bye, etc */
    override async end() {
        await super.end();
    }
}

export default GeneratorCli;
