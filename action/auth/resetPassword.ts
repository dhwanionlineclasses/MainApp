'use server'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5842'

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const resetPassword = async ({ token, newPassword }: ResetPasswordRequest) => {
  try {
    // Construct the request body
    const body = JSON.stringify({ token, newPassword });

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    };

    // Send the request to your backend
    const response = await fetch(`${baseUrl}/users/reset-password`, options);

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Password has been reset successfully',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to reset password',
      };
    }
  } catch (error) {
    console.error('Reset Password Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: errorMessage };
  }
}
