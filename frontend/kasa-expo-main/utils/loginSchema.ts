import * as Yup from "yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

export const loginSchema: Yup.ObjectSchema<LoginFormValues> = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
