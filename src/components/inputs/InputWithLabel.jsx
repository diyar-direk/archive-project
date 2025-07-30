import { forwardRef } from "react";

/**
 * @typedef {Object} Utils
 * @property {string} label - النص الذي سيُعرض كـ label
 * @property {string} id - المعرّف المستخدم لـ label و input/textarea
 * @property {"input"|"textarea"} writebelType - نوع الحقل الذي سيتم عرضه
 * @property {React.Ref<any>} ref - المرجع المستخدم للوصول إلى العنصر (اختياري)
 */

/**
 * @param {Utils & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>} props
 */

const InputWithLabel = ({ label, id, writebelType, ...props }, ref) => {
  return (
    <div className="flex flex-direction">
      {label && <label htmlFor={id}>{label}</label>}
      {writebelType === "textarea" ? (
        <textarea {...props} id={id} className={props.className || "inp"} />
      ) : (
        <input
          {...props}
          ref={ref || null}
          id={id}
          className={props.className || "inp"}
          type={props.type || "text"}
        />
      )}
    </div>
  );
};

export default forwardRef(InputWithLabel);
