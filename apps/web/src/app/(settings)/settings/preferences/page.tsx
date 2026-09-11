"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@repo/ui/badge";
import { Radio } from "@repo/ui/radio";
import { Switch } from "@repo/ui/switch";
import { SettingsPage, SectionHeading } from "../../components/settings-page";

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

const MODES = [
  {
    id: "suggest",
    title: "Suggest actions only",
    recommended: true,
    description:
      "Tai suggests responses within your funding mandate, but you decide the action.",
  },
  {
    id: "negotiate",
    title: "Negotiate on my behalf",
    recommended: false,
    description:
      "Tai handles negotiations for you, while you make the final decisions on the offers.",
  },
];

export default function PreferencesPage() {
  const [email, setEmail] = useState(true);
  const [topicsOpen, setTopicsOpen] = useState(true);
  const [topics, setTopics] = useState<Record<string, boolean>>({
    matched: true,
    offers: true,
    repayments: true,
    messages: true,
  });
  const [mode, setMode] = useState("suggest");

  return (
    <SettingsPage title="Preferences">
      <div className="flex max-w-[506px] flex-col gap-lg">
        <SectionHeading
          title="Notification preference"
          description="Set your notification preference."
        />

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

        <hr className="border-grey-200" />

        <SectionHeading
          title="Auto-negotiation settings"
          description="Set how much control Tai has when negotiating for you."
        />

        <div className="flex flex-col gap-md">
          {MODES.map((option) => (
            <div key={option.id} className="flex gap-sm">
              <Radio
                name="auto-negotiation"
                checked={mode === option.id}
                onSelect={() => setMode(option.id)}
                label={option.title}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-xs">
                  <p className="font-sans text-body-sm/[normal] text-grey-900">
                    {option.title}
                  </p>
                  {option.recommended ? <Badge>Recommended</Badge> : null}
                </div>
                <p className="text-body-sm text-grey-600">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SettingsPage>
  );
}
