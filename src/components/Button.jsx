/**
 * @typedef {Object} Utils
 * @property {boolean} isSending - Indicates if the button is in sending state.
 * @property {string} isSendingText
 */

/**
 * @param {Utils & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

import "./button.css";
const Button = ({ isSending, children, isSendingText, ...props }) => {
  return (
    <button
      disabled={props.disabled || isSending}
      className={`btn ${isSending ? "sending" : ""}`}
      {...props}
    >
      <article className="loader" />
      {isSending ? `${isSendingText || "sending"} ...` : children}
    </button>
  );
};

export default Button;
