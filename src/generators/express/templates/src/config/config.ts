<% if (dotenv) { %>import "dotenv/config";<% } %>
import ConfigService from "../services/ConfigService/ConfigService";

ConfigService
    .addConfig("port", "PORT", 3000)
    .addConfig("environment", "NODE_ENV", "production")
    .addConfig("requestLogging", "REQUEST_LOGGING", true);
