import Framework from "./Framework";

interface Answers {
    packages: string[];
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
                        value: "@mantine/dates",
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
        this.generator.dependencies.push(...this.answers.packages);
    }

    repoInit() {
        this.generator.copyTemplate(
            this.generator.templatePath(FOLDER, "src"),
            this.generator.destinationPath("src")
        );
    }

    packageInit() {
        this.dependenciesInit();

        const packageJson = this.generator.generatorApp.options.packageJson!;
        const scripts: { [key: string]: string } = packageJson.scripts ?? {};
        if (!packageJson.scripts) {
            packageJson.scripts = scripts;
        }
        scripts.start = "vite serve src";
        scripts.preview = "vite preview";
        scripts.build =
            "npm-run-all clean build:esm build:cjs build:types && vite build";
    }

    override writing(): void | Promise<void> {
        this.packageInit();
        this.repoInit();
    }
}

export default Mantine;
