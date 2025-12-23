"use client";

import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  if (!pathname || pathname.startsWith("/auth")) {
    return;
  }

  return (
    // <div className='w-full bg-white py-4 px-8 flex justify-center'>
    <div className="w-full flex flex-col justify-between items-center bg-primary text-white gap-12 mt-10 px-4 pt-12 pb-4">
      <div className="max-w-[1517px] w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex flex-col justify-start items-start gap-2 pb-6">
          <Link href='/'>
            <Image
              src="/icons/logo.svg"
              alt="logo"
              width={0}
              height={0}
              className="w-12 mb-4 text-white rounded-md"
            />
          </Link>
          <span className="flex justify-start items-center gap-2">
            <Image
              src="/icons/message.svg"
              alt="logo"
              width={0}
              height={0}
              className="w-4"
            />
            <span>wahhtabla@gmail.com</span>
          </span>
          {/* <span className='flex justify-start items-center gap-2'>
            <Image
              src='/icons/phone.svg'
              alt='logo'
              width={0}
              height={0}
              className='w-4'
            />
            <span>+91 99999 99999</span>
            </span> */}
          {/* <span className='flex justify-start items-center gap-2'>
            <Image
              src='/icons/location.svg'
              alt='logo'
              width={0}
              height={0}
              className='w-4'
            />
            <span>Somewhere in the World</span>
            </span> */}
        </div>
        <div className="flex flex-col sm:flex-row justify-start items-start gap-6 sm:gap-2 md:gap-20">
          <div className="flex flex-col justify-start items-start gap-1 text-sm">
            <Link href="/" className="text-lg pb-1 font-semibold">
              Home
            </Link>
            <Link href="/#benefits" className="text-white">
              Benefits
            </Link>
            <Link href="/#module" className="text-white">
              Our Modules
            </Link>
            <Link href="/#testimonials" className="text-white">
              Our Testimonials
            </Link>
            <Link href="/#faq" className="text-white">
              Our FAQ
            </Link>
          </div>
          <div className="flex flex-col justify-start items-start gap-1 text-sm">
            <Link href="/" className="text-lg pb-1 font-semibold">
              About Us
            </Link>
            <Link href="https://tvdhwani.com" className="text-white">
              TV Dhwani
            </Link>
            <Link href="https://dhwaniacademy.in/" className="text-white">
              Dhwani India
            </Link>
            <Link href="https://dhwaniacademy.us/" className="text-white">
              Dhwani US
            </Link>
            <Link href="/legal/contact" className="text-white">
              Contact US
            </Link>
          </div>
          <div className="flex flex-col justify-start items-start gap-1 text-sm">
            <Link href="/" className="text-lg pb-1 font-semibold">
              Legal
            </Link>
            <Link href="/legal/privacy-policy" className="text-white">
              Privacy Policy
            </Link>
            <Link href="/legal/terms-and-conditions" className="text-white">
              Terms and Conditions
            </Link>
            <Link href="/legal/refund-policy" className="text-white">
              Refund Policy
            </Link>
            <Link href="/legal/cancellation-policy" className="text-white">
              Cancellation Policy
            </Link>
            <Link href="/legal/shipping-policy" className="text-white">
              Shipping Policy
            </Link>
          </div>
          <div className="flex flex-col justify-start items-start gap-1">
            <Link href="/" className="text-lg pb-1 font-semibold">
              Social Profiles
            </Link>
            <div className="flex justify-start items-center gap-1 text-sm">
              <Link href="https://www.instagram.com/wahtabla/">
                <InstagramLogoIcon width={25} height={25} className="" />
              </Link>
              <Link href="https://www.facebook.com/profile.php?id=61577718671061">
                <Image
                  src="/icons/facebook.svg"
                  alt="logo"
                  width={0}
                  height={0}
                  className="w-10 p-2.5 rounded-sm"
                />
              </Link>
              <Link href="https://x.com/WahTabla">
                <Image
                  src="/icons/twitter.svg"
                  alt="logo"
                  width={0}
                  height={0}
                  className="w-10 p-2.5 rounded-sm"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-2 text-white text-sm">
        <p className="w-full flex justify-center items-center text-white text-sm">
          © {new Date().getFullYear()} Abhijit Banerjee. All rights reserved.
        </p>
        <Link href='https://sidahq.com/'>
          <p>Designed and Developed by SIDA Technologies</p>
        </Link>
      </div>
    </div>
    // </div>
  );
};

export default Footer;
