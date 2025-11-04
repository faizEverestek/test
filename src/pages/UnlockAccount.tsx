import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUnlockAccount } from "@/hooks/useAuth";
import { ForgotPasswordData, forgotPasswordSchema } from "@/types/auth";

const UnlockAccount = () => {
  const { toast } = useToast();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const unlockMutation = useUnlockAccount();

  useEffect(() => {
    document.title = "Unlock user account - CodeGenAI";
    const desc =
      "Unlock user account to access your projects, workflows, and database designs.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    const existingCanonical = document.querySelector('link[rel="canonical"]');
    const canonicalHref = `${window.location.origin}/account/unlock`;
    if (existingCanonical) {
      existingCanonical.setAttribute("href", canonicalHref);
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", canonicalHref);
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const onSubmit = (data: ForgotPasswordData) => {
    unlockMutation.mutate(data, {
      onSuccess: (res) => {
        navigate(
          `/validate-otp?email=${data?.email}&activationKey=${res?.token}&type=unlock`
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
            title: "Unlock account failed",
            description:
              message !== "Unexpected error" ? message : "Something went wrong",
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
          <h1 className="text-3xl font-bold tracking-tight">
            Unlock your account
          </h1>
        </header>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-4">
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
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Unlocking..." : "Unlock"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default UnlockAccount;
