import z from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Mobile number must be in E.164 format: +<CountryCode><SubscriberNumber>"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be less than 64 characters"),
  authProvider: z.string().default("NATIVE"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface SignupResponse {
  description: string;
  message: string;
  status: string;
  token: string;
}

export const ValidateOTPSchema = z.object({
  email: z.string(),
  otp: z.string(),
  activationKey: z.string(),
  emailType: z.string().optional(),
});

export type ValidateOTPFormData = z.infer<typeof ValidateOTPSchema>;

export enum AuthType {
  NATIVE = "NATIVE",
  GOOGLE = "GOOGLE",
  MICROSOFT = "MICROSOFT",
  GOOGLE_SIGNIN = "GOOGLE_SIGNIN",
  MICROSOFT_SIGNIN = "MICROSOFT_SIGNIN",
}

export interface ConnectResponse {
  authUrl: string;
}

export const socialSignupSchema = signUpSchema.extend({
  oauth2Token: z.string(),
  active: z.boolean().default(true),
});

export type SocialSignUpData = z.infer<typeof socialSignupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  forgotKey: z.string(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be less than 64 characters"),
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
