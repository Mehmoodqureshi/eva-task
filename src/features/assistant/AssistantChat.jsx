import React, { useState } from "react";
import ChatUI from "@/components/ChatUI";

export const AssistantChat = ({
  chatId,
  messages: externalMessages,
  onSendMessage,
}) => {
  const [internalMessages, setInternalMessages] = useState([]);

  const messages = externalMessages || internalMessages;
  const setMessages = onSendMessage
    ? (newMessages) => {
        if (typeof newMessages === "function") {
          const currentMessages = externalMessages || internalMessages;
          const updatedMessages = newMessages(currentMessages);
          const newMessage = updatedMessages[updatedMessages.length - 1];
          if (
            newMessage &&
            !currentMessages.find((msg) => msg.id === newMessage.id)
          ) {
            onSendMessage(newMessage);
          }
        }
      }
    : setInternalMessages;

  const [loading, setLoading] = useState(false);

  const sendMessage = async (msg) => {
    if (
      msg.toLowerCase().includes("contact") &&
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(msg)
    ) {
      const emailMatch = msg.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
      const email = emailMatch?.[0]?.trim();

      if (!email) {
        return "❗ Please provide a valid email. Example: get contact john@example.com";
      }
      try {
        const res = await fetch("/api/hubspot/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok && data.contact?.results?.length > 0) {
          const c = data.contact.results[0].properties;
          return `✅ Contact found: ${c.firstname || ""} ${
            c.lastname || ""
          }, 📧 ${c.email || ""}, 📞 ${c.phone || ""}`;
        } else {
          return `❌ Contact not found for email: ${email}`;
        }
      } catch (err) {
        console.error("❌ Error fetching contact:", err);
        return "⚠ Failed to get contact information.";
      }
    }

    if (msg.toLowerCase().includes("create deal")) {
      const nameMatch = msg.match(/create deal for (.+)/i);
      const contactName = nameMatch?.[1]?.trim();

      if (!contactName) {
        return "❗ Please specify the contact name. Example: create deal for John Doe";
      }

      try {
        const res = await fetch("/api/hubspot/deal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contactName }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          return `✅ Deal created successfully for ${contactName}.`;
        } else {
          return `❌ Failed to create deal for ${contactName}.`;
        }
      } catch (err) {
        console.error("❌ Error creating deal:", err);
        return "⚠ Something went wrong while creating the deal.";
      }
    }

    if (msg.toLowerCase().includes("update contact phone number")) {
      const match = msg.match(
        /update contact phone number for (.+?) to (\+?\d+)/i
      );
      const email = match?.[1]?.trim();
      const phone = match?.[2]?.trim();

      if (!email || !phone) {
        return "❗ Please provide both email and phone number. Example: update contact phone number for abc@email.com to ‪+923001234567‬";
      }

      try {
        const res = await fetch("/api/hubspot/update-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone }),
        });

        const data = await res.json();
        return res.ok
          ? `📞 Phone updated successfully for ${email}.`
          : `❌ Failed: ${data.error || "Could not update phone"}`;
      } catch (err) {
        console.error("Update phone error:", err);
        return "⚠ Error updating contact phone number.";
      }
    }

    if (msg.toLowerCase().includes("update contact email")) {
      const match = msg.match(/update contact email for (.+?) to (.+@.+\..+)/i);
      const oldEmail = match?.[1]?.trim();
      const newEmail = match?.[2]?.trim();

      if (!oldEmail || !newEmail) {
        return "❗ Please provide both old and new email. Example: update contact email for old@email.com to new@email.com";
      }

      try {
        const res = await fetch("/api/hubspot/update-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldEmail, newEmail }),
        });

        const data = await res.json();
        return res.ok
          ? `📧 Email updated successfully from ${oldEmail} to ${newEmail}.`
          : `❌ Failed: ${data.error || "Could not update email"}`;
      } catch (err) {
        console.error("Update email error:", err);
        return "⚠ Error updating contact email.";
      }
    }

    // 🤖 Default: forward message to Gemini
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      return data.reply || "🤖 No response from assistant.";
    } catch (err) {
      console.error("❌ Error communicating with Gemini:", err);
      return "⚠ Failed to get response from assistant.";
    }
  };

  const handleSend = async (msg) => {
    const userMsg = {
      id: Date.now().toString(),
      text: msg,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const assistantReply = await sendMessage(msg);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: assistantReply,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error fetching assistant response:", err);
    }

    setLoading(false);
  };

  return (
    <ChatUI
      messages={messages}
      onSend={handleSend}
      loading={loading}
      className="h-full"
    />
  );
};
