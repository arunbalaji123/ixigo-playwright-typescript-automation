import { expect, type Page, type Locator } from '@playwright/test';
import type{ FilteredBus,JourneyLocObj } from '../types/Bustypes';
export class BusResultsPage {
       readonly page: Page
    readonly Journey: string
    readonly resultsContainer: Locator
    readonly brdpointlocator: Locator
    readonly despointlocator:Locator
    readonly proceedButton:Locator
    readonly loctionContainer:Locator
    





    constructor(page:Page, Journey:string ) {
        this.page = page;
        this.Journey = Journey;
        this.resultsContainer = page.locator('#service-cards-container');
        this.brdpointlocator = page.locator("input[placeholder='Search Boarding Point']");
        this.despointlocator = page.locator("input[placeholder='Search Dropping Point']");
        this.proceedButton = page.getByRole('button', { name: 'Proceed', exact: true });
        this.loctionContainer = page.locator("div[class*='row card-footer']");
    }

    async verifySelectedBus(selectedBus:FilteredBus):Promise<void> {
        const selectedBusInfo = this.resultsContainer.locator(`#service-operator-info-${selectedBus.serviceId}`);
        await expect(selectedBusInfo).toBeVisible();
        await expect(selectedBusInfo).toContainText(selectedBus.operatorName);
        await expect(selectedBusInfo).toContainText(selectedBus.busType);
    }

    async openSeatLayout(serviceId:number):Promise<void> {
        await this.page.locator(`#show-service-btn-${serviceId}`).click();
        await expect(this.page.locator("div[class*='row card-footer']")).toBeVisible();
    }

    async selectAvailablePoint(inputLocator:Locator, preferredPoints:string[]):Promise<string> {
        for (const point of preferredPoints) {
            await inputLocator.fill('');
            await inputLocator.fill(point);
            const option = this.page.locator("div[id*='place-']").filter({ hasText: point }).first();
            try {
                await option.waitFor({ state: 'visible', timeout: 1500 });
                await option.click();
                console.log(`Selected point: ${point}`);
                return point;

            } catch {
                console.log(`${point} is unavailable`);
                // await inputLocator.click();
                // await inputLocator.press('Control+A');
                // await inputLocator.press('Backspace');
                await inputLocator.clear()
            }
        }

        throw new Error(`None of the preferred points are available: ` + preferredPoints.join(', '));
    }

    async PickUp_Drop():Promise<void> {
        const points = this.selectJourneyPoints();
        await this.selectAvailablePoint(this.brdpointlocator, points.boardingPoints);
        await this.selectAvailablePoint(this.despointlocator, points.droppingPoints);
    }

    selectJourneyPoints():JourneyLocObj {

        const des:string= this.Journey.split('-')[1].toLowerCase();
        const boardingPoints:string [] = ["Poonamallee", "Koyambedu", "Maduravo"];
        let droppingPoints;
        switch (des) {
            case "ern":
                droppingPoints = ["Aluva", "Edapally", "Vyttila"];
                break;

            case "blr":
                droppingPoints = ["Electronic City", "Majestic Bus Station", "Madiwala"];
                break;

            case "pune":
                droppingPoints = ["Wakad", "Baner", "Katraj"];
                break;

            case "mumbai":
                droppingPoints = ["Sion", "Vashi", "Panvel"];
                break;

            case "hyd":
                droppingPoints = ["Kondapur", "Ramoji", "LB Nagar"];
                break;

            case "goa":
                droppingPoints = ["Ramnagar", "Mollem", "Mapusa"];
                break;

            default:
                throw new Error("Our expected Dropping point isn't available...");
                 

        }
        return { boardingPoints, droppingPoints };

    }

    async selectSleeperSeats(passengerCount:number):Promise<string []> {
        if (passengerCount < 1 || passengerCount > 6) {
            throw new Error(
                'Passenger count must be between 1 and 6'
            );
        }
        const upperLayout:Locator = this.page.locator('#seat-layout-details').first();
        await expect(upperLayout).toBeVisible({ timeout: 5000 });
        const rows:Locator = upperLayout.locator('tbody tr');
        const firstRow:Locator = rows.nth(0);
        const secondRow:Locator = rows.nth(1);
        const singleBerthRow:Locator = rows.nth(3);
        const selectedPrices:string [] = [];
        let remainingPassengers:number = passengerCount;
        const firstRowCells:Locator = firstRow.locator('td');
        for (let column = 0; column < await firstRowCells.count() && remainingPassengers >= 2; column++) {
            const upperSeat:Locator = firstRow.locator('td').nth(column).locator('button.seat.sleeper.seat-button');
            const lowerSeat:Locator = secondRow.locator('td').nth(column).locator('button.seat.sleeper.seat-button');
            const upperAvailable:boolean = await upperSeat.count() > 0 && await upperSeat.isVisible() && await upperSeat.isEnabled();
            const lowerAvailable:boolean = await lowerSeat.count() > 0 && await lowerSeat.isVisible() && await lowerSeat.isEnabled();

            if (upperAvailable && lowerAvailable) {
                selectedPrices.push((await upperSeat.innerText())?.trim());
                await upperSeat.click();
                selectedPrices.push((await lowerSeat.innerText())?.trim());
                await lowerSeat.click();
                remainingPassengers -= 2;
            }
        }

        // If passenger count is odd, select one single berth.
        // Select all remaining passengers from available single berths
        // these are the new thungs we made a chnage...
        if (remainingPassengers > 0) {
            const singleSeats:Locator = singleBerthRow.locator('button.seat.sleeper.seat-button');
            const seatList:Locator[] = await singleSeats.all();
            for (const seat of seatList) {
                if (remainingPassengers === 0) {
                    break;
                }

                if (
                    await seat.isVisible() &&
                    await seat.isEnabled()
                ) {
                    const price:string|undefined= (await seat.textContent())?.trim();
                   

                    await seat.click();
                    if(price){
                    selectedPrices.push(price);
                }
                    remainingPassengers--;
                }

            }
        }

        if (remainingPassengers !== 0) {
            throw new Error(
                `Selected only ${selectedPrices.length} of ` + `${passengerCount} required seats`
            );
        }

        expect(selectedPrices).toHaveLength(passengerCount);

        console.log('Selected sleeper-seat prices:', selectedPrices);

        return selectedPrices;
    }

    async verifyProceedDisabled():Promise<void> {
        await expect(this.proceedButton).toBeDisabled();
    }
    async verifyProceedEnabled():Promise<void> {
        await expect(this.proceedButton).toBeEnabled();
    }

    async verifyMaximumSixSeats():Promise<void> {
        const seatLocator:Locator = this.page.locator('#seat-layout-details:visible ' + 'button.seat.sleeper.seat-button');
        await expect(seatLocator.first()).toBeVisible({ timeout: 10000 });

        const seats:Locator[] = await seatLocator.all();
        expect(seats.length).toBeGreaterThan(6);

        for (let i = 0; i < 6; i++) {
            await seats[i].click();
        }
        let dialogHandled:boolean = false;
        this.page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Maximum 6 seats allowed per passenger');
            dialogHandled = true;
            await dialog.accept();
        });

        await seats[6].click();

        expect(dialogHandled).toBeTruthy();
    }

    async clickProceed(Seat_SS:boolean):Promise<void> {
        await expect(this.proceedButton).toBeVisible();
        if(Seat_SS){
        await this.page.screenshot({ path: 'Chkpts_ScrShots/Seatschoosed.png' });
        await expect(this.proceedButton).toBeEnabled();
    }
        await this.proceedButton.click();
    }
  
    async openBusByOperator(operatorName:string):Promise<void> {
        const busCard:Locator = this.page.locator('#service-cards-container > div').filter({ hasText: operatorName }).first();

        await expect(busCard).toBeVisible();
        await busCard.getByRole('button', { name: 'Select Seats', exact: true }).click();
        await expect(this.page.locator('#seat-layout-details:visible').first()).toBeVisible();
    }

    async selectOneSleeperSeat():Promise<void> {
        const seat:Locator = this.page.locator('#seat-layout-details:visible ' + 'button.seat.sleeper.seat-button').first();
        await expect(seat).toBeVisible();
        await expect(seat).toBeEnabled();
        await seat.click();
    }

    async selectFixedBengaluruJourneyPoints():Promise<void> {
        await expect(this.loctionContainer).toBeVisible();

        await expect(this.brdpointlocator).toBeVisible();
        await this.brdpointlocator.fill('Poonam');
        const boardingOption:Locator = this.page.locator('#place-container > div[id^="place-"]').first();
        await boardingOption.click();


        await expect(this.despointlocator).toBeVisible();
        await this.despointlocator.fill('Electron');
        const droppingOption:Locator = this.page.locator('#place-container > div[id^="place-"]').first();
        await droppingOption.click();
    }



}
