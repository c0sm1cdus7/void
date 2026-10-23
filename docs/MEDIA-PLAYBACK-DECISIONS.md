# Media playback decisions and evidence

Historical record of the earlier sample-gallery increment. The approved
2026-10-22 private-library implementation supersedes its UX and unfinished-import
statements; see [Media](MEDIA.md) for the current contract. The executed evidence
below remains tied only to the older build explicitly named in this record.

Implemented under the owner's overnight mandate; this is the read-only local
Media increment, not a claim of a writable cloud library or native releases.

## Installed anatomy

- `media.library.ts` declares a single ordered `items` union: image, video or
  audio. Albums refer to those items; image/video/audio copies are not stored
  in competing arrays. The SDK rejects missing references and invalid covers.
- Images retain the approved card, cover carousel, zoom/pan/swipe and focus-return
  owners. Videos and audio enter the same viewer, not a new modal or product renderer.
- Timed media uses native playback with explicit Play, Pause, seek/time,
  volume/mute and supplied captions. No autoplay or background audio.
- Changing selection or closing pauses the old player and removes its source.
  Native decode/network errors display a recoverable error; loading stays silent.
- The toolbar stays the shared `ToolbarLayout`. Its existing top geometry is
  unchanged. The bottom toolbar wraps thumbnails on compact widths rather than
  shrinking the controls. Its Slider is an installed shadcn primitive, with the
  shared pane material and an accessible 44px interaction area.
- Album cards open albums. The previously approved header action still opens
  its cover gallery; switching that action to album navigation is not included.
- Original source files remain intact. Image/poster renditions use the existing
  hash-keyed WebP pipeline. Video/audio transcoding and codec negotiation are not
  claimed. The Studio sample is original, silent video plus synthesized audio;
  the Apple reference photographs remain external and must not be published.

## Executed verification

Against `build/void-capabilities-20261022-b` on 2026-10-22:

- `tests/web/media-playback.test.ts`: 2/2 at 390px and 1600px. Actual generated
  WebM/WAV playback, no autoplay, pause, seeking, volume, captions, source release,
  compact layout and Escape lifecycle. No browser runtime errors.
- `tests/web/media.test.ts`: 4/4, including the photo viewer's zoom/arrows/focus,
  album navigation, and a note surviving Media navigation and reload.
- `tests/web/notes-trash.test.ts`: 2/2, reviewed Trash and restored original note
  identity/content at both widths.

After that build, an isolated geometry assertion caught a new Slider track
collapsed by registry shorthand selectors unsupported by the installed Bits UI.
The shared primitive now uses the actual `data-orientation` attribute. The new
assertion failed before the fix; `desert/tests/media-playback-browser.test.ts`
then passed 3/3, including both sizes and error/Retry. A further regression test
found that different queue entries sharing an asset retained playback position;
the canvas is now keyed by queue position plus source, not source alone. That
test failed before the fix and the complete file then passed 4/4. The product build must be
regenerated to include these final corrections.

The card's single-use snippet was removed rather than granted an exception.
The viewer is registered as a private composition: only internal lexical slots
are admitted, never caller rendering or native attribute overrides. Its new
playback/artwork owners are closed. Seven media/Slider sources were individually
classified with empty finding allowances, leaving historical debt unchanged.
`media-visual-boundary.test.ts`, `web-catalog-manifest.test.ts` and the visual
ownership parity checks passed 11/11, including negative slot/style injection.

Additional SDK browser checks passed: photo-header regression 2/2, nested panel
gallery 2/2, and media/inspection ownership parity 3/3. The parity check compares
DOM anatomy and exact screenshots against the retained layout fixture; its
data wiring was adapted to the new media union, not its markup or styles.

Local evidence is in `.local/web-evidence/` and `desert/artifacts/media-playback/`.
Screenshots containing Apple reference photographs are local evidence only.

## Import boundary: what exists and what does not

Existing SDK pieces are reusable but do not constitute an upload pipeline:

1. `FileControl` and `LocalFileHost` select browser files with count/size/type
   metadata limits. Handles are ephemeral. Metadata checks do not inspect bytes,
   upload content or grant storage authority.
2. `bindCatalogAssets`/`bindLocalMedia` bind an explicit host file allowlist,
   reject unsafe paths/symlinks and attest hashes. These are read-only local
   reference bindings, not user-owned assets.
3. The existing rendition pipeline safely decodes bounded images and produces
   hash-keyed WebP variants without replacing originals.
4. `localMediaHandler` serves already-attested immutable bytes, ranges and ETags.
   It does not perform per-identity private-library authorization.
5. Commands currently accept declared scalar facts, not binary upload handles;
   the Media view currently embeds a static typed library rather than an
   authority-backed live Media/Album collection.

Real imports need one shared SDK capability: an authenticated streaming upload
staging service with quotas and byte validation; durable content-addressed
storage; identity ownership/access checks; typed staged-asset references admitted
by a command and receipt; orphan cleanup and recovery; authoritative Media/Album
reads; and authorization on downloads/renditions/ranges, including revocation.
Video posters/transcoding also need an explicit installed execution provider.
Importing private bytes into the current public-reference route would bypass
those rules, so this increment does not display a misleading Import action.
