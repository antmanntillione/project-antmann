import React from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";

interface ConfirmFieldProps {
  fieldName: string;
  confirmationValue: string;
  should_equal: boolean;
  error_msg: string;
  label: string;
  placeholder: string;
}

/**
 * This component renders a field used to enter a name and validates it.
 * @param props name of the field for Formik use, the value that the input should match
 *  if should_equal is set to true, the label displayed above the input field on screen
 *  and the placehole for the input field which is shown when the input field is empty
 */
export function EnterName(props: ConfirmFieldProps) {
  const validate_field_value = (name: string) => {
    let error: string | undefined;
    if (
      (props.should_equal && name !== props.confirmationValue) ||
      (!props.should_equal && name === props.confirmationValue)
    ) {
      error = props.error_msg;
    }
    return error;
  };

  const [field, meta] = useField({
    name: props.fieldName,
    validate: validate_field_value,
  });

  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        {...field}
        data-testid="name"
        type="text"
        isValid={meta.touched && !meta.error}
        isInvalid={meta.touched && !!meta.error}
        placeholder={props.placeholder}
      />
      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
}
