import { notFound } from "next/navigation";
import { CustomerDetail } from "../components/customer-detail";
import { CUSTOMERS } from "../data";

export function generateStaticParams() {
  return CUSTOMERS.map((customer) => ({ id: customer.id }));
}

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = CUSTOMERS.findIndex((customer) => customer.id === id);
  const customer = CUSTOMERS[index];

  if (!customer) {
    notFound();
  }

  return (
    <CustomerDetail
      customer={customer}
      prevHref={
        CUSTOMERS[index - 1]
          ? `/portfolio/${CUSTOMERS[index - 1]!.id}`
          : undefined
      }
      nextHref={
        CUSTOMERS[index + 1]
          ? `/portfolio/${CUSTOMERS[index + 1]!.id}`
          : undefined
      }
    />
  );
}
