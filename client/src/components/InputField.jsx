import React from "react";

const InputField = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  required = true,
  validFeedback,
  invalidFeedback = "此欄位為必填",
  autoComplete,
  className,
}) => {
  return (
    <div className={`mb-2 ${className}`}>
      {label ? (
        <label className="form-label fw-bold" htmlFor={id}>
          {label}
        </label>
      ) : (
        ""
      )}
      <input
        className="form-control"
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
      />
      <div className="valid-feedback">{validFeedback}</div>
      <div className="invalid-feedback">{invalidFeedback}</div>
    </div>
  );
};

export default InputField;
