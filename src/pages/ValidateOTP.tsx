import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useValidateOTP } from "@/hooks/useAuth";
import { ValidateOTPFormData, ValidateOTPSchema } from "@/types/auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ValidateOTP = () => {
  const { toast } = useToast();
  const { isSignedIn, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("activationKey");
  const email = searchParams.get("email");
  const type = searchParams.get("type");
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ValidateOTPFormData>({
    resolver: zodResolver(ValidateOTPSchema),
    defaultValues: {
      email,
      activationKey: token,
      otp: "",
    },
  });

  const validateOTPMutation = useValidateOTP();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const onSubmit = (data: ValidateOTPFormData) => {
    validateOTPMutation.mutate(
      {
        ...data,
        emailType:
          type === "register" ? "WELCOME_EMAIL" : "UNLOCK_SUCCESS_EMAIL",
      },
      {
        onSuccess: (res) => {
          signIn(res.accessToken, res.refreshToken, res.expiresIn);

          toast({
            title: "Welcome to CodeGenAI!",
            description: "Your account has been verified successfully.",
          });
          navigate("/");
        },
        onError: (
          error: AxiosError<{
            message?: string;
            validationErrors?: {
              field: keyof ValidateOTPFormData;
              message: string;
            }[];
          }>
        ) => {
          const message = error.response?.data?.message;
          if (error.response?.data?.validationErrors?.length) {
            error.response?.data?.validationErrors?.map((err) =>
              setError(err.field, {
                type: "server",
                message: err.message,
              })
            );
          } else {
            toast({
              title: "Verification failed",
              description: message || "Something went wrong",
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-md py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Verify your email address
          </h1>
          <p className="text-muted-foreground mt-2">
            We’ve sent a one-time password to {email}. Please enter it below to
            continue.
          </p>
        </header>

        <Card className="p-6 w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col items-center"
          >
            <Controller
              name="otp"
              control={control}
              rules={{
                required: "OTP is required",
                minLength: { value: 6, message: "Must be 6 digits" },
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-2 w-full pb-2">
                  <Label htmlFor="firstName">Enter OTP to Verify</Label>

                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    className="flex gap-2"
                  >
                    <InputOTPGroup className="flex gap-2">
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-10 h-12 border rounded text-center"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Validating..." : "Verify OTP"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default ValidateOTP;
