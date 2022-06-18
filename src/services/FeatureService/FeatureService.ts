import _ from "lodash";
import Generator from "yeoman-generator";
import bind from "../../decorators/bind";
import { FEATURE_ORDER_UNORDERED } from "../../utils/constants";
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
    public extend(
        generatorService: FeatureService,
        forceHidden?: boolean
    ): this {
        this.features = {
            ...this.features,
            ..._.mapValues(generatorService.features, (featureConfig) => ({
                ...featureConfig,
                hidden: forceHidden ?? featureConfig.hidden,
            })),
        };
        return this;
    }

    @bind
    public addFeature(
        feature: Feature,
        order = FEATURE_ORDER_UNORDERED,
        hidden = false
    ) {
        this.features[feature.getId()] = {
            feature,
            sourceRoot: this.generator.sourceRoot(),
            hidden,
            order,
        };
        return this;
    }

    @bind
    public addHiddenFeature(feature: Feature, order = FEATURE_ORDER_UNORDERED) {
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

        // Do not Promise.all, execution order is important
        for (const f of this.getEnabledFeatures()) {
            const feature = this.features[f.getId()];
            if (!feature) continue;
            this.generator.sourceRoot(feature.sourceRoot);
            await f.apply(this.generator, this.getFeatureByClass);
        }

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
