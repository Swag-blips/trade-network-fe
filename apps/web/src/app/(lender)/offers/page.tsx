import { Topbar } from "../components/topbar";
import { OffersBanner } from "./components/offers-banner";
import { OffersTable } from "./components/offers-table";
import { OFFERS } from "./data";

export default function OffersPage() {
  return (
    <>
      <Topbar title="Offers" />
      <div className="min-h-px flex-1 overflow-y-auto px-lg py-md pb-2xl">
        <OffersBanner />
        <div className="pt-xl">
          <OffersTable offers={OFFERS} />
        </div>
      </div>
    </>
  );
}
