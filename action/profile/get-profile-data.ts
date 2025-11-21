'use server'

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { BackendProfileResponse, ProfileDataResponse } from "@/types/profile";

const sessionTokenName =
  process.env.NODE_ENV === 'production'
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5842'


export const getProfileData = async (): Promise<ProfileDataResponse> => {

  const cookieStore = cookies()
  const tokens = cookieStore.get(sessionTokenName)?.value ?? ''

  const session = await decode({
    token: tokens,
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET!,
    salt: sessionTokenName
  })

  if (!session) {
    return { success: false, message: 'Access token not found in cookies' };
  }

  if (!session?.data?.tokens?.access || !session?.data?.tokens?.refresh) {
    return { success: false, message: 'Access or refresh token not found in session' };
  }

  const accessToken = session.data.tokens.access;
  const refreshToken = session.data.tokens.refresh;

  // Construct the Cookie header
  const cookieHeader = `accessToken=${accessToken}; refreshToken=${refreshToken}; Path=/; HttpOnly; Secure`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader, // Add cookies to the request
    },
    credentials: "include", // Ensure cookies are included in the request
  };
  try {

    const response = await fetch(`${baseUrl}/profiles`, options)
    const data: BackendProfileResponse = await response.json()

    if (response.status === 200) {

      return {
        success: true,
        message: 'Successfully recieved user data',
        data: {
          userId: data.user.userId,
          username: data.user.username,
          email: data.user.email,
          fullName: data.user.profile ? data.user.profile.fullName : undefined,
          gender: data.user.profile ? data.user.profile.gender : undefined,
          courses: data.courses,
          orders: data.orders
        }
      }
    } else {
      return { success: false, message: (data as any).message || 'Profile Fetching failed' }
    }


  } catch (error) {
    console.error('Login Error:', error)
    // Use a type guard to check if error is an instance of Error
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { success: false, message: errorMessage }
  }
}