import { test, expect } from '@playwright/test';

test.describe('To-Do App E2E', () => {
    test.beforeEach(async ({ page, context }) => {
        page.on('console', msg => console.log('BROWSER:', msg.text()));

        // Set the test header and cookie to bypass Clerk auth
        await page.setExtraHTTPHeaders({
            'x-playwright-test': 'true',
        });
        await context.addCookies([{
            name: 'x-playwright-test',
            value: 'true',
            domain: 'localhost',
            path: '/',
        }]);
        await page.goto('/?e2e=true');
    });

    test('should add a new todo', async ({ page }) => {
        const todoText = `Test Task ${Date.now()}`;

        // Fill the input
        await page.fill('input[placeholder="What needs to be done?"]', todoText);

        // Click Add
        await page.click('button:has-text("Add")');

        // Check if it appears in the list
        await expect(page.locator(`text=${todoText}`)).toBeVisible();
    });

    test('should toggle a todo completed status', async ({ page }) => {
        const todoText = `Toggle Task ${Date.now()}`;

        // Add a todo
        await page.fill('input[placeholder="What needs to be done?"]', todoText);
        await page.click('button:has-text("Add")');

        // Find the todo item container that contains the specific text
        const todoItem = page.locator('div.bg-white', { hasText: todoText }).first();
        const checkbox = todoItem.locator('input[type="checkbox"]');

        // Toggle it
        await checkbox.click();

        // Wait for the update (implicitly handled by Playwright assertions)
        await expect(checkbox).toBeChecked();
    });

    test('should delete a todo', async ({ page }) => {
        const todoText = `Delete Task ${Date.now()}`;

        // Add a todo
        await page.fill('input[placeholder="What needs to be done?"]', todoText);
        await page.click('button:has-text("Add")');

        // Verify it exists
        await expect(page.locator(`text=${todoText}`)).toBeVisible();

        // Click the delete button for this specific todo
        const todoItem = page.locator('div.bg-white', { hasText: todoText }).first();
        const deleteButton = todoItem.locator('button[aria-label="Delete task"]');
        await deleteButton.click();

        // Verify it is gone
        await expect(page.locator(`text=${todoText}`)).not.toBeVisible();
    });
});
