export interface TeslaEnergyDevice {
  name: string;
  data: TeslaEnergyDeviceData;
  settings: TeslaEnergyDeviceSettings;
}

export interface TeslaEnergyDeviceData {
  id: string;
}

export interface TeslaEnergyDeviceSettings {
  ipAddress: string;
  username: string;
  password: string;
}

// API response types
export interface ApiSitenameResponse {
  site_name: string;
  timezone: string;
}

export interface ApiBatterySoeResponse {
  percentage: number;
}

export interface ApiMeterAggregatesResponse {
  site: {
    last_communication_time: string;
    instant_power: number;
    instant_reactive_power: number;
    instant_apparent_power: number;
    frequency: number;
    energy_exported: number;
    energy_imported: number;
    instant_average_voltage: number;
    instant_total_current: number;
    i_a_current: number;
    i_b_current: number;
    i_c_current: number;
  };
  battery: {
    last_communication_time: string;
    instant_power: number;
    instant_reactive_power: number;
    instant_apparent_power: number;
    frequency: number;
    energy_exported: number;
    energy_imported: number;
    instant_average_voltage: number;
    instant_total_current: number;
    i_a_current: number;
    i_b_current: number;
    i_c_current: number;
  };
  load: {
    last_communication_time: string;
    instant_power: number;
    instant_reactive_power: number;
    instant_apparent_power: number;
    frequency: number;
    energy_exported: number;
    energy_imported: number;
    instant_average_voltage: number;
    instant_total_current: number;
    i_a_current: number;
    i_b_current: number;
    i_c_current: number;
  };
  solar: {
    last_communication_time: string;
    instant_power: number;
    instant_reactive_power: number;
    instant_apparent_power: number;
    frequency: number;
    energy_exported: number;
    energy_imported: number;
    instant_average_voltage: number;
    instant_total_current: number;
    i_a_current: number;
    i_b_current: number;
    i_c_current: number;
  };
  busway: {
    last_communication_time: string;
    instant_power: number;
    instant_reactive_power: number;
    instant_apparent_power: number;
    frequency: number;
    energy_exported: number;
    energy_imported: number;
    instant_average_voltage: number;
    instant_total_current: number;
    i_a_current: number;
    i_b_current: number;
    i_c_current: number;
  };
  frequency: {
    last_communication_time: string;
    instant_power: number;
    instant_reactive_power: number;
    instant_apparent_power: number;
    frequency: number;
    energy_exported: number;
    energy_imported: number;
    instant_average_voltage: number;
    instant_total_current: number;
    i_a_current: number;
    i_b_current: number;
    i_c_current: number;
  };
  generator: {
    last_communication_time: string;
    instant_power: number;
    instant_reactive_power: number;
    instant_apparent_power: number;
    frequency: number;
    energy_exported: number;
    energy_imported: number;
    instant_average_voltage: number;
    instant_total_current: number;
    i_a_current: number;
    i_b_current: number;
    i_c_current: number;
  };
}
