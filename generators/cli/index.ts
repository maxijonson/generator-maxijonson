import Generator from "yeoman-generator";
import GeneratorApp, { GeneratorOptions } from "../app";

interface Options {
    name?: string;
}

const FEATURES = {
    yargs: "yargs",
    inquirer: "inquirer",
} as const;

class GeneratorCli extends Generator<Options> {
    generatorApp!: GeneratorApp<typeof FEATURES>;
    features!: typeof this.generatorApp["features"];

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: Options
    ) {
        super(args, options);
        this.argument("name", { type: String, required: false });

        const generatorOptions: GeneratorOptions = {
            name: this.options.name,
            features: [
                {
                    name: "Yargs",
                    value: FEATURES.yargs,
                    checked: true,
                },
                {
                    name: "Inquirer",
                    value: FEATURES.inquirer,
                    checked: false,
                },
            ],
        };

        this.generatorApp = this.composeWith(
            require.resolve("../app"),
            generatorOptions,
            true
        ) as GeneratorApp<typeof FEATURES>;
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {}

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    async prompting() {}

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    configuring() {}

    _repoInit() {
        this.fs.copyTpl(
            this.templatePath("src/index.ts"),
            this.destinationPath("src/index.ts"),
            { yargs: this.features.yargs, inquirer: this.features.inquirer }
        );
    }

    async _packageInit() {
        this.generatorApp.options.packageJson = {
            bin: "dist/cjs/index.js",
            scripts: {
                ig: "npm-run-all build && npm i -g .",
            },
        };

        const dependencies: string[] = [];
        const devDependencies: string[] = [];

        if (this.features.yargs) {
            dependencies.push("yargs");
            devDependencies.push("@types/yargs");
        }

        if (this.features.inquirer) {
            dependencies.push("inquirer");
            devDependencies.push("@types/inquirer");
        }

        this.generatorApp.options.dependencies = dependencies;
        this.generatorApp.options.devDependencies = devDependencies;
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    async writing() {
        this.destinationRoot(this.appname);
        this.features = this.generatorApp.features;

        this._repoInit();
        await this._packageInit();
    }

    /** Where conflicts are handled (used internally) */
    conflicts() {}

    /** Where installations are run (npm, bower) */
    install() {}

    /** Called last, cleanup, say good bye, etc */
    end() {}
}

export default GeneratorCli;
