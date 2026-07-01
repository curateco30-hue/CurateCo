"use client";

import { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface SupportMessageRow {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface SupportInboxProps {
  initialMessages: SupportMessageRow[];
}

function SupportInbox({ initialMessages }: SupportInboxProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState(initialMessages);

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("support_messages").update({ is_read: true }).eq("id", id);
    if (!error) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    }
  };

  if (messages.length === 0) {
    return <p className="py-16 text-center text-sm text-text-muted">No support messages yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <Card
          key={message.id}
          className={`flex items-start gap-3 p-5 ${message.is_read ? "" : "border-brand/40 bg-brand-pale/40"}`}
        >
          {message.is_read ? (
            <MailOpen className="mt-0.5 size-5 shrink-0 text-text-muted" />
          ) : (
            <Mail className="mt-0.5 size-5 shrink-0 text-brand" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#1A1A1A]">{message.sender_name}</p>
              <p className="text-xs text-text-muted">
                {new Date(message.created_at).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <p className="text-xs text-text-muted">{message.sender_email}</p>
            <p className="mt-2 text-sm text-text-secondary">{message.message}</p>
          </div>
          {!message.is_read && (
            <Button size="sm" variant="secondary" onClick={() => markAsRead(message.id)}>
              Mark as Read
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}

export { SupportInbox };
