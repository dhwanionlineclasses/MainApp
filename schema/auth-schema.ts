import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// Type inference for User login data validation
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type RestetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;


export const usernameValidation = z
    .string()
    .min(3, "Username must be atleast 3 characters")
    .max(25, "Username must be atmost 25 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain alphanumeric characters")

export const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email('Invalid email format'),
  password: passwordValidation,
});

// Type inference for User signup data validation
export type SignupSchemaType = z.infer<typeof signUpSchema>;

export type AuthLoginApiResponseType = {
  success: boolean,
  message: string,
  statusCode?: number,
  errors?: [],
  data?: {
    user: {
      id: string,
      username: string,
      email: string
    },
    accessToken: string,
    refreshToken: string
  }
}
export type AuthRegisterApiResponseType = {
  success: boolean,
  message: string,
  statusCode?: number,
  errors?: [],
  data?: {
    user: {
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string
    },
  }
}
