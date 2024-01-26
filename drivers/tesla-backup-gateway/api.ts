import fetch, { RequestInit, Response } from "node-fetch";
import https from "node:https";
import {
  ApiBatterySoeResponse,
  ApiMeterAggregatesResponse,
  ApiSitenameResponse,
  ApiGridStatusResponse
} from "./types";

const ENDPOINTS = {
  login: "/login/Basic",
  status: "/status",
  siteName: "/site_info/site_name",
  batterySoc: "/system_status/soe",
  meterAggregates: "/meters/aggregates",
  gridStatus: "/system_status/grid_status"
};

class TeslaBackupGatewayApi {
  private baseUrl: string;
  private username: string;
  private password: string;
  private cookieHeader: string;

  constructor(ipAddress: string, username: string, password: string) {
    this.baseUrl = `https://${ipAddress}/api`;
    this.username = username;
    this.password = password;
    this.cookieHeader = "";
  }

  async fetchApiEndpoint<T>(endpoint: string) {
    const apiResponse = await this.rawApiRequest(endpoint);

    return apiResponse.json() as T;
  }

  async rawApiRequest(endpoint: string, body?: Object) {
    const requestOptions: RequestInit = body
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
      agent: () =>
        new https.Agent({
          rejectUnauthorized: false,
        }),
      ...requestOptions,
    });

    if (apiResponse.ok) {
      return apiResponse;
    } else if (apiResponse.status >= 400 && apiResponse.status < 500) {
      throw "Invalid credentials or session expired";
    }

    throw "Tesla Backup Gateway connection failed";
  }

  async login() {
    // Do not login if username and password have not been set (assume firmware before 20.49)
    if (this.username && this.password) {
      const loginResponse = await this.rawApiRequest(ENDPOINTS.login, {
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
  }

  async getSiteName() {
    const siteNameResponse = await this.fetchApiEndpoint<ApiSitenameResponse>(
      ENDPOINTS.siteName
    );

    return siteNameResponse.site_name;
  }

  async getBatterySoc() {
    const batterySocResponse =
      await this.fetchApiEndpoint<ApiBatterySoeResponse>(ENDPOINTS.batterySoc);

    return batterySocResponse.percentage;
  }

  async getMeterAggregates() {
    const meterAggregatesResponse =
      await this.fetchApiEndpoint<ApiMeterAggregatesResponse>(
        ENDPOINTS.meterAggregates
      );

    return meterAggregatesResponse;
  }

  async getGridStatus() {
    const gridStatusResponse =
      await this.fetchApiEndpoint<ApiGridStatusResponse>(
        ENDPOINTS.gridStatus
      );

    return gridStatusResponse;
  }
}

export default TeslaBackupGatewayApi;
