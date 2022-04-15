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

    override writing(): void | Promise<void> {
        this.generator.fs.copyTpl(
            this.generator.templatePath(FOLDER, "src/index.ts"),
            this.generator.destinationPath("src/index.ts")
        );
    }
}

export default Mantine;
