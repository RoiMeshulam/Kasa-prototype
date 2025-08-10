// hooks/useFormValidation.ts
import { useState } from "react";
import * as Yup from "yup";

export const useFormValidation = <T extends Record<string, any>>(
  schema: Yup.ObjectSchema<T>,
  initialValues: T
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = async (): Promise<boolean> => {
    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      if (err.inner) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        err.inner.forEach((e: Yup.ValidationError) => {
          newErrors[e.path as keyof T] = e.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validate,
    setValues,
    resetForm,
  };
};
