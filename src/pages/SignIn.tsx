import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useSignIn, useSocialSigninConnect } from "@/hooks/useAuth";
import { AuthType, SignInFormData, signInSchema } from "@/types/auth";

import google from "../assets/google.svg";
import microsoft from "../assets/microsoft.svg";

const SignIn = () => {
  const { toast } = useToast();
  const { isSignedIn, signIn } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const signInMutation = useSignIn();
  const connectMutation = useSocialSigninConnect();

  useEffect(() => {
    document.title = "Sign In - CodeGenAI";
    const desc =
      "Sign in to CodeGenAI to access your projects, workflows, and database designs.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    const existingCanonical = document.querySelector('link[rel="canonical"]');
    const canonicalHref = `${window.location.origin}/signin`;
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

  const onSubmit = (data: SignInFormData) => {
    setMessage(false);
    signInMutation.mutate(data, {
      onSuccess: (res) => {
        signIn(res.accessToken, res.refreshToken, res.expiresIn);

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate("/");
      },
      onError: (
        error: AxiosError<{
          message?: string;
          validationErrors?: { field: keyof SignInFormData; message: string }[];
        }>
      ) => {
        const message = error.response?.data?.message;
        const isBlocked = error.response?.data?.validationErrors
          ?.find((d) => d?.field === "email")
          ?.message?.includes(
            "Your account has been temporarily locked due to multiple failed login attempts"
          );

        if (isBlocked) {
          setMessage(true);
          return;
        } else if (error.response?.data?.validationErrors?.length) {
          error.response?.data?.validationErrors?.map((err) =>
            setError(err.field, {
              type: "server",
              message: err.message,
            })
          );
          const isAuthProviderError =
            error.response?.data?.validationErrors?.find(
              (d: { field?: string; message?: string }) =>
                d?.field === "authProvider"
            );
          if (isAuthProviderError) {
            setError("password", {
              type: "server",
              message: isAuthProviderError?.message,
            });
            toast({
              title: "Sign in failed",
              description:
                isAuthProviderError?.message || "Invalid email or password.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Sign in failed",
            description: message || "Invalid email or password.",
            variant: "destructive",
          });
        }
      },
    });
  };

  const onSocialSignin = (type: AuthType) => {
    connectMutation.mutate(type, {
      onSuccess: (res) => {
        window.open(res?.authUrl, "_blank");
      },
      onError: (
        error: AxiosError<{
          message?: string;
        }>
      ) => {
        const message = error.response?.data?.message;

        toast({
          title: "Sign in failed",
          description: message || "Something went wrong",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-md py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in to CodeGenAI
          </h1>
          <p className="text-muted-foreground mt-2">
            Access your projects, workflows and teams.
          </p>
        </header>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Continue with your email or a provider
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {message && (
                <div className="text-red-500 text-center">
                  Oops! Your account has been temporarily locked due to multiple
                  failed login attempts. It will unlock at 08 Oct 2025, 14:56.
                  You can also{" "}
                  <Link
                    to="/account/unlock"
                    className="text-white hover:underline"
                  >
                    click here
                  </Link>{" "}
                  to unlock immediately if you need access sooner.
                </div>
              )}

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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  {...register("password")}
                  onChange={(e) => {
                    register("password").onChange(e);
                    clearErrors("password");
                  }}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/signup" className="text-primary hover:underline">
                  Create an account
                </Link>
                <Link
                  to="/forgot-password"
                  className="text-muted-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Separator />

              <div className="grid gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex gap-3"
                  onClick={() => onSocialSignin(AuthType.GOOGLE)}
                >
                  <img src={google} alt="Google" className="w-4 h-4" />
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex gap-3"
                  onClick={() => onSocialSignin(AuthType.MICROSOFT)}
                >
                  <img src={microsoft} alt="Microsoft" className="w-4 h-4" />
                  Continue with Microsoft
                </Button>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || message}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default SignIn;
