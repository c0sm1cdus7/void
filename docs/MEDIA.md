# Media destination

Owner direction recorded on 2026-10-20. This is a product requirement and design
proposal, not an installed library or playback implementation.

## Preserve the approved anatomy

Bring the Landmarks browsing experience into VOID as **Media**. Preserve the
approved surface, shared header, title/subtitle docking, cover carousel, titled
horizontal collections and media viewer. Do not revive a separate Hero
primitive or copy Landmarks product code into VOID.

The owner clarified that "capas" means **covers/artwork**, not stacked layers.
The header presents covers of child albums. Content also groups items by
Videos, Music (with cover artwork) and Images. Albums organize content;
media types classify the same items, without duplicating stored assets.

The existing ordered roadmap still starts with Notes. Media is an additional
destination; its implementation priority relative to System and later verticals
has not been changed.

## Navigation proposal

- A child-album cover opens that album, rather than unexpectedly opening its
  cover image as if it were the album's content.
- An individual media item opens the shared viewer at that item.
- Closing the viewer returns to the originating album/collection and position.
- The viewer's thumbnail sequence comes from the collection that opened it,
  not an unrelated global queue. Mixed collections retain their explicit order.
- Album ancestry is independent of media type. Cycles, empty albums and a
  cover reference that becomes inaccessible need explicit shared validation.

The first bullet changes the old header-photo action and is a proposal to
confirm, not a consequence inferred from identical geometry.

## One media viewer

Use one shell for images, video and audio:

- Top dock: Close first, then title and secondary information/count.
- Canvas: a contained image, video at its native aspect ratio, or audio cover
  artwork. No stretching or fabricated cover image.
- Bottom dock: one thumbnail strip, with capability-appropriate media controls
  alongside it. Photo zoom remains available; timed media adds play/pause,
  seek/time and volume controls. Captions are available when supplied.
- On compact widths, the same bottom dock can allocate a second row instead
  of shrinking controls, clipping the strip or creating another viewer design.
- Keyboard, pointer and touch offer equivalent actions. Do not rely only on
  swipes; preserve focus return and a discoverable way to close.

No automatic audio playback. Changing the selected media stops the old playback
before preparing the next item. Closing stops playback unless a separate
background-playback contract is explicitly introduced later.

Preserve silent neutral loading and identity-keyed readiness: never show a
previous item's pixels while a new item is pending. Failures must remain
distinguishable from an indefinitely empty canvas and offer recovery.
Preserve originals; generate appropriately sized image previews/thumbnails and
video posters. Audio uses supplied artwork or the shared missing-artwork state.
Caching/prefetch must respect authority and network/device constraints.

## SDK ownership and gaps

VOID provides authorized album/item data and typed intents. DESERT owns the
catalog components, layout, playback state, gestures, loading, rendition policy
and responsive rules. No product-defined CSS, callbacks that draw, styling
overrides or competing image/video/audio viewer compositions.

Required shared contracts, not yet installed:

1. Album identity, child references, ordered item references and explicit cover.
2. Discriminated media items: image, video and audio, with typed sources,
   available renditions/artwork and playback capabilities.
3. Reusable Media/Album views and journeys using the closed view contract.
4. One generalized viewer composition and shared bottom media toolbar.
5. Playback lifecycle, seek/duration, audio/volume, captions and input parity.
6. Library persistence, imports, access policy and deletion/revocation behavior.

The current SDK viewer accepts photos only. Header video support is not a
mixed-media viewer. Local human/agent session tests do not prove this destination,
MCP/API support, media playback or native behavior.

## Asset rights and community

The Apple Landmarks sample's software license excludes its photographs.
Do not publish those photographs, generated derivatives or screenshots containing
them in VOID under MIT. Preserve the local visual reference; use owner-provided
or independently verified redistributable fixtures for a public demo.

VOID's MIT license does not relicense DESERT or third-party media. A local
mockup is not evidence of public distribution rights.
