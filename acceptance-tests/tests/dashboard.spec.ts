import { expect, test } from "@playwright/test";

const Configuration = {
  websiteUrl: "http://localhost:3000",
  knownInvestor: {
    id: "6c327bab-5a41-4803-8a4d-3415e56935e5",
    name: "Cza Weasley fund",
  },
};

test("The investors dashboard loads", async ({ page }) => {
  // go to the homepage
  await page.goto(new URL("/", Configuration.websiteUrl).href);

  // Expect to land on the Dashboard
  await expect(page.locator("text='Investors Dashboard'")).toBeVisible();
  await expect(page.locator(`text='${Configuration.knownInvestor.id}'`)).toBeVisible();
  await expect(page.locator(`text='${Configuration.knownInvestor.name}'`)).toBeVisible();
});

test("Commitments can be navigated to", async ({ page }) => {
  // go to the homepage
  await page.goto(new URL("/", Configuration.websiteUrl).href);
  await expect(page.locator("text='Investors Dashboard'")).toBeVisible();

  // go to the investment summaries
  const firstA = page.locator("tr:first-child td a");
  await firstA.click();
  await expect(page.locator("text='Investor Commitments'")).toBeVisible();

  // ensure the summaries exist
  await expect(page.locator("div").filter({ hasText: /^Natural Resources$/ })).toBeVisible();
  await expect(page.locator("div").filter({ hasText: /^Hedge Funds$/ })).toBeVisible();
  await expect(page.locator("div").filter({ hasText: /^Infrastructure$/ })).toBeVisible();
  await expect(page.locator("div").filter({ hasText: /^Private Equity$/ })).toBeVisible();
  await expect(page.locator("div").filter({ hasText: /^Private Debt$/ })).toBeVisible();
});
