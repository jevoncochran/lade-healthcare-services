# Lade Health Care Services — Style Guide

All visual styling comes from one file: **`src/app/globals.css`**.
Change a value there once and it updates across every page.

To see every token and component rendered live, run the dev server and open
**http://localhost:3000/style-guide** (hidden from search engines).

---

## Quick changes

| I want to change…              | Edit this                                                       |
| ------------------------------ | --------------------------------------------------------------- |
| The navy color                 | `--color-primary` (and `--color-primary-dark`) in `globals.css` |
| The blue color                 | `--color-secondary` (and `-light`)                              |
| The green / button color       | `--color-accent` (and `-dark`, `-light`)                        |
| Body or heading font           | The font imports in `src/app/layout.tsx`                        |
| How rounded buttons are        | `--radius-button`                                               |
| How rounded cards are          | `--radius-card` (cards), `--radius-panel` (big colored blocks)  |
| Card shadows                   | `--shadow-card`, `--shadow-card-hover`, `--shadow-float`        |
| Space above/below each section | `--section-y` (mobile), `--section-y-lg` (tablet and up)        |
| Max content width              | `--container-max`                                               |
| Phone, email, service area     | `src/lib/site.ts`                                               |
| Nav links                      | `navLinks` in `src/lib/site.ts`                                 |

---

## Colors

All colors are sampled from the Lade logo (green, blue and navy), and every text/background pairing meets WCAG AA contrast.

Colors are named by **role**, not appearance. When the client sent their logo, the accent changed from red to green by editing three values. No class names changed.

| Token             | Value     | Used for                                              |
| ----------------- | --------- | ----------------------------------------------------- |
| `primary`         | `#0d3b6e` | Navy. Top bar, dark sections, headings                |
| `primary-dark`    | `#082a52` | Footer                                                |
| `secondary`       | `#025cc5` | Blue. Links, icons, card top borders, payment panel   |
| `secondary-light` | `#067cdb` | Keyboard focus outlines                               |
| `accent`          | `#097c21` | Green. Main buttons, checkmarks, "Need a ride?" band    |
| `accent-dark`     | `#05642a` | Main button hover                                     |
| `accent-light`    | `#8bd43a` | Lime. Green details on dark backgrounds                       |
| `surface`         | `#f4f5f7` | Light gray sections and panels                        |
| `ink`             | `#222222` | Body text                                             |
| `muted`           | `#58595b` | Secondary text                                        |
| `line`            | `#e3e6eb` | Borders and dividers                                  |
| `danger`          | `#b42318` | Form error text and borders                           |
| `placeholder`     | `#fff1a8` | Yellow highlight on `<Placeholder>` text (temporary)  |

Use them as Tailwind classes: `bg-primary`, `text-accent`, `border-line`, `bg-secondary/10` (10% opacity), and so on.

**Rule:** never write a hex code in a component. If a new color is needed, add a token.

---

## Typography

| Role      | Font    | Tailwind class |
| --------- | ------- | -------------- |
| Headings, buttons, labels | Public Sans | `font-heading` |
| Body text | Public Sans | `font-sans` (the default) |

Both roles currently use Public Sans. To give headings a different font, load a second font in `layout.tsx` and point `--font-heading` at it in `globals.css`.

| Class            | Use                                                   |
| ---------------- | ----------------------------------------------------- |
| `.display`       | Hero headline, one per page (uppercase, very large)   |
| `.section-title` | Main heading of each section (`<h2>`)                 |
| `.section-lead`  | Intro paragraph under a section title                 |
| `.card-title`    | Heading inside a card or sidebar                      |

For the common title + lead combination, use the component:

```tsx
<SectionHeader title="Transport for every level of mobility" lead="…" />
<SectionHeader align="left" title="…" />
```

**Rule:** no small labels or badges above headings. The heading should say it on its own.

---

## Sections

Every page is a stack of sections:

```tsx
<section className="section">                 {/* white */}
<section className="section section-alt">     {/* light gray */}
<section className="section section-dark">    {/* navy; headings and text turn light automatically */}
  <div className="container-site">…</div>
</section>
```

Alternate white and gray to separate sections. Use `section-dark` once or twice per page for emphasis.

---

## Buttons

Always use the **`<Button>`** component (`src/components/Button.tsx`). Don't write `btn` classes by hand.

```tsx
import Button from "@/components/Button";
import { ArrowRightIcon, PhoneIcon } from "@/components/Icons";

<Button href="/book-a-ride">Book a Ride</Button>
<Button href={site.phoneHref} variant="outline" icon={PhoneIcon}>Call {site.phone}</Button>
<Button href="/book-a-ride" size="lg" icon={ArrowRightIcon} iconPosition="right">Book a Ride</Button>
<Button href="/about" variant="link" icon={ArrowRightIcon} iconPosition="right">Learn more</Button>
<Button type="submit">Send Request</Button>
```

It renders the right element automatically: a Next.js `<Link>` for internal pages (`/…`), an `<a>` for `tel:`, `mailto:` and external URLs, and a `<button>` when there's no `href`. Any other props (`onClick`, `aria-label`, `target`, `disabled`…) pass straight through.

| `variant`       | Looks like    | Use on                                         |
| --------------- | ------------- | ---------------------------------------------- |
| `primary` (default) | Green fill | The main action: Book a Ride                   |
| `outline`       | Navy outline  | Secondary actions on light backgrounds         |
| `light`         | White fill    | Main action on navy or green backgrounds         |
| `outline-light` | White outline | Secondary action on dark backgrounds or photos |
| `link`          | Blue text     | Inline "Learn more →" style links              |

| Prop           | Values                        |
| -------------- | ----------------------------- |
| `size`         | `"md"` (default), `"lg"` for heroes and CTA bands |
| `icon`         | Any icon from `Icons.tsx`     |
| `iconPosition` | `"left"` (default), `"right"` |
| `className`    | Extra spacing, e.g. `"mt-4"`  |

To restyle every button at once, edit the `.btn-*` classes in `globals.css`.

**Rule:** one `primary` button per section. The green button should always mean "book a ride or call".

------------------- | -------------- | -------------------------------------- |
| `btn-primary`       | Green fill     | The main action: Book a Ride           |
| `btn-outline`       | Navy outline   | Secondary actions on light backgrounds |
| `btn-light`         | White fill     | Main action on navy or green backgrounds |
| `btn-outline-light` | White outline  | Secondary action on dark backgrounds or photos |

Add `btn-lg` for hero and CTA-band sized buttons. For inline text links with an arrow, use `.link-arrow`.

**Rule:** one `btn-primary` per section. The green button should always mean "book a ride or call".

---

## Cards, panels and icons

| Class          | Use                                                       |
| -------------- | --------------------------------------------------------- |
| `.card`        | White box with rounded corners, shadow and padding        |
| `.card-hover`  | Adds a stronger shadow on hover                           |
| `.card-accent` | Blue top border (service cards)                           |
| `.panel`       | Large blue feature block with white text                  |
| `.icon-badge`  | Round tinted circle behind an icon                        |
| `.check-badge` | Small green circle behind a checkmark, for bullet lists     |

### Reusable card components (`src/components/cards/`)

| Component       | Use                                                              |
| --------------- | ---------------------------------------------------------------- |
| `CareLevelCard` | Large card for a level of care (ambulatory, wheelchair, stretcher) |
| `TripTypeCard`  | Compact centered card for a trip type. Set `headingLevel="h4"` when it sits under an `<h3>` |

Both take an item from `src/lib/services.ts` (`icon`, `title`, `description`), so the text is written once and shared across pages:

```tsx
{careLevels.map((level) => <CareLevelCard key={level.title} {...level} />)}
```

Icons live in `src/components/Icons.tsx`. They inherit text color, so you color them with `text-*` and size them with `h-* w-*`.

---

## Page building blocks

| Component       | Use                                                                 |
| --------------- | ------------------------------------------------------------------- |
| `PageHero`      | Photo header for inner pages. Props: `title`, `intro`, `image`, `imageAlt`, `layout`, `imagePosition`, buttons as children. `layout="background"` (default) puts the photo behind the text and crops it; `imagePosition` keeps the subject in frame. `layout="split"` shows the whole photo beside the text. Leave out `image` for a plain navy header (About page). Use it when the photo shouldn't be cropped (Services page) |
| `SectionHeader` | Section title + optional lead paragraph                             |
| `ServiceRow`    | One service on the Services page: photo (or icon panel) beside the copy. Pass a `service` from `services` in `src/lib/services.ts`; set `reverse` on every other row |
| `Placeholder`   | Yellow-highlighted `[text]` for facts the client hasn't given us yet. Search for `<Placeholder` to find everything left to fill in before launch |
| `CtaBand`       | Green "Need a ride today?" band. Put it at the bottom of most pages   |
| `FaqList`       | Expandable questions. Pass `faqs` from `src/lib/faqs.ts`            |

```tsx
<PageHero
  title="About Us"
  intro="…"
  image="/assets/images/about/photo.jpg"
  imageAlt="Describe the photo"
  imagePosition="object-[70%_30%]"
>
  <Button href="/book-a-ride" size="lg">Book a Ride</Button>
</PageHero>
```

Inside a `section-dark` section, a white box needs `text-primary` on its `.card-title`, because headings in dark sections turn white automatically.

---

## Forms

Wrap every control in **`<Field>`** (`src/components/form/Field.tsx`), which adds the label, an optional hint, the error message and the "(optional)" / `*` marker. Give the control `className="form-input"`, `aria-invalid` and `aria-describedby={describedBy(name, hint, error)}`.

```tsx
<Field name="email" label="Email" required error={errors.email}>
  <input id="email" name="email" type="email" className="form-input"
    aria-invalid={!!errors.email} aria-describedby={describedBy("email", undefined, errors.email)} />
</Field>
```

- Forms send to the booking API **from the browser** with `api()` in `src/lib/api.ts`. The API validates everything again, rate-limits per visitor and checks the request came from this site; a shared rules file in `src/lib/` mirrors its rules so errors show next to the right field (see `src/app/contact/ContactForm.tsx` and `src/lib/contact.ts`).
- Submit with `onSubmit` + `startTransition(() => formAction(formData))` (with `useActionState`), not `<form action>`. That avoids React's automatic reset, so fields keep their values when errors come back.
- Error text uses the `danger` token (`#b42318`).
- Ask visitors not to put medical details in general forms.
- The contact form is emailed to Lade's inbox by the API (`POST /contact`, Amazon SES), with the visitor's email as reply-to. Nothing is stored.
- For a plain text-style input, `<InputField>` (`src/components/form/InputField.tsx`) does the `<Field>` wiring for you, and adds a Show/Hide toggle to password inputs.

### Account forms (sign in, sign up, password reset, staff pages)

Like every form, these call the booking API from the browser, which also matters here because the API sets the sign-in cookie and it has to land in the visitor's browser. `src/lib/account.ts` mirrors the API's rules so errors show next to the right field.

- Lay them out with `<AuthShell>`, show problems with `<FormAlert>`, and swap the form for `<SuccessMessage>` when it's done (`src/components/account/`).
- Pages that need a signed-in person use `useSignedIn()` (`src/lib/useSignedIn.ts`), which sends them to sign in if their session has ended.
- Never reveal whether an email address has an account.
- Account pages live in the `(account)` route group and staff pages under `/admin`. Both layouts keep them out of search results.

---

## Shared content

`src/lib/services.ts` holds the full service list (`services`, used by the Services page and footer), care levels, trip types, who we serve and payment options. `src/lib/faqs.ts` holds the FAQ. `src/lib/site.ts` holds the business name, phone, email, service area and nav links. Header, footer and pages all read from it. **Don't hard-code a phone number anywhere else.**
