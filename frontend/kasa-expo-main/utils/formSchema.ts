import * as Yup from "yup";

export interface FormValues {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const formSchema: Yup.ObjectSchema<FormValues> = Yup.object({
  name: Yup.string().required("Text is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
});
