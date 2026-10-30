import { test,expect,type BrowserContext, type Page, type Locator } from "@playwright/test";
import  path  from 'path';
import {BusSearchPage} from '../Pages/BusSearchPage';
import {BusResultsPage} from '../Pages/BusResultsPage';
import {PassengerDetails} from '../Pages/passengerDetails';
import { BusPayloadType, BusSearchResponse, FilteredBus } from "../types/Bustypes";
//these are infile varibales..
const BASE_URL:string = 'https://www.ixigo.com/';
const AUTH_FILE:string = '../playwright/.auth/state.json';
const Filepath:string = path.resolve(__dirname, '../testData/Passengers.xlsx');
test.describe.configure({mode:'serial'});
const Journey:string = "chn-mumbai";


test('@web Search without Origin City ', async ({ browser }) => {
    const context:BrowserContext = await browser.newContext({ ignoreHTTPSErrors: true });
    const page:Page = await context.newPage();
    const Bsp:BusSearchPage = new BusSearchPage(page);
    await Bsp.openBusPage(BASE_URL);
    await Bsp.selectDestination('Chennai');
    await Bsp.clickSearch();
    await Bsp.verifyMissingOriginError();

    await context.close();
});


test('@web Search without Destination City', async ({ browser }) => {
    const context:BrowserContext = await browser.newContext({ ignoreHTTPSErrors: true });
    const page:Page = await context.newPage();
    const Bsp:BusSearchPage = new BusSearchPage(page);
    await Bsp.openBusPage(BASE_URL);
    await Bsp.selectSource('Mumbai');
    await Bsp.clickSearch();
    await Bsp.verifyMissingDestinationError();

    await context.close();
});



test('Maximum 6 seats allowed per passenger @web ', async ({ browser }) => {
    test.setTimeout(90000);
    const context:BrowserContext = await browser.newContext({ storageState: AUTH_FILE, ignoreHTTPSErrors: true });
    const page:Page = await context.newPage();
    const Bsp:BusSearchPage = new BusSearchPage(page);
    const Brp:BusResultsPage = new BusResultsPage(page, 'chn-blr');
    await Bsp.pageGoto();
    const selectSeatsButtons:Locator = page.getByRole('button', { name: 'Select Seats', exact: true });
    await expect(selectSeatsButtons.first()).toBeVisible();

    await selectSeatsButtons.first().click();
    await Brp.verifyMaximumSixSeats();


    await context.close();
});

test(' @web Proceed disabled without journey points and restricted female berth validation', async ({ browser }) => {
    test.setTimeout(90000);

    const context = await browser.newContext({ storageState: AUTH_FILE, ignoreHTTPSErrors: true });

    const page = await context.newPage();
    const bsp = new BusSearchPage(page)
    const Brp = new BusResultsPage(page, 'chn-blr');
    const pdp = new PassengerDetails(page, Filepath, 1);
   
    const ResOP = 'Fresh Bus Electric';

    await bsp.pageGoto();

    await bsp.applyBusFilters(false);
    await Brp.openBusByOperator(ResOP);
    await Brp.selectOneSleeperSeat();
    await Brp.verifyProceedDisabled();
    await Brp.selectFixedBengaluruJourneyPoints()
    await Brp.verifyProceedEnabled();
    await Brp.clickProceed(false);
    await pdp.fillSingleFemalePassenger("Sheee", 21);
    await pdp.continueToPay(false)
    await pdp.verifyFemaleBerthRestriction();

    await context.close();
});