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
            order?: number;
        };
    } = {};

    constructor(generator: Generator) {
        super(generator);
    }

    @bind
    public extend(generatorService: PromptService): this {
        this.prompts = {
            ...this.prompts,
            ...generatorService.prompts,
        };
        return this;
    }

    @bind
    public addPrompt(prompt: Prompt, order = 999, override = true) {
        if (this.prompts[prompt.getId()] && !override) return this;
        this.prompts[prompt.getId()] = {
            prompt: prompt,
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
        this.answers = {} as Answers;
        let lastPromptSize = 0;

        while (lastPromptSize !== this.getPrompts().length) {
            lastPromptSize = this.getPrompts().length;
            for (const prompt of this.getPrompts()) {
                if (this.answers[prompt.getId()]) continue;

                this.answers[prompt.getId()] = await prompt.prompt(
                    this.generator
                );

                // Prompts changed while prompting, so we need to prompt again in the correct order
                if (this.getPrompts().length !== lastPromptSize) {
                    break;
                }
            }
        }

        return this.answers;
    }
}
