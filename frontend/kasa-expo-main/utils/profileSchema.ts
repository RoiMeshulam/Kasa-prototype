import * as Yup from "yup";

export interface ProfileFormValues {
  name: string;
  phone: string;
  email: string;
}

export const profileSchema: Yup.ObjectSchema<ProfileFormValues> = Yup.object({
  name: Yup.string().required("Text is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});
