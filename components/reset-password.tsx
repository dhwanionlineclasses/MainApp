"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/schema/auth-schema"; // <-- schema for new password
import { resetPassword } from "@/action/auth/resetPassword";
import { toast } from "sonner";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";


const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) return; // token check early

    setLoading(true);
    try {
      const res = await resetPassword({ ...values, token });

      if (!res.success) {
        toast(res.message);
      } else {
        toast("Great", {
          description: res.message,
        });
        setSuccess(true); // ✅ hide form & show message
      }
    } catch (err) {
      console.log("Error while resetting password: ", err);
      toast("Something unexpected went wrong!");
    } finally {
      setLoading(false);
    }
  }

  // Show invalid token if token is missing
  if (!token) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 text-center">
          <h1 className="text-3xl font-bold text-red-600">Invalid Token</h1>
          <p className="text-muted-foreground text-sm">
            The password reset link is invalid or has expired.
          </p>
          <div className="mt-4">
            <Link href="/auth/forgot-password">
              <Button className="bg-black font-semibold px-6 py-2">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        {!success ? (
          <>
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="text-balance text-muted-foreground">
                Enter your new password to reset your account
              </p>
            </div>
            <div className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                              className="pr-10" // space for the icon
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              tabIndex={-1} // prevents stealing focus
                            >
                              {!showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-black font-semibold"
                  >
                    {loading ? "Loading..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </div>
          </>
        ) : (
          // ✅ Success message container
          <div className="bg-hsl-240-10-3.9 p-8 rounded-lg border border-hsl-0-0-20 text-center">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Password Reset Successful
            </h2>
            <p className="text-muted-foreground text-sm">
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
            <div className="mt-6">
              <Link href="/auth/login">
                <Button className="bg-black font-semibold px-6 py-2">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
