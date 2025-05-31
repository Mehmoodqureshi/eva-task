import { NextResponse } from "next/server";

export async function POST(req) {
  const HUBSPOT_TOKEN = process.env.HUBSPOT_API_KEY;
  const { email } = await req.json();
  if (!HUBSPOT_TOKEN) {
    console.error("❌ HubSpot token not loaded from .env");
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  if (!HUBSPOT_TOKEN) {
    return NextResponse.json(
      { error: "Missing HubSpot API Key" },
      { status: 500 }
    );
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: email,
                },
              ],
            },
          ],
          properties: ["email", "firstname", "lastname", "phone"], // add what you want
          limit: 1,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({ contact: data });
    } else {
      return NextResponse.json(
        { error: data.message || "Contact not found" },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error("HubSpot API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
