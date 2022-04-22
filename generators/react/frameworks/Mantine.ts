import _ from "lodash";
import Framework from "./Framework";

interface Answers {
    packages: (string | string[])[];
}

const FOLDER = "Mantine";

class Mantine extends Framework {
    answers!: Answers;

    getName(): string {
        return "Mantine";
    }

    override async prompting(): Promise<void> {
        this.answers = await this.generator.prompt<Answers>([
            {
                name: "packages",
                type: "checkbox",
                message: "Which packages do you want to use?",
                choices: [
                    {
                        name: "Core",
                        value: "@mantine/core",
                        checked: true,
                    },
                    {
                        name: "Hooks",
                        value: "@mantine/hooks",
                        checked: true,
                    },
                    {
                        name: "Form",
                        value: "@mantine/form",
                        checked: false,
                    },
                    {
                        name: "Dates",
                        value: ["@mantine/dates", "dayjs"],
                        checked: false,
                    },
                    {
                        name: "Notifications",
                        value: "@mantine/notifications",
                        checked: false,
                    },
                    {
                        name: "Prism",
                        value: "@mantine/prism",
                        checked: false,
                    },
                    {
                        name: "RTE",
                        value: "@mantine/rte",
                        checked: false,
                    },
                    {
                        name: "Dropzone",
                        value: "@mantine/dropzone",
                        checked: false,
                    },
                    {
                        name: "Modals",
                        value: "@mantine/modals",
                        checked: false,
                    },
                    {
                        name: "Spotlight",
                        value: "@mantine/spotlight",
                        checked: false,
                    },
                ],
            },
        ]);
    }

    dependenciesInit() {
        this.generator.dependencies.push(..._.flatten(this.answers.packages));
    }

    packageInit() {
        this.dependenciesInit();

        const packageJson = this.generator.generatorApp.options.packageJson!;
        const scripts: { [key: string]: string } = packageJson.scripts ?? {};
        if (!packageJson.scripts) {
            packageJson.scripts = scripts;
        }
    }

    repoInit() {
        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "src/index.html"),
            this.generator.destinationPath("src/index.html")
        );

        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "src/index.tsx"),
            this.generator.destinationPath("src/index.tsx")
        );

        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "src/components/App.tsx"),
            this.generator.destinationPath("src/components/App.tsx")
        );
    }

    testsInit() {
        if (!this.generator.features.tests) return;

        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "src/components/App.test.tsx"),
            this.generator.destinationPath("src/components/App.test.tsx")
        );

        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "src/config/setupTests.ts"),
            this.generator.destinationPath("src/config/setupTests.ts")
        );
    }

    viteInit() {
        this.generator.devDependencies.push(
            "vite", // TODO: Make this an option (Vite, Webpack, CRA, etc)
            "@vitejs/plugin-react"
        );

        const packageJson = this.generator.generatorApp.options.packageJson!;
        const scripts: { [key: string]: string } = packageJson.scripts ?? {};
        if (!packageJson.scripts) {
            packageJson.scripts = scripts;
        }

        scripts.start = "vite serve src";
        scripts.preview = "vite preview";
        scripts.build =
            "npm-run-all clean build:esm build:cjs build:types && vite build";

        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "vite.config.ts"),
            this.generator.destinationPath("vite.config.ts")
        );
    }

    override writing(): void | Promise<void> {
        this.packageInit();
        this.repoInit();
        this.viteInit();
        this.testsInit();
    }
}

export default Mantine;
