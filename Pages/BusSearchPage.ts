import { expect ,type Page,type Locator} from '@playwright/test';
import {BusSearchPayload} from '../types/Bustypes';

export class BusSearchPage {
    page:Page
    sourceInput:Locator
    destinationInput:Locator
    dateInput:Locator
    searchButton:Locator
    acFilter:Locator
    sleeperFilter:Locator
    constructor(page:Page) {
        this.page = page;
        this.sourceInput = page.locator("input[placeholder='Leaving From']");
        this.destinationInput = page.locator("input[placeholder='Going To']");
        this.dateInput = page.locator("input[placeholder='Onward Journey Date']");
        this.searchButton = page.locator('#search-button').first();
        this.acFilter = page.getByText('AC',{ exact: true });
        this.sleeperFilter = page.getByText('Sleeper',{ exact: true });
    }

    async openBusPage(baseURL:string):Promise<void> {
        await this.page.goto(baseURL + 'buses');
        await expect(this.sourceInput).toBeVisible();

    }

    async selectSource(source:string):Promise<void> {
        await this.sourceInput.fill(source);
        await this.page.getByText(source, { exact: true }).first().click();
    }

    async selectDestination(destination:string):Promise<void> {
        await this.destinationInput.fill('');
        await this.destinationInput.pressSequentially(destination);
        await this.page.getByText(destination, { exact: true }).first().click();
    }

    async selectJourneyDate(journeyDate:string):Promise<void> {
        const day = journeyDate.split('-')[2];
        await this.dateInput.click();
        await this.page.getByRole('button', {name: day,exact: true}).click();
    }

    async clickSearch():Promise<void> {
       
        await expect(this.searchButton).toBeEnabled();
        await this.searchButton.click();

    }
    

    async searchBus(payload:BusSearchPayload):Promise<void> {
        await this.selectSource(payload.source);
        await this.selectDestination(payload.destination);
        await this.selectJourneyDate(payload.jdate);
        await this.clickSearch();
        await expect(this.page.locator('#service-cards-container')).toBeVisible({timeout: 10000});


    }
    async applyBusFilters(ss:boolean):Promise<void> {
        await this.acFilter.click();
        await this.sleeperFilter.click();
        if(ss){
        await this.page.screenshot({ path: 'Chkpts_ScrShots/BusResults.png'});
        }
    }

     async pageGoto():Promise<void>{
        await this.page.goto('https://www.ixigo.com/buses/bus_search/Chennai/6/Bengaluru/7/30-10-2026/');
     }
     
    async verifyMissingOriginError():Promise<void> {
        await expect(this.page.getByText('Please enter your Origin City',{ exact: true } ) ).toBeVisible();
}

async verifyMissingDestinationError():Promise<void> {
    await expect( this.page.getByText('Please enter your Destination City',{ exact: true })).toBeVisible();
}
}

