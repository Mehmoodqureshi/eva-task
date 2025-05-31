import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, phone } = await req.json();
  const HUBSPOT_TOKEN = process.env.HUBSPOT_API_KEY;
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

  if (!email || !phone) {
    return NextResponse.json(
      { error: "Email and phone are required" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ Find contact by email
    const searchRes = await fetch(
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
                { propertyName: "email", operator: "EQ", value: email },
              ],
            },
          ],
          properties: ["firstname", "lastname", "phone"],
          limit: 1,
        }),
      }
    );

    const searchData = await searchRes.json();
    const contact = searchData.results?.[0];

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // 2️⃣ Update phone number using contactId
    const contactId = contact.id;
    const updateRes = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        },
        body: JSON.stringify({
          properties: {
            phone,
          },
        }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.json();
      return NextResponse.json(
        { error: err.message || "Failed to update contact" },
        { status: updateRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `📱 Phone updated for ${email}`,
    });
  } catch (error) {
    console.error("HubSpot API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
