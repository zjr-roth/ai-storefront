/**
 * Simple Toast Notification Utility
 *
 * This utility allows you to create toast notifications
 * consistently throughout the application.
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: () => void;
}

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right'
};

/**
 * Show a toast notification
 */
export function showToast(
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
): void {
  const mergedOptions = { ...defaultOptions, ...options };

  // Create toast element
  const toast = document.createElement('div');

  // Set position styles
  let positionStyles = '';
  switch (mergedOptions.position) {
    case 'top-left':
      positionStyles = 'top-4 left-4';
      break;
    case 'top-center':
      positionStyles = 'top-4 left-1/2 transform -translate-x-1/2';
      break;
    case 'bottom-right':
      positionStyles = 'bottom-4 right-4';
      break;
    case 'bottom-left':
      positionStyles = 'bottom-4 left-4';
      break;
    case 'bottom-center':
      positionStyles = 'bottom-4 left-1/2 transform -translate-x-1/2';
      break;
    case 'top-right':
    default:
      positionStyles = 'top-4 right-4';
  }

  // Set type-based styles
  let typeStyles = '';
  let icon = '';

  switch (type) {
    case 'success':
      typeStyles = 'bg-green-500 border-l-4 border-green-700';
      icon = `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>`;
      break;
    case 'error':
      typeStyles = 'bg-red-500 border-l-4 border-red-700';
      icon = `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>`;
      break;
    case 'warning':
      typeStyles = 'bg-amber-500 border-l-4 border-amber-700';
      icon = `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>`;
      break;
    case 'info':
    default:
      typeStyles = 'bg-blue-500 border-l-4 border-blue-700';
      icon = `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>`;
  }

  toast.className = `fixed ${positionStyles} flex items-center p-4 mb-4 min-w-[300px] max-w-sm ${typeStyles} text-white shadow-lg rounded-md z-50 transition-opacity duration-500`;

  toast.innerHTML = `
    <div class="flex-shrink-0 mr-3">
      ${icon}
    </div>
    <div class="text-sm font-medium">
      ${message}
    </div>
  `;

  // Add to DOM
  document.body.appendChild(toast);

  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
        if (mergedOptions.onClose) {
          mergedOptions.onClose();
        }
      }
    }, 500);
  }, mergedOptions.duration);
}

/**
 * Success toast shorthand
 */
export function showSuccessToast(message: string, options: ToastOptions = {}): void {
  showToast(message, 'success', options);
}

/**
 * Error toast shorthand
 */
export function showErrorToast(message: string, options: ToastOptions = {}): void {
  showToast(message, 'error', options);
}

/**
 * Warning toast shorthand
 */
export function showWarningToast(message: string, options: ToastOptions = {}): void {
  showToast(message, 'warning', options);
}

/**
 * Info toast shorthand
 */
export function showInfoToast(message: string, options: ToastOptions = {}): void {
  showToast(message, 'info', options);
}