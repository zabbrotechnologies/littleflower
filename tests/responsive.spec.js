import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile-Small', width: 360, height: 640 },
  { name: 'Mobile-SE', width: 375, height: 667 },
  { name: 'Mobile-Modern', width: 390, height: 844 },
  { name: 'Mobile-Large', width: 412, height: 915 },
  { name: 'Tablet-Portrait', width: 768, height: 1024 },
  { name: 'Tablet-Landscape', width: 1024, height: 768 },
  { name: 'Laptop-Compact', width: 1280, height: 800 },
  { name: 'Laptop-HD', width: 1366, height: 768 },
  { name: 'Desktop-Wide', width: 1440, height: 900 },
  { name: 'Desktop-FHD', width: 1920, height: 1080 },
  { name: 'Desktop-2K', width: 2560, height: 1440 },
  { name: 'TV-4K', width: 3840, height: 2160 },
];

for (const vp of viewports) {
  test(`Seamless Adaptation & Alignment Test - ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });

    // 1. Verify Page Title
    await expect(page).toHaveTitle(/Little Flowers Academy/);

    // 2. Strict Horizontal Overflow Check (Zero horizontal scrolling allowed on any device)
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow, `Horizontal overflow detected at ${vp.width}x${vp.height}`).toBeFalsy();

    // 3. Verify Alignment and Attachment of Every Core Section
    const coreSections = [
      '#home',
      '#about',
      '#philosophy',
      '#programs',
      '#why-choose-us',
      '#achievements',
      '#gallery',
      '#contact',
    ];

    for (const sec of coreSections) {
      const el = page.locator(sec);
      await expect(el).toBeAttached();
      const box = await el.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(vp.width + 2);
      }
    }

    // 4. Test Interactive Coverflow Pathway Deck
    const programsSection = page.locator('#programs');
    await programsSection.scrollIntoViewIfNeeded();

    const nextBtn = programsSection.locator('button[aria-label="Next pathway"]');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForTimeout(300);

    const dots = programsSection.locator('button[aria-label^="Go to slide"]');
    await expect(dots).toHaveCount(5);

    // 5. Verify Navigation Bar Adaptation
    const isMobileOrTablet = vp.width < 1024;
    if (isMobileOrTablet) {
      // Mobile hamburger should be present in DOM
      const hamburger = page.locator('button[aria-label="Open menu"]').first();
      await expect(hamburger).toBeAttached();
    }

    // 6. Test Admin Login Modal & Verify Credentials Note is Removed
    const adminLoginBtn = page.locator('button:has-text("Admin Login")').first();
    await adminLoginBtn.click();
    await page.waitForTimeout(400);

    // Verify modal is open
    const modal = page.locator('text=Admin Portal Sign In');
    await expect(modal).toBeVisible();

    // Verification: The default credentials note MUST be removed
    const credentialsNote = page.locator('text=Default credentials');
    await expect(credentialsNote).not.toBeVisible();

    // 7. Test Admin Authentication into Full-Screen CRM
    await page.fill('input[placeholder="admin"]', 'admin');
    await page.fill('input[placeholder="••••••••••••"]', 'lfa@admin2026');
    await page.click('button:has-text("Sign In to CRM")');
    await page.waitForTimeout(600);

    // 8. Verify CRM is Full-Screen with Zero Horizontal Overflow
    const crmRoot = page.locator('aside');
    await expect(crmRoot).toBeVisible();

    const crmOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(crmOverflow, `CRM horizontal overflow detected at ${vp.width}x${vp.height}`).toBeFalsy();

    // 9. Verify Identified Items are completely REMOVED from the CRM:
    // A) Course Distribution widget MUST NOT exist in Dashboard
    const courseDistributionWidget = page.locator('h3:has-text("Course Distribution")');
    await expect(courseDistributionWidget).not.toBeVisible();

    // B) Top Header badges (Neon PostgreSQL & WhatsApp Offline) MUST NOT exist
    const neonBadge = page.locator('header span:has-text("Neon PostgreSQL")');
    await expect(neonBadge).not.toBeVisible();

    const waBadge = page.locator('header span:has-text("WhatsApp Offline")');
    await expect(waBadge).not.toBeVisible();

    // C) Students Table footer: "Synced with Neon PostgreSQL" MUST NOT exist
    await page.click('button:has-text("Students")');
    await page.waitForTimeout(400);
    const syncedText = page.locator('text=Synced with Neon PostgreSQL');
    await expect(syncedText).not.toBeVisible();

    // 10. Exit CRM and return to public website
    await page.click('button:has-text("Exit CRM")');
    await page.waitForTimeout(400);
  });
}
