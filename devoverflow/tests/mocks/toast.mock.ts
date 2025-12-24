export const mockToast = jest.fn();

export const mockUseToast = jest.fn(() => ({
  toast: mockToast,
  toasts: [],
  dismiss: jest.fn(),
}));
