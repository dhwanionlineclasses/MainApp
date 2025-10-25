'use server'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5842'

export interface ForgotPasswordRequest {
  email: string;
}

export const forgotPassword = async ({ email }: ForgotPasswordRequest) => {
  try {
    // Construct the request body
    const body = JSON.stringify({ email });

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    };

    // Send the request to your backend
    const response = await fetch(`${baseUrl}/users/forgot-password`, options);

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Password reset link sent successfully',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to send password reset link',
      };
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: errorMessage };
  }
}
