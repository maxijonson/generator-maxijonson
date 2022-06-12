import _ from "lodash";
import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import GeneratorService from "../GeneratorService/GeneratorService";
import Prompt from "./Prompt";

type Answers = Record<string, unknown>;

export default class PromptService extends GeneratorService {
    private answers: Answers | null = null;
    private prompts: {
        [promptId: string]: {
            prompt: Prompt;
            generator: Generator;
            order?: number;
        };
    } = {};

    constructor(generator: Generator) {
        super(generator);
    }

    @bind
    public addPrompt(prompt: Prompt, order = 999, override = true) {
        if (this.prompts[prompt.getId()] && !override) return this;
        this.prompts[prompt.getId()] = {
            prompt: prompt,
            generator: this.generator,
            order,
        };
        return this;
    }

    @bind
    public removePrompt(prompt: Prompt | string) {
        const promptId = typeof prompt === "string" ? prompt : prompt.getId();
        delete this.prompts[promptId];
        return this;
    }

    @bind
    public getPrompts(): Prompt[] {
        return _.sortBy(
            _.map(this.prompts, ({ prompt, order }) => ({
                prompt,
                order,
            })),
            "order"
        ).map(({ prompt }) => prompt);
    }

    @bind
    public getAnswers(): Answers | null {
        return this.answers;
    }

    @bind
    public async prompt(): Promise<Answers> {
        const answers = {} as Answers;

        for (const prompt of this.getPrompts()) {
            answers[prompt.getId()] = await prompt.prompt(this.generator);
        }

        return (this.answers = answers);
    }
}
