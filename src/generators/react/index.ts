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
    router: boolean;
}

const FOLDER = "Common";

const FEATURES = {
    router: "router",
    i18next: "i18next",
} as const;

class GeneratorReact extends Generator<GeneratorOptions> {
    generatorApp!: GeneratorApp<typeof FEATURES>;
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
            features: [
                {
                    name: "React Router DOM",
                    value: FEATURES.router,
                    checked: true,
                },
                {
                    name: "i18next",
                    value: FEATURES.i18next,
                    checked: false,
                },
            ],
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

    _packageInit() {
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

        if (this.features.router) {
            dependencies.push("react-router-dom");
        }

        if (this.features.i18next) {
            dependencies.push(
                "i18next",
                "react-i18next",
                "i18next-browser-languagedetector",
                "i18next-resources-to-backend"
            );
        }

        this.generatorApp.options.dependencies = dependencies;
        this.generatorApp.options.devDependencies = devDependencies;
    }

    _i18nextInit() {
        if (!this.features.i18next) {
            return;
        }

        this.copyTemplate(
            this.templatePath(FOLDER, "src/i18n"),
            this.destinationPath("src/i18n")
        );
    }

    _globaldtsInit() {
        this.copyTemplate(
            this.templatePath(FOLDER, "src/global.d.ts"),
            this.destinationPath("src/global.d.ts")
        );
    }

    /** Where you write the generator specific files (routes, controllers, etc) */
    async writing() {
        GeneratorApp._setDestinationRoot(this);
        this.features = this.generatorApp.features;

        await this.framework.writing();
        this._packageInit();
        this._i18nextInit();
        this._globaldtsInit();

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
