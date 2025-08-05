// src/setupTests.js
import '@testing-library/jest-dom'

// Mock fetch globalement pour tous les tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
)

// Nettoyer les mocks après chaque test
afterEach(() => {
  fetch.mockClear()
})

// Supprimer les warnings act() dans les tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act')
    ) {
      return
    }
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ReactDOMTestUtils.act is deprecated')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})