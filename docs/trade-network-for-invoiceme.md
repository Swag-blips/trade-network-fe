# Trade Network: a briefing for the Invoice Me team

**Purpose.** This document explains what Trade Network is, the problem it solves, and how
it is built today, so that an engineer on Invoice Me (or Claude, working in the Invoice Me
codebase) can reason about **what could go wrong when Invoice Me users migrate to Trade
Network**. It is an input to an edge-case analysis, not that analysis itself. Section 9 is
a brief for whoever writes that analysis.

It was written on 18 November 2026 from the two Trade Network repositories
(`trade-network-fe`, `trade-network-be`) and the backend architecture document
(`trade-network-be/docs/backend-architecture.pdf`). Where something is planned rather
than built, it says so. Treat anything marked _planned_ as a statement of intent that can
still change.

---

## 1. Trade Network in one paragraph

Trade Network is a B2B platform for Nigerian businesses that **turns everyday trade
activity into records that can be financed**. A business keeps its trade records on the
platform (invoices, purchase orders, delivery notes, the companies it trades with), stays
compliant with invoicing and tax rules, and uses a verified trade (for example an unpaid
invoice to a buyer) to **ask capital providers for financing against it**. Capital
providers ("lenders") set out what they want to fund, are shown the trades that fit, make
offers, negotiate, send the money, and track repayment. An assistant called **Tai** is
planned to sit on top of all of this.

The public pitch (from the marketing site) is: _"Finance your trade. Grow your business.
Manage trade records, stay compliant, and access financing for verified trades."_

## 2. The problem it solves

- **Businesses in regional supply chains are capital-constrained by their own credit
  terms.** A supplier delivers goods, invoices a buyer on 30/60/90-day terms, and waits.
  Meanwhile it has to pay its own suppliers, buy inventory and make payroll.
- **Lenders can't easily see or trust that trade.** The evidence (invoice, purchase order,
  delivery note) is scattered across email, paper and accounting tools, and is hard to
  verify, so financing small and mid-sized businesses against their receivables is slow
  and expensive.
- **Trade Network's bet:** if the trade happens on the platform, or its evidence is
  brought onto it, then the trade itself becomes the credit signal. An invoice issued
  through an accredited e-invoicing channel and cleared by the **NRS (Nigeria Revenue
  Service)** is far stronger evidence than a PDF. That is why **e-invoicing is central to
  Trade Network, not a side feature**, and why Invoice Me matters.

## 3. Who uses it: two apps over one marketplace

| Side | App | Who | Status |
| --- | --- | --- | --- |
| Capital providers | **Lender app** (`apps/lender`, Next.js) | Funds, banks, private lenders | Built: onboarding, dashboard, opportunities, negotiation, funding, portfolio, settings, teams |
| Businesses | **Trade Hub** (`apps/business`, Next.js) | Suppliers, distributors, enterprises (the borrowers) | **Not built.** An empty shell. Business-side records exist only as seeded demo data |
| Assistant | **Tai** | Both sides | Planned |

Both apps talk to one **NestJS modular monolith** with **one shared PostgreSQL** database
(plus Redis for sessions). The two apps are two views of one marketplace: a lender's offer
references a business's trade, matching joins a lender's mandate to a business's trade, and
repayments roll up into the lender's portfolio.

**Invoice Me users map to the Trade Hub (business) side.** They are the suppliers and
buyers who issue and receive invoices. The lender side has no Invoice Me equivalent.

## 4. Vocabulary

| Term | Meaning in Trade Network |
| --- | --- |
| **Organization** | A company. `kind` is `LENDER` or `ENTERPRISE`. Every business on Trade Hub is an `ENTERPRISE` organization. |
| **Enterprise** | The business side, and the only kind of organization that can **borrow**. Its `BorrowerRole` on a trade is `SUPPLIER` or `DISTRIBUTOR`. |
| **Counterparty / buyer** | The company the enterprise sold to, who owes the invoice. **Today this is free text (`counterpartyName`) on the trade, not a linked organization.** |
| **User** | A person, identified by a **unique email**. Signs in by email OTP (no passwords). |
| **Membership** | User ↔ organization, with a role. A user **can belong to several organizations**, and a session has one *active* organization. |
| **Role / permission** | RBAC per organization (`Owner`, `Admin`, …), with permission keys checked on every request. |
| **Mandate** | A lender's funding preferences: capital allocation, ticket range, flat interest rate, tenor range, funding type, sectors. |
| **Trade** | One deal an enterprise wants financed: the invoice or purchase it's based on, the amount it wants advanced, for how long. |
| **Trade document** | `INVOICE`, `PURCHASE_ORDER` or `DELIVERY_NOTE`, at most one of each per trade. **Stored as a file name only; there is no file storage yet.** |
| **Opportunity** | A trade shown to one lender whose mandate it fits, with a score and match level. |
| **Offer / counter** | A proposal on an opportunity (amount + tenor at the lender's rate). The enterprise can counter. |
| **Conversation** | The negotiation thread between one lender and one enterprise about one trade. |
| **Funding** | What's owed once an offer is accepted. Has a human reference like `FT1000001`. |
| **Installment** | One scheduled repayment of a funding, every 30 days from confirmation. |
| **IRN** | Invoice Reference Number returned by NRS clearance. **Not stored anywhere in Trade Network yet.** |

## 5. How a deal flows (what is built)

1. **A lender signs up and onboards.** Email → OTP → organization details + mandate in one
   request. They become the organization's `Owner` and are immediately matched against
   every open trade that fits.
2. **An enterprise opens a trade.** _(No route yet; trades are created in code and by the
   demo seed. Trade Hub will do this.)_ The trade carries: borrower role, counterparty
   name, sector, funding type (`INVOICE_FINANCING`, `PURCHASE_ORDER`,
   `WORKING_CAPITAL`), financing purpose, currency, **invoice value**, optional **invoice
   number**, requested advance (≤ invoice value), tenor, the credit terms given to the
   buyer, **payment due date** (when the buyer pays), and an expiry for the request.
3. **Matching.** Opening a trade creates one opportunity per lender whose mandate fits
   (currency, sector, funding type, ticket range, tenor). The score is half "how many of
   the three documents are attached" and half "how far below the lender's max ticket".
4. **Negotiation.** The lender makes an offer or requests documents, which opens a
   conversation. The enterprise can counter. Only one offer is pending per opportunity.
   Several lenders can negotiate the same trade in parallel without knowing about each
   other.
5. **Acceptance reserves the trade for 24 hours** and creates a funding in
   `AWAITING_PAYMENT`. Other lenders aren't told.
6. **The lender pays**, off-platform for now, and says so (`AWAITING_CONFIRMATION`). **The
   enterprise confirms the money arrived** → the funding is `ACTIVE`, the trade is
   `FUNDED`, installments are created, every competing offer lapses and every other
   conversation closes. All in one database transaction.
7. **Repayment.** The lender records each installment as received. The last one marks the
   funding and the trade `REPAID` and frees the lender's capital.

Statuses only move forward, and each transition is a single conditional `UPDATE` so two
concurrent actions can't both win. Several states are **derived at read time** instead of
written by a job: an expired opportunity is hidden, an unpaid funding past `payBy` reads
as `EXPIRED`, an installment past due reads as `OVERDUE`.

```
Trade:   DRAFT → OPEN → RESERVED → FUNDED → REPAID      (DRAFT/OPEN → CANCELLED)
Funding: AWAITING_PAYMENT → AWAITING_CONFIRMATION → ACTIVE → REPAID   (or EXPIRED)
```

## 6. Facts about the codebase that matter for migration

These are the properties of Trade Network today that an Invoice Me migration will run into.

### Identity

- **A user is an email address.** `users.email` is unique, and sign-in is an emailed
  one-time code. There are no passwords to migrate, but there is also no other identifier
  for a person.
- **Users are created by self-signup, an invitation link, or onboarding.** There is no
  bulk-import or "pre-provisioned account" path yet.
- **One user can belong to several organizations**, and the active one comes from the
  session, never from a client-supplied id.
- **A user can change their email** (verified by codes to the old and the new address).
  Any external mapping keyed by email will drift.
- **Account deletion is a 7-day scheduled purge.** The last member leaving closes the
  organization (`closedAt`); the organization row stays with name, kind and country so
  counterparties' records keep their other side. The email becomes free and can sign up
  again as a new user.

### Businesses

- **Organizations have no tax or registry identifiers.** There is **no TIN, no CAC/RC
  number, and no Invoice Me `businessId` column** today. Fields are: name, country, state
  (ISO 3166-2 code in Nigeria, e.g. `NG-LA`), street address, sector (enterprises only),
  description. Two organizations with the same name are two organizations.
- **Enterprise onboarding doesn't exist yet** (`POST /onboarding/enterprise` is planned).
  Enterprises in the database today are demo data.
- **One Owner per organization**, created by onboarding. Ownership handover and member
  removal aren't built.

### Trades and invoices

- **A trade is not an invoice.** It's a financing request that _references_ an invoice:
  `invoiceValueMinor`, an optional `invoiceNumber`, `paymentDueAt`, and a document row
  whose only content is a file name.
- **The buyer is a string.** `counterpartyName` isn't linked to an organization, so Trade
  Network cannot currently tell that "the buyer on this trade" is a company that also has
  an account.
- **Documents aren't verified by the platform.** The backend doc says: _"An invoice made
  on the platform is already validated by NRS, and lenders review the rest in their own
  due diligence."_ In other words, **NRS clearance through e-invoicing is the intended
  trust anchor for invoices.**
- **A trade's sector is copied from the enterprise at creation**, so later edits don't
  rewrite history. The same "copy terms, don't reference them" rule applies to offers and
  fundings.

### Money and integrity

- **Amounts are integers in minor units** (`*Minor`, kobo for NGN), always next to a
  `currency`. Only `NGN` exists. Never floats.
- **Fundings and installments are never deleted by cascade** (`RESTRICT`); an enterprise
  with trades can't be deleted.
- **Planned, not built:** a double-entry ledger, **idempotency keys on every money-moving
  endpoint**, and reversing entries instead of edits.
- **Tenancy:** every organization-scoped query uses the session's organization id, never
  an id from the URL or body. Postgres row-level security is the planned backstop.

### Integrations

- **The only outbound integration built is email** (SMTP/Resend). There are **no
  webhooks, no inbound integration endpoints, no message queue, and no file storage** yet.
- An `integrations/invoiceme/` folder is **reserved and empty** ("thin seam, no domain
  logic").

## 7. The e-invoicing plan, as written today

From section 4 of `backend-architecture.pdf`. **This is the design the migration
discussion is now questioning.**

- **Integrate, don't rebuild.** Invoice Me is an existing, standalone **Quarkus** service.
  Trade Network will **proxy** invoice actions to it rather than reimplement e-invoicing.
- **Invoice Me is the system of record for invoices.** Trade Network keeps, at most, a thin
  reference row: `tradeId → invoiceId + IRN + status`. This is the one deliberate
  exception to "one shared Postgres".
- **Path:** Trade Hub → NestJS seam (bridges identity, no invoice logic) → Invoice Me →
  NRS clearance → IRN back the same way.
- **Handshake:**
  1. **Service credential.** NestJS authenticates to Invoice Me as a machine with a
     credential HOPtool issues (API key or OAuth2 client credentials; **still to confirm**).
  2. **Org mapping.** A Trade Hub organization maps to an Invoice Me business by its
     **`businessId`**, stored on the Trade Network side as `orgId → businessId`.
- **Separate logins.** Trade Hub users authenticate with Trade Network; Invoice Me has its
  own auth and its own NRS TaxProMax link.

**A discrepancy to settle early.** The architecture doc calls Invoice Me itself "the
accredited NRS Access Point". The current team description is a longer chain: **Trade
Network → Invoice Me → the APP (Access Point Provider) → NRS**. Under discussion is
**cutting Invoice Me out and having Trade Network call the APP directly**. Which entity
holds the accreditation, and therefore who may submit to NRS on a taxpayer's behalf,
decides a lot of the edge cases below.

## 8. The migration being considered

- **Invoice Me users will move to Trade Network over time, not all at once.** For a long
  stretch, some businesses will be on Trade Network and their trading partners still on
  Invoice Me, and the reverse.
- **Trade Network will get its own e-invoicing feature** in Trade Hub.
- **The target is to remove the downstream dependency** on Invoice Me: Trade Network
  talks to the APP (and through it, NRS) directly, instead of Trade Network → Invoice Me →
  APP → NRS.
- **The question:** what breaks, duplicates, goes missing or becomes ambiguous during and
  after that move?

**The motivating example.** A buyer has migrated to Trade Network. Their supplier is still
on Invoice Me and issues an invoice to that buyer on Invoice Me. Where does the buyer see
it? Which system is the record? If Trade Network now talks to the APP directly, does it
ever learn about an invoice that went Invoice Me → APP → NRS? Can that invoice back a
trade on Trade Network, and how would a lender know it's the cleared invoice and not a
copy?

## 9. Brief for the edge-case analysis (for Claude in the Invoice Me repo)

Use the sections above as the Trade Network side of the picture. In the Invoice Me
codebase, establish the facts below first, then enumerate edge cases. For each one give
the scenario, what happens today (or would happen with each architecture), the
consequence (compliance, money, data, user experience), and a proposed resolution or open
question.

**Establish first, from the Invoice Me code:**

1. How a business is identified (`businessId`, TIN, RC number, email), and how a user
   relates to a business (one-to-one, one-to-many).
2. How the **buyer/recipient** on an invoice is identified (TIN? email? free text? a
   linked business?), and whether the buyer has to be an Invoice Me user.
3. The invoice lifecycle and its states, including NRS submission, clearance, IRN
   assignment, rejection, cancellation, credit notes and amendments, and which of these
   are synchronous calls versus callbacks or polling.
4. Who is the accredited party that submits to NRS: Invoice Me, or a separate APP that
   Invoice Me calls. What credentials and taxpayer authorisations (e.g. TaxProMax) the
   submitter needs per business, and whether they can be transferred.
5. How Invoice Me notifies anyone of events (webhooks, emails, none), and its idempotency
   and retry behaviour toward the APP/NRS.
6. Money representation (minor units vs decimals, currencies, VAT/WHT fields).

**Areas to explore** (not exhaustive):

- **Split-platform counterparties.** Supplier on Invoice Me and buyer on Trade Network,
  and the reverse. Visibility, notifications, acceptance or dispute of an invoice, and
  which side is the system of record for that invoice.
- **Identity matching.** Linking an Invoice Me business to a Trade Network organization
  when Trade Network has no TIN or RC number; duplicates, two businesses claiming one TIN,
  email changes, users in several organizations, one Invoice Me user with several
  businesses.
- **In-flight invoices at cutover.** Submitted but not yet cleared, cleared but not yet
  paid, rejected and being corrected, partially credited. Who finishes them, and with
  which credentials?
- **Double submission and IRN uniqueness.** The same invoice sent to NRS from both
  systems, or re-sent after migration. Idempotency across two submitters.
- **Historical invoices.** Whether past invoices (and their IRNs) migrate as data, stay
  readable in Invoice Me, or are referenced. What a lender can rely on when a trade cites a
  pre-migration invoice.
- **Invoices backing a financing.** A trade on Trade Network references an invoice whose
  record lives in Invoice Me. That invoice is later cancelled, credited or amended, or the
  supplier migrates mid-financing. Trade Network today stores only an invoice number and a
  file name.
- **Removing the Invoice Me hop.** What Invoice Me does today between Trade Network and the
  APP (validation, enrichment, numbering, tax computation, retries, audit, storage) that
  Trade Network would have to take over, and what breaks for businesses still on Invoice
  Me while Trade Network calls the APP directly.
- **Authorisation and compliance.** Whether Trade Network can submit on behalf of a
  business without that business re-authorising, and whether the submitter's accreditation
  carries over.
- **Account lifecycle.** A business deleted or closed on one platform while active on the
  other (Trade Network keeps closed organizations' names for counterparties and purges
  users after 7 days).
- **Rollback.** A business that migrates and needs to go back, or a migration batch that
  fails halfway.

**Constraints from Trade Network to respect:** integer minor units with an explicit
currency; tenancy by the session's organization only; statuses that only move forward;
Trade Network stores invoice _references_, not invoice bodies, under the current design;
nothing on the Trade Network side issues or verifies an IRN today.
