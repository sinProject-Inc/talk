import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('about:blank');
  await page.goto('chrome-error://chromewebdata/');
  await page.goto('http://localhost:5173/');
  await page1.goto('http://localhost:5173/translate');
  await page1.getByRole('textbox').first().click();
  await page1.getByRole('textbox').first().click();
  await page1.getByRole('textbox').first().fill('hello');
  await page1.getByRole('heading', { name: 'History' }).click();
});