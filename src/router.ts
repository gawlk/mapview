import { createRouter } from 'ruelle'

const pages = import.meta.glob('./pages/(**!(components)/)?*.(vue|jsx|tsx)')

const router = createRouter(pages)

export default router
