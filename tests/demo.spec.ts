import { expect, test } from '@playwright/test'

test('demo launch', async ({ page, baseURL }) => {
  if (!baseURL) return
  await page.goto(baseURL)

  const demoButton = await page.getByRole('button', { name: 'Try demo' })

  await expect(demoButton).toBeVisible()

  await demoButton.click()

  await expect(page.getByTestId('loader')).toBeVisible()

  await page.waitForLoadState('networkidle')

  await expect(page.getByTestId('loader')).not.toBeVisible()
  await expect(page.getByTestId('Project')).toBeVisible({ visible: true })
  await expect(page.getByTestId('Map')).toBeVisible({ visible: true })
  await expect(page.getByTestId('Reports')).toBeVisible({ visible: true })
  await expect(page.getByTestId('Points')).toBeVisible({ visible: true })
  await expect(page.getByTestId('Data')).toBeVisible({ visible: true })
})
