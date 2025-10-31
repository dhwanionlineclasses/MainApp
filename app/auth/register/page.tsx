'use client'

import { Eye, EyeOff } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { signUpSchema } from "@/schema/auth-schema";
import { register } from "@/action/auth/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {

    setLoading(true)

    try {
      const res = await register(values)

      if (res.success) {
        toast('Successfully registerd!', {
          description: 'Please login with your new credentials',
        })

        router.push('/auth/login')
      } else {
        console.log(res.message)
        toast(res.message, {
          description: 'Failed to register'
        })
      }
    } catch (err) {
      console.log('Error while signup: ', err)
      toast('Something unexpected went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-full flex items-center justify-center">
      <div className="mx-auto grid w-[350px] gap-2">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to create an account
          </p>
        </div>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
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
              <Button type="submit" className="w-full bg-black font-semibold">
                {loading ? 'Loading...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
          <div className="text-sm text-muted-foreground text-center">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-black">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-black">
              Privacy Policy.
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login">
            <Button variant="link" className="px-0 text-black underline">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
