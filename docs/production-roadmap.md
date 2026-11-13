# Production roadmap

This repository is a local presentation demo. A successful build does not make the sample commercial data valid or connect a live fulfilment system.

## Five company decisions before launch

1. **Approved catalogue and specifications.** Confirm family names, real sellable SKUs, measurements, thicknesses, units (piece/sheet/metre/kg/reel), tolerances, food-contact declarations where applicable, photos and publishing rights. Confirm current Sun-Ka/Larton identity and office contact details.
2. **Commercial rules.** Provide actual customer price lists, currencies, tier logic, MOQ, pack/bundle multiples, sample policy and customer approval roles. Replace every sample capacity and variant with authoritative data.
3. **Order, payment and ERP ownership.** Decide invoice/credit terms, real payment provider, who accepts an order, stock allocation, ERP mapping, order state transitions and reconciliation. Send transactional mail only after an actual integrated delivery result exists.
4. **Tax, freight and lead-time policy.** Confirm selling entities, tax jurisdiction, incoterms, destination availability, freight quotation/carriers and production scheduling. Publish delivery promises only once the company owns the process and data.
5. **Legal and customer data policy.** Supply reviewed privacy, KVKK/GDPR, terms, returns, retention, consent and access-control rules. Determine lawful data collection, deletion and audit responsibilities.

## Engineering phase two

- Migrate from local SQLite to managed production storage with backups, restores and audited migrations. Preserve integer minor units and transactional order snapshots.
- Replace seeded accounts with invitations, password reset, MFA for staff, central rate limiting, durable sessions and security monitoring. Require HTTPS and secure cookies; configure the exact application origin.
- Implement customer-specific price books and explicit currency records without fictitious live conversion. Add a product/variant/media management workflow with versioned specifications.
- Connect ERP/availability, authenticated RFQ/CRM queues, real quote approval and accepted order transitions. Add an outbox for email and webhooks with retries, idempotency and delivery records.
- Add attachment storage only with size/type limits, malware scanning, access controls, safe downloads and a retention policy.
- Define and integrate tax/shipping calculators and actual payment terms; test failure, cancellation, duplicate submission and refund paths in provider sandboxes first.
- Extend test coverage to production integrations, browser/accessibility audits, observability and failure recovery. Establish real-user performance budgets and business approval sign-off.
- Replace noindex only after content, policies, asset rights and commercial claims are approved; configure the canonical production domain and locale strategy.

No public deployment, payment activation or real message sending is part of this delivery.
