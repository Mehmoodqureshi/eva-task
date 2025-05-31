import { NextResponse } from "next/server";

export async function POST(req) {
  const { oldEmail, newEmail } = await req.json();
  if (!HUBSPOT_TOKEN) {
    console.error("❌ HubSpot token not loaded from .env");
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }
  const HUBSPOT_TOKEN = process.env.HUBSPOT_API_KEY;

  if (!oldEmail || !newEmail) {
    return NextResponse.json(
      { error: "Missing old or new email" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Find the contact ID by old email
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
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: oldEmail,
                },
              ],
            },
          ],
          properties: ["email"],
          limit: 1,
        }),
      }
    );

    const searchData = await searchRes.json();
    const contactId = searchData.results?.[0]?.id;

    if (!contactId) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Step 2: Update the email using PATCH
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
            email: newEmail,
          },
        }),
      }
    );

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      return NextResponse.json(
        { error: errorData.message },
        { status: updateRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email updated successfully",
    });
  } catch (err) {
    console.error("HubSpot API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
