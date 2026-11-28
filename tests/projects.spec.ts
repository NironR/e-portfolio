import { test, expect } from '@playwright/test';

test('the first project links to its case study', async ({ page }) => {
  await page.goto('/');
  const project = page.locator('#project-1');
  await project.scrollIntoViewIfNeeded();
  await expect(project.getByRole('heading', { name: 'Predicting every Formula 1 race' })).toBeVisible();

  await project.getByRole('link', { name: 'View project' }).click();
  await expect(page).toHaveURL(/\/projects\/gridlock$/);
  await expect(page).toHaveTitle(/Gridlock/);
  await expect(page.getByRole('heading', { level: 1, name: 'Gridlock' })).toBeVisible();
});
