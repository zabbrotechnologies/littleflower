import { test, expect } from '@playwright/test';

const mobileViewports = [
  { name: 'Mobile-Small', width: 360, height: 640 },
  { name: 'Mobile-SE', width: 375, height: 667 },
  { name: 'Mobile-Modern', width: 390, height: 844 },
  { name: 'Tablet-Portrait', width: 768, height: 1024 },
];

for (const vp of mobileViewports) {
  test(`Mobile Drawer Alignment & E2E - ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });

    // 1. Hero header should hide Admin Login on mobile/tablet (<1024px) and show Open menu
    const heroAdminBtn = page.locator('#home header button:has-text("Admin Login")');
    await expect(heroAdminBtn).not.toBeVisible();

    const menuBtn = page.locator('#home header button[aria-label="Open menu"]');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await page.waitForTimeout(350);

    // 2. Verify Drawer is visible and properly aligned inside viewport bounds
    const drawerCloseBtn = page.locator('button[aria-label="Close menu"]');
    await expect(drawerCloseBtn).toBeVisible();

    const drawerAdminBtn = page.locator('button:has-text("Admin Login"):visible').first();
    await expect(drawerAdminBtn).toBeVisible();

    const box = await drawerAdminBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(vp.width);
    expect(box.y + box.height).toBeLessThanOrEqual(vp.height);

    // 3. Click Admin Login inside drawer -> opens modal -> sign in to CRM
    await drawerAdminBtn.click();
    await expect(page.locator('text=Admin Portal Sign In')).toBeVisible();

    await page.fill('input[placeholder="admin"]', 'admin');
    await page.fill('input[placeholder="••••••••••••"]', 'lfa@admin2026');
    await page.click('button:has-text("Sign In to CRM")');
    await expect(page.locator('aside')).toBeVisible({ timeout: 5000 });

    // 4. Zero horizontal overflow in CRM
    const crmOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(crmOverflow).toBeFalsy();

    await page.click('button:has-text("Exit CRM")');
  });
}
