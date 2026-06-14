# Service Planning Document

**Service Name:** DaengDaeng Care
**Version:** v1.0
**Platform:** iOS
**Date:** 2026-06-12

---

## 1. Service Overview

### One-Line Definition
An all-in-one health management app for dog owners — food safety, ingredient analysis, symptom checking, hospital finder, and health records all in one place.

### Background
- Approximately 15 million pet-owning households in South Korea (1 in 4 households)
- Dog owners' biggest anxieties: "Can my dog eat this?", "Should I go to the vet?", "When was the last vaccination?"
- Existing apps are fragmented — users have to switch between multiple apps
- No single app solves everyday dog health questions in one place

### Core Value Proposition
> "Every day with your dog, with more peace of mind."

---

## 2. Target Users

### Primary Target
- Dog owners in their 20s–40s (especially single-person households and newlyweds)
- First-time dog owners who are new to pet care
- Health-conscious owners who actively research information about their dogs

### User Personas

**Persona A — First-time Owner, Jisoo Kim (28)**
- Adopted a Maltese 3 months ago
- Searches the internet every time she's unsure what food to give
- Has missed a vaccination appointment before
- Panics at night when her dog seems unwell because she doesn't know where emergency vets are

**Persona B — Experienced Owner, Minjun Lee (35)**
- Has been raising a Golden Retriever for 5 years
- Carefully monitors dog food ingredients
- Currently writes health records in a notebook
- Wants a more organized digital tracking tool

---

## 3. Core Features Summary

| Feature | Description | Usage Frequency |
|---------|-------------|-----------------|
| Food Safety Checker | Instantly check if a food is safe | Daily |
| Ingredient Analyzer | Scan barcode to analyze food ingredient risks | At purchase |
| Symptom Checker | Input symptoms → determine if vet visit needed | Occasional |
| Hospital Finder | Find 24-hour animal hospitals near current location | Emergency |
| Health Records | Track vaccinations, weight, and vet visits | Weekly |

---

## 4. Revenue Model

### AdMob Advertising (Primary Revenue)
- **Banner Ads:** Fixed at the bottom of each result screen
- **Interstitial Ads:** Shown just before entering the symptom check result screen (highest attention moment)
- **Native Ads:** Inserted within the hospital list

### Ad Placement Principles
- No ads during urgent situations (while navigating hospital finder, during active symptom check)
- Ads only shown after information is confirmed, in a natural context
- Ad frequency maintained so it does not disrupt UX

---

## 5. UX Principles

1. **Immediacy** — Users should reach the information they need within 3 seconds
2. **Trustworthiness** — Health-related app: always show source and basis for information
3. **Reassurance** — Colors, tone, and language should feel warm and stable
4. **Simplicity** — Even with many features, the home screen stays simple; depth lives inside tabs

---

## 6. Design Direction

### Tone & Mood
- Warm and trustworthy feel
- Subtle cuteness (pet app, but not childish)
- Balance between the credibility of a medical/health app and the friendliness of a pet app

### Color Direction
- Primary: Warm tones (amber/orange or green — to be finalized)
- Secondary: Light neutrals
- Alerts: Clear 3-level distinction — Red / Yellow / Green
- Background: White or very light cream

### Typography
- Korean readability as the top priority
- Key information on result screens: large and bold
- Body/description text: light and easy to read

---

## 7. Technical Constraints (Design Must Reflect)

- **Platform:** iOS only (iPhone baseline, dark mode support required)
- **Component Pattern:** Compound Component Pattern
  - UI elements on each screen are composable
  - Example: `<FoodCard>`, `<FoodCard.Badge>`, `<FoodCard.Description>`
- **Ad Area:** Banner height fixed at 50–60pt — must be reserved in layout
- **Safe Area:** Must handle iPhone notch and Dynamic Island

---

## 8. v1.0 Launch Scope

### Included
- All 5 core features
- Single dog profile
- AdMob ads

### Not Included (Future Versions)
- Multiple dog profile management
- Social/community features
- Cat support
- Push notifications (vaccination reminders — v1.1)
