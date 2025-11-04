import axiosInstance from "@/lib/axiosInstance";
import { authApi } from "@/lib/constant";
import {
  AuthResponse,
  AuthType,
  ConnectResponse,
  ForgotPasswordData,
  ResetPasswordData,
  SignInFormData,
  SignUpFormData,
  SignupResponse,
  SocialSignUpData,
  ValidateOTPFormData,
} from "@/types/auth";

export const signIn = async (data: SignInFormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post(authApi.signin, data);
  return response.data;
};

export const signUp = async (data: SignUpFormData): Promise<SignupResponse> => {
  const response = await axiosInstance.post(authApi.signup, data);
  return response.data;
};

export const validateOTP = async (
  data: ValidateOTPFormData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(authApi.validateOTP, data);
  return response.data;
};

export const googleConnect = async (): Promise<ConnectResponse> => {
  const response = await axiosInstance.post(authApi.googleConnect, {
    origin: window.location.origin,
  });
  return response.data;
};

export const googleAuthorize = async (
  code: string
): Promise<SignUpFormData> => {
  const response = await axiosInstance.get(
    `${authApi.googleAuthorize}?code=${code}`
  );
  return response.data;
};

export const socialSignUp = async (
  data: SocialSignUpData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(
    data?.authProvider === AuthType.GOOGLE
      ? authApi.googleSignup
      : authApi.microsoftSignup,
    data
  );
  return response.data;
};

export const googleSigninConnect = async (): Promise<ConnectResponse> => {
  const response = await axiosInstance.post(authApi.googleSigninConnect, {
    origin: window.location.origin,
  });
  return response.data;
};

export const googleSigninAuthorize = async (
  code: string
): Promise<AuthResponse> => {
  const response = await axiosInstance.get(
    `${authApi.googleSigninAuthorize}?code=${code}`
  );
  return response.data;
};

export const microsoftConnect = async (): Promise<ConnectResponse> => {
  const response = await axiosInstance.post(authApi.microsoftConnect, {
    origin: window.location.origin,
  });
  return response.data;
};

export const microsoftAuthorize = async (
  code: string
): Promise<SignUpFormData> => {
  const response = await axiosInstance.get(
    `${authApi.microsoftAuthorize}?code=${code}`
  );
  return response.data;
};

export const microsoftSigninConnect = async (): Promise<ConnectResponse> => {
  const response = await axiosInstance.post(authApi.microsoftSigninConnect, {
    origin: window.location.origin,
  });
  return response.data;
};

export const microsoftSigninAuthorize = async (
  code: string
): Promise<AuthResponse> => {
  const response = await axiosInstance.get(
    `${authApi.microsoftSigninAuthorize}?code=${code}`
  );
  return response.data;
};

export const unlockUserAccount = async (
  payload: ForgotPasswordData
): Promise<SignupResponse> => {
  const response = await axiosInstance.post(authApi.unlockAccount, {
    origin: window.location.origin,
    ...payload,
  });
  return response.data;
};

export const forgetPassword = async (
  payload: ForgotPasswordData
): Promise<SignupResponse> => {
  const response = await axiosInstance.post(authApi.forgotPassword, {
    origin: window.location.origin,
    ...payload,
  });
  return response.data;
};

export const resetPassword = async (
  payload: ResetPasswordData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(authApi.resetPassword, {
    origin: window.location.origin,
    ...payload,
  });
  return response.data;
};
