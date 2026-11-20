# NGDC DataPower Migration: Partner Engagement Process

## Project context
- About 1,000 DataPower proxies move from the heritage data center to the new generation data center (NGDC), onto a new framework.
- Proxy development is complete. What remains is non-production deployment, partner testing, production deployment and traffic cutover.
- No process existed for coordinating with API providers and consumers. This project defines it.
- About 700 provider applications and about 400 consumers, all internal.
- Source brief: `usecase.txt`.

## Deliverables (in this repo)
- `NGDC DataPower Migration Partner Engagement Process.docx`: the process document. Export of the Claude Doc "NGDC DataPower Migration: Partner Engagement Process" (https://claude.ai/artifact/7PPPD3amaPXxpAwSdqRD3j). The Doc is the editable source; re-export after changing it.
- `NGDC Migration Workflow Diagram.pptx`: one-slide workflow diagram, built with pptxgenjs and not exported from the Doc. The diagram in the Doc is a separate widget, so update both when the process changes.

## Terms
- **TCI** (Technology Change Initiative): issued to every provider application and every consumer. It only notifies them that the proxy must migrate by the end of Q2 2027. It carries no provider date.
- **Neighborhood**: the production infrastructure per CIO team. All are available and operational.
- **UAT**: the shared non-production environment where partner testing happens.
- **Central team**: the central API management team, which owns the migration.

## Decisions (settled)
- **Dates:** internal cutover target 15 Jun 2027; hard deadline 30 Jun 2027, which is also heritage DataPower end of life; heritage retirement planned for Q3 2027. No exception may go past 30 Jun 2027.
- **Freeze:** production changes avoid the last week of each month. Non-production work continues.
- **Trigger:** the provider raises a Jira ticket quoting its TCI number. No ticket, no wave. Mandatory fields: TCI number, application, proxies, planned date, contact, backend readiness from UAT and the production neighborhood.
- **Planned date:** it comes from the provider's ticket. The central team compares it with the window and proposes an earlier date for conflicts. Anything that cannot make 30 Jun goes to the CIO as an end-of-life risk.
- **Waves:** CIOs migrate in parallel, each with several waves, grouped by provider application.
- **Tickets:** one parent ticket per provider application, one child ticket per consumer-API pair. The consumer raises the child ticket after its traffic cutover and closes its own TCI. The central team verifies the logs and closes the ticket.
- **URLs:** consumers change their endpoint URL to the NGDC proxy. Heritage and NGDC run in parallel.
- **Sign-off:** UAT sign-off is mandatory from the provider and from each consumer of the API. A consumer cannot cut over without it, and silence is not consent. Non-responders go through stepped escalation (team, manager, CIO leadership). Each API has a published retirement date as the backstop.
- **Cutover:** the proxy is deployed to production after the provider signs off. Each consumer then cuts over independently, in weeks 1 to 3 of a month.
- **Cutover closed when:** traffic is on the NGDC proxy, the heritage proxy has none of that consumer's traffic, and the child ticket is raised.
- **Rollback:** the consumer reverts to the heritage URL. Heritage is never changed while a consumer still uses it.
- **Retirement:** a heritage proxy retires after 2 weeks of zero traffic from all consumers.
- **Roles:** the central team owns the process. Consumers make the changes. Providers coordinate with consumers for testing.
- **Consumer discovery:** the inventory lists providers and consumers. Reconcile it against heritage traffic logs per wave and add any missing callers.
- **Communication:** consumers get one consolidated notice listing all of their APIs.
- **Reporting:** weekly status to CIOs (including provider tickets received against due) and a monthly steering review.

## Open actions
- Set the ticket-by dates and send the request to all providers.
- Confirm whether consumer TCIs have been issued.
- Confirm who closes the provider TCI and when (assumed: once all its child tickets are closed).
- Define the Jira statuses for provider and child tickets.
- Choose the pilot provider applications.
- Compute the full counts of consumer-API pairs, provider applications and consumers per CIO.
- Confirm the central team's headcount and name a coordinator per CIO.
- Confirm the exact heritage DataPower end-of-life date within Q2 2027.
- Confirm the proposed lead-time template (8 weeks before the planned date: notify and deploy to UAT; 8 to 4: testing and sign-off; 4 to 0: production and cutover).
- Collect the planned dates from provider tickets and run the first deadline check.

## AI agent candidates (ranked)
1. Consumer reconciliation against heritage logs.
2. Cutover closure check (NGDC traffic, zero heritage traffic, ticket).
3. Jira ticket manager.
4. Non-responder chaser.
5. Wave notice drafter.
6. Weekly status reporter.

Agents should read and draft first. Anything that sends messages, closes tickets or changes a proxy needs human approval.

## Working notes
- The inventory (API, NGDC proxy name, CIO, providers, consumers) is not in this repo.
- Capacity estimate: about 20 production weeks from Dec 2026 to 15 Jun 2027, so roughly 35 provider applications and 50 proxies per week. This is a planning estimate only.
- Doc export: the docx export result is large and base64-encoded. Decode it from the saved tool-result JSON into this folder.
- PowerPoint: LibreOffice is not installed on this machine, so slide renders are unchecked. Build the slide with pptxgenjs and run the skill's `validate.py`.
- Git: remote is `https://github.com/arunprasadlv/NGDC_Migration_DP2DP` (private), branch `main`. `.gitignore` excludes Word lock files (`~$*`).
