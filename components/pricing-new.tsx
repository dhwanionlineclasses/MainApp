"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pricingModel } from "@/data/constants/pricing";

const PricingNew = () => {
  const [country, setCountry] = useState<string>("DEFAULT");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("/api/location");
        const data = await response.json();
        setCountry(data.country);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };
    fetchLocation();
  }, []);

  return (
    <Card
      id="pricing"
      className="w-full bg-transparent shadow-none border-none mt-6"
    >
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Pricing Model</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-x-4 gap-y-6">
          {pricingModel.map((priceModel, index) => {
            return (
              <Card
                key={index}
                className="w-full pb-0 flex flex-col justify-between rounded-sm bg-primary text-white shadow-none border border-muted/20"
              >
                <div>
                  <CardHeader className="min-h-36 flex justify-start items-center gap-4">
                    <Button className="bg-background w-full rounded-sm text-xs text-tertiary-foreground hover:bg-background cursor-default shadow-none ">
                      {priceModel.plan}
                    </Button>
                    {priceModel.plan === "Full Course" ? (
                      <span className="drop-shadow-3xl">
                        <span className="text-5xl font-semibold flex flex-col justify-start items-center">
                          <span className="text-sm">{priceModel.unit}</span>
                          {country === "IN"
                            ? `₹ ${priceModel.originalPriceIn}`
                            : `$ ${priceModel.originalPrice}`}
                        </span>
                      </span>
                    ) : (
                      <span className="drop-shadow-3xl">
                        <span className="text-5xl font-semibold">
                          {country === "IN"
                            ? `₹ ${priceModel.originalPriceIn}`
                            : `$ ${priceModel.originalPrice}`}
                          <span className="text-sm">{priceModel.unit}</span>
                        </span>
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="pt-2 bg-primary text-white flex flex-col justify-center items-center gap-4">
                    <p>Available Features</p>
                    <div className="w-full flex flex-col justify-center items-center gap-2">
                      {priceModel.features.map((feature, idx) => {
                        return (
                          <span
                            key={idx}
                            className="w-full flex justify-start items-center gap-4 border border-muted/20 px-4 py-2 pointer-events-none cursor-default bg-transparent hover:bg-transparent shadow-none rounded-sm text-white text-sm"
                          >
                            <Image
                              src="/icons/tick.svg"
                              alt="tick"
                              width={0}
                              height={0}
                              className="w-6 p-1 bg-tertiary rounded-sm"
                            />
                            <span>{feature}</span>
                          </span>
                        );
                      })}
                    </div>
                  </CardContent>
                </div>
                <CardFooter>
                  <Link href="/buy-course" className="w-full">
                    <Button className="w-full bg-white text-primary hover:bg-muted">
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingNew;
