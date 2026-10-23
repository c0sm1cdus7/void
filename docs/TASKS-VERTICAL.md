# Tasks vertical

`src/modules/tasks/tasks.module.ts` publishes an independent personal task module.
It does not depend on Notes, Media, Home, or any product navigation policy.

## Installed contract

- Task owns a title (1–200 characters), details, references to private Projects, `open`/`completed` status and identity owner.
- Create assigns the current identity and starts open. Input cannot override owner or status.
- Read publishes title, details, Projects and status, never owner; collection rows publish title and status.
- Edit preserves identity, status and owner, and requires the editor's original record revision.
- Complete only accepts an open task. Reopen only accepts a completed task.
- All mutations use canonical controller admission, preparation and atomic acceptance; repeated acceptance is idempotent.
- The object publishes its detail View and Edit action. Complete/Reopen are the two choices of its named Status selector, not ambiguous toolbar shortcuts. Offers follow current state and controller availability.

The Tasks View lists the authorized task titles and statuses. Home has its own
published summary and attention feed; an open task is not automatically an
attention signal. The editor prefers the right dock
and uses the existing adaptive surface on smaller screens. Views use only the typed
SDK `Components` catalog; no task-specific CSS, renderer or visual overrides exist.

## Projects are private canonical objects

`Task.projects` is the SDK's `references(Project, {label: 'name', color: 'color'})`
field, assigned through `fromInput` in Create/Edit. It stores Project IDs, not
free-text names or serialized display labels. A Project has a name (1–64
characters), a color from the published palette and an identity owner.
ReadProjects and CreateProject are real exposed journeys. The shared selector
loads authorized choices, renders their names and color bullets, and creates a
Project through the canonical companion command. Color supplements the name; it
never replaces it.

An explicit empty array means no Projects. Missing/null inputs are invalid; no
CSV or JSON-string interpretation exists. The controller validates the authorized
target objects, not just the shape of a UUID. Complete/Reopen preserve the exact
selected references. Projects do not imply an environment, actor, shared task
permission or execution queue. This contract does not currently publish Project
editing, deletion or archival commands.

## Reading and editing

The body uses the shared multiline editor and readable paragraphs, preserving
newlines, whitespace and user casing. Known-empty body/Projects are omitted from
the read view; an unavailable or unknown value is not misrepresented as empty.
Properties and the Status selector share one semantic group after the content.
The shared row owner reflows at narrow widths or enlarged text without changing
the stored content. State changes remain reversible through the same selector.

The presentation refinement does not add facts, enlarge collection read
authority, change mutation contracts or migrate an existing store. In particular,
collection rows still publish only title/status, not body or Project membership.

## Verification scope

`tests/tasks.test.ts` exercises standalone module composition and real temporary
PostgreSQL controllers: human/agent parity, create/edit/status transitions, repeat
acceptance, invalid input, original-revision conflicts, and identity isolation.
`tests/tasks-projects.test.ts` covers canonical Project creation, authorized
references, limits, exact receipt replay and explicitly clearing membership.
`tests/tasks-recovery.test.ts` proves references remain intact across controller loss
without replaying the pending mutation.
`tests/web/tasks.test.ts` exercises the installed product at 390px and 1600px when
run against an up-to-date VOID build and its real multi-role host.

## Not installed here

Actor assignment, task conversation, deadlines/reminders, task dependencies,
environment queues, execution limits and the VOID CLI provider bridge remain
separate capabilities. Their policies and data contracts must be defined before
installation. Completing a personal task does not execute an agent or claim
remote work was performed.

An already-open ordinary draft is retained in session memory when connectivity
is lost. It is not a persistent offline draft, an offline write queue or an
automatic reconnect submission. Persistent local drafts require an explicit
identity-scoped storage, expiry, recovery and privacy contract; that capability
is not implied by the current editor.
