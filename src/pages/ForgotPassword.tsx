import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForgotPassword } from "@/hooks/useAuth";
import { ForgotPasswordData, forgotPasswordSchema } from "@/types/auth";
import ResetPassword from "./ResetPassword";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const forgotKey = searchParams.get("key");
  const [message, setMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const forgotPwdMutation = useForgotPassword();

  useEffect(() => {
    document.title = forgotKey
      ? "Reset password - CodeGenAI"
      : "Forgot password - CodeGenAI";
    const desc = "";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    const existingCanonical = document.querySelector('link[rel="canonical"]');
    const canonicalHref = `${window.location.origin}/forgot-password`;
    if (existingCanonical) {
      existingCanonical.setAttribute("href", canonicalHref);
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", canonicalHref);
      document.head.appendChild(link);
    }
  }, []);

  const onSubmit = (data: ForgotPasswordData) => {
    forgotPwdMutation.mutate(data, {
      onSuccess: (res) => {
        setMessage(
          "Reset Password Mail has been sent to your email ID. Kindly check your inbox."
        );
      },
      onError: (
        error: AxiosError<{
          message?: string;
          validationErrors?: {
            field: keyof ForgotPasswordData;
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
            title: "Forgot password failed",
            description:
              message !== "Unexpected error" ? message : "Something went wrong",
            variant: "destructive",
          });
        }
      },
    });
  };

  return (
    <>
      {forgotKey ? (
        <ResetPassword />
      ) : (
        <div className="min-h-screen bg-background">
          <main className="container mx-auto max-w-md py-12">
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Forgot Password
              </h1>
            </header>

            <Card>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 pt-4">
                  {message && <div className="text-center pt-3">{message}</div>}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      onChange={(e) => {
                        register("email").onChange(e);
                        clearErrors("email");
                      }}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "submitting..." : "Submit"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </main>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
