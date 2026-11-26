import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile-SE', width: 375, height: 667 },
  { name: 'Tablet-Portrait', width: 768, height: 1024 },
  { name: 'Laptop-HD', width: 1366, height: 768 },
  { name: 'Desktop-FHD', width: 1920, height: 1080 },
  { name: 'TV-4K', width: 3840, height: 2160 },
];

test.describe('Security & API Protection Tests', () => {
  test('Rejects invalid admin credentials in UI and API', async ({ page, request }) => {
    // 1. API-level auth check
    const badAuth = await request.post('http://localhost:3001/api/admin/login', {
      data: { username: 'admin', password: 'wrongpassword123' },
    });
    expect(badAuth.status()).toBe(401);

    // 2. UI-level auth check + no default credentials leaked
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.locator('button:has-text("Admin Login")').first().click();
    await expect(page.locator('text=Admin Portal Sign In')).toBeVisible();
    await expect(page.locator('text=Default credentials')).not.toBeVisible();

    await page.fill('input[placeholder="admin"]', '<script>alert(1)</script>');
    await page.fill('input[placeholder="••••••••••••"]', 'badpass');
    await page.click('button:has-text("Sign In to CRM")');
    await page.waitForTimeout(400);

    // Must remain on login modal, NOT enter CRM
    await expect(page.locator('aside')).not.toBeVisible();
  });

  test('WhatsApp API blocks dispatch when unlinked', async ({ request }) => {
    await request.post('http://localhost:3001/api/whatsapp/disconnect');
    const res = await request.post('http://localhost:3001/api/whatsapp/test', {
      data: { phone: '+91 98765 43210' },
    });
    expect(res.status()).toBe(500);
    const body = await res.json();
    expect(body.error).toContain('WhatsApp is not linked');
  });
});

test.describe('Deep Responsiveness, Alignment & CRM Flow', () => {
  for (const vp of viewports) {
    test(`Full E2E & Alignment - ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });

      // Zero horizontal overflow
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `Overflow at ${vp.width}x${vp.height}`).toBeFalsy();

      // Core sections within bounds
      for (const sec of ['#home', '#about', '#philosophy', '#programs', '#why-choose-us', '#achievements', '#gallery', '#contact']) {
        const el = page.locator(sec);
        await expect(el).toBeAttached();
        const box = await el.boundingBox();
        if (box) expect(box.width).toBeLessThanOrEqual(vp.width + 2);
      }

      // Sign in to CRM
      await page.locator('button:has-text("Admin Login")').first().click();
      await page.fill('input[placeholder="admin"]', 'admin');
      await page.fill('input[placeholder="••••••••••••"]', 'lfa@admin2026');
      await page.click('button:has-text("Sign In to CRM")');
      await expect(page.locator('aside')).toBeVisible({ timeout: 5000 });

      // CRM zero overflow
      const crmOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(crmOverflow, `CRM overflow at ${vp.width}x${vp.height}`).toBeFalsy();

      // Verify removed UI elements stay absent
      await expect(page.locator('h3:has-text("Course Distribution")')).not.toBeVisible();
      await expect(page.locator('header span:has-text("Neon PostgreSQL")')).not.toBeVisible();
      await expect(page.locator('header span:has-text("WhatsApp Offline")')).not.toBeVisible();

      await page.click('button:has-text("Students")');
      await expect(page.locator('text=Synced with Neon PostgreSQL')).not.toBeVisible();

      await page.click('button:has-text("Exit CRM")');
    });
  }
});
