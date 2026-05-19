# ✨ Fatura Flow Local

<div align="center">
  <p align="center">
    <strong>A premium, local-first, glassmorphic invoice workspace built for absolute privacy and visual excellence.</strong>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6.0" />
    <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8.0" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS 4.0" />
  </p>
</div>

---

## 📖 Introduction

**Fatura Flow Local** is an ultra-premium, client-side-only invoicing application engineered to combine top-tier desktop-like aesthetics with complete privacy. Drawing inspiration from modern Apple design languages, it features rich glassmorphism, responsive micro-animations, and fluid layout transitions. 

Because it operates **100% on the client side**, none of your financial details, client emails, or transaction figures ever touch an external server. Your workspace is stored entirely within your browser's persistent `localStorage`.

---

## 🚀 Key Features

- **🔒 Absolute Privacy & Local-First**: No database, no logins, and no servers. All invoices, clients, and settings are saved locally inside your browser's private sandbox.
- **💻 Apple-Inspired Glassmorphic UI**: High-fidelity translucent window layouts (`MacWindow`), sleek glass inputs (`glass-input`), and responsive action badges.
- **🌓 Tri-Mode Theme Engine**: Seamlessly switch between **Light Mode** (sleek, high-contrast, paper-like elements), **Dark Mode** (vibrant neon-tinted background grids), or **System Preference** with customized light-dark styling variables.
- **📄 Pixel-Perfect PDF Generator**: Dynamic, print-friendly live invoice previews rendered and compiled on-the-fly using `html2pdf.js`.
- **📊 Real-time Financial Analytics**: Instantly compute Total Revenue, Active Drafts, Paid Revenue, and Invoice volume using custom aggregate formulas (`calculateTotals`).
- **💾 Secure Backup System**: Easily download a complete JSON backup of your database (`Export Data`) and restore it seamlessly anytime (`Import Data`).

---

## 🛠️ Technology Stack

- **Core & Runtime**: React 19, Vite 8, TypeScript 6.0
- **State Management**: Zustand 5 (for lightweight, concurrent reactivity)
- **Styling & Motion**: TailwindCSS 4.0, `@tailwindcss/vite`, `tw-animate-css`
- **Iconography**: Lucide React
- **Document Compiling**: `html2pdf.js`
- **Typography**: Geist Variable Font (via `@fontsource-variable/geist`)

---

## 📂 Project Architecture

```bash
Fatura-Flow-Local/
├── src/
│   ├── components/
│   │   ├── invoice/
│   │   │   ├── DashboardView.tsx     # Full analytics graphs, filters, and status distribution
│   │   │   ├── InvoiceDashboard.tsx # Table list, sorting, search, & invoice actions
│   │   │   ├── InvoiceForm.tsx      # Comprehensive client/item/tax invoice editor
│   │   │   ├── InvoicePreview.tsx   # Elegant printable layout preview for PDFs
│   │   │   └── StatsCard.tsx        # Responsive dashboard statistic metric cards
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx        # Navigation sidebar frame and view controller
│   │   │   ├── MacWindow.tsx        # Iconic macOS-style container wrapper
│   │   │   └── Sidebar.tsx          # Nav links, quick links, and theme widgets
│   │   └── ui/                      # Standard custom visual component wrappers
│   ├── store/
│   │   ├── useInvoiceStore.ts       # Main Zustand store for active/saved invoices & state
│   │   └── useThemeStore.ts         # Tri-mode theme system and CSS variable injection
│   ├── types/
│   │   └── invoice.ts               # Strong schemas for client, line item, invoice, & totals
│   ├── App.tsx                      # Core root layout, views router, and Settings dashboard
│   ├── index.css                    # Premium styles, CSS grid gradients, glass panel classes
│   └── main.tsx                     # Entry-point bootstrap
├── package.json
└── vite.config.ts
```

---

## ⚡ Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.x or above) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/zakariaelqannaa-dv/Fatura-Flow-Local.git
cd Fatura-Flow-Local
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:5173` (or the fallback local port) in your browser to view your brand new dashboard.

### 4. Build for production
To compile the highly optimized bundle:
```bash
npm run build
```

---

## 🎨 Theme Customization (The Magic Trick)

In `src/index.css`, Fatura Flow Local utilizes a customized color variable mapping system where:
- `--color-white` resolves to the dark slate color (`var(--theme-base)`) in Light mode, and standard `#ffffff` in Dark mode.
- `--color-black` resolves to pure `#ffffff` (`var(--theme-invert)`) in Light mode, and standard `#000000` in Dark mode.

This provides highly reactive, automatic visual inversions across the entire application with no extra runtime style queries.

---

## ✍️ Author & Signature

<div align="center">
  <br />
  <h3><b>Zakariaelqannaa-dv</b> (<code>zakariaelqannaa-dv</code>)</h3>
  <p><i>Crafting premium, high-fidelity, local-first web applications using state-of-the-art technologies.</i></p>
  
  <p>
    <a href="https://github.com/zakariaelqannaa-dv">
      <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile" />
    </a>
  </p>
  
  <blockquote>
    "Software is most beautiful when it is completely private, incredibly fast, and visually spectacular."
  </blockquote>
  <br />
</div>
