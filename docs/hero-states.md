# Hero State Machine — Reference

**Total states:** 6 (0 – 5) | **Total frames:** 481 (0 – 480)  
**States 0–3:** Auto-scroll (accumulated delta, scroll locked). User scrolls to advance.  
**State 4:** Auto-scroll (pure canvas sweep 240→360). When complete, Lenis activates automatically.  
**State 5:** Lenis-driven manual scroll (frames 360→480). Hero section scrolls out naturally at frame 480.  
**Frame rate:** 60 fps for auto-scroll segments (~2s per 120-frame segment).  
**Scroll threshold:** 50 px accumulated `deltaY` before triggering a state transition.  
**Scroll window:** After a transition starts, a 600ms grace window ignores all scroll input. Past the window, only an intentional re-scroll (detected by a 200ms pause in wheel events) triggers a skip. Continuous trackpad momentum is ignored. After any transition, a 500ms cooldown prevents momentum from chaining into the next state.

---

## State 0 — Canvas + Headline + Navbar
**Frames:** hold 0  
**Trigger:** Page load / initial mount  
**Canvas:** static at frame 0

| Direction | Elements |
|-----------|----------|
| IN | `seg1-headline` ("The Physical World is your Playground") — already visible (instant, duration 0) |
| IN | `navbar` — already visible (instant, duration 0) |
| OUT | *(nothing)* |

Notes: `applyInstant('state0')` snaps all registered elements to their initial positions. Headline and navbar are visible from the very start — no fade-in animation.

---

## State 1 — Physical World
**Frames:** hold 0 (no canvas movement)  
**Trigger:** First scroll down  
**Events fired:** `propheus:state1`  
**Canvas:** static at frame 0 (components animate in over a still canvas)

| Direction | Elements |
|-----------|----------|
| STAY | `seg1-headline` — remains visible |
| STAY | `navbar` — remains visible |
| IN | `sp-topo` (PlacesCard) — signal pointer sequence (**baseDelay 1.3s**) |
| IN | `sp-weather` (WeatherWidget) — signal pointer sequence (**baseDelay 2.6s**) |
| IN | `StoreMapMarkers` — self-managed via `propheus:state1` event (Framer Motion stagger) |
| IN | `DemographicsWidget` — self-managed via `propheus:state1` event (bottom-center overlay) |

Notes: No canvas motion — frame stays at 0. Components stagger in over the still canvas. Since there is no auto-scroll, snapping UI on interrupt finalizes the state immediately.

---

## State 2 — Intelligence Layer
**Frames:** 0 → 120  
**Trigger:** Second scroll down  
**Events fired:** `propheus:state1:exit` (when leaving state 1)  
**Canvas:** playing (frame sweep 0 → 120, ~2s at 60fps, starts after 0.3s UI lead time)

| Direction | Elements |
|-----------|----------|
| IN | `sp-sentiment` (SentimentPieChart) — signal pointer sequence (**baseDelay 0.8s**) |
| IN | `sp-competitor` (CompetitorCard) — signal pointer sequence (**baseDelay 2.0s**) |
| IN | `sp-promo` (PromoWatchCard) — signal pointer sequence (**baseDelay 3.2s**) |
| OUT | `seg1-headline` — fadeOut (0.4s) + slideUp 20 px (0.4s) |
| OUT | `navbar` — fadeOut (0.5s) |
| OUT | `sp-topo` — all 4 parts (dot/line/panel/content) fadeOut + collapse (0.55s) |
| OUT | `sp-weather` — all 4 parts fadeOut + collapse (0.55s) |
| OUT | `StoreMapMarkers` — self-hides via `propheus:state1:exit` |
| OUT | `DemographicsWidget` — self-hides via `propheus:state1:exit` |

Notes: First canvas motion begins. Scrolling during this state snaps components but user must wait for the frame sweep (0→120) to finish before the next state can begin.

---

## State 3 — Traffic & Footfall
**Frames:** 120 → 240  
**Trigger:** Third scroll down  
**Canvas:** playing (frame sweep 120 → 240, ~2s at 60fps)

| Direction | Elements |
|-----------|----------|
| IN | `sp-traffic` (TrafficFlowChart) — signal pointer sequence (**baseDelay 0.8s**) |
| IN | `sp-footfall` (FootfallCard) — signal pointer sequence (**baseDelay 2.0s**) |
| OUT | `sp-sentiment` — all 4 parts fadeOut + collapse (0.55s) |
| OUT | `sp-competitor` — all 4 parts fadeOut + collapse (0.55s) |
| OUT | `sp-promo` — all 4 parts fadeOut + collapse (0.55s) |

---

## State 4 — Pure Canvas Sweep
**Frames:** 240 → 360  
**Trigger:** Fourth scroll down  
**Canvas:** playing (frame sweep 240 → 360, ~2s at 60fps)

| Direction | Elements |
|-----------|----------|
| IN | *(none — pure canvas animation)* |
| OUT | `sp-traffic` — all 4 parts fadeOut + collapse (0.55s) |
| OUT | `sp-footfall` — all 4 parts fadeOut + collapse (0.55s) |

Notes: No new components appear. Previous signal pointers fade out. Canvas plays through frames 240–360. When the canvas finishes, Lenis scroll mode activates automatically — the user does not need to scroll again.

---

## State 5 — Lenis Scroll
**Frames:** 360 → 480 (manual scroll)  
**Trigger:** Automatic (activates when state 4 canvas reaches frame 360)  
**Scroll mode:** Lenis-driven linear frame mapping

| Direction | Elements |
|-----------|----------|
| IN | *(no UI elements — pure canvas scroll)* |
| OUT | *(nothing — state 4 already cleared all components)* |

Notes: Auto-scroll lock disengages. Hero section height expands to `100vh + 2000px` to create scroll room. `.hero-sticky` becomes `position: sticky; top: 0` so the canvas pins while the user scrolls. Scroll position linearly maps to frames 360→480 (120 frames over 2000px scroll distance).

**Smooth exit:** When the user scrolls past the Lenis zone (progress ≥ 1, frame 480), the hero section is NOT abruptly reset. Instead, the navbar fades back in and the hero section naturally scrolls out of view via CSS sticky behavior — the sticky element unsticks when the container bottom reaches the viewport, producing a seamless transition to the rest of the page.

### Reverse behaviour
Scrolling back to `scrollY === 0` during Lenis mode triggers a reverse auto-scroll from frame 360 to 240, entering state 3 with traffic/footfall components animating in. From there, normal reverse state transitions play in order (3→2→1→0).

### Re-entry from below
Scrolling the page back up so `scrollY` re-enters the Lenis zone (0–2000px range) naturally resumes frame mapping. Scrolling back past the Lenis zone hides navbar again. Scrolling all the way to `scrollY === 0` triggers the 360→240 reverse animation into state 3.

If `_onScrollBack` detects `scrollY === 0` after the hero was fully scrolled past, it re-enters Lenis scroll mode at state 5 (frame 480).

---

## Scroll Window

When the user scrolls during an active transition, a momentum-aware system prevents accidental state skipping:

1. **Grace window (600ms):** All scroll input is silently ignored. This absorbs the burst of wheel events that trackpads / Magic Mouse send from a single flick gesture.
2. **Gap detection:** Past the grace window, the system checks for a 200ms pause in wheel events. Continuous events (gap < 200ms) are treated as trackpad momentum and silently ignored. Only a deliberate re-scroll after a pause triggers the skip.
3. **Skip:** When intentional re-scroll is detected, all GSAP tweens on registered elements are killed (`killAllTweens`), then elements snap to their destination via `applyInstant()`. The canvas tween keeps playing at normal 60fps; the transition finalizes when the canvas finishes. For states without canvas motion (0→1), this finalizes immediately.
4. **Post-transition cooldown (500ms):** After any transition ends, continuous wheel events (gap < 200ms) are ignored. Only events after a 200ms pause can start a new transition. This prevents trackpad momentum from chaining states.
5. **Orphan protection:** Every `runTransition` call begins with `killAllTweens()` on all registered elements, nuking any stale delayed tweens from previous transitions. `finalizeTransition` explicitly kills active timelines before nulling references. This prevents the scenario where a long-delayed show animation (e.g. promo at 3.2s baseDelay) fires after the transition has ended and re-shows a component during a later state.

Touch and keyboard inputs are not affected by gap detection or cooldown — they have no momentum problem. `handleScrollDuringAnimation(wheelGap)` defaults to `Infinity` for these inputs, always passing the gap check.

---

## Custom Events

| Event | Fired When | Listeners |
|-------|-----------|-----------|
| `propheus:state1` | Entering state 1 (forward) | `StoreMapMarkers`, `DemographicsWidget` — show |
| `propheus:state1:exit` | Leaving state 1 (any direction) | `StoreMapMarkers`, `DemographicsWidget` — hide |

---

## Signal Pointer Anatomy

Every signal card (`sp-*`) follows the same 4-part DOM structure and staggered animation sequence, orchestrated by the `registerPointer()` helper:

```
DOM:  .sp-{name}
        ├── .sp-{name}-dot
        ├── .sp-{name}-line
        ├── .sp-{name}-panel
        │     └── .sp-{name}-content

Animation IN (offsets are relative to baseDelay):
  dot     →  fadeIn (0.45s) + glowPulse scale 1.4 (0.5s) → settle to scale 1 elastic (0.55s, +0.1s)
  line    →  scaleY draw from 0 → 1 (0.85s, starts at +0.52s)
  panel   →  fadeIn + slideDown + scaleUp to 1 (0.9s, starts at +1.0s)
  content →  fadeIn + slideDown (0.75s, starts at +1.25s)

Animation OUT (all simultaneous, 0.55s):
  dot     →  fadeOut + scaleDown to 0.8
  line    →  scaleY collapse to 0
  panel   →  fadeOut + slideDown 10px + scaleDown to 0.97
  content →  fadeOut + slideDown 12px
```

### Signal Pointer Instances

| ID prefix | Component | Show state | Hide state | baseDelay |
|-----------|-----------|:----------:|:----------:|:---------:|
| `sp-topo` | PlacesCard | 1 | 2 | 1.3s |
| `sp-weather` | WeatherWidget | 1 | 2 | 2.6s |
| `sp-sentiment` | SentimentPieChart | 2 | 3 | 0.8s |
| `sp-competitor` | CompetitorCard | 2 | 3 | 2.0s |
| `sp-promo` | PromoWatchCard | 2 | 3 | 3.2s |
| `sp-traffic` | TrafficFlowChart | 3 | 4 | 0.8s |
| `sp-footfall` | FootfallCard | 3 | 4 | 2.0s |

---

## Frame Map Summary

| State | Hold / Range | Canvas Motion | Duration |
|-------|-------------|---------------|----------|
| 0 | frame 0 | static | — |
| 1 | frame 0 | static | — |
| 2 | 0 → 120 | auto-scroll | ~2s (120 frames × 1/60) |
| 3 | 120 → 240 | auto-scroll | ~2s (120 frames × 1/60) |
| 4 | 240 → 360 | auto-scroll | ~2s (120 frames × 1/60) |
| 5 | 360 → 480 | Lenis scroll | user-controlled (2000px scroll distance) |

Auto-scroll frame sweep uses `power2.inOut` easing. Advancing forward adds a 0.3s UI lead time before the canvas tween starts. Lerp smoothing (`currentFrame += (targetFrame − currentFrame) × 0.1`) filters the rendered frame.

---

## Scroll Lock Behaviour

| Event | Action |
|-------|--------|
| Page load | Lock at state 0, frame 0. `window.scrollTo(0,0)`, overflow hidden, Lenis stopped. |
| State 4 complete (frame 360) | Lenis scroll mode activates automatically. No extra scroll needed. |
| Frame 480 reached (scroll progress ≥ 1) | Navbar fades in. Hero stays expanded — natural scroll continues. CSS sticky element unsticks at container edge. |
| User scrolls back to `scrollY === 0` (from below hero) | Re-enters Lenis scroll mode at state 5 (frame 480). |
| Scroll back to top of Lenis zone (`scrollY === 0`) | Exits Lenis mode. Animates 360→240 (reverse into state 3 with components). |
| Reverse to state 0 | User at idle, no further reverse possible. |
| Scroll during auto-scroll | Grace window (600ms) → gap detection (200ms pause required) → skip UI (canvas keeps playing). |
| Scroll during no-motion state (0→1) | Same system; skip finalizes immediately. |
| Scroll after transition (momentum) | 500ms cooldown; continuous wheel events ignored until 200ms pause. |

Input methods: wheel (`deltaY`), touch (swipe), keyboard (Arrow/Space/Page keys).

---

## Navbar Visibility

| State | Navbar |
|-------|--------|
| 0 | Visible (instant) |
| 1 | Visible (stays) |
| 2 | Hidden (fadeOut 0.5s) |
| 3 | Hidden |
| 4 | Hidden |
| 5 | Hidden |
| Past hero (scroll progress ≥ 1) | Visible (gsap fadeIn 0.5s) |

---

## UI Components per State (visibility)

| Component | State 0 | State 1 | State 2 | State 3 | State 4 | State 5 |
|-----------|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| Headline (seg1-headline) | ✓ | ✓ | — | — | — | — |
| PlacesCard (sp-topo) | — | ✓ | — | — | — | — |
| WeatherWidget (sp-weather) | — | ✓ | — | — | — | — |
| StoreMapMarkers *(event)* | — | ✓ | — | — | — | — |
| DemographicsWidget *(event)* | — | ✓ | — | — | — | — |
| SentimentPieChart (sp-sentiment) | — | — | ✓ | — | — | — |
| CompetitorCard (sp-competitor) | — | — | ✓ | — | — | — |
| PromoWatchCard (sp-promo) | — | — | ✓ | — | — | — |
| TrafficFlowChart (sp-traffic) | — | — | — | ✓ | — | — |
| FootfallCard (sp-footfall) | — | — | — | ✓ | — | — |
| Navbar | ✓ | ✓ | — | — | — | — |

*(event)* = self-managing component via custom window events, not GSAP-controlled.

---

## Removed from Hero

The following elements were present in the previous state machine and have been removed from the hero section:
- **ThoughtBubble** (`seg0-text`) — "what if i had a superpower?" text bubble
- **Conclusion strip** (`seg4-text`, `seg4-strip`, `seg4-powered`)
- **DrivingDecisionsOverlay** — "Signal→ [WORD] Decisions" rotating text (still exists in `components/sections/DrivingDecisions.tsx` for use outside the hero)
