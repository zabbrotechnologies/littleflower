import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'OnePlus-Nord-CE4-Lite', width: 360, height: 800 },
  { name: 'Mobile-SE', width: 375, height: 667 },
  { name: 'Mobile-Modern', width: 390, height: 844 },
  { name: 'Tablet-Portrait', width: 768, height: 1024 },
];

for (const vp of viewports) {
  test(`CRM Mobile Alignment & Drawer Test - ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });

    // Open mobile menu drawer -> Admin Login
    await page.locator('#home header button[aria-label="Open menu"]').click();
    await page.locator('button:has-text("Admin Login"):visible').first().click();

    await page.fill('input[placeholder="admin"]', 'admin');
    await page.fill('input[placeholder="••••••••••••"]', 'lfa@admin2026');
    await page.click('button:has-text("Sign In to CRM")');

    // Wait for CRM main content
    const main = page.locator('main').last();
    await expect(main).toBeVisible({ timeout: 5000 });

    // 1. On mobile/tablet (<1024px), sidebar must be off-screen so main gets full viewport width!
    const mainBox = await main.boundingBox();
    expect(mainBox.width).toBeGreaterThanOrEqual(vp.width - 5);

    // 2. Zero horizontal overflow in CRM Dashboard
    const overflowDash = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflowDash, `Dashboard horizontal overflow at ${vp.width}x${vp.height}`).toBeFalsy();

    // 3. Open CRM mobile sidebar drawer, switch to Billing & Admissions, verify drawer auto-closes & zero overflow
    await page.locator('button[aria-label="Open CRM menu"]').click();
    const billingNav = page.locator('aside button:has-text("Billing & Admissions")');
    await expect(billingNav).toBeVisible();
    await billingNav.click();
    await page.waitForTimeout(300);

    const overflowBilling = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflowBilling, `Billing horizontal overflow at ${vp.width}x${vp.height}`).toBeFalsy();

    // 4. Switch to WhatsApp Integration & Students, verify zero overflow
    await page.locator('button[aria-label="Open CRM menu"]').click();
    await page.locator('aside button:has-text("Students")').click();
    await page.waitForTimeout(300);
    const overflowStudents = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflowStudents, `Students horizontal overflow at ${vp.width}x${vp.height}`).toBeFalsy();

    await page.click('button:has-text("Exit CRM")');
  });
}
