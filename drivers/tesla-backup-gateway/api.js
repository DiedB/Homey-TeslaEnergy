const fetch = require('node-fetch');
const https = require('https');

class TeslaBackupGatewayApi {
    endpoints = {
        siteName: '/site_info/site_name',
        siteStatus: '/sitemaster',
        batterySoc: '/system_status/soe',
        meterAggregates: '/meters/aggregates'
    }

    constructor(ipAddress) {
        this.baseUrl = `https://${ipAddress}/api`;
    }

    getConnectionStatus() {
        return this.connected;
    }

    async apiRequest(endpoint) {
        const apiResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            agent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        if (apiResponse.ok) {
            return await apiResponse.json();
        }

        throw "Tesla Backup Gateway connection failed"
    }

    async connect() {
        await this.apiRequest(this.endpoints.siteStatus);
        this.connected = true;
    }

    async getSiteName() {
        return (await this.apiRequest(this.endpoints.siteName)).site_name;
    }

    async getBatterySoc() {
        return (await this.apiRequest(this.endpoints.batterySoc)).percentage;
    }

    async getMeterAggregates() {
        return (await this.apiRequest(this.endpoints.meterAggregates));
    }
}

module.exports = { TeslaBackupGatewayApi };