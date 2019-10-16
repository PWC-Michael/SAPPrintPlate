export const appConfig = {
    __api_dev: "http://sap-api.local/api/rest/",
    __api_live: "https://printplate-api.herokuapp.com/api/rest",
    env: "dev",
    PROOF_OF_ID_CODE: 'PID',
    PROOF_OF_ENT_CODE: 'PENT',
    setEnvironment(envValue) {
        this.env = envValue;
    },
    getAPIBase() {
        // always default to dev unless explicity stated
        let api = this.__api_dev;
        if (this.env == "live") {
            api = this.__api_live;
        }
        return api;
    },
};