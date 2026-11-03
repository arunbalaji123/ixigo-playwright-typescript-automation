import {BusPayloadType} from '../types/Bustypes';
export class payloads {
   readonly key:string
    constructor(key:string) {
        this.key = key;
    }

    PayloadForBus():BusPayloadType {
        switch (this.key.toLowerCase()) {
            case "chn-hyd":
                return {
                    "source": "Chennai", "sourceid": 6, "destination": "Hyderabad", "destinationid": 3,
                    "jdate": "2026-11-10", "prd": "mobile", "filters": "1",
                    "isReturnJourney": "0", "version": "105", "api_exp":
                    {
                        "exp_feat_getbuslist": "v1", "exp_ixigo_payment": "A", "exp_no_results_sdui_web":
                            "B", "exp_seatlayout_desktop_apis": "2291", "exp_seatlayout_mobile_apis": "2291", "exp_seatlayout_version": "V1", "exp_service_cards": "2", "exp_sponsored_listing_clicks": "A", "exp_srp_outlier": "no", "exp_srp_sort_weighted": "C", "exp_uber_seat": "A"
                    }, "clevertapID": "9bbb39be217e425e82cb54505fb512f6"
                }

            case "chn-pune":
                return { "source": "Chennai", "sourceid": 6, "destination": "Pune", "destinationid": 51, "jdate": "2026-11-10", "prd": "mobile", "filters": "1", "isReturnJourney": "0", "version": "105", "api_exp": { "exp_feat_getbuslist": "v1", "exp_ixigo_payment": "A", "exp_no_results_sdui_web": "B", "exp_seatlayout_desktop_apis": "2291", "exp_seatlayout_mobile_apis": "2291", "exp_seatlayout_version": "V1", "exp_service_cards": "2", "exp_sponsored_listing_clicks": "A", "exp_srp_outlier": "no", "exp_srp_sort_weighted": "C", "exp_uber_seat": "A" }, "clevertapID": "9bbb39be217e425e82cb54505fb512f6" }

            case "chn-blr":
                return { "source": "Chennai", "sourceid": 6, "destination": "Bengaluru", "destinationid": 7, "jdate": "2026-11-10", "prd": "mobile", "filters": "1", "isReturnJourney": "0", "version": "105", "api_exp": { "exp_feat_getbuslist": "v1", "exp_ixigo_payment": "A", "exp_no_results_sdui_web": "B", "exp_seatlayout_desktop_apis": "2291", "exp_seatlayout_mobile_apis": "2291", "exp_seatlayout_version": "V1", "exp_service_cards": "2", "exp_sponsored_listing_clicks": "A", "exp_srp_outlier": "no", "exp_srp_sort_weighted": "C", "exp_uber_seat": "A" }, "clevertapID": "9bbb39be217e425e82cb54505fb512f6" }

            case "chn-goa":
                return { "source": "Chennai", "sourceid": 6, "destination": "Goa", "destinationid": 102, "jdate": "2026-11-10", "prd": "mobile", "filters": "1", "isReturnJourney": "0", "version": "105", "api_exp": { "exp_feat_getbuslist": "v1", "exp_ixigo_payment": "A", "exp_no_results_sdui_web": "B", "exp_seatlayout_desktop_apis": "2291", "exp_seatlayout_mobile_apis": "2291", "exp_seatlayout_version": "V1", "exp_service_cards": "2", "exp_sponsored_listing_clicks": "A", "exp_srp_outlier": "no", "exp_srp_sort_weighted": "C", "exp_uber_seat": "A" }, "clevertapID": "9bbb39be217e425e82cb54505fb512f6" }

            case "chn-ern":
                return { "source": "Chennai", "sourceid": 6, "destination": "Ernakulam", "destinationid": 530, "jdate": "2026-11-10", "prd": "mobile", "filters": "1", "isReturnJourney": "0", "version": "105", "api_exp": { "exp_feat_getbuslist": "v1", "exp_ixigo_payment": "A", "exp_no_results_sdui_web": "B", "exp_seatlayout_desktop_apis": "2291", "exp_seatlayout_mobile_apis": "2291", "exp_seatlayout_version": "V1", "exp_service_cards": "2", "exp_sponsored_listing_clicks": "A", "exp_srp_outlier": "no", "exp_srp_sort_weighted": "C", "exp_uber_seat": "A" }, "clevertapID": "9bbb39be217e425e82cb54505fb512f6" }

            case "chn-mumbai":
                return { "source": "Chennai", "sourceid": 6, "destination": "Mumbai", "destinationid": 4, "jdate": "2026-11-10", "prd": "mobile", "filters": "1", "isReturnJourney": "0", "version": "105", "api_exp": { "exp_feat_getbuslist": "v1", "exp_ixigo_payment": "A", "exp_no_results_sdui_web": "B", "exp_seatlayout_desktop_apis": "2291", "exp_seatlayout_mobile_apis": "2291", "exp_seatlayout_version": "V1", "exp_service_cards": "2", "exp_sponsored_listing_clicks": "A", "exp_srp_outlier": "no", "exp_srp_sort_weighted": "C", "exp_uber_seat": "A" }, "clevertapID": "9bbb39be217e425e82cb54505fb512f6" }

            default:
                throw new Error(`You gave a Unexpected Journey Key: ${this.key}..`);
                
        }
    }

}


















//     async selectSleeperSeats(page, passengerCount) {
//         const{expect}=require('@playwright/test')
//     const availableSleeperSeats = page.locator('#seat-layout-details:visible button.seat.sleeper.seat-button');
//     await expect(availableSleeperSeats.first()).toBeVisible();
//     const availableCount = await availableSleeperSeats.count();
//     if (availableCount < passengerCount) {
//         throw new Error(
//             `Only ${availableCount} sleeper seats are available, ` +
//             `but ${passengerCount} seats are required`
//         );
//     }

//     const selectedSeatPrices = [];
//     for (let i = 0; i < passengerCount; i++) {
//         const seat = availableSleeperSeats.nth(i);
//         await seat.scrollIntoViewIfNeeded();
//         await expect(seat).toBeVisible();
//         await expect(seat).toBeEnabled();
//         const price = (await seat.textContent()).trim();
//         await seat.click();
//         selectedSeatPrices.push(price);
//     }

//     console.log('Selected sleeper seat prices:', selectedSeatPrices);

//     return selectedSeatPrices;
// }




