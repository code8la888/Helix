import React from "react";

const InputField = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  required = true,
  validFeedback = "看起來不錯",
  invalidFeedback = "此欄位為必填",
}) => {
  return (
    <>
      {label ? (
        <label className="form-label" htmlFor={id}>
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
      />
      <div className="valid-feedback">{validFeedback}</div>
      <div className="invalid-feedback">{invalidFeedback}</div>
    </>
  );
};

export default InputField;
