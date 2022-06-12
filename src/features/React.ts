import Generator from "yeoman-generator";
import bind from "../decorators/bind";
import Feature from "../services/FeatureService/Feature";

export default class React extends Feature {
    constructor(enabled = true, available = true, hidden = true) {
        super("react", "React", enabled, available, hidden);
    }

    @bind
    public apply(generator: Generator): void {
        throw new Error("Method not implemented.");
    }
}
