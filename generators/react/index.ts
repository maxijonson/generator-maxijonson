import Generator from "yeoman-generator";
import GeneratorApp, { GeneratorOptions as GeneratorAppOptions } from "../app";
import Framework from "./frameworks/Framework";
import fs from "fs";

interface Arguments {
    name?: string;
}

interface Options {
    framework?: string;
}

type GeneratorOptions = Arguments & Options;

interface Answers {
    framework: number;
}

const FEATURES = {} as const;

class GeneratorReact extends Generator<GeneratorOptions> {
    generatorApp!: GeneratorApp<typeof FEATURES>;
    features!: typeof this.generatorApp["features"];
    framework!: Framework;
    frameworks: Framework[] = [];
    answers!: Answers;

    dependencies: string[] = [];
    devDependencies: string[] = [];

    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: Arguments
    ) {
        super(args, options);
        this.argument("name", { type: String, required: false });
        this.option("framework", { type: String });

        const generatorAppOptions: GeneratorAppOptions = {
            name: this.options.name,
            packageJson: {},
            react: true,
        };

        this.generatorApp = this.composeWith(
            require.resolve("../app"),
            generatorAppOptions,
            true
        ) as GeneratorApp<typeof FEATURES>;
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    async initializing() {
        const files = fs
            .readdirSync(this.templatePath("../frameworks"))
            .filter(
                (f) => f.split(".")[0] !== "Framework" && !f.endsWith(".ts")
            );

        for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const Framework = require(`./frameworks/${file}`).default;
            this.frameworks.push(new Framework(this));
        }
    }

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    async prompting() {
        const optionFramework = this.options.framework;
        if (optionFramework) {
            this.framework = this.frameworks.find(
                (f) =>
                    f.getName().toLowerCase() === optionFramework.toLowerCase()
            ) as Framework;
        }

        this.answers = await this.prompt<Answers>([
            {
                type: "list",
                name: "framework",
                message: "Which framework do you want to use?",
                choices: this.frameworks.map((f, i) => ({
                    name: f.getName(),
                    value: i,
                })),
                when: !this.framework,
            },
        ]);

        if (typeof this.answers.framework === "number") {
            this.framework = this.frameworks[
                this.answers.framework
            ] as Framework;
        }

        await this.framework.prompting();
    }

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    async configuring() {
        this.features = this.generatorApp.features;
        await this.framework.configuring();
    }

    async _packageInit() {
        const dependencies: string[] = [
            "react",
            "react-dom",
            ...this.dependencies,
        ];
        const devDependencies: string[] = [
            "@types/react",
            "@types/react-dom",
            "typescript",
            ...this.devDependencies,
        ];

        if (this.features.tests) {
            devDependencies.push(
                "@testing-library/react",
                "@testing-library/jest-dom",
                "@types/testing-library__jest-dom"
            );
        }

        this.generatorApp.options.dependencies = dependencies;
        this.generatorApp.options.devDependencies = devDependencies;
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    async writing() {
        GeneratorApp._setDestinationRoot(this);
        this.features = this.generatorApp.features;

        await this.framework.writing();
        await this._packageInit();

        this.generatorApp.options.skippedFiles = [
            this.destinationPath("src/index.ts"),
            this.destinationPath("src/index.test.ts"),
        ];
    }

    /** Where conflicts are handled (used internally) */
    async conflicts() {
        await this.framework.conflicts();
    }

    /** Where installations are run (npm, bower) */
    async install() {
        await this.framework.install();
    }

    /** Called last, cleanup, say good bye, etc */
    async end() {
        await this.framework.end();
    }
}

export default GeneratorReact;
