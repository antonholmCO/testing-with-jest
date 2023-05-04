const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

const fileUnderTest = 'file://' + __dirname.replace(/ /g, '%20') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
console.log(fileUnderTest);
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
	let stack = await driver.findElement(By.id('top_of_stack')).getText();
	expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
	it('should open a prompt box', async () => {
		let push = await driver.findElement(By.id('push'));
		await push.click();
		let alert = await driver.switchTo().alert();
		await alert.sendKeys("Bananer");
		await alert.accept();
	});
});

describe('Clicking on the "Vad finns överst på stacken?" after popping an item', () => {
	it('should show the correct item on top of the stack', async () => {
		let push, alert;
        
        push = await driver.findElement(By.id('push'));
		await push.click();
		alert = await driver.switchTo().alert();
		await alert.sendKeys("Hund");
		await alert.accept();

        push = await driver.findElement(By.id('push'));
		await push.click();
		alert = await driver.switchTo().alert();
		await alert.sendKeys("Katt");
		await alert.accept();

        let popButton = await driver.findElement(By.id('pop'));
		await popButton.click();
        alert = await driver.switchTo().alert();
        await alert.accept();

        let peekButton = await driver.findElement(By.id('peek'));
        await peekButton.click();

        let stack = await driver.findElement(By.id('top_of_stack')).getText();
        expect(stack).toEqual("Hund");
	});
});