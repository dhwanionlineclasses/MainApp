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
import { forgotPasswordSchema } from "@/schema/auth-schema";
import { forgotPassword } from "@/action/auth/forgotPassword";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // ✅ track success

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setLoading(true);
    try {
      const res = await forgotPassword(values);

      if (!res.success) {
        toast(res.message);
      } else {
        toast("Great", {
          description: res.message,
        });
        setSuccess(true); // ✅ hide form & show message
      }
    } catch (err) {
      console.log("Error while login: ", err);
      toast("Something unexpected went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen h-full flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        {!success ? (
          <>
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email to reset your password
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-black font-semibold"
                  >
                    {loading ? "Loading..." : "Verify Email"}
                  </Button>
                </form>
              </Form>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register">
                <Button variant="link" className="px-0 text-black underline">
                  Sign up
                </Button>
              </Link>
            </div>
          </>
        ) : (
          // ✅ Success message container
          <div className="bg-hsl-240-10-3.9 p-8 rounded-lg border border-hsl-0-0-20 text-center">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Check Your Email
            </h2>
            <p className="text-muted-foreground text-sm">
              We have sent a password reset link to your email. Please check
              your inbox and follow the instructions to reset your password.
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

export default ForgotPassword;
