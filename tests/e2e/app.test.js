const httpServer = require('http-server');
const puppeteer = require('puppeteer');

describe('CRM e2e', () => {
  let server;
  let browser;
  let page;

  beforeAll(async () => {
    server = httpServer.createServer({ root: 'dist', cache: -1 });
    await new Promise((resolve) => server.listen(8080, resolve));

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    page = await browser.newPage();
    await page.goto('http://127.0.0.1:8080', { waitUntil: 'networkidle0' });
  });

  afterAll(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  test('add validates and creates row', async () => {
    await page.click('[data-role="add"]');
    const err0 = await page.$('.error');
    expect(err0).toBeNull();

    await page.click('[data-role="save"]');
    await page.waitForSelector('.error');

    await page.type('input[name="name"]', 'Phone');
    await page.type('input[name="price"]', '10');
    await page.click('[data-role="save"]');

    await page.waitForSelector('tr[data-id]');
  });

  test('edit then add resets state', async () => {
    await page.click('button[data-action="edit"]');
    await page.waitForSelector('input[name="name"]');
    await page.click('input[name="name"]', { clickCount: 3 });
    await page.type('input[name="name"]', 'Phone X');
    await page.click('[data-role="save"]');

    await page.click('[data-role="add"]');
    await page.waitForSelector('input[name="name"]');
    const nameVal = await page.$eval('input[name="name"]', (el) => el.value);
    expect(nameVal).toBe('');
    const err = await page.$('.error');
    expect(err).toBeNull();
  });

  test('delete with confirm', async () => {
    await page.click('button[data-action="delete"]');
    await page.waitForSelector('[data-role="confirm-ok"]');
    await page.click('[data-role="confirm-ok"]');
    const rows = await page.$$('tr[data-id]');
    expect(rows.length).toBe(0);
  });
});
