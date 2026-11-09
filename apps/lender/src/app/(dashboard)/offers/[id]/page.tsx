import { notFound } from "next/navigation";
import { DetailHeader } from "@repo/ui/detail-header";
import { StatusBadge } from "../components/status-badge";
import { NegotiationTimeline } from "../components/negotiation-timeline";
import { OfferSummary } from "../components/offer-summary";
import { OFFERS } from "../data";

export function generateStaticParams() {
  return OFFERS.map((offer) => ({ id: offer.id }));
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = OFFERS.findIndex((offer) => offer.id === id);
  const offer = OFFERS[index];

  if (!offer) {
    notFound();
  }

  return (
    <>
      <DetailHeader
        backLabel="offers"
        itemLabel="offer"
        initials={offer.initials}
        name={offer.applicant}
        badge={<StatusBadge status={offer.status} />}
        prevHref={
          OFFERS[index - 1] ? `/offers/${OFFERS[index - 1]!.id}` : undefined
        }
        nextHref={
          OFFERS[index + 1] ? `/offers/${OFFERS[index + 1]!.id}` : undefined
        }
      />
      <div className="min-h-px flex-1 overflow-y-auto py-lg">
        <div className="mx-auto flex w-full max-w-content items-start gap-20 px-lg">
          <NegotiationTimeline offer={offer} />
          <OfferSummary offer={offer} />
        </div>
      </div>
    </>
  );
}
