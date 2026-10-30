import {expect , type Page,type Locator} from '@playwright/test';
import {Readpassengers } from '../Utils/excelReader';
import type{BusPayloadType,FilteredBus,Passenger} from '../types/Bustypes';

export class PassengerDetails {
    readonly page:Page
    readonly lc:Locator
    readonly passengerNames:Locator
    readonly passengerAges:Locator
    readonly Filepath:string
    readonly passengerCount:number
    readonly pslo:Locator
    readonly paybtn:Locator
    passengers:Passenger[]

    constructor(page:Page, Filepath:string, passengerCount:number) {
        this.page = page;
        this.lc = page.locator("#travel-distance-container");
        this.passengerNames = page.getByPlaceholder('Name');
        this.passengerAges = page.getByPlaceholder('Age');
        this.Filepath = Filepath;
        this.passengerCount = passengerCount;
        this.pslo = page.locator('#passenger-detail-gender');
        this.paybtn = page.getByText('Continue to Pay ₹ ');
        this.passengers=[];
    }

    async verifyPage():Promise<void> {
        await expect(this.page.getByText('Passenger Details', { exact: true })).toBeVisible();
        await expect(this.page.getByText('Contact Details', { exact: true })).toBeVisible();
        await expect(this.page.getByText('Fare Details', { exact: true })).toBeVisible();
    }

    async verifyTripDetails(Payload:BusPayloadType, selectedBus:FilteredBus):Promise<void> {
        await expect(this.lc).toContainText(Payload.source);
        await expect(this.lc).toContainText(Payload.destination);
        await expect(this.lc).toContainText(Payload.jdate.split('-')[2]);
        expect(await this.page.locator('span[class="travel-agent-name"]').textContent()).toEqual(selectedBus.operatorName);
    }

    async fillPassengers():Promise<void> {

        await expect(this.passengerNames).toHaveCount(this.passengerCount);
        await expect(this.passengerAges).toHaveCount(this.passengerCount);
        await expect(this.pslo).toHaveCount(this.passengerCount);
        this.passengers = await Readpassengers(this.Filepath, this.passengerCount);
        for (let i = 0; i < this.passengerCount; i++) {
            await this.passengerNames.nth(i).fill(this.passengers[i].name);
            await this.passengerAges.nth(i).fill(String(this.passengers[i].age));
            const gender:string= this.passengers[i].gender.trim().toLowerCase();
            await this.pslo.nth(i).locator(`button.btn-gender.${gender}`).click();
        }
    }

    async continueToPay(QR_SS:boolean):Promise<void> {
        if(QR_SS){
        await this.page.screenshot({ path: 'Chkpts_ScrShots/PassengersDetail.png', fullPage: true });
        }
        await this.paybtn.click();
    }
    

    returnPassengers():Passenger[] {
        return this.passengers;  
    }

    async fillSingleFemalePassenger(name:string, age:number):Promise<void> {
    await expect(this.passengerNames.first()).toBeVisible();
    await this.passengerNames.first().fill(name);
    await this.passengerAges.first().fill(String(age));

    await this.pslo.first().locator('button.btn-gender.female').click();
    await this.page.getByText("Secure this booking only").click();

}
async verifyFemaleBerthRestriction():Promise<void> {
    await expect(this.page.getByText('Sorry, failed to confirm seat',{ exact: true })).toBeVisible();
    await expect(this.page.getByText(/does not allow single women passengers to book a seat on double berth/i)).toBeVisible();
    await expect(this.page.getByText('Go back to seat Layout',{ exact: true })).toBeVisible();
}
} 