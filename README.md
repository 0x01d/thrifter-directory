# Thrifter.be - Belgian Thrift Store Directory

A comprehensive directory of thrift stores (kringwinkels/ressourceries) in Belgium, built with SvelteKit, TypeScript, and static site generation (SSG).

## Features

- **Province Pages**: Browse all thrift stores by province with city listings
- **City Pages**: View all stores in a specific city
- **Store Detail Pages**: Comprehensive information about each thrift store
- **Static Site Generation**: Fully pre-rendered for optimal performance and SEO
- **Multilingual Support**: Ready for Dutch (nl), French (fr), and English (en) via Paraglide
- **Responsive Design**: Mobile-friendly interface

## Project Structure

```
thrifter-directory/
├── data/
│   └── stores/              # JSON data files (Province_City.json)
├── src/
│   ├── lib/
│   │   ├── data/
│   │   │   └── loader.ts    # Data loading utilities
│   │   ├── types/
│   │   │   └── thrift-store.ts  # TypeScript types
│   │   └── utils/
│   │       └── slug.ts      # URL slug generation
│   └── routes/
│       ├── +page.svelte     # Home page (provinces list)
│       ├── [province]/
│       │   ├── +page.svelte # Province page
│       │   └── [city]/
│       │       ├── +page.svelte  # City page
│       │       └── [store]/
│       │           └── +page.svelte  # Store detail page
└── messages/                # i18n translation files
```

## Getting Started

### Installation

```sh
npm install
```

### Development

Start the development server:

```sh
npm run dev

# or open in browser automatically
npm run dev -- --open
```

### Building

Create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Adding Store Data

Store data is managed through JSON files in the `data/stores/` directory.

### File Naming Convention

Files should be named: `Province_City.json`

Example: `Antwerpen_Antwerpen.json`

### Data Format

Each JSON file contains an array of store objects:

```json
[
  {
    "city": "Antwerpen",
    "province": "Antwerpen",
    "name": "Kringwinkel Antwerpen Meir",
    "category": "Used clothing store",
    "address": "Otto Veniusstraat 11, 2000 Antwerpen, Belgium",
    "phone": "+32 3 773 34 90",
    "website": "kringwinkel.be",
    "stars": "4.0",
    "review_count": "281 reviews",
    "google_maps_url": "https://www.google.com/maps/place/..."
  }
]
```

See `data/README.md` for detailed information about the data format and optional fields.

## Technology Stack

- **Framework**: SvelteKit 2
- **Language**: TypeScript
- **Styling**: Component-scoped CSS
- **i18n**: Paraglide (inlang)
- **Build**: Vite
- **Adapter**: Netlify (supports SSG)
- **Node**: 22+

## Static Site Generation

All pages are pre-rendered at build time using SvelteKit's SSG capabilities:

- Home page lists all provinces
- Province pages are generated for each unique province
- City pages are generated for each unique city
- Store pages are generated for each individual store

The `entries` functions in `+page.server.ts` files define which pages to pre-render.

## Internationalization

The project uses Paraglide for i18n with support for:

- Dutch (nl) - Base locale
- French (fr)
- English (en)

Translation files are in the `messages/` directory.

## Deployment

The project is configured for deployment to Netlify using `@sveltejs/adapter-netlify`. The build process generates a static site in the `.svelte-kit/output/` directory.

### Deploy to Netlify

1. Push your code to a Git repository
2. Connect the repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.svelte-kit/output/client`

## Development Workflow

1. Add new store data to `data/stores/` directory
2. Run `npm run dev` to test locally
3. Run `npm run build` to verify static generation
4. Commit and deploy

## Future Enhancements

Planned features to be added:

- Social media links (Instagram, Facebook)
- Opening hours display
- Store specialties and categories
- Designer item indicators
- Store descriptions
- Photo galleries
- Search functionality
- Interactive maps
- Filtering and sorting

## Contributing

When adding new stores:

1. Follow the JSON format in `data/README.md`
2. Ensure all required fields are present
3. Validate JSON syntax
4. Test the build locally
5. Create a pull request

## License

MIT
