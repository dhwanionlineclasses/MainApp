'use server'

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { McqExamSubmitServerResponse, McqExamSubmitType } from "@/types/exam/mcq-exam";

const sessionTokenName =
  process.env.NODE_ENV === 'production'
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5842'

export const submitEntranceMcqQuestionsData = async (values: McqExamSubmitType): Promise<McqExamSubmitServerResponse> => {

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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader, // Add cookies to the request
    },
    credentials: "include", // Ensure cookies are included in the request
    body: JSON.stringify(values)
  };
  try {

    const url = `${baseUrl}/exams/emcq/submit`
    console.log(url)
    
    const response = await fetch(url, options)
    // console.log(response.status)
    const responseData = await response.json()
    // console.log(responseData, response.status)

    if (response.status === 200) {
      return {
        success: true,
        message: responseData.message || 'MCQ exam submitted and graded successfully',
        data: responseData.data
      }
    } else {
      return { 
        success: false, 
        message: responseData.message || 'MCQ exam submission failed' 
      }
    }

  } catch (error) {
    console.error('Login Error:', error)
    // Use a type guard to check if error is an instance of Error
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { success: false, message: errorMessage }
  }
}