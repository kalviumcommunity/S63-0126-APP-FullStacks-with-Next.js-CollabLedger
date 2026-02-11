# CollabLedger

A collaborative platform for NGOs and open-source communities to reduce duplicated effort by improving visibility into ongoing, planned, and completed work.

## Reusable Component Architecture

### Component Hierarchy Diagram

```
LayoutWrapper
 ├── Header (sticky nav with logo, links, CTAs)
 ├── Sidebar (link list)
 └── Page Content (main) → {children}
```

### Folder Structure

```
src/
 ├── app/
 │    ├── layout.tsx      # Wraps all routes with LayoutWrapper
 │    ├── page.tsx        # Landing page
 │    └── dashboard/
 │         └── page.tsx   # Dashboard (demonstrates Button, Card)
 │
 ├── components/
 │    ├── layout/
 │    │    ├── Header.tsx
 │    │    ├── Sidebar.tsx
 │    │    └── LayoutWrapper.tsx
 │    │
 │    ├── ui/
 │    │    ├── Button.tsx
 │    │    └── Card.tsx
 │    │
 │    └── index.ts        # Barrel exports
 │
 └── styles/
      └── globals.css    # (in src/app/globals.css)
```

Layout components live in `components/layout/`; reusable UI primitives in `components/ui/`. They are never mixed.

### Code Snippets

**Header** (semantic `<header>`, responsive, keyboard focusable):

```tsx
<header role="banner" className="sticky top-0 z-20 border-b ...">
  <Link href="/">CollabLedger</Link>
  <nav aria-label="Main navigation">{/* nav links */}</nav>
  <Link href="/signup">Sign Up</Link>
  <Link href="/login">Log In</Link>
</header>
```

**LayoutWrapper** (wraps Header, Sidebar, children):

```tsx
interface LayoutWrapperProps {
  children: React.ReactNode;
}
export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

**Button** (configurable variant):

```tsx
interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}
// Usage: <Button label="Submit" variant="primary" onClick={handleSubmit} />
```

### Props Contract

| Component        | Props                                  | Purpose                    |
|-----------------|----------------------------------------|----------------------------|
| LayoutWrapper   | `children: React.ReactNode`            | Wrap page content          |
| Header          | (none)                                 | Global nav bar             |
| Sidebar         | (none)                                 | Side nav links             |
| Button          | `label`, `onClick`, `variant`          | Reusable action buttons    |
| Card            | `title?`, `children`                   | Content container          |

### Accessibility Considerations

- **Semantic tags**: `<header>`, `<nav>`, `<aside>`, `<main>` used where appropriate
- **ARIA**: `role="banner"`, `aria-label` on nav and sidebar
- **Keyboard**: All links and buttons support focus rings and keyboard navigation
- **Contrast**: Grayscale theme for clear text contrast

### Reflection

- **Reusability**: Header, Sidebar, Button, and Card are shared across pages; no duplicated layout logic
- **Maintainability**: Changes to nav or layout live in one place; barrel exports keep imports clean
- **Scalability**: New pages automatically get Header + Sidebar; new UI components extend `components/ui/`
- **Design consistency**: Shared grayscale styling and spacing across the app

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
