import {test as setup ,expect} from '@playwright/test';
import {popupHandler} from '../Utils/popupHandler';
const AUTH_FILE:string = '../playwright/.auth/state.json';
setup('Ixigo Login', async ({ page}) => {
    const ph:popupHandler=new popupHandler(page);

    await page.goto('https://www.ixigo.com/');
    await page.getByText('Log in/Sign up').first().click();

    let mobileNumber:string|undefined = process.env.IXIGO_MOBILE;
    if (!mobileNumber) {
        throw new Error('IXIGO_MOBILE is missing');
    }
    await page.getByRole('textbox', {name: 'Enter Mobile Number'}).fill(mobileNumber);
    await page.getByRole('button', {name: 'Continue'}).click();
    await ph.HandleOfferPopup();
    await page.pause();
    await expect(page.getByText('Log in/Sign up').first()).toBeHidden();
    await page.context().storageState({path: AUTH_FILE});
});