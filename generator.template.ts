/* eslint-disable */
// Use the following template to kickstart a new generator.
import Generator from "yeoman-generator";

class GeneratorNAME extends Generator {
    constructor(
        args: ConstructorParameters<typeof Generator>[0],
        options: ConstructorParameters<typeof Generator>[1]
    ) {
        super(args, options);
    }

    /** Your initialization methods (checking current project state, getting configs, etc) */
    initializing() {}

    /** Where you prompt users for options (where you'd call `this.prompt()`) */
    async prompting() {}

    /** Saving configurations and configure the project (creating `.editorconfig` files and other metadata files) */
    configuring() {}

    /** Where you write the generator specific files (routes, controllers, etc) */
    writing() {}

    /** Where conflicts are handled (used internally) */
    conflicts() {}

    /** Where installations are run (npm, bower) */
    install() {}

    /** Called last, cleanup, say good bye, etc */
    end() {}
}

export default GeneratorNAME;
