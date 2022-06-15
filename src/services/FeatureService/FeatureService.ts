import _ from "lodash";
import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import GeneratorService from "../GeneratorService/GeneratorService";
import Feature from "./Feature";

type FeatureClass<T extends Feature> = new (...args: any[]) => T;

interface FeatureConfig {
    feature: Feature;
    sourceRoot: string;
    hidden: boolean;

    /** The **execution** order when applying the features. (i.e: not the displayed order) */
    order: number;
}

export default class FeatureService extends GeneratorService {
    private features: {
        [featureId: string]: FeatureConfig;
    } = {};

    constructor(generator: Generator) {
        super(generator);
    }

    @bind
    public addFeature(feature: Feature, order = 9999, hidden = false) {
        this.features[feature.getId()] = {
            feature,
            sourceRoot: this.generator.sourceRoot(),
            hidden,
            order,
        };
        return this;
    }

    @bind
    public addHiddenFeature(feature: Feature, order = 9999) {
        return this.addFeature(feature, order, true);
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
    public getVisibleFeatures(): Feature[] {
        return _(this.features)
            .filter(({ hidden }) => !hidden)
            .map(({ feature }) => feature)
            .value();
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

    @bind
    private getSortedFeatureConfigs(): FeatureConfig[] {
        return _.sortBy(this.features, ({ order }) => order);
    }

    @bind
    private getSortedFeatures(): Feature[] {
        return _.map(this.getSortedFeatureConfigs(), ({ feature }) => feature);
    }

    @bind
    private getEnabledFeatures(): Feature[] {
        return _.filter(this.getSortedFeatures(), (f) => f.isEnabled());
    }

    @bind
    private getFeatureById(featureId: string): Feature | null {
        return this.features[featureId]?.feature ?? null;
    }
}
