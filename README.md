# Visual Mockup & Graphic Asset Studio - Functional Specification

A comprehensive technical and functional specification for an all-in-one, browser-based visual mockup, screenshot beautifier, and marketing asset generator.


## Implementation Status & Quickstart

### Getting Started
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run End-to-End tests
npm run test:e2e

# Build for production
npm run build
```

### Development Roadmap
- [x] **Feature 1: Core Architecture Foundation** (TypeScript, Vite, Reactive Store, Canvas/WebGL 3D engine, Backgrounds, Layout, Text, Export Hub, Playwright E2E)
- [x] **Feature 2: Screenshot & Device Mockup Studio** (8 hardware frames, single/compare/montage modes, auto-palette extraction, Playwright E2E)
- [x] **Feature 3: Vector & Canvas Annotation Suite** (Arrows, text pills, boxes, blurs, emojis, loupe, 3D tracking, Playwright E2E)
- [ ] **Feature 4: Code Snippet & Terminal Beautifier** (26 languages, 10 themes, line highlights, CLI mode, AI code generation)
- [ ] **Feature 5: Social Media Post Simulator** (8 platforms, native light/dark UI, verified badges, metric counters)
- [ ] **Feature 6: Customer Testimonial & Review Card Generator** (ratings, logos, avatars, custom typography)
- [ ] **Feature 7: Chat & Messaging Conversation Simulator** (11 messengers, up to 30 bubbles, timestamps, read ticks)
- [ ] **Feature 8: Mobile & Desktop Notification Mockup** (iOS, Android, macOS, Web toast, lockscreen framing)
- [ ] **Feature 9: Key Metrics & Product Release Announcement Cards** (KPI with sparkline, changelog badges)
- [ ] **Feature 10: Presets Browser, JSON Import/Export & Batch ZIP Packaging** (55+ presets, batch packaging)

---

## 1. Executive Summary & Core Architecture

### 1.1 Product Vision
The Visual Mockup & Graphic Asset Studio is a zero-friction, client-side web application designed to transform raw screenshots, code snippets, social media posts, messaging threads, push notifications, client reviews, and key business metrics into polished, studio-quality graphic assets.

The application operates without mandatory user registration, server-side asset storage, or heavyweight desktop dependencies. All rendering, composition, effect calculations, and file exports are executed locally within the client's browser.

### 1.2 Core Architectural Principles
* **Client-Side Rendering Pipeline**: Compositions are computed and rasterized using HTML5 2D Canvas and WebGL shaders for high-performance real-time previews.
* **Privacy by Design**: User-uploaded images, code, and text never leave the browser runtime, ensuring zero data leakage for sensitive screenshots or proprietary code.
* **Reactive State Management**: A centralized, observable state store manages parameters across modules, with deep-merging capabilities and an automated 100-step undo/redo timeline.
* **Cross-Device Performance**: Optimized memory allocation, dynamic downscaling during drag/preview states, and chunked background rendering via `requestIdleCallback`.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          User Interface                                │
│  ┌───────────────────┐  ┌───────────────────────────────────────────┐  │
│  │   Tool Selector   │  │   Interactive Stage (Live Canvas Preview) │  │
│  │  (7 Studio Tools) │  ├───────────────────────────────────────────┤  │
│  └───────────────────┘  │   Collapsible Settings Panels (Sidebar)   │  │
└───────────────┬───────────────────────────────┬────────────────────────┘
                │                               │
                ▼                               ▼
┌───────────────────────────────┐ ┌──────────────────────────────────────┐
│     Reactive State Store      │ │         Rendering Engines            │
│  - Deep merge & patches       │ │  - 2D Canvas Compositor              │
│  - 100-step history (Undo/Redo│ │  - WebGL 3D Perspective Projector    │
│  - LocalStorage persistence   │ │  - Vector Annotation Layer           │
│  - JSON Preset Import/Export  │ │  - Procedural Wallpaper Generators   │
└───────────────┬───────────────┘ └──────────────────────┬───────────────┘
                │                                        │
                └───────────────────┬────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Export & Packaging Hub                           │
│  - PNG / JPEG / WebP (1× to 4× scaling)                                │
│  - Clipboard Copy (PNG blob) & Web Share API                           │
│  - Multi-aspect Batch Export zipped on client (ZipStore)               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Visual Generator Tools

The studio provides seven specialized creative tools, each tailored to specific graphic formats while sharing the underlying framing, 3D perspective, background, and export engines.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             STUDIO TOOLSET                               │
├───────────────┬───────────────┬───────────────┬──────────────────────────┤
│ 1. Screenshot │ 2. Code & CLI │ 3. Social     │ 4. Testimonial           │
│    Beautifier │    Window     │    Post Card  │    Review Card           │
├───────────────┴──────────────┬┴───────────────┴──────────────────────────┤
│ 5. Chat & Messaging          │ 6. OS & Web Push  │ 7. Metrics & Release  │
│    Conversation              │    Notification   │    Announcements      │
└──────────────────────────────┴───────────────────┴───────────────────────┘
```

---

### 2.1 Tool 1: Screenshot & Device Mockup Studio

Enables users to wrap raw screen captures, design mockups, and application screenshots in hardware frames, desktop windows, or browser chrome, with single, comparison, and montage capabilities.

#### Ingestion Capabilities
* **File Upload & Drag-and-Drop**: Supports PNG, JPEG, WebP, SVG, and HEIC image formats up to 40 MB.
* **Clipboard Ingestion**: Direct paste (`Ctrl+V` / `Cmd+V`) from system clipboard anywhere on the workspace.
* **Remote Webpage URL Capture**:
  * Input field supporting URLs (`http://`, `https://`).
  * Capture modes: **Desktop** (1280×800 viewport) or **Mobile** (390×844 viewport).
  * Automatically provisions the captured page into either a Browser window or Smartphone frame.

#### Composition Modes
1. **Single Shot Mode**: Focuses on one primary screenshot with full framing and 3D positioning.
2. **Compare Mode (Before / After)**:
   * Supports two screenshots side-by-side.
   * Layout arrangements:
     * **Side-by-side** (`side`): Horizontal dual placement.
     * **Stacked** (`stacked`): Vertical top/bottom placement.
     * **Split Cut** (`split`): A single composite frame divided by an adjustable vertical separator line.
     * **Overlay** (`overlay`): The second screenshot floats over the corner of the base screenshot.
   * Badge Labels: Configurable "Before" and "After" badge overlays with customizable labels and contrast fills.
3. **Montage Mode**:
   * Combines up to 6 screenshots (`MAX_SHOTS = 6`) into a cohesive marketing visual.
   * Montage layouts:
     * **Cascade** (`cascade`): Layered diagonal succession with controllable offset spread.
     * **Row** (`row`): Linear horizontal alignment.
     * **Fan** (`fan`): Curved radial arch with subtle angle divergence.
     * **Grid** (`grid`): Symmetrical multi-column auto-balancing grid.
   * Adjustable spread spacing slider (0% to 100%).

#### Hardware Device Frames & Window Chrome
* **No Frame** (`none`): Clean image display with custom corner radius and borders.
* **Desktop Window** (`desktop`): macOS-styled application window featuring traffic light window controls (red, yellow, green) and title header.
* **Windows Window** (`windows`): Modern Windows 11 style chrome featuring minimize, maximize, and close controls.
* **Web Browser** (`browser`): Full browser top bar with back/forward navigation buttons, SSL lock icon, and editable URL address pill.
* **Smartphone** (`phone`): Modern bezel, stereo speaker cutout, and camera configurations (Dynamic Island or Punch Hole).
* **Tablet** (`tablet`): Symmetrical thin bezel tablet chassis with landscape or portrait auto-orientation.
* **Laptop** (`laptop`): Aluminum unibody laptop display with bottom deck notch and display rim.
* **Smartwatch** (`watch`): Smartwatch case featuring digital crown, side button, curved bezels, and silicone straps.

#### Frame Themes & Finishes
* **Theme**: Light or Dark chrome appearance.
* **Chassis Color Palette**:
  * `Auto` (derives color from background/content).
  * Hardware metallic and pastel finishes: **Midnight**, **Gold**, **Rose**, **Blue**, **Green**, **Purple**, **Red**.

---

### 2.2 Tool 2: Code Snippet & Terminal Beautifier

Transforms source code snippets and shell sessions into syntax-highlighted, editor-style screenshots.

#### Operating Modes
1. **Code Editor Window**:
   * Simulates IDEs like VS Code or Sublime Text.
   * Supports custom file names (e.g., `app.ts`, `server.go`, `schema.sql`).
   * Custom tab indentation behavior (Tab key inserts spaces, Shift+Tab dedents; Escape releases keyboard focus).
2. **Terminal / CLI Console**:
   * Simulates a Unix / zsh / bash terminal session.
   * Intelligent parsing: lines starting with `$` or custom prompt characters are styled as executed commands; subsequent lines render as stdout/stderr output.
   * Configurable terminal prompt character (default: `$`).
   * Terminal window title and optional blinking cursor simulation toggle.

#### Syntax Highlighting & Language Support
* **26 Programming & Markup Languages**:
  * Web & Scripting: HTML, CSS, JavaScript, TypeScript, PHP, Python, Ruby, Lua.
  * Systems & Compiled: C, C++, Go, Rust, Java, C#, Kotlin, Swift, Dart, Scala.
  * Data, Query & Config: SQL, JSON, YAML, TOML, Markdown, Dockerfile, Diff, Bash.
* **Automated Language Detection**: Built-in heuristic scoring engine analyzes keywords, token structures, and syntax idioms to automatically identify language without user intervention.

#### Syntax Themes (10 Hand-Crafted Palettes)
Each theme ships with syntax token coloring and a complementary default background:
* **Violine**: Purple dark theme with pastel pink, cyan, and gold accents.
* **Monokai**: Classic vibrant high-contrast hacker palette.
* **Nocturne**: Dracula-inspired deep night theme with purple and cyan tones.
* **Ardoise**: Slate gray cool-toned dark theme.
* **Fjord**: Nordic-inspired blue and teal palette.
* **Abysse**: Deep ocean ultramarine and electric blue contrast.
* **Charbon**: Minimalist neutral dark charcoal.
* **Craie**: High-readability inverted paper-white light theme.
* **Sable**: Warm sand and beige light editor theme.
* **Cerise**: Ruby and warm berry creative theme.

#### Window & Typography Controls
* **Line Numbers**: Toggleable gutter numbers with auto-width adjustment.
* **Line Highlighting**:
  * Specify lines via text expression (e.g., `2, 5-7`).
  * Direct click-to-toggle on code lines in the preview canvas.
  * Non-highlighted lines dim slightly, emphasizing active code.
* **Typography**:
  * Fonts: **JetBrains Mono**, **Fira Code**, **Source Code Pro**.
  * Font size slider (12px to 24px).
  * Window width slider (auto-fit or fixed width up to 1200px).
  * Internal padding slider.

#### AI Code Sample Generator
* In-editor AI assistant powered by LLM completion.
* Natural language prompt input (e.g., *"A TypeScript debounce utility with generics"*).
* Generates snippet, file name, and auto-selects language.
* Hourly and daily rate-limiting safety guards with localized feedback.

---

### 2.3 Tool 3: Social Media Post Simulator

Generates authentic, pixel-accurate mockups of social media posts across major modern platforms for pitch decks, marketing plans, and client approvals.

#### Supported Platforms (8 Networks)
* **X (Twitter)**
* **Instagram**
* **LinkedIn**
* **Facebook**
* **TikTok**
* **Threads**
* **Bluesky**
* **Mastodon**

#### Platform Configuration & Data Fields
* **Appearance**: Native Light or Dark UI themes for each platform.
* **Author Credentials**:
  * Author Display Name.
  * Username / Handle (with auto `@` prefix).
  * Author Headline / Professional Title (specialized for LinkedIn format).
  * Profile Avatar (upload, square or circular auto-crop).
  * Platform-specific Verified Badge (color-matched: cyan for Twitter, blue for Instagram/Facebook/Bluesky/Threads, dark blue for LinkedIn, purple for Mastodon).
* **Post Content**:
  * Multiline post text with real-time character counter.
  * Attached image upload (post banner/illustration).
* **Publication Metadata**:
  * Date & timestamp string (e.g., "10:24 AM · Oct 10, 2026").
  * Platform Logo toggle.
* **Engagement Metrics Counter**:
  * Configurable metric fields: **Likes / Hearts**, **Comments**, **Reposts / Retweets / Shares**, and **Views / Impressions**.
  * Dynamic icon rendering matching each platform's design system.
  * Empty metric fields automatically hide their respective counters.

---

### 2.4 Tool 4: Customer Testimonial & Review Card Generator

Formats raw customer feedback and reviews into polished social proof cards ready for landing pages, social media, and sales collateral.

#### Card Anatomy & Data Elements
* **Customer Review Quote**: Main quote text with automated smart line wrapping.
* **Author Details**:
  * Full Name.
  * Title / Role and Company Name (e.g., *"VP of Engineering, Acme Corp"*).
  * Customer Avatar photo upload.
  * Company Logo upload (supports transparent PNG).
* **Star Rating**:
  * 0 to 5 gold stars.
  * Star rating can be disabled for general quotes.
* **Review Source Attribution**:
  * Integrates verified brand source logos: **Google**, **Trustpilot**, **G2**, **Tripadvisor**, **Facebook**, or **None**.
  * Positioned adjacent to the star rating.
* **Decorative Quotation Mark**: Stylized quotation mark watermark toggleable in the background corner.

#### Styling & Theming
* **Curated Card Styles**:
  * **Sorbet**, **Crème**, **Menthe**, **Bonbon**, **Brand**, **Ocean**, **Minuit**, **Réglisse**.
* **Palette Customization**: 6 card surface colors and 8 vivid accent colors.
* **Typography**:
  * Font choices: Modern Sans (`Plus Jakarta Sans`), Editorial Serif (`Fraunces`), Contemporary Grotesque (`Bricolage Grotesque`), Handwritten (`Caveat`).
  * Font size adjustment slider.
  * Text alignment: Left or Center.
* **Card Width**: Adjustable between 400px and 800px.

---

### 2.5 Tool 5: Chat & Messaging Conversation Simulator

Reconstructs messaging threads and direct message exchanges with platform-faithful speech bubbles, timestamps, and read receipts.

#### Supported Platforms (11 Messengers)
* **iMessage** (Apple iOS)
* **WhatsApp**
* **Facebook Messenger**
* **Instagram Direct**
* **Telegram**
* **Signal**
* **Snapchat**
* **Microsoft Teams**
* **Slack**
* **Discord**
* **Twitch Chat**

#### Conversation Structure & Message Management
* **Message Sequences**: Up to 30 sequential messages (`MAX_MESSAGES = 30`).
* **Message Parties**:
  * Sender ("Me"): Renders on the right (or platform-native side) with primary bubble coloring.
  * Recipient ("Them"): Renders on the left with secondary bubble coloring.
* **Platform Bubble Mechanics**:
  * Native corner rounding, directional bubble tails, and platform gradients (e.g., Instagram purple-blue gradient, WhatsApp light-green bubbles).
* **Read Receipts & Status**:
  * Read status checkmarks: Sent (single check), Delivered (double check), Read (blue double check).
  * Configurable read receipt timestamp footer (e.g., *"Read 10:42"*).

#### Header & Participant Customization
* **Header Bar**: Toggleable top bar with back navigation, recipient avatar, and online status.
* **Participant Info**:
  * Contact Name and Custom Status text (e.g., *"Online"*, *"Typing..."*, *"Active 2h ago"*).
  * Avatar upload for both Contact and Self.
  * Name colors (8 distinct colors for group chat formats like Slack, Discord, and Twitch).
* **Date Separator Chips**: Centralized date pill (e.g., *"Today"*, *"Yesterday"*).

---

### 2.6 Tool 6: Mobile & Desktop Notification Mockup

Designs push notifications and UI toast alerts for marketing feature announcements, sales milestones, or interface prototypes.

#### Notification Formats (4 Operating Environments)
1. **iOS Notification**:
   * iPhone Lock Screen / Banner style.
   * Displays application icon, application name, timestamp, notification title, and notification body.
2. **Android Notification**:
   * Material You style card.
   * Displays small mono app icon, app label, timestamp, and message.
3. **macOS Push Banner**:
   * Top-right desktop notification alert style.
   * Compact card layout with high-density typography.
4. **Web App Toast**:
   * In-app toast banner.
   * 4 functional alert variants: **Success** (green), **Info** (blue), **Warning** (amber), **Error** (red).

#### Display Contexts
* **Standalone Floating Card**:
  * Notification card floats directly over the selected canvas background.
  * Optional **Stacked Cards** effect to simulate multiple incoming notifications.
* **Embedded Device Mode**:
  * Wraps the notification on a realistic hardware device screen:
    * iOS: iPhone frame with Dynamic Island.
    * Android: Smartphone frame with centered camera punch hole.
    * macOS: MacBook laptop frame.
    * Toast: Web browser window frame.
  * Lock Screen Wallpapers: 6 curated system wallpapers (**Dusk**, **Ocean**, **Sunset**, **Forest**, **Sand**, **Night**).
  * Customizable lockscreen clock and date overlay.

---

### 2.7 Tool 7: Key Metrics & Release Announcement Cards

Creates shareable announcement cards designed to communicate growth milestones, KPI metrics, or software release changelogs.

#### Announcement Modalities
1. **Key Metric / KPI Card (`stat`)**:
   * **Brand Header**: Brand logo upload and company/product name.
   * **Hero Numeric Metric**: Bold, high-scale numerical value (e.g., `"12,480"`, `"$1.2M"`).
   * **Metric Descriptor**: Descriptive context (e.g., *"Active developers this month"*).
   * **Trend Indicator**:
     * Direction: **Up** (emerald green badge) or **Down** (crimson red badge).
     * Evolution Delta: Percentage or absolute delta (e.g., `"+38%"`).
     * Benchmark Comparison: Relative timeframe (e.g., *"vs last month"*).
   * **Interactive Sparkline Mini-Chart**:
     * Text input accepts space- or semicolon-separated values (up to 60 numeric data points).
     * Dynamically normalizes values and renders a smooth Bezier spline with gradient fill.

2. **Product Release / Changelog Card (`release`)**:
   * **Header Metadata**: Product title, version tag badge (e.g., `"v2.4.0"`), and release date.
   * **Changelog Rows**: Up to 6 release item rows (`MAX_ITEMS = 6`).
   * **Category Tag Badges**:
     * `New` (Emerald Green)
     * `Improved` (Royal Blue)
     * `Fixed` (Tangerine Orange)

#### Card Typography & Customization
* Card background color and brand accent color swatches.
* Font selections: Sans, Serif (`Fraunces`), Grotesque (`Bricolage Grotesque`), or Cursive (`Caveat`).
* Card width slider (400px to 800px) and alignment toggle (Left or Center).

---

## 3. Universal Customization Engines

Every tool in the studio inherits a shared suite of layout, background, 3D perspective, annotation, and typographic controls.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   UNIVERSAL CUSTOMIZATION ENGINES                        │
├───────────────────────┬──────────────────────────┬───────────────────────┤
│ Background Engine     │ 3D Perspective Shaders   │ Layout & Canvas Engine│
│ - Gradients & Meshes  │ - 3-Axis Rotation        │ - Aspect Ratios       │
│ - Procedural Art      │ - Distance Projection    │ - Multi-layer Shadows │
│ - Auto-Palette Extract│ - Ground Reflection      │ - 9-Point Alignment   │
├───────────────────────┼──────────────────────────┼───────────────────────┤
│ Vector Annotations    │ Typography & Overlays    │ Preset Storage Engine │
│ - Arrows, Boxes, Text │ - Contrast Auto-Ink      │ - 55+ Curated Styles  │
│ - Privacy Blur, Loupe │ - Brand Title/Subtitle   │ - JSON Backup/Share   │
└───────────────────────┴──────────────────────────┴───────────────────────┘
```

---

### 3.1 Background Engine

Provides 7 background modes, texture overlays, and automated color matching.

#### Background Types
1. **Linear Gradient** (`gradient`): Dual- or triple-stop gradient with an adjustable angle wheel (0° to 360°).
2. **Mesh Gradient** (`mesh`): Multi-point fluid color blend calculated across diagonal quadrants.
3. **Solid Color** (`solid`): Flat single-color background from curated swatches or hex color picker.
4. **Split Duotone** (`split`): Two-color diagonal divide at a customizable split angle.
5. **Spotlight** (`spotlight`): Focused radial light beam emerging from a deep dark backdrop.
6. **Procedural Generative Wallpapers** (`wallpaper`):
   * 12 mathematically generated canvas textures:
     * `satin`: Flowing ribbon folds.
     * `dunes`: Desert sand dunes.
     * `aurora`: Atmospheric polar lights.
     * `chrome`: Liquid metallic sheen.
     * `mist`: Soft atmospheric fog.
     * `ripple`: Concentric water ripples.
     * `blobs`: Organic blended metaballs.
     * `ember`: Warm glowing embers.
     * `clouds`: Billowing sky formations.
     * `waves`: Mathematical sine/bezier oceanic waves.
     * `glass`: Refractive frosted panels.
     * `sunset`: Dusk twilight gradients.
7. **Custom Image Background** (`image`): Upload a custom background image with an adjustable Gaussian blur slider (0px to 100px).

#### Surface Overlays & Patterns
* **Geometric Patterns**: Transparent overlay patterns rendered above the background:
  * `none`: Clean background.
  * `dots`: Grid of subtle circular points.
  * `grid`: Coordinate grid lines.
  * `stripes`: 45-degree diagonal hatching lines.
  * Pattern Opacity slider (0% to 100%).
* **Noise / Film Grain**: Monochromatic procedural noise canvas overlay (0% to 100%) to prevent digital banding on gradients.

#### Automated Color Palette Extraction
* When a user loads an image or screenshot, the engine runs a color quantization algorithm extracting the top 5 dominant colors.
* Generates complementary background gradient swatches matched to the screenshot's color profile.

---

### 3.2 3D Perspective & Spatial Effects Engine

Utilizes a hardware-accelerated WebGL shader pipeline to project 2D canvas surfaces into 3D space with genuine perspective foreshortening.

```
       Rotate X (Tilt)
            ▲
            │      Perspective
            │     /
            │    /
            └───┼──────────► Rotate Y (Rotation)
               /
              /
             ▼ Rotate Z (Pivot)
```

#### Spatial Transformation Parameters
* **Rotate X (Tilt)**: Vertical pitch (-60° to +60°).
* **Rotate Y (Rotation)**: Horizontal yaw (-60° to +60°).
* **Rotate Z (Pivot)**: Planar roll (-45° to +45°).
* **Perspective Distance**: Camera distance factor (1.0 to 8.0), controlling wide-angle vs telephoto distortion.
* **Surface Reflection**: Mirrors the rendered object onto the floor plane with gradient falloff (0% to 100%).

#### Quick Tilt Presets
* **Flat** (`none`): Perfectly orthogonal, zero 3D rotation.
* **Left** (`left`): Yaw +24°, Pitch +4°.
* **Right** (`right`): Yaw -24°, Pitch +4°.
* **Back** (`back`): Pitch +32° (slanted keyboard viewpoint).
* **Hero** (`hero`): Pitch +14°, Yaw -18°, Pivot +3° (popular marketing hero shot).
* **Isometric** (`iso`): Pitch +50°, Yaw 0°, Pivot -38° (technical axonometric projection).

---

### 3.3 Layout, Canvas Dimensions & Framing

#### Aspect Ratios
* **Auto (`auto`)**: Canvas snugly wraps the content plus padding.
* **16:9**: Landscape presentation and video format (1920×1080).
* **4:3**: Traditional display format.
* **3:2**: Photography aspect ratio.
* **1:1**: Square post format (1080×1080) for Instagram / LinkedIn.
* **4:5**: Portrait feed format (1080×1350) for maximum mobile feed real estate.
* **9:16**: Vertical full-screen format (1080×1920) for Stories, Reels, TikTok.
* **Open Graph (`1200:630`)**: Standard social media link preview cards.
* **Banner (`1500:500`)**: Header banner format for social profile headers.

#### Positioning & Sizing Controls
* **Canvas Padding**: Edge margin slider (0px to 240px).
* **Content Scale**: Scale zoom slider (20% to 150%).
* **Corner Radius**: Edge curvature slider (0px to 60px).
* **Content Alignment Matrix**: 9-point anchor alignment grid:
  * Top-Left (`tl`), Top-Center (`tc`), Top-Right (`tr`)
  * Middle-Left (`ml`), Middle-Center (`mc`), Middle-Right (`mr`)
  * Bottom-Left (`bl`), Bottom-Center (`bc`), Bottom-Right (`br`)
* **Offset Shifts**: Manual granular X and Y pixel offsets.

#### Shadow & Border Styling
* **Layered Realistic Shadows**:
  * Intensity / Blur distance slider (0 to 100).
  * Shadow Style: **Soft** (multi-stop progressive diffusion) or **Hard** (sharp retro drop shadow).
  * Shadow Color & Ambient Angle direction (0° to 360°).
* **Card Border**: Stroke width (0px to 20px), color picker, and border opacity.
* **Colored Halo Glow**: Ambient perimeter luminescence projecting the card's dominant color outward.

---

### 3.4 Vector Annotation Suite

An integrated vector overlay system allowing users to mark up, annotate, and censor areas directly within the preview canvas.

```
┌──────────────────────────────────────────────────────────┐
│                   ANNOTATION TOOLS                       │
├───────────────┬──────────────────────────┬───────────────┤
│ Text Pill (T) │ Curved Arrow (A)         │ Rectangle (R) │
├───────────────┼──────────────────────────┼───────────────┤
│ Emoji (E)     │ Magnifier / Loupe (L)    │ Blur (B)      │
└───────────────┴──────────────────────────┴───────────────┘
```

#### Available Annotation Types
1. **Text Pill (`text`)**: Label badge with pill background, customizable typography (Sans, Display, Mono), and text color.
2. **Curved Arrow (`arrow`)**: Fluid Bezier arrow with adjustable curvature control, line width, dash style (solid/dashed), and arrowhead styling.
3. **Bounding Box (`box`)**: Highlight rectangle with outline or filled tint modes and rounded corners.
4. **Privacy Blur (`blur`)**: Gaussian pixelation/blur rectangle to redact passwords, API tokens, names, or sensitive data.
5. **Emoji Sticker (`sticker`)**: High-resolution vector emoji stamps for visual callouts.
6. **Magnifying Loupe (`loupe`)**: Circular zoom lens with adjustable magnification factor (1.5× to 4×) and border ring.

#### Spatial Attachment & 3D Synchronization
* Annotations support an `attached: true` property pinning their coordinate space to the target image.
* When 3D tilt, rotation, scaling, or perspective are altered, attached annotations undergo identical mathematical matrix transformations, remaining locked to their target location in 3D perspective.

---

### 3.5 Header & Typography Text Overlays

Allows adding a headline message directly above or below the graphic asset without third-party design tools.

* **Title & Subtitle**: Plaintext inputs (Title up to 120 chars; Subtitle up to 240 chars).
* **Sizing**: Small (`s`), Medium (`m`), or Large (`l`).
* **Alignment**: Left, Center, or Right.
* **Vertical Position**: Top (above mockup) or Bottom (below mockup).
* **Font Families**: System Sans, Editorial Display, Monospace.
* **Adaptive Ink (Luminance Sensing)**: Automatically computes the relative luminance of the underlying background region to set contrasting title text color (dark ink on light backgrounds, crisp white on dark backdrops), with optional custom color override.

---

## 4. Preset Management & Storage System

### 4.1 Built-in Design Presets (55+ Curated Styles)
The application includes a curated library of 55+ production-ready styles spanning diverse aesthetics:
* **Shot**: Clean digital product marketing styles.
* **Fruity**: Vibrant, saturated pop gradients.
* **Pastel**: Soft, muted low-contrast aesthetics.
* **Paper**: Warm editorial tactile textures.
* **Minimal**: Clean monochromes and subtle slate tones.
* **Deep**: Dark mode aesthetics with neon glows.
* **Wallpaper**: Paired with procedural generative canvas backgrounds.
* **Device**: Hardware frame configurations.

### 4.2 Interactive Style Browser
* Fullscreen style modal with categorized filter tabs (`All`, `Mine`, `Shot`, `Fruity`, etc.).
* Asynchronous background thumbnail rendering using idle callbacks (`requestIdleCallback`).
* Instant canvas hover preview: hovering over a preset thumbnail previews the style in real time without committing to state.
* **Shuffle Button**: One-click random preset generator for rapid exploration.

### 4.3 Custom Personal Presets
Users can save their customized styles locally and share them across workstations:
* **Save Current Style**: Captures frame, background, layout, shadow, and 3D settings into a named user preset.
* **Local Persistence**: Presets are serialized and stored in browser `localStorage` (supporting up to 60 custom presets).
* **Preset Renaming & Deletion**: In-app management interface.
* **JSON Export**: Downloads custom styles as an interoperable `.json` backup file.
* **JSON Import**: Ingests `.json` style definitions with validation and schema sanitization.

---

## 5. Export, Packaging & Distribution Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPORT PIPELINE                                 │
├───────────────────────┬──────────────────────────┬─────────────────────┤
│ Resolution Multipliers│ File Formats             │ Action Hub          │
│ - 1× (Standard Web)   │ - PNG (Lossless 32-bit)  │ - Download Image    │
│ - 2× (Retina / HiDPI) │ - JPEG (High Quality)    │ - Copy to Clipboard │
│ - 3× (Ultra-HD)       │ - WebP (Modern Web)      │ - Native Web Share  │
│ - 4× (Print Ready)    │                          │ - Batch ZIP Archive │
└───────────────────────┴──────────────────────────┴─────────────────────┘
```

### 5.1 Rendering Engine Specifications
* Single raster canvas supporting output resolutions up to **16,384 pixels** per side (`MAX_EXPORT_SIDE`) and **40,000,000 total pixels** (`MAX_EXPORT_AREA`).
* Multi-scale export factors: **1×**, **2×** (Retina), **3×**, and **4×** (Ultra-HD / Print).
* Image Formats:
  * **PNG**: Lossless 32-bit RGBA preserving background alpha transparency.
  * **JPEG**: Compressed photographic export with clean matte fallback.
  * **WebP**: Modern high-compression format.

### 5.2 Export Actions
* **Direct File Download**: Downloads the rasterized file with intelligent slugified naming based on project title, mode, and timestamp.
* **Copy to Clipboard**: Generates a PNG blob and writes it directly to the system clipboard via `navigator.clipboard.write([new ClipboardItem(...)])` for instant pasting into Slack, Figma, Notion, or Twitter.
* **Web Share API**: Invokes the mobile or desktop OS native share sheet where supported.
* **Attribution Watermark**: Optional, non-intrusive watermark toggle.

### 5.3 Batch Multi-Format ZIP Export
A built-in packaging feature allowing social media managers to export a graphic in all essential dimensions in a single click:
1. User selects desired target aspect ratios (checkboxes for `16:9`, `4:3`, `1:1`, `4:5`, `9:16`, `Open Graph 1200×630`).
2. The engine loops over each selected aspect ratio, recalculates the canvas layout, and renders the image buffer.
3. An internal, pure-JavaScript zero-dependency ZIP encoder (`createZip`) packages all images in memory into a single compressed `.zip` archive and triggers a browser download.

---

## 6. State Management, History & UX Architecture

### 6.1 State Architecture & Mutation Model
The entire application state is governed by an immutable Store pattern:
* **State Paths**: Dot-notation addressable keys (e.g., `background.colors.0`, `layout.padding`, `effect.rotateX`).
* **Coalescing History Timeline**: Real-time slider scrubbing inputs are throttled/coalesced (800ms window) so that continuous drag motions collapse into a single undo step.
* **100-Step Undo / Redo**: Complete state rollbacks (`store.undo()`) and rollforwards (`store.redo()`).
* **Per-Section Reset**: Every sidebar panel features an isolated reset button to restore default values for that section without affecting other settings.

### 6.2 Keyboard Shortcuts Map

| Shortcut | Scope | Functionality |
| :--- | :--- | :--- |
| `Ctrl + Z` / `Cmd + Z` | Global | Undo previous action |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Global | Redo action |
| `Ctrl + Y` / `Cmd + Y` | Global | Redo action |
| `Ctrl + C` / `Cmd + C` | Workspace | Copy rendered canvas to clipboard |
| `Ctrl + S` / `Cmd + S` | Workspace | Download rendered image file |
| `S` | Workspace | Shuffle to a random style preset |
| `G` | Workspace | Open / close Styles library modal |
| `V` | Annotations | Activate Selection / Move tool |
| `T` | Annotations | Activate Text pill annotation tool |
| `A` | Annotations | Activate Curved Arrow annotation tool |
| `R` | Annotations | Activate Rectangle / Box annotation tool |
| `E` | Annotations | Activate Emoji sticker stamp tool |
| `L` | Annotations | Activate Magnifying Loupe tool |
| `B` | Annotations | Activate Privacy Blur tool |
| `Delete` / `Backspace` | Annotations | Delete currently selected annotation |
| `Escape` | Modal / Tools | Close active dropdown, dialog, or release input focus |

### 6.3 Responsive User Interface
* **Adaptive Workspace**: Split-view architecture featuring an auto-centering canvas stage and a modular sidebar.
* **Collapsible Accordion Panels**: Sidebar panels persist their collapsed/expanded states in `localStorage`.
* **Dark / Light UI Theme**: Automatic detection of OS `prefers-color-scheme` with manual toggle button.
* **Touch & Mobile Support**: Responsive canvas viewport with pinch-to-zoom and touch drag handling.

---

## 7. Technical Data Dictionary (State Schema)

```typescript
interface StudioState {
  // Device & Frame Properties
  frame: {
    type: 'none' | 'desktop' | 'windows' | 'browser' | 'phone' | 'tablet' | 'laptop' | 'watch';
    theme: 'light' | 'dark';
    color: 'auto' | 'gold' | 'rose' | 'blue' | 'green' | 'purple' | 'red' | 'midnight';
    url: string;               // URL address bar for browser frame
    title: string;             // Window header title
    camera: 'island' | 'notch' | 'hole';
  };

  // Canvas Background Properties
  background: {
    type: 'gradient' | 'mesh' | 'solid' | 'split' | 'spotlight' | 'wallpaper' | 'image';
    colors: string[];          // Array of hex color strings (2-3 stops)
    angle: number;             // Angle in degrees (0-360)
    solid: string;             // Flat color value
    wallpaper: string;         // Identifier of procedural wallpaper generator
    blur: number;              // Blur radius for custom image background (0-100)
    noise: number;             // Grain/noise texture percentage (0-100)
    pattern: 'none' | 'dots' | 'grid' | 'stripes';
    patternOpacity: number;    // Pattern opacity percentage (0-100)
  };

  // Canvas Layout & Geometry
  layout: {
    aspect: 'auto' | '16:9' | '4:3' | '3:2' | '1:1' | '4:5' | '9:16' | '1200:630' | '1500:500';
    padding: number;           // Outer canvas padding (px)
    scale: number;             // Content scale percentage (20-150)
    radius: number;            // Corner curvature radius (px)
    shadow: number;            // Drop shadow blur and elevation
    shadowStyle: 'soft' | 'hard';
    shadowColor: string;
    shadowAngle: number;
    border: { width: number; color: string; opacity: number };
    halo: number;              // Colored ambient glow intensity
    stack: 'none' | 'stack';
    align: 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br';
    offsetX: number;
    offsetY: number;
  };

  // 3D Spatial Transforms (WebGL)
  effect: {
    rotateX: number;           // Tilt (-60 to +60 deg)
    rotateY: number;           // Rotation (-60 to +60 deg)
    rotateZ: number;           // Pivot (-45 to +45 deg)
    perspective: number;       // Projection distance (1.0 to 8.0)
    reflection: number;        // Ground plane mirror reflection (0-100%)
    decor: 'none' | 'selection';
  };

  // Header & Overlay Typography
  text: {
    title: string;
    subtitle: string;
    size: 's' | 'm' | 'l';
    align: 'left' | 'center' | 'right';
    position: 'top' | 'bottom';
    font: 'sans' | 'display' | 'mono';
    weight: 'bold' | 'regular';
    color: 'auto' | 'custom';
    customColor: string;
  };

  // Export Settings
  export: {
    format: 'png' | 'jpeg' | 'webp';
    scale: 1 | 2 | 3 | 4;
    watermark: boolean;
  };

  // Vector Annotations List
  annotations: Array<AnnotationItem>;
}
```

---

## 8. Summary Matrix of Tool Capabilities

| Feature Capability | 1. Screenshot | 2. Code & CLI | 3. Social Post | 4. Review Card | 5. Messaging | 6. Push Alert | 7. Metrics & News |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Custom Text Content** | Title/Subtitle | Source Code | Post Body | Review Quote | Chat Bubbles | Notification | KPI / Changelog |
| **Hardware Frames** | Yes (8 types) | Window only | No | No | No | Optional | No |
| **3D Tilt & Perspective** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Background Engine** | Full | Full | Full | Full | Full | Full | Full |
| **Vector Annotations** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Multi-Item Support** | Up to 6 shots | Single file | Single post | Single review | Up to 30 msgs | Stacked cards | Up to 6 items |
| **Image / Avatar Upload** | Source image | No | Avatar + Image | Avatar + Logo | 2 Avatars | App Icon | Brand Logo |
| **Preset Style Themes** | 55+ Styles | 10 Themes | Light / Dark | 8 Themes | 11 Networks | 4 Platforms | 8 Styles |
| **Batch Multi-Export** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
