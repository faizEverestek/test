import { AxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgetPassword,
  googleAuthorize,
  googleConnect,
  googleSigninAuthorize,
  googleSigninConnect,
  microsoftAuthorize,
  microsoftConnect,
  microsoftSigninAuthorize,
  microsoftSigninConnect,
  resetPassword,
  signIn,
  signUp,
  socialSignUp,
  unlockUserAccount,
  validateOTP,
} from "@/api/authService";
import { setToken } from "@/lib/storage";
import {
  AuthResponse,
  AuthType,
  ForgotPasswordData,
  ResetPasswordData,
  SignInFormData,
  SignUpFormData,
  SocialSignUpData,
  ValidateOTPFormData,
} from "@/types/auth";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      const res = await signIn(data);
      setToken(res.accessToken, res.refreshToken, res.expiresIn);
      return res;
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const res = await signUp(data);
      return res;
    },
  });
};

export const useValidateOTP = () => {
  return useMutation({
    mutationFn: async (data: ValidateOTPFormData) => {
      const res = await validateOTP(data);
      setToken(res.accessToken, res.refreshToken, res.expiresIn);
      return res;
    },
  });
};

export const useSocialConnect = () => {
  return useMutation({
    mutationFn: async (type: AuthType) => {
      const res =
        type === AuthType.GOOGLE
          ? await googleConnect()
          : await microsoftConnect();

      return res;
    },
  });
};

export const useSocialAuthorize = ({
  code,
  type,
}: {
  code: string;
  type: AuthType;
}) => {
  return useQuery({
    queryKey: ["socialAuthorize", code, type],
    queryFn: () =>
      type === AuthType.GOOGLE
        ? googleAuthorize(code)
        : microsoftAuthorize(code),
    enabled:
      (!!code && type === AuthType.GOOGLE) ||
      (!!code && type === AuthType.MICROSOFT),
    retry: false,
  });
};

export const useSocialSignUp = () => {
  return useMutation({
    mutationFn: async (data: SocialSignUpData) => {
      const res = await socialSignUp(data);
      return res;
    },
  });
};

export const useSocialSigninConnect = () => {
  return useMutation({
    mutationFn: async (type: AuthType) => {
      const res =
        type === AuthType.GOOGLE
          ? await googleSigninConnect()
          : await microsoftSigninConnect();
      return res;
    },
  });
};

export const useSocialSigninAuthorize = ({
  code,
  type,
}: {
  code: string;
  type: AuthType;
}) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery<
    AuthResponse,
    AxiosError<{
      message?: string;
      validationErrors?: {
        field: keyof SignUpFormData;
        message: string;
      }[];
    }>
  >({
    queryKey: ["socialSigninAuthorize", code, type],
    queryFn: async () => {
      const res =
        type === AuthType.GOOGLE_SIGNIN
          ? await googleSigninAuthorize(code)
          : await microsoftSigninAuthorize(code);
      signIn(res.accessToken, res.refreshToken, res.expiresIn);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      navigate("/");
      return res;
    },
    enabled:
      (!!code && type === AuthType.GOOGLE_SIGNIN) ||
      (!!code && type === AuthType.MICROSOFT_SIGNIN),
    retry: false,
  });
};

export const useUnlockAccount = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const res = await unlockUserAccount(data);
      return res;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const res = await forgetPassword(data);
      return res;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const res = await resetPassword(data);
      return res;
    },
  });
};
