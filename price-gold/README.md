# PWA Practice

## Overview

- This document concerns pwa practice. Build the Price Gold web application.

## Target

- Understand what a PWA is and why it's useful.
- Create and configure a basic PWA using React.
- Set up service workers and the manifest file.
- Understand caching strategies and offline data handling.
- Mobile responsive design

## Technical Stack

- React 19
- Typescript
- Jest
- Vite
- PWA Vite Plugin

## Features

- Live gold price display
  - Current spot price (USD per troy ounce)
  - Real-time or near real-time updates
- Daily change (+/-)
  - Price difference and percentage change
- Manual refresh button
- Multiple currencies (USD, EUR)
  - Price display in different currencies
- Show a chart for the price of gold over a year
- Offline support with cached prices

### Installation

1. **Clone the repository:**

   ```bash
   git@gitlab.asoft-python.com:thao.ha/pwa-training.git
   ```

2. **Checkout into "dev" branch:**

   ```bash
   git checkout dev
   ```

3. **Install dependencies:**

   ```bash
   cd price-gold
   ```

   ```bash
   pnpm install
   ```

4. **Create environment variables**

- Clone the `.env.sample` file to `.env` and update it with your environment-specific variables:
  ```bash
  cp .env.sample .env
  ```

5. **Start the project**

   | Script         | Description                                           |
   | -------------- | ----------------------------------------------------- |
   | `pnpm dev`     | Starts the development server using Vite              |
   | `pnpm build`   | Builds the app for production using TypeScript + Vite |
   | `pnpm preview` | Serves the production build locally                   |
   | `pnpm lint`    | Lints the codebase with ESLint                        |
   | `pnpm test`    | Runs unit tests using Vitest                          |

## Plan

- [Link](https://docs.google.com/document/d/1G-aK2vc8dLZXTTdt6Ff85S9M6QyoqPX3YfPB9vWMD0A/edit?tab=t.0)
