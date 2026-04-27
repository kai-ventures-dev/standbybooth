# 07 · Storage — destinations, formats, sidecar metadata

Standby Booth never sees the recordings. Every file lives on the host's
hardware: their iPad, their USB-C drive, their Photos library. Where
recordings go is a Storage tab setting, configured once.

## The four destinations

### A · Photos library *(free, default)*

- Saves via `PHPhotoLibrary` to the Photos app
- Visible in the iPad Photos app like any other video
- Easy to AirDrop to Mac in bulk afterward
- No folder structure — Photos handles organization

**When to use:** casual hosts, single events, "I just want them in Photos."

---

### B · Local Documents *(Pro)*

- Path: `/Documents/StandbyBooth/[EventName]/[Date]/`
- Visible in the iPadOS **Files app** under "On My iPad → Standby Booth"
- Bulk-export options:
  - AirDrop a folder to Mac
  - USB-C cable + Files-on-Mac
  - Drag from Finder via "Devices → iPad" in macOS Finder

**When to use:** organizers who want a clean per-event folder structure
without buying a USB drive.

---

### C · USB-C external drive *(Pro)*

- Admin connects USB-C drive → "Select USB Drive Folder" → native iPadOS file picker
- **Security-scoped bookmarks** (`UIDocumentPickerViewController`) maintain write access across app restarts
- Recordings written to chosen folder during the event
- If drive disconnected mid-event: **falls back to local storage**, alerts admin

**When to use:** professionals who deliver clips to clients on a thumb
drive, or who prefer external storage for capacity / archival reasons.

---

### D · Google Drive *(post-launch · "coming soon")*

> Marketed on the paywall as **coming soon, included with Pro at no extra
> cost when released.**

- Admin pastes a shared folder URL in admin panel
- One-time Google Sign-In OAuth in admin panel
- Refresh token stored in **Keychain** (not UserDefaults — security)
- After "Keep It": background upload of `.mp4` + `.json` to the linked folder
- **Upload queue with retry.** If WiFi drops, recordings queue locally and upload on reconnect
- Local copy retained until Drive upload confirms success
- Built on Google Drive API v3 + GoogleSignIn + GoogleAPIClientForREST Swift SDKs

---

## File output

### Video file

```
filename:  {EventName}_{Date}_{Sequence}.mp4
codec:     H.265 / HEVC video
audio:     AAC 128 kbps
container: .mp4
```

**Example:** `Smith-Wedding_2026-04-26_017.mp4`

The naming template is admin-configurable on Pro. Free is locked to
`StandbyBooth_{Date}_{Sequence}.mp4`.

**Tokens:**

| Token | Replaces with |
|---|---|
| `{EventName}` | Sanitized event name (alphanumeric + dash) |
| `{Date}` | ISO-style YYYY-MM-DD |
| `{Sequence}` | Zero-padded counter, increments per event (001, 002, …) |

### Metadata sidecar (Pro)

For every `.mp4`, a matching `.json` sidecar:

```json
{
  "id": "5C9F1A2B-…",
  "timestamp": "2026-04-26T19:42:08Z",
  "eventName": "Smith Wedding",
  "duration": 47.3,
  "qualitySetting": "standard1080p",
  "promptsShown": [
    "What's your favorite memory of the bride?",
    "Any advice for the newlyweds?"
  ],
  "sequenceNumber": 17,
  "extensionsUsed": 1,
  "appVersion": "1.0 (build 3)"
}
```

The sidecar is the bridge to whatever post-production system the host
uses. A wedding videographer can grep the JSON files for prompts shown,
sort by duration, etc.

The sidecar is **off by default for free** and **on by default for Pro**.

---

## Storage estimates

| Quality | Resolution / fps | ~Size per minute | 100 × 60s recordings |
|---|---|---|---|
| Economy | 720p @ 30fps | ~30 MB | ~3 GB |
| Standard | 1080p @ 30fps | ~60 MB | ~6 GB |
| High | 1080p @ 60fps | ~90 MB | ~9 GB |
| Ultra | 4K @ 30fps | ~190 MB | ~19 GB |

Free is locked to Economy (720p). A free-tier event with 100 guests fits
on a stock iPad with no concern.

A pro event at 4K with 200 × 90s recordings uses ~57 GB — recommend USB-C
drive at that scale.

---

## Critical invariants

These rules are enforced in the code; design must respect them:

1. **Always write to local temp first**, then copy to final destination.
   Never write directly to Google Drive / USB during the recording itself
   — the camera pipeline cannot block on remote/removable I/O.

2. **Mirror preview, save non-mirrored.** The Camera preview appears
   selfie-mirrored to the guest. The saved file is not mirrored — text
   in the recording reads correctly.

3. **Refresh tokens go in Keychain.** Google Drive credentials never live
   in UserDefaults. Keychain access uses
   `kSecAttrAccessibleAfterFirstUnlock` so tokens survive uninstall.

4. **All analytics are local.** No telemetry. No analytics SDK. No
   network call for tracking. The "analytics dashboard" is an aggregate
   of Core Data rows the iPad wrote itself.

---

## Storage Capacity Dashboard (admin)

The Storage tab shows a **capacity dashboard** with:

- Total storage used by the app (`Documents/StandbyBooth/`)
- Free space remaining on the device
- Recording count per event
- Largest event by size

This is read-only — the dashboard surfaces info, doesn't manage it. The
host deletes events via the Files app on iPad or via Finder on Mac.

---

## Privacy posture

Standby Booth handles video of identifiable people. Our posture:

- **No data leaves the iPad** unless the admin configures Drive / sharing.
- **AirDrop and QR transfers are peer-to-peer** over local WiFi.
- **No analytics, no telemetry, no remote logging.**
- **Refresh tokens** for Drive (post-launch) live in Keychain, not on disk.
- **No advertising SDKs.** No third-party SDKs at all except GoogleSignIn (when admin opts into Drive).

The Privacy Policy at `standbybooth.app/privacy` formalizes this. The
copy is short and uses plain language because there's not much to
disclose.
