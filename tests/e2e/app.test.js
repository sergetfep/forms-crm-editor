const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

function serveStatic(rootDir) {
  return http.createServer((req, res) => {
    const urlPath = (req.url || '/').split('?')[0];
    const rel = urlPath === '/' ? '/index.html' : urlPath;
    const filePath = path.join(rootDir, rel);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const types = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
      };

      res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
      res.end(data);
    });
  });
}

describe('CRM e2e', () => {
  let server;
  let port;

  beforeAll(async () => {
    server = serveStatic(path.resolve(__dirname, '../../dist'));
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        port = server.address().port;
        resolve();
      });
    });
  }, 30000);

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  }, 30000);

  async function withPage(fn) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle0' });

    try {
      await fn(page);
    } finally {
      const closePromise = browser.close();
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
      await Promise.race([closePromise, timeoutPromise]);
    }
  }

  async function addItem(page, name, price) {
    await page.click('[data-role="add"]');
    await page.waitForSelector('input[name="name"]');
    await page.type('input[name="name"]', name);
    await page.type('input[name="price"]', String(price));
    await page.click('[data-role="save"]');
    await page.waitForSelector('tr[data-id]');
  }

  test('add validates and creates row', async () => {
    await withPage(async (page) => {
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
  }, 60000);

  test('edit then add resets state', async () => {
    await withPage(async (page) => {
      await addItem(page, 'Phone', 10);

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
  }, 60000);

  test('delete with confirm', async () => {
    await withPage(async (page) => {
      await addItem(page, 'Tmp', 1);

      await page.click('button[data-action="delete"]');
      await page.waitForSelector('[data-role="confirm-ok"]');
      await page.click('[data-role="confirm-ok"]');

      await page.waitForFunction(() => document.querySelectorAll('tr[data-id]').length === 0);
      const rowsAfter = await page.$$('tr[data-id]');
      expect(rowsAfter.length).toBe(0);
    });
  }, 60000);
});
