# VOID implementation decisions — 22 October 2026

This is the working delivery record for the owner's authorized overnight pass.
It is not a release declaration. Development remains on `codex/module-architecture`
in VOID and DESERT. No release, remote push, external account provisioning or
provider execution is authorized by this record.

## Morning handoff — verified checkpoint N

`build/void-capabilities-20261022-n` is now the live build on the existing
`http://127.0.0.1:4400/` host, using the protected local installation
`.local/void-capabilities-20261022-n`. The first-administrator screen was checked
in both existing VOID tabs. The owner supplies the identity and password; no
credentials were invented. Earlier stores and stable artifacts were preserved.

The final SDK confirmation passed **1441/1441**; VOID passed **40/40** contract/runtime
tests, admission of **85** product source files, TypeScript and **54/54** generated
browser tests. Notebook continuity, Inspection, public catalog/motion, press and
shared-owner suites also passed. Exact digests, logs, fixture corrections and
qualification limits are in [verification](VERIFICATION.md). All subsequent
entries below are historical progress, not competing current build claims.

Seven installed modules provide Notes, Tasks, Media, System, Appearance, Identity
and Visual catalog. Home is product composition, not an eighth capability module.
Notes supports private create/read/edit and reversible Trash/Restore. Tasks adds
typed project labels and complete/reopen. Media retains the shared sample
image/video/audio viewer and adds private optimized image import, rename and
Trash/Restore. Guided note demonstrates acknowledged durable steps and review
using the ordinary note command. System reports actual controller evidence;
Appearance applies shared device preferences; Identity provides bootstrap,
sign-in and lock. Cross-tab session ownership is enforced at both client and host.

This is **not the entire defined product**. Connections/provisioning, environment
enrollment, real provider actors and task conversations still lack product
implementation; the isolated queue kernel is not a substitute. Recovery, agent
OAuth, canonical identity administration, assigned cross-identity activities,
shared MCP/API navigation, conditional business-input requirements, private
albums/audio/video import, collaborative Notes and native binaries remain open.
Ordinary editor drafts are session-memory only; Guided note persists acknowledged
steps. There is no automatic offline write queue. Legacy visual ownership is not
globally qualified, and public reproducibility still needs a distributable SDK
and independent media assets. See [roadmap](ROADMAP.md) for the bounded slices.

No push, release, external account creation, provider invocation or infrastructure
provisioning was performed. All decisions requiring later review are collected
in the decision table below; no new visual surface or private product renderer
was introduced.

## Preserved boundary

VOID declares modules, objects, commands, journeys, destinations and typed Views.
DESERT owns their validation, execution and the existing web catalog. Product
code does not add HTML, Svelte, CSS, controller implementations or private
validators. Shared primitives retain their approved glass, geometry and motion.
New authoring uses `defineView` and `Components`; renderer identities are generated.
Published module references remain objects, not manually repeated identifier strings.

## Decisions taken

| Area | Decision | Consequence |
| --- | --- | --- |
| Notes | Delete moves a note to a private Trash with explicit review; Restore is reversible. | No irreversible purge and no administrator access to another identity's notes. |
| Tasks | A personal task has a required title, details, multiple project labels and open/completed state; completion can be reversed. | Projects are typed label arrays, not project containers or CSV. Actor assignments are not simulated. |
| Appearance | System is the default color scheme; Light/Dark and three text sizes are per-device preferences. | Every destination, including Visual catalog, uses the same root preference. OS motion/transparency settings remain independent. |
| System | Display the actual exposed operation inventory and observed controller evidence separately. | Registered, unknown, unavailable and ready are not synonyms. No fabricated build or identity metadata. |
| Controllers | One installed host may explicitly provide multiple independently declared controller roles. | Notes and Tasks do not depend on each other's modules. Host role sets are pinned with the contract. |
| Storage upgrades | A changed contract/installation schema is rejected by an old store instead of silently repinning it. | The next development installation uses a new private data directory; earlier stable stores remain untouched. |
| Identity | First administrator is initialized atomically through a one-use local bootstrap capability. Human sign-in uses a password; sessions expire after eight hours and are revocable. | Passwords require at least twelve characters. Only the administrator provisions other human identities. There is no pretend recovery flow or OAuth implementation. |
| Journeys with steps | Activity drafts persist, use revision checks and can branch on previous answers. Editing earlier answers invalidates dependent answers and prepared approval. Notes publishes a Guided note using the same create command as quick creation. | Final execution still uses the same canonical prepare/accept lifecycle; drafts are not permission to execute. The host and built artifact must agree on the installed activity catalog digest. |
| MCP | A real stdio adapter consumes the same agent exposure and canonical requests. Preparation and acceptance remain separate tools. | No alternate validators, object-data bypass or implicit acceptance. Activity tools are omitted when the host has no installed activity catalog. |
| Media | Extend the existing viewer, not introduce a second gallery. | The reference library provides image/video/audio playback in the same layout. Personal image import, rename, reversible Trash and Restore use canonical commands and private storage. Private audio/video import and album management remain separate work. |
| Execution queue | Isolated local-host queue with exact actor/environment binding, durable acknowledgement, per-actor limits and lease fencing. | Lost workers retain an uncertain permit instead of silently replaying a provider job. No real provider adapter or production enrollment is enabled. |
| Admission | Creation journeys explicitly reference their result read; component-authored Views are required at activity admission too. | No guessing from a single registered read or raw-View escape into the activity catalog. |
| Visual ownership | Toolbars and the workspace accept finite data, not caller-authored render slots. The declared workspace and catalog adapters select closed catalog owners. | Existing markup is preserved; exact page/search and toolbar/viewer screenshot comparisons cover 390 and 1280 pixels. |
| Private image import | Preserve the immutable original and generate bounded optimized WebP renditions. Each staged asset is bound to identity, operation and input; canonical acceptance attaches it atomically. | Private reads recheck published read authority and selection; URLs are short-lived local Blob URLs, never public asset paths. Rename/Trash/Restore do not replace or delete original bytes. |
| Storage quotas | The local private image host caps each upload at 20 MiB/80 megapixels, total originals at 1 GiB/1,000 files and each identity at 512 MiB/500 files. | Failed/unattached staging is conservatively charged. Trash does not free quota. No automatic purge or repair of an uncertain host lease. |
| Project labels | At most twelve unique labels of up to 64 Unicode code points each. Preserve case and ordering; trim only on explicit Add. | Canonical command validation rejects malformed arrays, surrounding whitespace, duplicates and excessive limits. UI affordances derive limits from that same input schema. |
| One product composition | Public compilation accepts only an admitted composed product. Builds and controller hosts obtain its View program from that exact composition; no program override or standalone renderer is installed. | A copied domain, forged composition or alternate navigation is rejected before host storage is created. Notebook exercises the same module architecture as VOID. |
| Shared connection observation | One View program shares a single controller-evidence observer across its read scopes. Subscriptions do not replay cached readiness, and expired evidence is invalidated. | Switching destinations does not multiply availability polling. Read refresh cancels superseded reads without replaying writes or replacing editor drafts. |
| Browser session ownership | Each protected browser instance binds requests and responses to its authenticated session, not only the shared cookie. A sign-in in another tab invalidates the old instance. | A draft from one identity must never execute under another identity after a cookie change. The binding is not a credential; the controller still authenticates and authorizes every request. |
| Direct manipulation | The shared surface-motion owner distinguishes gesture-driven position from its normal entrance endpoint. | A force-mounted navigation preview cannot retain a hidden/offscreen starting style after release. Normal opening, dismissal and reduced-motion preferences keep their existing rules. |

## Evidence obtained so far

- Notes runtime, ownership, edit conflicts, persistence and Trash/Restore tests.
- Tasks runtime, ownership, state guards, repeat acceptance and actual PostgreSQL
  outage/recovery without replaying a prepared command.
- Appearance in a real generated product build, both desktop and compact widths;
  preferences survive reload and apply to Visual catalog.
- Multi-controller host execution and per-role availability in real PostgreSQL;
  changing the installed role set fails closed.
- Persistent conditional activities, expired/cancelled/invalidated approvals,
  atomic rollback and a real HTTP lifecycle with an independent SQL witness.
- MCP protocol client/server interaction plus an independent stdio subprocess;
  canonical acceptance, receipt recovery and revocation remain enforced.
- Identity backend and HTTP tests for concurrent bootstrap, sign-in, revocation,
  private-data isolation, administrative provisioning and failed-sign-in limits.
- Real Notes Trash/Restore and mixed Media browser flows at 390 and 1600 pixels;
  existing image-gallery/Notes coexistence tests remain passing.
- The isolated queue's real PostgreSQL and deterministic child-process tests;
  no user's provider CLI was invoked to obtain this evidence.
- Protected host restart and failed-build cleanup without automatic identity creation.

Independent review rejected a proposed post-login Identity administration UI
because it bypassed the published journey catalog. That UI was removed; only
the SDK's trusted host administration API remains. Session bootstrap/sign-in/lock
are the access boundary, not undeclared product commands. Local lock now survives
reload even when server revocation cannot be reached. The generated VOID build
passed first-admin initialization, private Note creation, offline lock, reload,
unlock and server-confirmed lock; the test uses disposable credentials and storage.

Build `void-capabilities-20261022-d` compiled successfully. Product declaration
validation, TypeScript and 33 product tests passed. Svelte reported zero errors
and zero warnings. All 39 integrated browser cases passed, including the protected
identity lifecycle above. The two toolbar return-to-top pointer regressions found
in build c were corrected in the shared owner. The 320-pixel/200%-text shared
reading-inset mismatch was also corrected. Twenty-four targeted toolbar tests,
27 boundary tests and 66 canonical runtime tests passed. This is a qualified
local checkpoint, not a production release or full roadmap completion.

Build `void-capabilities-20261022-e` subsequently passed 41 integrated browser
cases, including private image import, optimized display, shared viewer zoom,
selection and reload at 390/1600 pixels. Source has advanced since that artifact:
Guided note, project labels and image rename/Trash/Restore require a new frozen
build before they are promoted to port 4400.

An exploratory full SDK run reported 1,251 passing and 22 failing tests while
the next label batch was being edited; it is not a reproducible release result.
It exposed a real nonvisual-source inventory escape and a real nonmodal Popover
Tab-exit failure. The inventory now checks every browser-client source, including
dormant/nested files; adversarial tests reject indirect DOM access. Popover uses
one stable internal panel identity for its trigger relationship, and focused
Tab/ShiftTab tests now pass. Other failures included stale inventory assertions,
generated authoring-reference drift and compile tests observing in-flight edits.
The integrated post-freeze run must supersede this exploratory result.

Build `void-capabilities-20261022-f` exercised 45 browser cases: 37 passed and
eight failed. This build was not promoted. The failures exposed a contradictory
Close/Back declaration in Guided note, a collapsing label-input layout after the
first addition, and stale test assumptions about collection publication and the
catalog entry count. The collection correctly withheld image references; its
detail read still published the authorized reference. The test now checks both
boundaries instead of expecting private image data in a text collection.

Diagnostic build `void-capabilities-20261022-g` passed the Guided note walkthrough
and private image Rename/Trash/Restore at both 390 and 1600 pixels. These four
cases are scoped evidence only. Additional work before the next qualified build
closes resolved-image leases on authority loss and refreshes authorized reads
while a controller remains available. Connected does not imply that an object's
previous version or its offered actions are still current. Refresh must never
submit, accept or replay an operation, discard an editor draft, or advance its
original edit base.

Build `void-capabilities-20261022-h` passed all 50 integrated browser cases and
40 product tests. Its full SDK run was stopped after a stale-selection refresh
test timed out; the suite did not pass and that artifact was not promoted.
The failure exposed an old read preventing a newer selection from progressing.
The read scheduler now supersedes pending read generations, abandons cancelled
read-only requests and prevents stale completions from replacing current data.
Additional regression cases cover a request arriving during drain finalization
and clearing a read while its begin request remains in flight.

The subsequent source migration removes the legacy human-product renderer and
its implicit scopes, not the approved shared primitives. Builds cannot accept a
second View program. The example Notebook now composes a module and authored
Views, with source validation before importing its declarations. Focused build,
host and protocol checks pass; VOID's 40 product tests also pass on this source.
The next complete SDK and browser runs must qualify the integrated artifact
before it replaces the running installation on port 4400.

Build `void-capabilities-20261022-i` now passes all 50 VOID browser cases and
40 product tests. Its manifest is version 3 and binds both the canonical operation
contract and the exact View program. Mounting another program with the same
operation contract fails before serving it. One browser expectation was migrated:
after navigating away from Notes, the held obsolete post-save read must be
cancelled, not return a response. The test still checks one accepted operation,
one stored note and uninterrupted Media navigation.

The full SDK run subsequently completed with 1,343 passing and 17 failing tests.
It exposed obsolete test fixtures missing
an explicit read scope or using a module-private dependency; their focused
migrations pass without changing presentation or ownership expectations. Separate
Notebook browser checks reproduced gaps not covered by VOID's 50 cases: draft
editing while preparation/acceptance is pending, and selecting another record
with a read panel already open. Those failures remain open at this checkpoint;
the current build has not been promoted or declared stable.

These are scoped test results, not a claim that the entire product or all native
platforms are qualified. Final build/browser results must be recorded below when
the integrated artifact is verified.

The next diagnostic pass closes draft editing during preparation/acceptance and
main-collection selection while a read panel is open. Panel continuity is owned
by the shared frame: semantic Close/Escape can return to the same subject,
keyboard focus is retained across temporary disabled states, and one suspended
reading position belongs to an opaque read-scope/subject identity, never a title
or content revision. These require the next frozen browser run; source completion
does not itself qualify them.

Activity acceptance now persists the exact pending intent before dispatch.
Unknown outcomes are receipt-recovery-only, cannot expose a second acceptance,
and correlate responses with the exact activity, plan and intent. The private
recovery journal is identity-scoped. An adversarial startup/navigation check also
found that an unresolved journal must be protected before the view model has
restored it; that correction is included in the next qualification candidate.

Shared browser checks passed all five compact-toolbar overflow cases, including
320×568 at 200% text. The body minimum uses the actual shared reading inset,
leaving the footer reachable without reducing text size. Landmark/heading fixes
also passed direct full-frame pixel equality at 390/1280 in light/dark. These
checks do not reset the approved visual baseline.

Build j's long VOID browser run is invalid: source changed after its renderer
fingerprint was sealed, and subsequent fixtures correctly rejected it with
`BUILD_RENDERER_MISMATCH`. It was not promoted. The next qualification holds
sources fixed through both compilation and the complete browser run.

Frozen build k passes all 53 VOID browser cases and all 40 product tests. The
independent Notebook/catalog run still exposes panel continuity defects: the
old keyed frame is already detached when its replacement effect reads focus
and scroll. The correction must retain those values while that frame is alive,
not infer them from the replacement DOM. Catalog migration passes 39/40 cases;
its remaining failure is the same Review Back focus defect. Native modal `inert`
and the browser accessibility tree are authoritative; locator counts alone do
not establish that an inert collection remains accessible.

All press/overflow assertions are passing in scoped k runs after migrating four
stale expectations: calendar date selection commits on key-down and closes;
wide controls use the existing 13px role while prose uses 16px; grouped rows are
owned by GroupedPanel; and a label switches to an icon when it actually overflows,
not merely because the viewport is compact. No presentation was changed to make
those assertions pass. The complete SDK k run was explicitly interrupted for
the remaining shared continuity fixes; it is not a full-suite pass.

Frozen build m passes 53/53 VOID browser cases, 40/40 product tests and admission
of all 85 product source files. Independent shared-catalog checks pass 40/40
inspection cases, 16/16 draft/focus/scroll continuity cases, 19/19 pressed-feedback
and compact-toolbar cases, and 24/24 shared-owner geometry, motion and parity
cases. These are separate suites, not one full-SDK qualification. Build m is not
yet promoted: recovery of an activity whose create response was lost needs to
reuse its persisted occurrence, not discover and adopt another draft.

The legacy Landmarks browser matrix reports 23/31 passing. Several failures use
obsolete detail selectors or encounter cancelled image requests; they remain
unqualified until individually examined. A CSS relocation probe also showed
small raster differences with identical sources, identical DOM and identical
CSS as its control. Exact computed-style and geometry equality is evidence;
that unstable raster probe is not a pixel-parity certification. No approved
image baseline or tolerance was reset to turn these results green.

The activity occurrence recovery now passes both lost-response regressions and
the canonical idempotency witness. Static authoring checks also reject extra
properties inside toolbar actions and undeclared outputs in top/bottom toolbars,
collections and stacks; runtime schema validation remains mandatory.

The catalog gesture investigation found a real shared-motion defect: the
force-mounted navigation retained `data-starting-style` after a successful
gesture, leaving it 64 pixels offscreen and transparent. The shared motion owner
now gives direct manipulation its own visible endpoint; full/reduced-motion
regressions cover tracking, reversal, cancellation, release and subsequent
normal button opening. The old catalog-local animation override was removed.

An independent identity audit then reproduced a cross-tab session race. A tab
could show identity A while shared cookies had changed to identity B; SQL
ownership still held, but a stale draft could be submitted under the wrong
displayed identity. This is a promotion blocker, not an acceptable polling delay.
The next candidate includes controller-enforced session binding and real two-tab
browser verification. The previously running installation remains unchanged
until that candidate is qualified.

## Not represented as completed

- Real-time collaborative Notes, participation, history and labels.
- Task-to-actor assignment and task conversations.
- Real account connections for GitHub, Resend, Railway or Apple Developer.
- Provisioned environments, production CLI enrollment, actual provider execution
  and its durable reconciliation/cancellation contract.
- Identity recovery and agent OAuth.
- Cross-identity assignment of dynamically created activities and an activity inbox.
- Private album organization, private audio/video ingestion and storage reclamation.
- Native iOS/Android/Linux binaries and reproducible public SDK publication.

External credentials, paid infrastructure and real provider jobs will not be
fabricated to make this list appear complete.
