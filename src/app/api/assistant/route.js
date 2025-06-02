import { NextResponse } from "next/server";
import OpenAI from "openai";

let chatHistoryCache = [];

export async function POST(request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
    const { message } = await request.json();

    const chatHistory = [];

    chatHistoryCache.forEach(({ userMessage, assistantReply }) => {
      chatHistory.push({ role: "user", content: userMessage });
      chatHistory.push({ role: "assistant", content: assistantReply });
    });

    chatHistory.push({ role: "user", content: message });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You are a web-based personal assistant interface., allowing users to interact with an AI connected to HubSpot. ask questions and provide context if you need for any task, like feilds etc, dont stress too much, try with the minimum details that user provides, no need to confirm again and again",
            },
          ],
        },
        ...chatHistory,
      ],
      text: {
        format: {
          type: "text",
        },
      },
      reasoning: {},
      tools: [
        {
          type: "mcp",
          server_label: "hubspot_mcp",
          server_url: process.env.MCP_API_URL,
          headers: {
            Authorization: `Bearer ${process.env.MCP_API_KEY}`,
          },
          allowed_tools: [
            "crm_create_company",
            "crm_update_company",
            "crm_get_company",
            "crm_search_companies",
            "crm_batch_create_companies",
            "crm_batch_update_companies",
            "crm_get_company_properties",
            "crm_create_company_property",
            "crm_list_objects",
            "crm_get_object",
            "crm_create_object",
            "crm_update_object",
            "crm_delete_object",
            "crm_search_objects",
            "crm_batch_create_objects",
            "crm_batch_update_objects",
            "crm_batch_delete_objects",
            "crm_list_association_types",
            "crm_get_associations",
            "crm_create_association",
            "crm_delete_association",
            "crm_batch_create_associations",
            "crm_batch_delete_associations",
            "crm_create_contact",
            "crm_update_contact",
            "crm_get_contact",
            "crm_search_contacts",
            "crm_batch_create_contacts",
            "crm_batch_update_contacts",
            "crm_get_contact_properties",
            "crm_create_contact_property",
            "crm_create_lead",
            "crm_update_lead",
            "crm_get_lead",
            "crm_search_leads",
            "crm_batch_create_leads",
            "crm_batch_update_leads",
            "crm_get_lead_properties",
            "crm_create_lead_property",
            "meetings_list",
            "meetings_get",
            "meetings_create",
            "meetings_update",
            "meetings_delete",
            "meetings_search",
            "meetings_batch_create",
            "meetings_batch_update",
            "meetings_batch_archive",
            "notes_create",
            "notes_get",
            "notes_update",
            "notes_archive",
            "notes_list",
            "notes_search",
            "notes_batch_create",
            "notes_batch_read",
            "notes_batch_update",
            "notes_batch_archive",
            "tasks_create",
            "tasks_get",
            "tasks_update",
            "tasks_archive",
            "tasks_list",
            "tasks_search",
            "tasks_batch_create",
            "tasks_batch_read",
            "tasks_batch_update",
            "tasks_batch_archive",
            "engagement_details_get",
            "engagement_details_create",
            "engagement_details_update",
            "engagement_details_list",
            "engagement_details_delete",
            "engagement_details_get_associated",
            "calls_create",
            "calls_get",
            "calls_update",
            "calls_archive",
            "calls_list",
            "calls_search",
            "calls_batch_create",
            "calls_batch_read",
            "calls_batch_update",
            "calls_batch_archive",
            "emails_create",
            "emails_get",
            "emails_update",
            "emails_archive",
            "emails_list",
            "emails_search",
            "emails_batch_create",
            "emails_batch_read",
            "emails_batch_update",
            "emails_batch_archive",
            "communications_get_preferences",
            "communications_update_preferences",
            "communications_unsubscribe_contact",
            "communications_subscribe_contact",
            "communications_get_subscription_definitions",
            "communications_get_subscription_status",
            "communications_update_subscription_status",
            "products_batch_archive",
            "products_batch_create",
            "products_batch_read",
            "products_batch_update",
            "products_list",
            "products_read",
            "products_create",
            "products_update",
            "products_archive",
          ],
          require_approval: "never",
        },
      ],
      temperature: 1,
      top_p: 1,
      store: true,
    });

    chatHistoryCache.push({
      userMessage: message,
      assistantReply: response.output_text,
    });
    if (chatHistoryCache.length > 2) {
      chatHistoryCache = chatHistoryCache.slice(-5);
    }

    return NextResponse.json({
      reply: response.output_text || "No reply from MCP",
      context: chatHistoryCache,
    });
  } catch (error) {
    console.error("Error in /api/assistant:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
