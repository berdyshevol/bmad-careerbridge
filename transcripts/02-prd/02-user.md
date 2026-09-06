Read it. The FR/NFR structure with IDs is exactly what we need, and the state model in §3 is a good addition. Now the assumptions, by number.

**Overturned**
- **A-5 — no re-application ever.** Too harsh for students who change their mind. Split it: after **withdrawal** an Applicant may apply again while the Posting is Live (the old Application stays in history as Withdrawn); after **rejection** there is no re-application to the same Posting. Adjust FR-A3-3.
- **A-17 — interview outcome as a precondition of an offer.** Overturned. The team's answer to Q-011 is that the interview is only *recorded*; making it a hard gate couples UC-R5 and UC-R6 and would block the demo if someone forgets to record an outcome. An offer can be extended from Stage Interview regardless. Keep the Passed / Failed / No-show outcomes (A-16) as data, not as a gate.
- **A-13 — Live Postings are immutable.** Soften: a Recruiter may edit the description text of a Live Posting without re-approval; changes to title, category, location, or expiry are refused while Live (close and re-post, as you had it). A typo fix should not need the admin.

**Accepted, no change:** A-2, A-6 (resume snapshot — good catch, we had not thought about it), A-14, A-18, A-19 (auto-reject others as "Position filled" matches our Q-012 answer), A-20, A-27, A-28, A-29, A-30 (CI on every push — yes, GitHub Actions), A-31 (offers never expire and cannot be rescinded this semester — list it in Non-Goals and in Open Questions for the customer).

**Adjusted**
- **A-26** idle timeout 24 hours → **8 hours**. Nobody needs a day-long session on a recruiting site.
- **A-22** Application Cap range 1–50 → **1–20**; the default stays 5.
- **FR-A3-2 "complete profile"** — define "complete" as *name + uploaded Resume*. Nothing else, or the demo stalls on optional fields.

**Admin model.** Write the PRD body for **Option A** (single platform Administrator). Keep UC-M5 (company admin) in the addendum only, as the alternative the team may choose after Dr. Ren answers D-005. Do not put it in the FR list yet.

**Length pushback.** The file is about 3,900 words; I asked for two to three pages of requirements. The FRs and NFRs earn their place — cut elsewhere: §1 Vision should be three sentences with a pointer to the brief, §2 Journeys can shrink to a table, and §3 Glossary should keep only the two state machines and the terms an FR actually uses. Target under 3,000 words total.

Then run Finalize as you described — memlog audit, reconciliation against the brief and Deliverable 0, reviewer pass, polish — local files only. Tell me the final paths and what BMAD recommends next; I plan to run `bmad-architecture` next because the written stack rationale is due in Iteration 1.
