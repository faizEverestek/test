import { useEffect } from "react";
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
import google from "../assets/google.svg";
import microsoft from "../assets/microsoft.svg";
import { useAuth, useSignUp, useSocialConnect } from "@/hooks/useAuth";
import { AuthType, SignUpFormData, signUpSchema } from "@/types/auth";

const SignUp = () => {
  const { toast } = useToast();
  const { isSignedIn, signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const signUpMutation = useSignUp();
  const connectMutation = useSocialConnect();

  useEffect(() => {
    document.title = "Create Account - CodeGenAI";
    const desc =
      "Sign up for CodeGenAI to create projects, design workflows, and generate code.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    const existingCanonical = document.querySelector('link[rel="canonical"]');
    const canonicalHref = `${window.location.origin}/signup`;
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

  const onSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(
      { ...data, authProvider: AuthType.NATIVE },
      {
        onSuccess: (res) => {
          navigate(
            `/validate-otp?email=${data?.email}&activationKey=${res?.token}&type=register`
          );
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
              title: "Sign up failed",
              description: message || "Something went wrong",
              variant: "destructive",
            });
          }
        },
      }
    );
  };

  const onSocialSignup = (type: AuthType) => {
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
          title: "Sign up failed",
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
            Create your CodeGenAI account
          </h1>
          <p className="text-muted-foreground mt-2">
            Start building projects with prompts, workflows, and database
            designs.
          </p>
        </header>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Get started</CardTitle>
              <CardDescription>
                Use your email or continue with a provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jane Doe"
                  {...register("firstName")}
                  onChange={(e) => {
                    register("firstName").onChange(e);
                    clearErrors("firstName");
                  }}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Jane Doe"
                  {...register("lastName")}
                  onChange={(e) => {
                    register("lastName").onChange(e);
                    clearErrors("lastName");
                  }}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
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

              <Separator />

              <div className="grid gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex gap-3"
                  onClick={() => onSocialSignup(AuthType.GOOGLE)}
                >
                  <img src={google} alt="Google" className="w-4 h-4" /> Continue
                  with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex gap-3"
                  onClick={() => onSocialSignup(AuthType.MICROSOFT)}
                >
                  <img src={microsoft} alt="Microsoft" className="w-4 h-4" />
                  Continue with Microsoft
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default SignUp;
