import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import FeatureService from "../services/FeatureService/FeatureService";
import Prompt from "../services/PromptService/Prompt";

interface Answers {
    features: string | string[]; // Feature IDs
}

export default class Features extends Prompt<Feature[]> {
    constructor(
        private featureService: FeatureService,
        private type: "checkbox" | "list" = "checkbox",
        id = "features",
        message = "What features would you like?"
    ) {
        super(id, message);
    }

    @bind
    public async prompt(generator: Generator): Promise<Feature[]> {
        const visibleFeatures = this.featureService.getVisibleFeatures();

        const { features } = await generator.prompt<Answers>([
            {
                type: this.type,
                name: "features",
                message: this.message,
                store: false,
                choices: visibleFeatures.map((f) => ({
                    name: f.getName(),
                    value: f.getId(),
                    checked: f.isEnabled(),
                    disabled: !f.isAvailable(),
                })),
            },
        ]);

        const feats = typeof features === "string" ? [features] : features;
        visibleFeatures.forEach((f) => {
            this.featureService.setFeatureEnabled(
                f.getId(),
                feats.includes(f.getId())
            );
        });

        return this.featureService.getFeatures();
    }
}
