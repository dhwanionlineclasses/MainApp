"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function DoubtClearingEmbedd() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "doubt" });
      cal("ui", {
        styles: { branding: { brandColor: "#FFFFFF" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);
  return (
    <div className="w-full flex justify-center items-center mt-2 overflow-scrolls">
      <Cal
        namespace="doubt"
        calLink="wahtabla/doubt"
        config={{ layout: "month_view", theme: "light" }}
        className="w-full h-full"
      />
    </div>
  );
}

