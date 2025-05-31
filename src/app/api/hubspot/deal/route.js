import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const {
    contactName,
    dealname = `Deal with ${contactName}`,
    amount = "1000",
  } = body;

  const dealStageId = "1560154852";
  const pipelineId = "default";

  try {
    const dealPayload = {
      properties: {
        dealname,
        dealstage: dealStageId,
        pipeline: pipelineId,
        amount,
      },
    };

    const hubspotRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/deals",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealPayload),
      }
    );

    const result = await hubspotRes.json();

    if (hubspotRes.ok) {
      return NextResponse.json({ success: true, dealId: result.id });
    }

    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    );
  } catch (error) {
    console.error("Create deal error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
