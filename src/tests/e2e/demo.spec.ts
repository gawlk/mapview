import { expect, test } from '@playwright/test'

test('demo launch', async ({ page, baseURL }) => {
  if (!baseURL) return
  await page.goto(baseURL)

  const demoButton = await page.getByRole('button', { name: 'Try demo' })

  await expect(demoButton).toBeVisible()

  await demoButton.click()

  await expect(page.locator('#loader')).toBeVisible()

  await page.waitForLoadState('networkidle')

  await expect(page.locator('#loader')).not.toBeVisible()

  await expect(page.locator('#Project')).toBeVisible({ visible: true })

  await expect(page.locator('#Map')).toBeVisible({ visible: true })

  await expect(page.locator('#Reports')).toBeVisible({ visible: true })

  await expect(page.locator('#Points')).toBeVisible({ visible: true })

  await expect(page.locator('#Data')).toBeVisible({ visible: true })
})
