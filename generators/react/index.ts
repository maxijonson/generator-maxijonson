import Generator from "yeoman-generator";
import GeneratorApp, { GeneratorOptions } from "../app";
import Framework from "./frameworks/Framework";
import fs from "fs";

interface Options {
    name?: string;
}

interface Answers {
    framework: string;
}

const FEATURES = {} as const;

class GeneratorReact extends Generator<Options> {
    generatorApp!: GeneratorApp<typeof FEATURES>;
    features!: typeof this.generatorApp["features"];
    framework!: Framework;
    frameworks: Framework[] = [];
    answers!: Answers;

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: Options
    ) {
        super(args, options);
        this.argument("name", { type: String, required: false });

        const generatorOptions: GeneratorOptions = {
            name: this.options.name,
        };

        this.generatorApp = this.composeWith(
            require.resolve("../app"),
            generatorOptions,
            true
        ) as GeneratorApp<typeof FEATURES>;
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    async initializing() {
        const files = fs
            .readdirSync(this.templatePath("../frameworks"))
            .filter((f) => f !== "Framework.ts");

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const path = require(this.templatePath("../frameworks/Mantine.ts"));

        // for (const file of files) {
        //     // eslint-disable-next-line @typescript-eslint/no-var-requires
        //     const framework = require(this.templatePath("../frameworks", file));
        //     this.frameworks.push(new framework.default());
        // }
    }

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    async prompting() {
        this.answers = await this.prompt<Answers>([
            {
                type: "list",
                name: "framework",
                message: "Which framework do you want to use?",
                choices: this.frameworks.map((f, i) => ({
                    name: f.getName(),
                    value: i,
                    short: "- " + f.getName(),
                })),
            },
        ]);
    }

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    configuring() {}

    async _packageInit() {
        const dependencies: string[] = [];
        const devDependencies: string[] = [];

        this.generatorApp.options.dependencies = dependencies;
        this.generatorApp.options.devDependencies = devDependencies;
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    async writing() {
        this.destinationRoot(this.appname);
        this.features = this.generatorApp.features;

        await this._packageInit();
    }

    /** Where conflicts are handled (used internally) */
    conflicts() {}

    /** Where installations are run (npm, bower) */
    install() {}

    /** Called last, cleanup, say good bye, etc */
    end() {}
}

export default GeneratorReact;
