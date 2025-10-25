"use client";

import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { pricing } from "@/data/constants/pricing-checkout";
import { createStripeCheckoutSession } from "@/action/stripe-checkout";

type course = {
  id: number;
  name: string;
  lengthInYears: number;
};

type propsType = {
  course: course,
  userLastPurchase: any,
  user: any
}

interface OrderItem {
  itemType: "Month" | "Module" | "Year" | "Course";
  itemName: string; // like "Month 1", "Module 2"
}

interface Order {
  orderId: number;
  orderItems: OrderItem[];
  // other fields not needed here
}

export function getNextIndices(orders?: Order[]) {
  if (!orders || orders.length === 0) {
    return {
      nextMonth: 1,
      nextModule: 1,
      nextYear: 1,
      hasCourse: false,
    };
  }

  let maxMonth = 0;
  let maxModule = 0;
  let maxYear = 0;
  let hasCourse = false;

  orders.forEach((order) => {
    order.orderItems?.forEach((item) => {
      if (item.itemType === "Month") {
        const match = item.itemName.match(/Month (\d+)/);
        if (match) maxMonth = Math.max(maxMonth, parseInt(match[1], 10));
      }

      if (item.itemType === "Module") {
        const match = item.itemName.match(/Module (\d+)/);
        if (match) maxModule = Math.max(maxModule, parseInt(match[1], 10));
      }

      if (item.itemType === "Year") {
        const match = item.itemName.match(/Year (\d+)/);
        if (match) maxYear = Math.max(maxYear, parseInt(match[1], 10));
      }

      if (item.itemType === "Course") {
        hasCourse = true;
      }
    });
  });

  return {
    nextMonth: maxMonth > 0 ? maxMonth + 1 : 1,
    nextModule: maxModule > 0 ? maxModule + 1 : 1,
    nextYear: maxYear > 0 ? maxYear + 1 : 1,
    hasCourse,
  };
}



const BuyingOptionsNew = ({ course, userLastPurchase, user }: propsType) => {
  const [country, setCountry] = useState<string>("DEFAULT");
  const [nextIndices, setNextIndices] = useState({
    nextMonth: 1,
    nextModule: 1,
    nextYear: 1,
    hasCourse: false,
  });

  useEffect(() => {
    if (userLastPurchase?.data) {
      const nextIndices = getNextIndices(userLastPurchase.data)
      setNextIndices(getNextIndices(userLastPurchase.data));
    }
  }, [userLastPurchase]);

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

  const handleCheckout = async (
    courseName: string,
    plan: string,
    amount: number,
    type: string
  ) => {
    try {
      const res = await createStripeCheckoutSession(
        courseName,
        plan,
        type,
        amount
      );

      if (res.success) {
        window.location.href = res.url; // Redirect to Stripe Checkout
      } else {
        console.error("Error creating checkout session:", res.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const coursePricing = pricing.find((c) => c.courseName === course.name);

  if (!coursePricing) {
    <div>No pricing available for this course</div>;
  }

  // ✅ Filtered pricing based on user's purchasePlan
  const filteredPriceModules = (() => {
    if (!user?.purchasePlan) return coursePricing?.priceModule ?? [];

    const userPlanLower = user.purchasePlan.toLowerCase();

    const filtered = coursePricing?.priceModule.filter((p) =>
      userPlanLower.includes(p.type.toLowerCase())
    );

    return filtered && filtered.length > 0 ? filtered : coursePricing?.priceModule ?? [];
  })();


  return (
    <div className="w-full flex flex-col justify-start items-start gap-6">
      <Label>Choose Options</Label>
      <Card className="w-full bg-transparent shadow-none border-none mt-6">
        <CardContent className="px-0">
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 justify-items-center gap-x-4 gap-y-6">
            {filteredPriceModules.map((priceModel, index) => {
              return (
                <Card
                  key={index}
                  className="relative w-full pb-0 flex flex-col justify-between rounded-sm bg-primary text-white shadow-none border border-muted/20"
                >
                  {priceModel.billedType === 'Full Course' && (
                    <span
                      className="absolute left-2 -top-2 w-12 px-1 pt-2 pb-4 rounded-sm bg-yellow-500 text-xs text-center font-bold text-[#111111]"
                      style={{
                        clipPath:
                          "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)",
                      }}
                    >
                      Best Value
                    </span>
                  )}
                  {priceModel.billedType === 'Monthly' && (
                    <span
                      className="absolute left-2 -top-2 w-12 px-1 pt-2 pb-4 rounded-sm bg-yellow-500 text-xs text-center font-bold text-[#111111]"
                      style={{
                        clipPath:
                          "polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)",
                      }}
                    >
                      Most Popular
                    </span>
                  )}
                  <CardHeader className="flex justify-start items-center gap-4">
                    <Button
                      className="flex flex-col bg-primary w-32 rounded-sm cursor-default shadow-none text-xl text-wrap font-semibold uppercase"
                      disabled={
                        (priceModel.type === "Year" && nextIndices.nextYear > 1) ||
                        (priceModel.type === "Course" && nextIndices.hasCourse === true)
                      }
                    >
                      {priceModel.billedType}
                      {priceModel.billedType !== "Full Course" && (
                        <span className="text-xs">
                          (
                          {priceModel.type === "Month" && `Month ${nextIndices.nextMonth}`}
                          {priceModel.type === "Module" && `Module ${nextIndices.nextModule}`}
                          {priceModel.type === "Year" && `Year ${nextIndices.nextYear}`})
                        </span>
                      )}
                    </Button>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-col justify-center items-center gap-2">
                      {priceModel.originalPrice && priceModel.save && (
                        <span className="flex flex-col justify-center items-center text-white opacity-60">
                          <span className="line-through">
                            ${priceModel.originalPrice}
                          </span>
                          <span className="text-xs">
                            You save ${priceModel.save}
                          </span>
                        </span>
                      )}
                      <span className="drop-shadow-3xl">
                        <span className="text-4xl font-semibold">
                          {country === "IN"
                            ? priceModel.priceIn
                            : `${priceModel.priceDefault}`}
                        </span>
                        {priceModel.type !== "Course" && (
                          <span className="lowercase text-base">
                            /{priceModel.type}
                          </span>
                        )}
                      </span>
                      <span className="text-white opacity-60">
                        {priceModel.billedAs}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      disabled={
                        (priceModel.type === "Year" && nextIndices.nextYear > 1) ||
                        (priceModel.type === "Course" && nextIndices.hasCourse === true)
                      }
                      onClick={() => {
                        let planLabel = priceModel.plan;

                        if (priceModel.type === "Month") {
                          planLabel = `${priceModel.type} ${nextIndices.nextMonth}`;
                        } else if (priceModel.type === "Module") {
                          planLabel = `${priceModel.type} ${nextIndices.nextModule}`;
                        } else if (priceModel.type === "Year") {
                          planLabel = `${priceModel.type} ${nextIndices.nextYear}`;
                        }

                        handleCheckout(
                          course.name,
                          planLabel,
                          priceModel.amount,
                          priceModel.type
                        );
                      }}
                      className="w-full bg-white text-primary hover:bg-muted"
                    >
                      Join Now
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyingOptionsNew;