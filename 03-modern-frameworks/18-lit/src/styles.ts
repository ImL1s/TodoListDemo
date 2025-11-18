import { css } from 'lit';

/**
 * Shared styles for the todo application
 * These can be imported and used across components
 */

export const sharedStyles = css`
  * {
    box-sizing: border-box;
  }
`;

export const buttonStyles = css`
  button {
    cursor: pointer;
    border: none;
    background: none;
    padding: 8px 12px;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  button:hover {
    opacity: 0.8;
  }

  button:active {
    transform: scale(0.95);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const inputStyles = css`
  input[type='text'] {
    border: 1px solid #ddd;
    padding: 12px 16px;
    font-size: 16px;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  input[type='text']:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
  }
`;

export const checkboxStyles = css`
  input[type='checkbox'] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin: 0;
  }
`;

export const cardStyles = css`
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
`;

export const animationStyles = css`
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  .animate-in {
    animation: slideIn 0.3s ease;
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }
`;

/**
 * Typography styles
 */
export const typographyStyles = css`
  .heading-1 {
    font-size: 48px;
    font-weight: 200;
    color: #2c3e50;
    margin: 0;
  }

  .heading-2 {
    font-size: 24px;
    font-weight: 400;
    color: #34495e;
    margin: 0;
  }

  .text-muted {
    color: #7f8c8d;
  }

  .text-small {
    font-size: 14px;
  }
`;

/**
 * Utility styles
 */
export const utilityStyles = css`
  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-1 {
    gap: 8px;
  }

  .gap-2 {
    gap: 16px;
  }

  .w-full {
    width: 100%;
  }

  .p-1 {
    padding: 8px;
  }

  .p-2 {
    padding: 16px;
  }

  .m-0 {
    margin: 0;
  }

  .mb-1 {
    margin-bottom: 8px;
  }

  .mb-2 {
    margin-bottom: 16px;
  }
`;
