import _ from "lodash";
import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import Npm from "./Npm";
import Tests from "./Tests";

export default class PackageJson extends Feature {
    constructor(enabled = false, available = true) {
        super("packagejson", "package.json", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const tests = getFeature(Tests);
        const npm = getFeature(Npm);

        copyTpl(
            generator,
            generator.templatePath("package.json"),
            generator.destinationPath("package.json"),
            {
                appname: generator.appname,
                tests: tests?.isEnabled(),
                npm: npm?.isEnabled(),
            }
        );

        if (generator.options.packageJson) {
            let packageJson = null;

            if (_.isObject(generator.options.packageJson)) {
                packageJson = generator.options.packageJson;
            } else if (_.isString(generator.options.packageJson)) {
                try {
                    packageJson = JSON.parse(generator.options.packageJson);
                } catch {
                    packageJson = null;
                }
            }

            if (packageJson) {
                generator.packageJson.merge(generator.options.packageJson);
            }
        }

        await generator.addDevDependencies([
            "typescript",
            "ts-node",
            "npm-run-all",
        ]);
    }
}
