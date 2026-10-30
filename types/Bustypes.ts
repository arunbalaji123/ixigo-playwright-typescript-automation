export interface BusPayloadType {
    source: string;
    sourceid: number;
    destination: string;
    destinationid: number;
    jdate: string;
    prd: string;
    filters: string;
    isReturnJourney: string;
    version: string;
    api_exp: apiExperiments;
    clevertapID: string;
}

export interface apiExperiments {
    exp_feat_getbuslist: string;
    exp_ixigo_payment: string;
    exp_no_results_sdui_web: string;
    exp_seatlayout_desktop_apis: string;
    exp_seatlayout_mobile_apis: string;
    exp_seatlayout_version: string;
    exp_service_cards: string;
    exp_sponsored_listing_clicks: string;
    exp_srp_outlier: string;
    exp_srp_sort_weighted: string;
    exp_uber_seat: string;
}

export interface SeatStats {
    availableSeats: number;
}

export interface BusService {
    serviceId: number;
    travelerAgentName: string;
    busTypeName: string;
    rating: number;
    noOfRatings: number;
    seatStats: SeatStats;
}

export interface BusSearchResponse {
    status?: string;
    message?: string;
    services: BusService[];
}

export interface FilteredBus{
    serviceId: number,
    operatorName:string,
    busType:string
}
export interface BusSearchPayload {
    source: string;
    destination: string;
    jdate: string;
}
export interface JourneyLocObj{ 
    boardingPoints:string[] , 
    droppingPoints:string [] 
}
type Gender='Male'|'Female';
export interface Passenger{
    name:string,
    age:string,
    gender:Gender
}

