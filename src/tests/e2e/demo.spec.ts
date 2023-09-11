/* eslint-disable @typescript-eslint/await-thenable */
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

  await expect(page.locator('#desktop-menu-project')).toBeVisible({
    visible: true,
  })

  await expect(page.locator('#desktop-menu-map')).toBeVisible({ visible: true })

  await expect(page.locator('#desktop-menu-reports')).toBeVisible({
    visible: true,
  })

  await expect(page.locator('#desktop-menu-colors')).toBeVisible({
    visible: true,
  })

  await expect(page.locator('#desktop-menu-data')).toBeVisible({
    visible: true,
  })
})
