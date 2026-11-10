"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { Switch } from "@repo/ui/switch";

const TOPICS = [
  {
    id: "matched",
    title: "Matched opportunities",
    description: "Get notified about new funding opportunities.",
  },
  {
    id: "offers",
    title: "Offers",
    description: "Receive updates about the status of your offers.",
  },
  {
    id: "repayments",
    title: "Repayment reminders",
    description: "Get reminded when a repayment is due.",
  },
  {
    id: "messages",
    title: "New messages",
    description: "Get alerts for new inbox messages.",
  },
];

export function NotificationSettings() {
  const [email, setEmail] = useState(true);
  const [topicsOpen, setTopicsOpen] = useState(true);
  const [topics, setTopics] = useState<Record<string, boolean>>({
    matched: true,
    offers: true,
    repayments: true,
    messages: true,
  });

  return (
    <>
      <div className="flex items-center gap-sm">
        <span className="flex size-8 flex-none items-center justify-center rounded-full bg-grey-100">
          <HugeiconsIcon
            icon={Mail01Icon}
            size={16}
            className="text-grey-800"
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="font-sans text-body-sm/[normal] font-medium text-grey-900">
            Email notification
          </p>
          <p className="text-caption text-grey-600">
            Receive notifications via email.
          </p>
        </div>
        <Switch
          checked={email}
          onCheckedChange={setEmail}
          label="Email notification"
        />
      </div>

      <section className="overflow-hidden rounded-lg border border-grey-200">
        <button
          type="button"
          onClick={() => setTopicsOpen(!topicsOpen)}
          aria-expanded={topicsOpen}
          className="flex w-full items-center justify-between border-b border-grey-200 px-md py-sm text-left"
        >
          <span className="font-sans text-body-sm/[normal] text-grey-900">
            Notify me about...
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={20}
            className={`text-grey-900 transition-transform motion-reduce:transition-none ${
              topicsOpen ? "" : "-rotate-90"
            }`}
          />
        </button>
        {topicsOpen ? (
          <div className="flex flex-col gap-md p-md">
            {TOPICS.map((topic) => (
              <div key={topic.id} className="flex items-center gap-sm">
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="font-sans text-body-sm/[normal] text-grey-900">
                    {topic.title}
                  </p>
                  <p className="text-caption text-grey-600">
                    {topic.description}
                  </p>
                </div>
                <Switch
                  checked={topics[topic.id] ?? false}
                  onCheckedChange={(next) =>
                    setTopics({ ...topics, [topic.id]: next })
                  }
                  label={topic.title}
                />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
