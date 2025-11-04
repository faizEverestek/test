import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useResetPassword } from "@/hooks/useAuth";
import { ResetPasswordData, resetPasswordSchema } from "@/types/auth";

const ResetPassword = () => {
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forgotKey = searchParams.get("key");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setValue,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    setValue("forgotKey", forgotKey);
  }, [setValue, forgotKey]);

  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data: ResetPasswordData) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: (res) => {
        signIn(res.accessToken, res.refreshToken, res.expiresIn);

        toast({
          title: "Welcome back!",
          description: "Password reset successfully.",
        });
        navigate("/");
      },
      onError: (
        error: AxiosError<{
          message?: string;
          validationErrors?: {
            field: keyof ResetPasswordData;
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
            title: "Reset password failed",
            description:
              message !== "Unexpected error"
                ? message
                : "This reset link is invalid or has expired.",
            variant: "destructive",
          });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-md py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
        </header>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Your password"
                  {...register("newPassword")}
                  onChange={(e) => {
                    register("newPassword").onChange(e);
                    clearErrors("newPassword");
                  }}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default ResetPassword;
