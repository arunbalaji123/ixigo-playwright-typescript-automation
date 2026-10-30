import {expect,type Page,type Locator} from '@playwright/test';
import type{ BusPayloadType, Passenger } from '../types/Bustypes';
export class PaymentPage{
    readonly page:Page
    readonly gb:Locator
    constructor(page:Page){
        this.page=page;
        this.gb = page.getByText("Generate QR");

    }
getUIDestination(destination:string):string {
         return destination === 'Bengaluru' ? 'Bangalore' : destination;
  
    }

    async verifyPaymentPage(payload:BusPayloadType,passengers:Passenger[],passengerCount:number):Promise<void> {
        await this.page.waitForLoadState('load');
        await expect(this.page).toHaveURL(/\/payments\/view\/home/);
            await expect(this.page.getByText('Fare Summary', { exact: true })).toBeVisible();
            await expect(this.page.getByText('Amount To Be Paid', { exact: true })).toBeVisible();
            const uiDestination:string = this.getUIDestination(payload.destination);
            const routeHeading:Locator = this.page.getByRole('heading', {name: `${payload.source} - ${uiDestination}`,exact: true });
            const tripDetails:Locator = routeHeading.locator('xpath=ancestor::div[contains(@class,"shadow-100")][1]');
           await expect(routeHeading).toBeVisible();
           await expect(tripDetails).toBeVisible();
           await expect(tripDetails).toContainText(payload.source);
           await expect(tripDetails).toContainText(uiDestination);
           await expect(tripDetails).toContainText('Travellers');
           await expect(tripDetails).toContainText(passengers[0].name);
            if (passengerCount > 1) {
                await expect(tripDetails).toContainText(`+${passengerCount - 1} More`);
        }

    }

    async verifyPaymentMethods():Promise<void> {
        
            await expect(this.page.getByText('Pay via any UPI app', { exact: true })).toBeVisible();
            await expect(this.page.getByText('Credit/Debit/ATM Card', { exact: true })).toBeVisible();
            await expect(this.page.getByText('Net Banking', { exact: true })).toBeVisible();
    }

    async generateQR():Promise<void> {
       
          await this.gb.click();
          await this.gb.waitFor({ state: 'hidden' });
          await this.page.screenshot({ path: 'Chkpts_ScrShots/PaymentPage.png', fullPage: true ,});
    }
}
