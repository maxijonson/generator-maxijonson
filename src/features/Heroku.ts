import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature, { GetFeature } from "../services/FeatureService/Feature";
import copyTpl from "../utils/copyTpl";
import React from "./react/React";

export default class Heroku extends Feature {
    constructor(enabled = false, available = true) {
        super("heroku", "Heroku", enabled, available);
    }

    @bind
    public async apply(
        generator: Generator,
        getFeature: GetFeature
    ): Promise<void> {
        const react = getFeature(React);

        if (react?.isEnabled()) {
            /**
             * Add the following buildpacks, in order:
             * - https://buildpack-registry.s3.amazonaws.com/buildpacks/heroku-community/nginx.tgz
             * - heroku/nodejs
             */
            copyTpl(
                generator,
                generator.templatePath("Procfile"),
                generator.destinationPath("Procfile")
            );

            copyTpl(
                generator,
                generator.templatePath("config/nginx.conf.erb"),
                generator.destinationPath("config/nginx.conf.erb")
            );
        }
    }
}
