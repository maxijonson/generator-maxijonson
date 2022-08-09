<% if (dotenv) { %>require('dotenv').config();<% } %>

const CLUSTER_MODE = process.env.CLUSTER_MODE || "true";

const enableClusterMode = CLUSTER_MODE === "true";

module.exports = {
    apps: [
        {
            name: "<%= appname %>",
            script: "./dist/esm/index.js",
            node_args: "--experimental-specifier-resolution=node",
            exec_mode: enableClusterMode ? "cluster" : "fork",
            instances: enableClusterMode ? "max" : 1,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
