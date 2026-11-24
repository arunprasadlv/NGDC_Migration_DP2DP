# NGDC DataPower Migration: Partner Engagement Process

## Project context
- About 1,000 DataPower proxies move from the heritage data center to the new generation data center (NGDC), onto a new framework.
- Proxy development is complete. What remains is non-production deployment, partner testing, production deployment and traffic cutover.
- No process existed for coordinating with API providers and consumers. This project defines it.
- About 700 provider applications and about 400 consumers, all internal.
- Source brief: `usecase.txt`.

## Deliverables (in this repo)
- `NGDC DataPower Migration Partner Engagement Process.docx`: the process document, rebuilt locally on 2026-11-23 with python-docx. The earlier Claude Doc (https://claude.ai/artifact/7PPPD3amaPXxpAwSdqRD3j) is now out of date and its connector was disconnected, so this repo is the source of truth.
- `NGDC Migration Workflow Diagram.pptx`: one-slide workflow diagram (pptxgenjs).
- `NGDC Migration Workflow Diagram.drawio`: the same diagram for draw.io.
- The diagram layout is defined once and generates the PNG in the docx, the pptx and the draw.io file. Update all three together when the process changes.

## Terms
- **TCI** (Technology Change Initiative): there are two shared TCIs, sent earlier this year, one for all providers and one for all consumers. Each party has its own item under them. They only notify that the proxy must migrate by the end of Q2 2027 and carry no provider date.
- **DCMS flight plan**: owned by the DCMS CDAE team. Lists applications and the date each must go to production. It has no provider or consumer information, and it can include consumer applications.
- **API inventory**: one row per API, with its proxy, provider application, consumers and CIO. The API management team records gate status and dates in it, and a Power BI dashboard reads it. It has no TCI numbers.
- **Hard gates**: pre-deployment gate is met when every proxy of the application is deployed in production. Post-deployment gate is met when all consumer traffic has cut over and heritage has zero traffic. Both are due by the flight plan date and are tracked per application.
- **Neighborhood**: the production infrastructure per CIO team. All are available.
- **UAT**: the shared non-production environment where partner testing happens.
- **API management team**: owns the migration. **Flux** is the pod that manages the Jira tasks.
- **Network zones**: gen zone, CD zone and PAA zone. A provider API can be in any of them.

## Decisions (settled)
- **Planning:** the API management team plans the waves. Providers do not raise a ticket to start. The earlier provider-ticket trigger and ticket-by dates were dropped.
- **Date source:** the flight plan date per provider application. The inventory decides each application's role: provider dates drive the plan, consumer-only applications are ignored, and an application that is both uses its provider date. Consumer schedules never affect proxy migration or cutover.
- **Missing or unmatched date:** an application with no flight plan date, or present in only one source, is an exception. The API management team asks the provider for a date within 10 business days and records it as provider-supplied. If there is no reply, the API management team assigns a date inside the window and escalates via the CIO.
- **Ordering:** flight plan date first, then business criticality and consumer count. CIOs migrate in parallel, each with several waves. Conflicts get a proposed earlier date. Anything that cannot make 30 Jun 2027 is a CIO end-of-life risk, not an exception. The plan is refreshed weekly.
- **Dates:** internal cutover target 15 Jun 2027; hard deadline 30 Jun 2027, which is also heritage DataPower end of life; heritage retirement planned for Q3 2027. No exception may go past 30 Jun 2027.
- **Freeze:** production changes avoid the last week of each month. Non-production work continues.
- **Provider communication:** one plan message per provider after the waves are planned. The provider confirms the date or requests a change, and confirms backend readiness. If it does not respond, the API management team escalates via the CIO and keeps the date. A further message goes out only when a date changes.
- **Consumer communication:** one notice per consumer per wave, sent when the proxies are in UAT. It gives testing and sign-off dates and the planned cutover date, and references the consumer TCI.
- **Jira:** when a wave is planned, a story per provider application per network zone is assigned to the API management team. The Flux pod creates tasks under it from a standard template. Zone only splits the execution work; gates, dates and status stay per application. Providers create no tickets.
- **Sign-off:** UAT sign-off is mandatory from the provider and from each consumer of the API. A consumer cannot cut over without it, and silence is not consent. Non-responders go through stepped escalation (team, manager, CIO leadership). Each API has a published retirement date as the backstop.
- **Cutover:** the proxy is deployed to production after the provider signs off. Each consumer then cuts over independently, in weeks 1 to 3 of a month.
- **Closure:** the consumer raises a Jira ticket after production cutover. The API management team verifies the logs and closes it, and then the consumer closes its TCI item. The provider's TCI item closes once the API management team confirms zero heritage traffic for the application.
- **Rollback:** the consumer reverts to the heritage URL. Heritage is never changed while a consumer still uses it.
- **Retirement:** a heritage proxy retires after 2 weeks of zero traffic from all consumers. This is tracked separately from the TCI items.
- **Roles:** the API management team owns the process. Consumers make the changes. Providers coordinate with consumers for testing.
- **Consumer discovery:** reconcile the inventory against heritage traffic logs per wave and add any missing callers.
- **Reporting:** gate status is recorded in the inventory and shown in Power BI. Weekly status to CIOs and a monthly steering review.

## Reports (R1 to R9, marked on the diagram)
- R1 wave plan with window check and conflicts (stage 1); R2 data quality (stages 0 and 3); R3 plan confirmation tracker (stage 2); R4 UAT sign-off tracker (stages 5 and 6); R5 gate status per application, shown in Power BI (stages 7 and 10); R6 cutover closure verification per consumer (stage 9); R7 weekly CIO status and R8 monthly steering pack, both roll-ups; R9 heritage retirement (stage 11).
- The provider plan message and the consumer UAT notice are communications, not reports.
- Formats, cadences and thresholds are still to be defined. Detailed reporting requirements are deferred to a later discussion.

## Open actions
- Name the application field (join key) in the inventory and in the flight plan.
- Discuss how gate status is maintained in the inventory, and who maintains the Power BI dashboard.
- Define the Jira statuses and the standard task template per story, and confirm which teams besides the Flux pod create tasks.
- Choose the pilot provider applications, based on flight plan dates.
- Compute the full counts of provider applications, consumers, APIs and stories per CIO and zone.
- Confirm the API management team's headcount.
- Confirm the exact heritage DataPower end-of-life date within Q2 2027.
- Define the format, cadence and thresholds for each report (R1 to R9), including the dashboard refresh and who maintains it.
- Confirm the proposed lead-time template (6 weeks before the flight plan date: notify and deploy to UAT; 6 to 4: testing and sign-off, only 2 weeks; 4: pre-deployment gate; 4 to 0: cutovers).
- Collect the flight plan dates, identify applications with no date, and run the first window check.

## AI agent candidates (ranked)
1. Consumer reconciliation against heritage logs.
2. Cutover closure check (NGDC traffic, zero heritage traffic, ticket).
3. Jira story and task manager.
4. Inventory status updater.
5. Non-responder chaser.
6. Notice drafter (provider plan message, consumer UAT notice).
7. Weekly status reporter.

Agents should read and draft first. Anything that sends messages, closes tickets or changes a proxy needs human approval.

## Working notes
- The inventory and the flight plan are not in this repo.
- Capacity estimate: about 20 production weeks from Dec 2026 to 15 Jun 2027, so roughly 35 provider applications and 50 proxies per week. This is a planning estimate only.
- Building the docx: python-docx, with the diagram as a PNG on a landscape page. The pptx uses pptxgenjs and the draw.io file is generated XML. LibreOffice is not installed on this machine, so the docx and pptx are not rendered; run the pptx skill's `validate.py` on the pptx.
- Git: remote is `https://github.com/arunprasadlv/NGDC_Migration_DP2DP`, branch `main`. The repo was made public on 2026-11-20. `.gitignore` excludes Word lock files (`~$*`).
