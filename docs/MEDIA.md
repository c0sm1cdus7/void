# Media

Current product contract after the approved walkthrough of 2026-10-22. Earlier
sample-gallery decisions in `MEDIA-PLAYBACK-DECISIONS.md` are historical evidence,
not the installed product UX. Exact executed build/test evidence is tracked in
the walkthrough delivery record; a test's presence is not evidence it passed.

## One private library

The destination is **Media**. It reads the identity's real collections and media;
it does not mount the old continent/Studio sample gallery or a second “My images”
destination. A visible content header owns its title; the shared toolbar takes
over only after the header scrolls away.

The only creation entry is `+`. It opens the native file chooser directly,
filtered to installed formats. Cancelling creates no draft or activity. After
choosing a file, an explicitly transient (never docked) surface provides
presentation, optional description and collection membership. Images have no
title field. Collections have names and may contain images, video and audio.

Opening a collection navigates to its main content page. Its editor is reached
inside that collection; a media item's editor is reached inside its viewer.
Closing a member returns to the originating collection. Native selection begun
inside a collection initializes that collection in the new media draft, but a
late chooser result cannot apply after its origin changes.

## Canonical storage and editing

`PrivateImage` retains its historical object ID and hidden legacy `title` fact
for data compatibility. New imports store an empty legacy title; user-facing
cards, viewers and search never render it. `image` holds the canonical private
asset reference, including the server-verified media discriminator for new
mixed-media uploads. Metadata editing changes `fit`, `description` and
`collections`, never replaces or rewrites the binary.

`MediaCollection` owns `title`, `layout` (`grid` or `list`) and optional `cover`.
The one source of membership truth is `PrivateImage.collections`; the collection
page uses an admitted inverse relation, not a second independently stored list.
Cover choices are authorized, active image members of that collection. The
default cover is its first available image; video/audio-only collections use the
shared neutral artwork state. Removing a selected cover member clears the cover
draft back to automatic.

Membership checkboxes are local draft changes. **Cancel writes nothing.** Save
first accepts the collection metadata through its canonical command, then saves
changed memberships through their version-bound commands. This is deliberately
not described as an atomic multi-object transaction: if interrupted, the editor
stays open, confirmed changes are retained, and explicit recovery continues only
unfinished operations. An uncertain acceptance checks the same receipt/intent;
successful writes are not replayed. Closing or editing a partially saved draft
is blocked until the operation is resolved. Identity/availability loss revokes
private pixel authority even while the recoverable operation is retained.

Move to Trash uses shared confirmation; Restore uses the undo icon. Trash and
restore preserve asset bytes and references. They neither purge files nor reclaim
quota. Ownership and active/trashed read predicates remain canonical.

## Private files and playback

The installed bounded pipeline accepts JPEG, PNG, WebP, MP4 (H.264 video/AAC
audio), MP3 and WAV, with a 20 MiB per-file limit. The chooser filter is not a
security check: the server validates bytes, metadata, codecs, quotas and the
authorized run/input before accepting a durable reference. Original bytes are
preserved. Images get bounded metadata-free WebP renditions; timed media is
served as the original and is not transcoded. Codec playback still depends on
the browser; unsupported/decode failures remain explicit.

Every original/rendition request checks the authorized read, identity, published
field and accepted link. Scoped object URLs are revoked on closure, authority
loss and disposal. Late responses cannot replace a newer item's pixels. Private
bytes never enter the old public sample-media route. The CSP admits only same-
origin and local blob media sources, without opening arbitrary remote playback.
Browser byte reads share a bounded two-transfer queue, below the host's four-read
limit. Waiting reads retain cancellation and a total deadline; temporary transfer
contention retries only the same authorized GET. Session ownership is checked
again before every request and after bytes arrive. No private-byte cache is added.

Video/audio use the shared viewer's explicit play/pause, seek and volume/mute
controls, with no autoplay or background playback. Closing pauses the player and
releases its source. All media rendering, forms, collections, cover selectors,
membership selectors, responsive behavior and attention markers are closed SDK
owners represented in the visual bank; VOID supplies typed declarations, no CSS
or custom drawing callbacks.

## Compatibility and deliberate limits

Existing private-image records require only additive defaults: `fit="fill"`,
`description=""`, `collections=[]`. Legacy titles/assets/identities remain
unchanged. Any store upgrade must use the documented isolated migration path;
the live user store must not be reset or repinned to make a build appear healthy.

Nested collections, video poster generation/transcoding, user-authored captions,
background playback, permanent deletion and quota reclamation are not implied
by this increment. Binary import is human-only until an actual agent acquisition
capability is installed. Native OS/browser coverage is reported separately from
the tested Chromium flows.

The shared metadata form currently exposes “Thumbnail fit” for every media kind;
it affects image thumbnails only, not audio/video playback. Hiding it by media
kind needs an admitted conditional-form contract, which does not exist yet. No
product-specific conditional rendering or alternate form was added to bypass the
visual bank. This is a known secondary-form limitation, not a playback control.

Canonical coverage lives in `tests/media-collections.test.ts`,
`tests/private-media.test.ts`, `tests/media-lifecycle.test.ts` and
`tests/media-navigation-runtime.test.ts`. Browser coverage includes native file
entry, transient imports, collection Save/Cancel, authorized loading/revocation,
private audio/video playback, search and lifecycle at narrow and wide widths.

The old Apple reference photographs remain local-only visual references. Their
software sample license does not relicense the photographs for publication.
