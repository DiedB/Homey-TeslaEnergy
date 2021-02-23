const fetch = require("node-fetch");
const https = require("https");

class TeslaBackupGatewayApi {
    endpoints = {
        login: "/login/Basic",
        status: "/status",
        siteName: "/site_info/site_name",
        batterySoc: "/system_status/soe",
        meterAggregates: "/meters/aggregates",
    };

    constructor(ipAddress, username, password) {
        this.baseUrl = `https://${ipAddress}/api`;
        this.username = username;
        this.password = password;
        this.cookieHeader = "";
    }

    async apiRequest(endpoint, body) {
        const requestOptions = body
            ? {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      Cookie: this.cookieHeader,
                  },
                  body: JSON.stringify(body),
              }
            : {
                  headers: {
                      Cookie: this.cookieHeader,
                  },
              };

        const apiResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            agent: new https.Agent({
                rejectUnauthorized: false,
            }),
            ...requestOptions,
        });

        // TODO: remove debugging statement before release
        this.log(apiResponse);

        if (apiResponse.ok) {
            return apiResponse;
        } else if (apiResponse.status >= 400 && apiResponse.status < 500) {
            throw "Invalid credentials or session expired";
        }

        throw "Tesla Backup Gateway connection failed";
    }

    async login() {
        const loginResponse = await this.apiRequest(this.endpoints.login, {
            username: "customer",
            email: this.username,
            password: this.password,
            force_sm_off: false,
        });

        this.cookieHeader = loginResponse.headers
            .raw()
            ["set-cookie"].map((cookie) => cookie.split(";")[0])
            .join(";");
    }

    async getSiteName() {
        const siteNameResponse = await this.apiRequest(this.endpoints.siteName);
        const siteNameJson = await siteNameResponse.json();
        return siteNameJson.site_name;
    }

    async getBatterySoc() {
        const batterySocResponse = await this.apiRequest(
            this.endpoints.batterySoc
        );
        const batterySocJson = await batterySocResponse.json();
        return batterySocJson.percentage;
    }

    async getMeterAggregates() {
        const meterAggregatesResponse = await this.apiRequest(
            this.endpoints.meterAggregates
        );
        return await meterAggregatesResponse.json();
    }
}

module.exports = { TeslaBackupGatewayApi };
