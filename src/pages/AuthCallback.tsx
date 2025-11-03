import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";
import {
  useAuth,
  useSocialAuthorize,
  useSocialSigninAuthorize,
  useSocialSignUp,
} from "@/hooks/useAuth";
import { AuthType, SignUpFormData, signUpSchema } from "@/types/auth";

interface AuthCallbackProps {
  type: AuthType;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const {
    data,
    error: signupError,
    isSuccess,
    isError,
    isLoading,
  } = useSocialAuthorize({
    code,
    type,
  });

  const { error: signinError, isError: isSigninError } =
    useSocialSigninAuthorize({ code, type });

  const signUpMutation = useSocialSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isError) {
      toast({
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      navigate("/signup", { replace: true });
      return;
    }

    if (isSigninError && signinError) {
      const validationError =
        signinError.response?.data?.validationErrors?.[0]?.message;
      const message =
        validationError ||
        signinError.response?.data?.message ||
        signinError.message ||
        "Something went wrong. Please try again later.";

      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });
      navigate("/signin", { replace: true });
      return;
    }

    if (isSuccess && data) {
      reset({ ...data, password: "google-authenticated" });
    }
  }, [
    isError,
    isSuccess,
    data,
    navigate,
    searchParams,
    isSigninError,
    signinError,
    toast,
    reset,
  ]);

  useEffect(() => {
    if (error === "access_denied") {
      const redirectPath =
        type === AuthType.GOOGLE || type === AuthType.MICROSOFT
          ? "/signup"
          : "/signin";
      navigate(redirectPath, { replace: true });
      toast({
        description: `We couldn’t complete the ${
          type === AuthType.GOOGLE || type === AuthType.MICROSOFT
            ? "signup"
            : "signin"
        } because access was denied. Please try again.`,
        variant: "destructive",
      });
    }
  }, [error, navigate, type, toast]);

  const onSignup = (values: SignUpFormData) => {
    if (!data) return;

    signUpMutation.mutate(
      {
        ...data,
        active: true,
        ...values,
        password:
          type === AuthType.GOOGLE
            ? "google-authenticated"
            : "microsoft-authenticated",
        authProvider: type,
      },
      {
        onSuccess: (res) => {
          signIn(res.accessToken, res.refreshToken, res.expiresIn);
          toast({
            title: "Welcome to CodeGenAI!",
            description: "Your account has been created successfully.",
          });
          navigate("/", { replace: true });
        },
        onError: (
          error: AxiosError<{
            message?: string;
            validationErrors?: {
              field: keyof SignUpFormData;
              message: string;
            }[];
          }>
        ) => {
          const validationErrors = error.response?.data?.validationErrors;
          const emailExists = error.response?.data?.validationErrors?.find(
            (d) => d?.field === "email"
          );
          if (validationErrors?.length && !emailExists) {
            validationErrors.forEach((err) =>
              setError(err.field, { type: "server", message: err.message })
            );
          } else {
            toast({
              title: "Sign up failed",
              description: emailExists
                ? emailExists?.message
                : error.response?.data?.message ||
                  "Something went wrong. Please try again later.",
              variant: "destructive",
            });
            navigate("/signup", { replace: true });
          }
        },
      }
    );
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-md py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Congratulations!
          </h1>
          <p className="text-muted-foreground mt-2">
            You’re just one step away from unlocking the full potential of us!
          </p>
        </header>

        <Card>
          <form onSubmit={handleSubmit(onSignup)}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  type="text"
                  placeholder="+919876543210"
                  {...register("mobile")}
                  onChange={(e) => {
                    register("mobile").onChange(e);
                    clearErrors("mobile");
                  }}
                />
                {errors.mobile && (
                  <p className="text-sm text-red-500">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AuthCallback;
