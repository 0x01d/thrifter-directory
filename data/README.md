# Thrift Store Data

This directory contains JSON files with thrift store data for Belgium.

## File Naming Convention

Files should be named following this pattern:
```
Province_City.json
```

For example:
- `Antwerpen_Antwerpen.json`
- `Vlaams-Brabant_Leuven.json`
- `Oost-Vlaanderen_Gent.json`

## File Format

Each JSON file should contain an array of store objects with the following structure:

### Required Fields

```json
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
```

### Optional Fields (Coming Soon)

The following fields can be added in the future:

```json
{
  "email": "info@store.be",
  "instagram": "@storename",
  "facebook": "facebook.com/storename",
  "openingHours": "Mon-Fri: 10:00-18:00, Sat: 10:00-17:00",
  "specialties": ["vintage clothing", "furniture", "books"],
  "priceRange": "€€",
  "hasDesigner": true,
  "description": "A cozy thrift store with a great selection of vintage items",
  "picturesUrlList": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ]
}
```

## Adding New Stores

1. Find the appropriate JSON file for the province and city
2. If the file doesn't exist, create a new file following the naming convention
3. Add the store data to the array in the JSON file
4. Ensure all required fields are present
5. Rebuild the site to generate new pages

## Data Sources

Data is typically sourced from:
- Google Maps listings
- Store websites
- Public directories
- Manual verification

## Validation

Before committing new data:
- Ensure JSON is valid (use a JSON validator)
- Verify all required fields are present
- Check that URLs are properly formatted
- Confirm phone numbers include country code
