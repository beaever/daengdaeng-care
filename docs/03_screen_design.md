# Screen Design Specification

**Service Name:** DaengDaeng Care
**Version:** v1.0
**Date:** 2026-06-12
**Reference Device:** iPhone 14 (390 x 844pt)

---

## Full Screen List

```
SCR-001  Splash
SCR-002  Onboarding (3 slides)
SCR-003  Profile Setup
SCR-004  Home
SCR-005  Food Safety Checker — Search
SCR-006  Food Safety Checker — Result
SCR-007  Ingredient Analyzer — Scan
SCR-008  Ingredient Analyzer — Result
SCR-009  Symptom Checker — Category Selection
SCR-010  Symptom Checker — Follow-up Questions
SCR-011  Symptom Checker — Result
SCR-012  Hospital Finder — Map / List
SCR-013  Hospital Finder — Detail
SCR-014  Health Records — Main
SCR-015  Health Records — Add Record
SCR-016  Settings
```

---

## Navigation Structure

```
Tab Bar (fixed at bottom)
├── 🏠 Home
├── 🍖 Food / Ingredients
├── 🩺 Symptom Check
├── 🏥 Hospital Finder
└── 📋 Health Records
```

---

## SCR-001. Splash

```
┌─────────────────────────┐
│                         │
│                         │
│                         │
│        [App Logo]       │
│      DaengDaeng Care    │
│  Every day with your    │
│  dog, with more peace   │
│       of mind.          │
│                         │
│                         │
└─────────────────────────┘
```

**Components**
- App logo (centered, upper third)
- App name
- Service tagline
- Background: primary color or white

**Behavior**
- Auto-navigate after 1.5 seconds
- First launch → Onboarding
- Re-launch → Home

---

## SCR-002. Onboarding

**3 slides, paging style**

```
Slide 1
┌─────────────────────────┐
│                    Skip │
│                         │
│       [Illustration]    │
│  Not sure what foods    │
│  are safe for your dog? │
│                         │
│   Search and find out   │
│      instantly.         │
│                         │
│        ● ○ ○            │
│        [Next]           │
└─────────────────────────┘

Slide 2
┌─────────────────────────┐
│                    Skip │
│                         │
│       [Illustration]    │
│  Not sure whether to    │
│  visit the vet when     │
│  symptoms appear?       │
│                         │
│   Enter symptoms and    │
│    we'll tell you.      │
│                         │
│        ○ ● ○            │
│        [Next]           │
└─────────────────────────┘

Slide 3
┌─────────────────────────┐
│                         │
│       [Illustration]    │
│  Vaccinations, weight,  │
│  and vet visits —       │
│  all in one place.      │
│                         │
│                         │
│        ○ ○ ●            │
│      [Get Started]      │
└─────────────────────────┘
```

---

## SCR-003. Profile Setup

```
┌─────────────────────────┐
│  Tell us about your dog │
│                         │
│      [Photo Area]       │  ← Tap to open camera/gallery
│      📷 Add Photo       │
│                         │
│  Name *                 │
│  ┌───────────────────┐  │
│  │  e.g. Buddy       │  │
│  └───────────────────┘  │
│                         │
│  Breed                  │
│  ┌───────────────────┐  │
│  │ Search or type    │  │
│  └───────────────────┘  │
│                         │
│  Date of Birth          │
│  ┌───────────────────┐  │
│  │ Select date       │  │
│  └───────────────────┘  │
│                         │
│  Sex                    │
│  [Male]  [Female]       │
│                         │
│  Neutered / Spayed      │
│  [Yes]  [No]  [Unknown] │
│                         │
│  ┌─────────────────────┐ │
│  │      Get Started    │ │
│  └─────────────────────┘ │
└─────────────────────────┘
```

**Compound Component Structure**
```jsx
<ProfileForm>
  <ProfileForm.Avatar />
  <ProfileForm.Field label="Name" required />
  <ProfileForm.Field label="Breed" />
  <ProfileForm.DatePicker label="Date of Birth" />
  <ProfileForm.RadioGroup label="Sex" options={['Male', 'Female']} />
  <ProfileForm.RadioGroup label="Neutered" options={['Yes', 'No', 'Unknown']} />
  <ProfileForm.SubmitButton />
</ProfileForm>
```

---

## SCR-004. Home

```
┌─────────────────────────┐
│  DaengDaeng Care   🔔   │  ← Header
│                         │
│  ┌─────────────────────┐ │
│  │ 🐶 Buddy            │ │  ← Pet profile card
│  │ Maltese · 2 yrs     │ │
│  │ Next vaccine: D-15  │ │
│  └─────────────────────┘ │
│                         │
│  Quick Access           │
│  ┌────────┐ ┌────────┐  │
│  │  🍖    │ │  📦    │  │
│  │  Food  │ │Ingred. │  │
│  │Checker │ │Analyzer│  │
│  └────────┘ └────────┘  │
│  ┌────────┐ ┌────────┐  │
│  │  🩺    │ │  🏥    │  │
│  │Symptom │ │Hospital│  │
│  │Checker │ │ Finder │  │
│  └────────┘ └────────┘  │
│                         │
│  Health Summary         │
│  ┌─────────────────────┐ │
│  │ Last weight: 3.2kg  │ │
│  │ Last vet: 3 wks ago │ │
│  │ Next vaccine: 15d   │ │
│  └─────────────────────┘ │
│                         │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │  ← Tab bar
└─────────────────────────┘
```

**Compound Component Structure**
```jsx
<PetProfileCard>
  <PetProfileCard.Avatar />
  <PetProfileCard.Info />
  <PetProfileCard.NextVaccine />
</PetProfileCard>

<QuickMenu>
  <QuickMenu.Item icon="food" label="Food Checker" />
  <QuickMenu.Item icon="barcode" label="Ingredient Analyzer" />
  <QuickMenu.Item icon="symptom" label="Symptom Checker" />
  <QuickMenu.Item icon="hospital" label="Hospital Finder" />
</QuickMenu>

<HealthSummaryCard>
  <HealthSummaryCard.WeightRow />
  <HealthSummaryCard.LastVisitRow />
  <HealthSummaryCard.NextVaccineRow />
</HealthSummaryCard>
```

---

## SCR-005. Food Safety Checker — Search

```
┌─────────────────────────┐
│  ←  Is this food safe?  │  ← Header
│                         │
│  ┌───────────────────┐  │
│  │ 🔍 Search food... │  │  ← Auto-focused
│  └───────────────────┘  │
│                         │
│  Frequently Searched    │
│  [Grapes] [Chocolate]   │
│  [Apple]  [Chicken]     │
│  [Carrot] [Sweet potato]│
│                         │
│  ─────────────────────  │
│  Recent Searches        │
│  Grapes           ×     │
│  Broccoli         ×     │
│  Watermelon       ×     │
│                         │
│                         │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**While Typing**
```
┌─────────────────────────┐
│  ←  Is this food safe?  │
│                         │
│  ┌───────────────────┐  │
│  │ 🔍 grape|         │  │  ← Typing
│  └───────────────────┘  │
│                         │
│  Grape                  │  ← Autocomplete list
│  Grape (raisins)        │
│  Grape juice            │
│  Grape seed oil         │
│                         │
└─────────────────────────┘
```

---

## SCR-006. Food Safety Checker — Result

**Danger Level Example**

```
┌─────────────────────────┐
│  ←  Is this food safe?  │
│                         │
│  Grapes                 │
│                         │
│  ┌─────────────────────┐ │
│  │  🚨                  │ │
│  │  Never give this     │ │  ← Red background
│  └─────────────────────┘ │
│                         │
│  Why is it dangerous?   │
│  Grapes and raisins can │
│  cause kidney failure   │
│  in dogs. Even small    │
│  amounts are dangerous. │
│                         │
│  Symptoms if ingested   │
│  • Vomiting, Diarrhea   │
│  • Lethargy             │
│  • Decreased urination  │
│                         │
│  Also avoid these       │
│  [Raisins] [Grape juice]│
│  [Grape seed oil]       │
│                         │
│  ─────────────────────  │
│  [Ad Banner — 50pt]     │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**Safe Level Example**

```
┌─────────────────────────┐
│  ←  Is this food safe?  │
│                         │
│  Carrots                │
│                         │
│  ┌─────────────────────┐ │
│  │  ✅                  │ │
│  │  Safe to eat         │ │  ← Green background
│  └─────────────────────┘ │
│                         │
│  How to serve           │
│  Serve raw or cooked.   │
│  Cut into small pieces  │
│  to prevent choking.    │
│                         │
│  Nutritional Info       │
│  Beta-carotene, Fiber   │
│  Vitamin A, Vitamin K   │
│                         │
│  ─────────────────────  │
│  [Ad Banner — 50pt]     │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**Compound Component Structure**
```jsx
<FoodResult>
  <FoodResult.Header foodName="Grapes" />
  <FoodResult.SafetyBadge level="danger" />   // 'safe' | 'caution' | 'danger'
  <FoodResult.Description />
  <FoodResult.Symptoms />                      // only for danger/caution
  <FoodResult.RelatedFoods />
  <FoodResult.AdBanner />
</FoodResult>
```

---

## SCR-007. Ingredient Analyzer — Scan

```
┌─────────────────────────┐
│  ←  Ingredient Analyzer │
│                         │
│  ┌─────────────────────┐ │
│  │                     │ │
│  │    [Camera View]    │ │
│  │                     │ │
│  │   ┌───────────┐     │ │
│  │   │           │     │ │  ← Barcode scan guide
│  │   │           │     │ │
│  │   └───────────┘     │ │
│  │ Align barcode here  │ │
│  └─────────────────────┘ │
│                         │
│  ────────── or ──────── │
│                         │
│  [Search by product name]│
│                         │
└─────────────────────────┘
```

---

## SCR-008. Ingredient Analyzer — Result

```
┌─────────────────────────┐
│  ←  Ingredient Analyzer │
│                         │
│  ┌──────┐               │
│  │ img  │ Royal Canin   │
│  │      │ Mini Adult    │
│  └──────┘ Royal Canin   │
│                         │
│  Overall Grade          │
│  ┌─────────────────────┐ │
│  │         B+           │ │  ← Grade display
│  │   Good quality food  │ │
│  └─────────────────────┘ │
│                         │
│  Top Ingredients (Top 5)│
│  1. Chicken       ✅     │
│  2. Rice          ✅     │
│  3. Corn gluten   ⚠️     │
│  4. Animal fat    ✅     │
│  5. Wheat         ⚠️     │
│                         │
│  Ingredients to Watch   │
│  ┌────────────────┐     │
│  │ Corn gluten ⚠️ │     │
│  └────────────────┘     │
│  May trigger allergies  │
│                         │
│  ─────────────────────  │
│  [Ad Banner — 50pt]     │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**Compound Component Structure**
```jsx
<FoodAnalysisResult>
  <FoodAnalysisResult.ProductHeader
    name="Royal Canin Mini Adult"
    brand="Royal Canin"
    image={...}
  />
  <FoodAnalysisResult.GradeBadge grade="B+" />
  <FoodAnalysisResult.IngredientList>
    <FoodAnalysisResult.IngredientItem name="Chicken" status="safe" rank={1} />
    <FoodAnalysisResult.IngredientItem name="Corn gluten" status="caution" rank={3} />
  </FoodAnalysisResult.IngredientList>
  <FoodAnalysisResult.WarningSection />
  <FoodAnalysisResult.AdBanner />
</FoodAnalysisResult>
```

---

## SCR-009. Symptom Checker — Category Selection

```
┌─────────────────────────┐
│  ←  Symptom Checker     │
│  What seems wrong?      │
│                         │
│  ┌─────────┐ ┌─────────┐│
│  │  🤢     │ │  😮‍💨    ││
│  │Digestive│ │Breathing││
│  └─────────┘ └─────────┘│
│  ┌─────────┐ ┌─────────┐│
│  │  🦵     │ │  👁️     ││
│  │Movement │ │Eye/Ear/ ││
│  │         │ │  Nose   ││
│  └─────────┘ └─────────┘│
│  ┌─────────┐ ┌─────────┐│
│  │  🩹     │ │  😴     ││
│  │  Skin / │ │Behavior ││
│  │   Coat  │ │ Change  ││
│  └─────────┘ └─────────┘│
│                         │
│  ┌─────────────────────┐ │
│  │ 🚨  Emergency        │ │  ← Red emphasis
│  │ Seizure / Collapsed  │ │
│  └─────────────────────┘ │
│                         │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

---

## SCR-010. Symptom Checker — Follow-up Questions

```
┌─────────────────────────┐
│  ←                 2/4  │  ← Progress indicator
│  ████████░░░░░░░░░░     │  ← Progress bar
│                         │
│  How many times has     │
│  your dog vomited today?│
│                         │
│  ○  1–2 times           │
│  ○  3–4 times           │
│  ○  5 or more times     │
│  ○  Hasn't vomited yet  │
│                         │
│                         │
│                         │
│                         │
│  ┌─────────────────────┐ │
│  │        Next         │ │
│  └─────────────────────┘ │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**Compound Component Structure**
```jsx
<SymptomChecker>
  <SymptomChecker.ProgressBar current={2} total={4} />
  <SymptomChecker.Question text="How many times has your dog vomited today?" />
  <SymptomChecker.Options>
    <SymptomChecker.Option value="1-2" label="1–2 times" />
    <SymptomChecker.Option value="3-4" label="3–4 times" />
    <SymptomChecker.Option value="5+" label="5 or more times" />
    <SymptomChecker.Option value="none" label="Hasn't vomited yet" />
  </SymptomChecker.Options>
  <SymptomChecker.NextButton />
</SymptomChecker>
```

---

## SCR-011. Symptom Checker — Result

**Emergency Level**

```
┌─────────────────────────┐
│  ←  Symptom Check Result│
│                         │
│  ┌─────────────────────┐ │
│  │  🚨                  │ │
│  │  Go to the vet       │ │  ← Red background
│  │  right now           │ │
│  └─────────────────────┘ │
│                         │
│  Why so urgent?         │
│  Vomiting with blood    │
│  may indicate internal  │
│  bleeding or poisoning. │
│                         │
│  Do this right now      │
│  • Stop food and water  │
│  • Take a photo of      │
│    the vomit            │
│  • Head to nearest vet  │
│                         │
│  ┌─────────────────────┐ │
│  │ 🏥 Find Nearby Vet  │ │  ← Hospital finder link
│  └─────────────────────┘ │
│                         │
│  ※ This result is for   │
│  reference only and does│
│  not replace a vet's    │
│  diagnosis.             │
│                         │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**Watch Level**

```
┌─────────────────────────┐
│  ←  Symptom Check Result│
│                         │
│  ┌─────────────────────┐ │
│  │  ✅                  │ │
│  │  Not urgent          │ │  ← Green background
│  │  right now           │ │
│  └─────────────────────┘ │
│                         │
│  What you can do        │
│  • Provide plenty of    │
│    fresh water          │
│  • Switch to bland diet │
│  • Keep environment     │
│    calm and comfortable │
│                         │
│  Go to the vet if...    │
│  • No improvement in    │
│    24 hours             │
│  • Blood in stool/urine │
│  • Worsening lethargy   │
│                         │
│  ─────────────────────  │
│  [Ad Banner — 50pt]     │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**Compound Component Structure**
```jsx
<SymptomResult>
  <SymptomResult.SeverityBadge level="emergency" />  // 'emergency' | 'today' | 'watch'
  <SymptomResult.Reason />
  <SymptomResult.ActionList />
  <SymptomResult.WatchList />
  <SymptomResult.HospitalButton />                   // emergency and today only
  <SymptomResult.Disclaimer />
  <SymptomResult.AdBanner />                         // watch only
</SymptomResult>
```

---

## SCR-012. Hospital Finder — Map / List

```
┌─────────────────────────┐
│  ←  Nearby Animal Vets  │
│  [Map] [List]  Radius[1km▼]│  ← View toggle + radius selector
│                         │
│  ┌─────────────────────┐ │
│  │                     │ │
│  │      [Map View]     │ │
│  │  📍Me    🟢  🔴     │ │  ← Open/closed pins
│  │                     │ │
│  └─────────────────────┘ │
│                         │
│  4 hospitals nearby     │
│  ─────────────────────  │
│  🟢 Open now            │
│  Happy Animal Clinic  0.3km│
│  02-123-4567  9am–9pm   │
│  ─────────────────────  │
│  ⭐ 24 Hours            │  ← 24hr emphasis
│  Gangnam Emergency  1.1km│
│  02-999-0000  24 Hours  │
│  ─────────────────────  │
│  [Native Ad Area]       │  ← 3rd position
│  ─────────────────────  │
│  🔴 Closed now          │
│  Miso Animal Clinic 1.4km│
│  02-456-7890  9am–7pm   │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**Compound Component Structure**
```jsx
<HospitalList>
  <HospitalList.ViewToggle />
  <HospitalList.RadiusSelector />
  <HospitalList.Map />
  <HospitalList.ResultCount />
  {hospitals.map((h, i) => (
    <>
      <HospitalCard key={h.id}>
        <HospitalCard.StatusBadge isOpen={h.isOpen} is24h={h.is24h} />
        <HospitalCard.Name />
        <HospitalCard.Distance />
        <HospitalCard.Phone />
        <HospitalCard.Hours />
      </HospitalCard>
      {i === 1 && <NativeAd />}
    </>
  ))}
</HospitalList>
```

---

## SCR-013. Hospital Finder — Detail

```
┌─────────────────────────┐
│  ←  Hospital Detail     │
│                         │
│  ┌─────────────────────┐ │
│  │    [Mini Map]       │ │
│  │        📍           │ │
│  └─────────────────────┘ │
│                         │
│  Gangnam Emergency Vet  │
│  ⭐ Open 24 Hours       │
│                         │
│  📍 123-45 Yeoksam-dong │
│     Gangnam-gu, Seoul   │
│                         │
│  🕐 Hours               │
│  Mon–Sun: 24 Hours      │
│                         │
│  📞 02-999-0000         │
│                         │
│  ┌─────────┐ ┌─────────┐│
│  │ 📞 Call │ │🗺️ Direc.││
│  └─────────┘ └─────────┘│
│                         │
└─────────────────────────┘
```

---

## SCR-014. Health Records — Main

```
┌─────────────────────────┐
│  Health Records     ＋  │  ← Header + add button
│                         │
│  🐶 Buddy               │
│                         │
│  [All] [Vaccine] [Weight] [Vet]│  ← Category tabs
│                         │
│  Jun 10, 2026           │
│  ┌─────────────────────┐ │
│  │ 💉 Vaccination      │ │
│  │ DHPPL — 5th dose    │ │
│  │ Next: Jun 10, 2027  │ │
│  └─────────────────────┘ │
│                         │
│  May 25, 2026           │
│  ┌─────────────────────┐ │
│  │ ⚖️ Weight            │ │
│  │ 3.2 kg              │ │
│  │ +0.1kg from last mo.│ │
│  └─────────────────────┘ │
│                         │
│  May 10, 2026           │
│  ┌─────────────────────┐ │
│  │ 🏥 Vet Visit        │ │
│  │ Happy Animal Clinic │ │
│  │ Skin rash checkup   │ │
│  └─────────────────────┘ │
│                         │
│  ─────────────────────  │
│  [Ad Banner — 50pt]     │
├─────────────────────────┤
│  🏠    🍖    🩺   🏥  📋 │
└─────────────────────────┘
```

**Compound Component Structure**
```jsx
<HealthRecord>
  <HealthRecord.PetHeader />
  <HealthRecord.CategoryTabs />
  <HealthRecord.Timeline>
    <HealthRecord.TimelineGroup date="Jun 10, 2026">
      <HealthRecord.VaccineEntry data={...} />
    </HealthRecord.TimelineGroup>
    <HealthRecord.TimelineGroup date="May 25, 2026">
      <HealthRecord.WeightEntry data={...} />
    </HealthRecord.TimelineGroup>
  </HealthRecord.Timeline>
  <HealthRecord.AdBanner />
</HealthRecord>
```

---

## SCR-015. Health Records — Add Record

```
┌─────────────────────────┐
│  ×  Add Record          │  ← X button (modal sheet)
│                         │
│  Record Type            │
│  [💉 Vaccine] [⚖️ Weight]│
│  [🏥 Vet Visit]         │
│                         │
│  ── When Vaccine Selected ──│
│                         │
│  Vaccine Type           │
│  ┌───────────────────┐  │
│  │ DHPPL ▼           │  │
│  └───────────────────┘  │
│                         │
│  Vaccination Date       │
│  ┌───────────────────┐  │
│  │ Jun 12, 2026      │  │
│  └───────────────────┘  │
│                         │
│  Next Scheduled Date    │
│  ┌───────────────────┐  │
│  │ Jun 12, 2027 (auto)│  │
│  └───────────────────┘  │
│                         │
│  Notes (Optional)       │
│  ┌───────────────────┐  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  ┌─────────────────────┐ │
│  │        Save         │ │
│  └─────────────────────┘ │
└─────────────────────────┘
```

---

## SCR-016. Settings

```
┌─────────────────────────┐
│  Settings               │
│                         │
│  Dog Profile            │
│  ┌─────────────────────┐ │
│  │ 🐶 Buddy            │ │
│  │ Maltese · 2 yrs   > │ │
│  └─────────────────────┘ │
│                         │
│  App Settings           │
│  Notifications        > │
│  Units (kg / lbs)     > │
│                         │
│  Legal                  │
│  Privacy Policy       > │
│  Terms of Service     > │
│  Version 1.0.0          │
│                         │
└─────────────────────────┘
```

---

## Shared Component Definitions

### AdBanner
```jsx
<AdBanner>
  <AdBanner.Container height={50} />   // fixed height
  <AdBanner.Unit unitId="..." />
</AdBanner>
```

### SafetyBadge
```jsx
<SafetyBadge level="danger" />    // 'danger' | 'caution' | 'safe'
// → color, icon, and label determined automatically
```

### StatusBadge (Hospital open status)
```jsx
<StatusBadge isOpen={true} is24h={false} />
// → 🟢 Open / ⭐ 24 Hours / 🔴 Closed
```

### EmptyState
```jsx
<EmptyState>
  <EmptyState.Icon />
  <EmptyState.Title />
  <EmptyState.Description />
  <EmptyState.Action />
</EmptyState>
```

---

## Key Interaction Definitions

| Interaction | Behavior |
|-------------|----------|
| Tap food search result | Push to result screen |
| Tap hospital card | Push to detail screen |
| Tap hospital call button | Open phone app |
| Tap directions button | Deep link to Kakao Maps / Naver Maps |
| Tap health record card | Open detail / edit screen |
| Back during symptom check | Go to previous question (pop stack) |
| Tap home quick menu | Navigate directly to that tab |

---

## Ad Area Layout Rules

1. **Banner ads:** Fixed above tab bar, height 50pt
2. **Interstitial:** Full screen on screen transition; close button activates after 5 seconds
3. **Native ads:** Same card style as list items; must display `[Ad]` label
4. **No ads on Emergency screens** (Emergency level symptom result)
