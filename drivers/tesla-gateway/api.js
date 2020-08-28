const fetch = require('node-fetch');
const https = require('https');

class TeslaGatewayApi {
    endpoints = {
        siteName: '/api/site_info/site_name'
    }

    constructor(ipAddress) {
        this.baseUrl = `https://${ipAddress}`;
    }

    async apiRequest(endpoint) {
        const apiResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            agent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        return await apiResponse.json();
    }

    async getSiteName() {
        return (await this.apiRequest(this.endpoints.siteName)).site_name;
    }
}

module.exports = { TeslaGatewayApi };