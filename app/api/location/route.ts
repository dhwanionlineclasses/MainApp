export async function GET(req: Request) {
  try {
    // Retrieve forwarded IP from headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      null;

    console.log("Client IP:", ip);

    // Handle localhost (ipinfo cannot geolocate ::1 or 127.0.0.1)
    const ipOrAuto = (!ip || ip === "::1" || ip === "127.0.0.1")
      ? "json"
      : `${ip}/json`;

    const response = await fetch(
      `https://ipinfo.io/${ipOrAuto}?token=${process.env.IPINFO_API_TOKEN}`
    );

    if (!response.ok) {
      console.error("Location fetch failed:", response.status);
      return Response.json(
        { error: "Failed to fetch location" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return Response.json({
      ip: ip ?? data.ip,
      country: data.country,
      region: data.region,
    });
  } catch (e) {
    console.error("Error:", e);
    return Response.json(
      { country: "DEFAULT", region: "" },
      { status: 500 }
    );
  }
}
