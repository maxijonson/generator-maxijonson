import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";
import FeatureService from "../services/FeatureService/FeatureService";
import Prompt from "../services/PromptService/Prompt";

interface Answers {
    features: string[]; // Feature IDs
}

export default class Features extends Prompt<Feature[]> {
    constructor(private featureService: FeatureService) {
        super("features");
    }

    @bind
    public async prompt(generator: Generator): Promise<Feature[]> {
        const visibleFeatures = this.featureService.getVisibleFeatures();

        const { features } = await generator.prompt<Answers>([
            {
                type: "checkbox",
                name: "features",
                message: "What features would you like?",
                store: true,
                choices: visibleFeatures.map((f) => ({
                    name: f.getName(),
                    value: f.getId(),
                    checked: f.isEnabled(),
                    disabled: !f.isAvailable(),
                })),
            },
        ]);

        visibleFeatures.forEach((f) => {
            this.featureService.setFeatureEnabled(
                f.getId(),
                features.includes(f.getId())
            );
        });

        return this.featureService.getFeatures();
    }
}
