import { test,expect,type BrowserContext, type Page } from "@playwright/test";
import  path  from 'path';
import {popupHandler } from '../Utils/popupHandler';
import {APIutils} from '../Utils/APIUtils';
import {payloads} from '../Utils/payloads';
import {BusSearchPage} from '../Pages/BusSearchPage';
import {BusResultsPage} from '../Pages/BusResultsPage';
import {PassengerDetails} from '../Pages/passengerDetails';
import {PaymentPage} from '../Pages/PaymentPage';
import { BusPayloadType, BusSearchResponse, FilteredBus } from "../types/Bustypes";
//ithulam infile varibales
const BASE_URL:string = 'https://www.ixigo.com/';
const AUTH_FILE:string= '../playwright/.auth/state.json';
const Filepath:string = path.resolve(__dirname, '../testData/Passengers.xlsx');
const Journey:string = "chn-pune";
const passengerCount:number = 6;

test( '@web Arun Bus section', async ({ browser }) => {
    test.setTimeout(120000)
    const context:BrowserContext = await browser.newContext({ storageState: AUTH_FILE, ignoreHTTPSErrors: true });
    const BS:APIutils = new APIutils(context.request);
    const pyl:payloads = new payloads(Journey);
    const busSearchPayload:BusPayloadType = pyl.PayloadForBus()
    const busSearchResponse:BusSearchResponse = await BS.searchBuses(busSearchPayload);
    const selectedBus:FilteredBus = BS.selectBestBus(busSearchResponse, passengerCount);
    expect(selectedBus.serviceId).toBeDefined();
    expect(selectedBus.operatorName).toBeTruthy();
    expect(selectedBus.busType.toLowerCase()).toContain('sleeper');

    // UI work starts later
    const page:Page = await context.newPage();
    const Bsp:BusSearchPage = new BusSearchPage(page);
    const ph:popupHandler = new popupHandler(page);
    const Brp:BusResultsPage = new BusResultsPage(page, Journey);
    const pdp:PassengerDetails = new PassengerDetails(page, Filepath, passengerCount);
    const pp:PaymentPage = new PaymentPage(page);

    //bus search page
    await Bsp.openBusPage(BASE_URL);
    await Bsp.searchBus(busSearchPayload);
    await ph.HandleSecurePopup();
    await Bsp.applyBusFilters(true);
    await ph.HandleSecurePopup();

    //bus result page
    await Brp.verifySelectedBus(selectedBus);
    await Brp.openSeatLayout(selectedBus.serviceId);
    await Brp.PickUp_Drop();
    const selectedSeats:string[] = await Brp.selectSleeperSeats(passengerCount);
    expect(selectedSeats).toHaveLength(passengerCount);
    await Brp.clickProceed(true);
    await ph.HandleSecurePopup();


    /// passenger page 
    await pdp.verifyPage();
    await pdp.verifyTripDetails(busSearchPayload, selectedBus)
    await pdp.fillPassengers();
    await ph.passengerSecure();
    await pdp.continueToPay(true);

    // payment page
    await pp.verifyPaymentPage(busSearchPayload, pdp.returnPassengers(), passengerCount)
    await pp.verifyPaymentMethods();
    await pp.generateQR();
    await context.close();

});





  

