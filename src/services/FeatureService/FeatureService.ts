import _ from "lodash";
import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import GeneratorService from "../GeneratorService/GeneratorService";
import Feature from "./Feature";

type FeatureClass<T extends Feature> = new (...args: any[]) => T;

export default class FeatureService extends GeneratorService {
    private features: {
        [featureId: string]: {
            feature: Feature;
            sourceRoot: string;
            hidden: boolean;
        };
    } = {};

    constructor(generator: Generator) {
        super(generator);
    }

    @bind
    public addFeature(feature: Feature, hidden = false, override = true) {
        if (this.features[feature.getId()] && !override) return this;
        this.features[feature.getId()] = {
            feature,
            sourceRoot: this.generator.sourceRoot(),
            hidden,
        };
        return this;
    }

    @bind addHiddenFeature(feature: Feature, override = true) {
        return this.addFeature(feature, true, override);
    }

    @bind
    public setFeatureEnabled(featureId: string, enabled: boolean) {
        const feature = this.getFeatureById(featureId);
        if (feature) feature.setEnabled(enabled);
    }

    @bind
    public getFeatures(): Feature[] {
        return _.map(this.features, ({ feature }) => feature);
    }

    @bind
    public getEnabledFeatures(): Feature[] {
        return _.filter(this.getFeatures(), (f) => f.isEnabled());
    }

    @bind
    public getVisibleFeatures(): Feature[] {
        return _(this.features)
            .filter(({ hidden }) => !hidden)
            .map(({ feature }) => feature)
            .value();
    }

    @bind
    public getFeatureById(featureId: string): Feature | null {
        return this.features[featureId]?.feature ?? null;
    }

    @bind
    public getFeatureByClass<T extends Feature>(
        featureClass: FeatureClass<T>
    ): T | null {
        const feature = _.find(
            this.getFeatures(),
            (f) => f instanceof featureClass
        );
        return (feature as T) ?? null;
    }

    @bind
    public async applyFeatures() {
        const sourceRoot = this.generator.sourceRoot();
        await Promise.all(
            this.getEnabledFeatures().map((f) => {
                const feature = this.features[f.getId()];
                if (!feature) return;
                this.generator.sourceRoot(feature.sourceRoot);
                return f.apply(this.generator, this.getFeatureByClass);
            })
        );
        this.generator.sourceRoot(sourceRoot);
    }
}
