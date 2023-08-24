import { vi } from 'vitest'

const urlMock = {
  createObjectURL: vi.fn(),
}

vi.stubGlobal('URL', urlMock)
