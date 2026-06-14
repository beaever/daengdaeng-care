# Feature Specification

**Service Name:** DaengDaeng Care
**Version:** v1.0
**Date:** 2026-06-12

---

## F001. Food Safety Checker

### Overview
Allows owners to instantly check whether a food is safe to give their dog.

### Input
| Input Method | Description |
|-------------|-------------|
| Text Search | Enter food name in Korean or English |

### Processing
- Match search term against local DB (JSON bundled in app)
- Supports partial match (e.g., "grape" → includes "raisins", "grape juice")
- If no result found → show "Unverified food" notice

### Output — 3 Safety Levels

| Level | Display | Color | Meaning |
|-------|---------|-------|---------|
| Safe | ✅ Safe to eat | Green | Generally safe |
| Caution | ⚠️ Small amounts only | Yellow | Risky in large quantities |
| Danger | 🚨 Never give this | Red | Toxic, immediately dangerous |

### Result Screen Contents
- Safety level badge
- Reason/explanation (1–2 sentences)
- Dangerous ingredient name (if applicable)
- Symptoms if ingested (Danger/Caution levels only)
- Related foods (e.g., Grapes → Raisins, Grape juice also dangerous)

### Key Data (Sample Dangerous Foods)
```
Danger:  Grapes/Raisins, Chocolate, Onions/Garlic, Xylitol, Macadamia nuts,
         Avocado, Alcohol, Caffeine, Raw yeast dough, Excessive salt,
         Plum/Peach pits, Raw egg whites

Caution: Milk, Cheese, Peanut butter (xylitol-free), Watermelon (seedless),
         Blueberries, Carrots, Cucumber

Safe:    Cooked chicken, Cooked beef, Cooked rice, Sweet potato,
         Broccoli, Apple (seedless)
```

### Ads
- Banner ad at bottom of result screen (fixed 50pt height)

---

## F002. Ingredient Analyzer

### Overview
Scan a dog food barcode to analyze ingredient risk levels and overall quality.

### Input
| Input Method | Description |
|-------------|-------------|
| Barcode Scan | Recognize barcode on food packaging via camera |
| Manual Search | Enter product name directly (fallback if barcode fails) |

### Processing
1. Extract barcode value using expo-barcode-scanner
2. Call Open Pet Food Facts API (`https://world.openpetfoodfacts.org/api/v0/product/{barcode}.json`)
3. Parse ingredient list
4. Match against internal hazardous ingredient DB

### Output

**Product Basic Info**
- Product name, brand, photo (if available from API)
- Overall grade (A–D)

**Ingredient Analysis**
| Category | Display |
|----------|---------|
| Key Ingredients | Top 5 ingredients highlighted |
| Hazardous | Red tag |
| Caution | Yellow tag |
| Good | Green tag |

**Key Hazardous / Caution Ingredients**
```
Hazardous: BHA, BHT, Ethoxyquin, Propylene glycol, Artificial colors (Red 40, etc.)
Caution:   Corn syrup, By-products, Wheat gluten, Artificial flavoring
Good:      Real meat (Chicken, Beef), Sweet potato, Peas
```

### Error Handling
- Barcode not recognized → prompt manual search
- No API data → show "Unregistered product" + guide to photograph ingredient label (v1.1)
- Offline → display cached recent search results

### Ads
- Banner ad at bottom of analysis result screen

---

## F003. Symptom Checker

### Overview
Owner inputs current symptoms, app assesses severity and provides action guidance.

### Input
- Select symptom category → select specific symptoms → answer follow-up questions

### Symptom Categories
```
🤢 Digestive/Vomiting  — Vomiting, Diarrhea, Constipation, Loss of appetite
😮‍💨 Breathing          — Coughing, Difficulty breathing, Increased snoring
🦵 Movement            — Limping, Refusing to move, Trembling
👁️ Eyes/Ears/Nose      — Eye discharge, Redness, Ear scratching, Runny nose
🩹 Skin/Coat           — Itching, Hair loss, Redness, Lumps
😴 Behavioral Changes  — Lethargy, Excessive drinking, Wandering
🚨 Emergency Symptoms  — Loss of consciousness, Seizures, Breathing stopped
```

### Decision Tree Example
```
Vomiting selected
  └─ How many times today?
      ├─ 1–2 times
      │   └─ Does it contain blood or foreign material?
      │       ├─ Yes → 🔴 Go to vet today
      │       └─ No  → 🟢 Watch and wait
      └─ 3 or more times → 🔴 Go to vet today
```

### Output — 3 Severity Levels

| Level | Icon | Color | Message |
|-------|------|-------|---------|
| Emergency | 🚨 | Red | "Go to the vet right now" |
| Today | ⚠️ | Yellow | "See a vet within today" |
| Watch | ✅ | Green | "Not urgent right now" |

**Result Screen Contents**
- Reason for assessment
- At-home actions (Watch level only)
- Warning signs to monitor
- Nearest hospital shortcut button (Emergency / Today levels)
- Disclaimer: "This result is for reference only and does not replace veterinary diagnosis."

### Ads
- Interstitial: shown just before result screen opens (except Emergency level)
- Banner ad at bottom of result screen

---

## F004. 24-Hour Hospital Finder

### Overview
Finds nearby animal hospitals based on current location and displays 24-hour availability.

### Input
- Auto-detect current location (expo-location)
- Search radius selection: 500m / 1km / 3km / 5km

### Processing
1. Search for "animal hospital" via Kakao Local API
2. Parse operating hours → determine if currently open
3. Sort by distance

### Output

**Map View**
- Current location marker
- Hospital pins
  - 🟢 Currently open
  - 🔴 Currently closed
  - ⭐ 24-hour operation

**List View**
Each hospital card includes:
- Hospital name
- Open/closed status badge
- Distance
- Phone number (tap to open phone app)
- Operating hours

**Detail Screen**
- Map (hospital location)
- Call button
- Directions button (deep link to Kakao Maps / Naver Maps)
- Full operating hours

### Error Handling
- Location permission denied → prompt manual address entry
- No results found → suggest expanding radius
- Offline → show cached results with offline notice

### Ads
- Native ad inserted at 3rd item position in hospital list
- Banner ad when no open hospitals are found

---

## F005. Health Records

### Overview
Locally stores and manages vaccination history, weight, and vet visit records for a dog.

### Data Storage
- expo-sqlite + Drizzle ORM
- Local storage only (no server)
- Data is deleted if app is uninstalled (v1.0)

### Dog Profile
| Field | Required |
|-------|----------|
| Name | Required |
| Breed | Optional |
| Date of birth | Optional |
| Sex | Optional |
| Neutered/Spayed | Optional |
| Profile photo | Optional |

### Record Types

**Vaccination Record**
| Field | Description |
|-------|-------------|
| Vaccine type | Select from DHPPL, Coronavirus, Kennel cough, Rabies, Influenza, etc. |
| Vaccination date | Date picker |
| Next scheduled date | Auto-calculated or manual input |
| Notes | Optional |

**Weight Record**
| Field | Description |
|-------|-------------|
| Date | Date |
| Weight | kg unit |
| Notes | Optional |

Weight change graph (line chart, last 10 records)

**Vet Visit Record**
| Field | Description |
|-------|-------------|
| Visit date | Date |
| Hospital name | Text |
| Reason for visit | Select + free text |
| Diagnosis | Text |
| Prescribed medication | Text |
| Cost | Optional |
| Next appointment | Optional |

### Screen Layout
- Timeline view: all records in reverse chronological order
- Category tabs: Vaccination / Weight / Vet separated
- Floating add button

### Ads
- Banner ad at bottom of records tab

---

## F006. Dog Profile Setup

### Overview
Register dog information on first launch; editable afterwards.

### Onboarding Flow
```
First app launch
  → Service introduction (2–3 slide carousel)
  → Dog profile registration
  → Home screen
```

### Profile Fields
- Name (required)
- Photo (optional — camera or gallery)
- Breed (search or free text)
- Date of birth (date picker)
- Sex + neutered/spayed status

---

## Ad Placement Summary

| Screen | Ad Type | Trigger |
|--------|---------|---------|
| Food safety result | Banner | After result displayed |
| Ingredient analysis result | Banner | After result displayed |
| Entering symptom result | Interstitial | Before result screen opens (not Emergency) |
| Symptom result | Banner | Bottom of result |
| Hospital list | Native | 3rd item position |
| Health records tab | Banner | Bottom of tab |

---

## Data Sources

| Feature | Data Source | Method |
|---------|-------------|--------|
| Food safety | Custom-built JSON DB | Bundled in app |
| Ingredient analysis | Open Pet Food Facts | API call |
| Hospital locations | Kakao Local API | API call |
| Health records | Local SQLite | On-device storage |
