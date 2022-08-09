import Service from "../Service/Service";

// Do not use type unions, because the ConfigService casts process.env entries based on the type of the default value.
// If you use a type union (e.g. string | number) and use a number as default value the ConfigService will cast the process.env entry to a number. Hence, the type string will NEVER be used.
interface Config {
    /** Port number of the app. Leave as-is for Heroku. */
    port: number;

    /** The app's current environnement */
    environment: "development" | "production";

    /** Enable request logging */
    requestLogging: boolean;
}

class ConfigService extends Service {
    // eslint-disable-next-line no-use-before-define
    private static serviceInstance: ConfigService;

    // Should eventually be a full config object with the use of addConfig
    private config: Config = {} as Config;

    private constructor() {
        super("Config Service");
        this.notifyReady();
    }

    public static get instance(): ConfigService {
        if (!ConfigService.serviceInstance) {
            ConfigService.serviceInstance = new ConfigService();
        }
        return ConfigService.serviceInstance;
    }

    public getConfig(): Config {
        return { ...this.config };
    }

    public addConfig<K extends keyof Config>(
        key: K,
        processKey: string,
        defaultValue: Config[K]
    ) {
        if (this.config[key]) {
            return this;
        }

        switch (typeof defaultValue) {
            case "string":
                this.config[key] = (process.env[processKey] ||
                    defaultValue) as Config[K];
                break;
            case "number":
                this.config[key] = (Number(process.env[processKey]) ||
                    defaultValue) as Config[K];
                break;
            case "boolean":
                this.config[key] = (
                    process.env[processKey] === "true" ||
                    process.env[processKey] === "false"
                        ? process.env[processKey] === "true"
                        : defaultValue
                ) as Config[K];
                break;
            default:
                this.config[key] = defaultValue;
                break;
        }

        return this;
    }
}

export default ConfigService.instance;
