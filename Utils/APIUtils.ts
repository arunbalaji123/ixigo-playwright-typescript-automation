import {expect,type APIRequestContext,type APIResponse} from '@playwright/test';
import {BusPayloadType,BusSearchResponse,BusService,FilteredBus,} from '../types/Bustypes';

export class APIutils {
    readonly context:APIRequestContext
    constructor(context:APIRequestContext) {
        this.context = context;
    }


    async searchBuses(searchPayload:BusPayloadType):Promise<BusSearchResponse> {
        const searchResponse:APIResponse = await this.context.post('https://www.ixigo.com/buslist/v3/services', {
            data: searchPayload
        }
        );

        expect(searchResponse.ok()).toBeTruthy();
        const responseBody:BusSearchResponse = await searchResponse.json();
        const serviceArray:BusService[] = responseBody.services;
        // console.log(responseBody);
        if (!Array.isArray(serviceArray) || serviceArray.length === 0) {
            throw new Error("status: "+ responseBody.status + "\nmessage: "+responseBody.message );
        }
        return responseBody;
    }


   filterBuses(responseBody:BusSearchResponse, passengerCount:number):BusService[] {
    const eligibleBuses:BusService[]= responseBody.services.filter(bus => {
        const type:string = bus.busTypeName.toLowerCase();
        return type.includes('ac') &&type.includes('sleeper') &&!type.includes('non ac') && !type.includes('non-ac') 
        && bus.seatStats.availableSeats >= passengerCount && bus.rating >= 3.0;
        })
        .sort((a:BusService, b:BusService) =>b.noOfRatings - a.noOfRatings || b.rating - a.rating);
    if (!eligibleBuses.length) {
        throw new Error('No suitable bus available');
    }
    return eligibleBuses;
}

selectBestBus(responseBody:BusSearchResponse, passengerCount:number):FilteredBus {
    const selectedBus:BusService =this.filterBuses(responseBody, passengerCount)[0];
    console.log('Selected Bus:', {
    serviceId: selectedBus.serviceId,
    operatorName: selectedBus.travelerAgentName,
    busType: selectedBus.busTypeName,
    rating: selectedBus.rating,
    ratingCount: selectedBus.noOfRatings,
    availableSeats: selectedBus.seatStats.availableSeats
});
    return {
        serviceId: selectedBus.serviceId,
        operatorName: selectedBus.travelerAgentName,
        busType: selectedBus.busTypeName
    };
}

}
