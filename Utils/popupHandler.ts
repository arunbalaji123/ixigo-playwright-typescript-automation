import {type Page,type Locator} from '@playwright/test';
export class popupHandler {
    readonly page:Page
    readonly offerPopup:Locator
    readonly securePopup:Locator
             t:boolean
             g:boolean

    constructor(page:Page) {
        this.page = page;
        this.offerPopup = page.locator('#wiz-iframe-intent');
        this.securePopup = page.locator('div.container.card.light.lg.rounded-md');
        this.t=false;
        this.g=true;
    }

    async HandleOfferPopup():Promise<void> {
        
        try {
            await this.offerPopup.waitFor({state: 'visible',timeout: 2000});

            await this.offerPopup.contentFrame().getByRole('button', { name: '×' }).click();

            console.log('Offer popup closed');
        } catch {
            console.log('Offer popup not displayed');
        }
    }

    async HandleSecurePopup():Promise<void> {
        if(!this.t ){
         try {
            await this.securePopup.waitFor({state: 'visible',timeout: 5000});

            await this.securePopup.getByText('Always Secure', { exact: true }).click();
            this.t=true;
            console.log('Secure popup handled');
        } catch {
           if(this.g) {
            console.log('Secure popup did not appear');
            }
            this.g=false;
                    
        }
    }
    }

    async passengerSecure():Promise<void>{
        if(!this.t){
        await this.page.getByText("Secure this booking only").click();
        }
    }
}

