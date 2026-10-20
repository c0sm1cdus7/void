# Notes first vertical

Notes is the first VOID vertical and the test of DESERT's shared view/journey
architecture. Completion requires a real product, not a renamed local-draft
demo. The N0 runtime proof below starts that work without claiming the missing
MCP or collaborative mechanisms. N1 now mounts a local web create/read slice.

## N1 local web slice

`experience.ts` composes five typed Views and four presentation/execution
bindings. Home and Notes share `create-note`; `read-notes` binds the list and
read-only detail. Visual catalog consumes the existing SDK inspection owner.
The builder validates and freezes the program before including it in the
verified web artifact. Unknown or unsupported semantics fail before mounting.

Canonical command inputs, validation, admission, acceptance and recovery stay
inside DESERT. The local host retains its private developer identity and
PostgreSQL store. This is not a production identity or recovery flow.

## Required product behavior

- Create notes with or without a title. Never persist a fabricated "Untitled"
  title to fit a renderer or schema.
- List, open and edit durable notes under the current identity's authority.
- Start a reusable creation journey from Home or Notes without duplicating it.
- Reuse the editor view without embedding journey IDs or command callbacks.
- Preserve a draft through supported presentation changes and recover the same
  accepted operation after a lost response.
- Present the editor in the right dock, with a transient fallback when it does
  not fit. Keep navigation in the left dock; use shared host geometry and behavior.
- Reject stale edits instead of silently replacing newer content.
- Keep notes private initially; add authorized participants and real-time
  collaboration under an explicit shared policy.
- Support labels with text/color and meaningful collaboration history.
- Cover the same applicable journeys on human, MCP and API surfaces.

## N0 runtime proof

The first executable subset declares create and read journeys through the
currently installed DESERT API, using `*.journey.ts` filenames. It exercises
real PostgreSQL, not an in-memory simulation or a private VOID service.

The proof uses a present-empty title (`""`) as an untitled witness. That is not
approval of a general absent/optional-fact model. Missing title fields must not
be silently coerced into empty values by the SDK. The final editing/view contract
must settle absence versus an explicitly cleared title.

No edit, participant or external provider command is exposed in N0. A successful
agent session test establishes shared local authorization, not a working MCP
server or remote API. No UI or Visual catalog migration is claimed by these tests.

## Independent acceptance

| Case | Required observation |
| --- | --- |
| Create untitled | Stored title is empty, not generated copy; content is unchanged. |
| Submit malformed input | Canonical SDK validation rejects extra/invalid fields; no object/receipt is created. |
| Create and read | The admitted create commits once; list and detail return declared fields. |
| Read projection | Ownership/internal fields are not returned merely because they exist in storage. |
| Private note | Another identity cannot list or read it by guessing its ID. |
| Credential revocation | Subsequent read/admission/acceptance is denied. |
| Retry acceptance | Reaccepting the same intent yields the original receipt and one object. |
| Reopen controller | Data and operation receipt survive controller restart. |
| Human and agent exposure | Both resolve the same journey IDs and enforce the same applicable contract. |
| Reused editor | Create/edit bind typed outputs; the view has no knowledge of the invoking journey. |
| Stale edit base | An editor opened at revision 1 cannot replace revision 2, even if prepare occurs after revision 2 commits. |
| Post-prepare conflict | Another accepted change invalidates the earlier prepared effect. |
| Lost reply | Recover the original operation identity, never issue a replacement write blindly. |
| Invalid visual input | Unknown nodes, class/style/HTML, arbitrary render slots and unbound outputs fail. |
| Cross-surface resume | Resume the authorized journey state through actual web/MCP/API adapters without resetting through Home. |

The case table is the target; the verification record must identify which cases
actually ran. A passing N0 result does not mark the remaining rows complete.

## Shared SDK gaps

1. N1 installs a finite read/create View program and shared web renderer.
   General module composition, cross-module data binding, authored arbitrary
   side docks and media-header handoff remain unsupported in this executable
   subset; unsupported declarations fail. The global catalog ownership audit
   remains open. Do not confuse this slice with full architecture closure.
2. The human builder rejects subject mutations with input fields; its mutation
   client supplies an empty input for subject actions. Editing requires a shared
   SDK correction, not a private product form.
3. Preparation currently reads the current stored revision, not the revision
   originally opened by an editor. Carry and validate the original edit base
   before preparing, and retain the existing acceptance-time concurrency guard.
4. The fact vocabulary has no genuine optional/absent title contract.
5. Participation, revocation, live content subscriptions, collaborative merge
   and history are not provided by owner-only access or availability polling.
6. Agent exposure does not install MCP. A qualified remote API and its
   authentication/continuity contract also remain to be implemented.

Keep actual deficiencies distinct from proposed product choices. TypeScript
types, filenames, JSON Schema and a storyboard are not execution authority.

## Delivery safeguards

Use an isolated database for tests. Never repin or erase Notebook or Landmarks
data to make a new product compile. Do not change `v127a-stable`, its preview,
approved components or media assets to bootstrap VOID.

The next human-surface decision must use the actual shared components/tokens,
with a versioned mockup and explicit gaps. No hand-painted substitute that hides
the missing SDK contract. Keep kernel execution and appearance qualification
separate, then prove their integration.
