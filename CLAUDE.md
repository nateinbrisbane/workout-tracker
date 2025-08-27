# Workout Tracker - Project Context for Claude

## Project Overview
A personal workout tracking application built with Next.js that allows users to log and track their exercise routines. The app supports weight training, bodyweight exercises, and cardio workouts with proper unit conversion and timezone handling.

## Tech Stack
- **Frontend**: Next.js 14.2.5 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Prisma
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components with shadcn/ui patterns
- **Date Handling**: date-fns

## Project Structure
```
/app                    # Next.js app directory
  /api                 # API routes
    /workouts         # Workout CRUD operations
    /workout-types    # Workout type management
  /history            # History page
  /settings           # Settings page for workout types
  page.tsx            # Main workout tracking page

/components           # React components
  navigation.tsx      # Navigation with mobile hamburger menu
  workout-form.tsx    # Form for adding workouts (adapts based on type)
  workout-list.tsx    # Display list with smart formatting
  icon-selector.tsx   # Emoji icon picker

/lib
  prisma.ts          # Prisma client
  date-utils.ts      # Timezone and date handling utilities

/prisma
  schema.prisma      # Database schema
```

## Database Schema

### WorkoutType
```prisma
model WorkoutType {
  id            String   @id @default(cuid())
  name          String   @unique
  icon          String   @default("💪")
  category      String   @default("weight")  // "weight" or "cardio"
  isBodyWeight  Boolean  @default(false)
  unit          String   @default("kg")      // "kg" or "lbs"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Workout
```prisma
model Workout {
  id        String   @id @default(cuid())
  exercise  String   // Exercise name
  weight    Float    // Weight/Time depending on category
  reps      Int      // Reps/Distance depending on category
  date      DateTime // Stored in local time
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Key Features & Implementation Details

### 1. Timezone Handling
- **Issue**: Server runs in different timezone than users
- **Solution**: 
  - Store dates in local time format
  - Add 10-hour offset for Australian Eastern Standard Time in filtering
  - Client-side date grouping in History page
- **Key Files**: `lib/date-utils.ts`, `app/api/workouts/route.ts`

### 2. Dynamic Workout Types
- **Weight Training**: Shows weight (kg/lbs) and reps
- **Bodyweight**: Allows 0 weight, shows "Bodyweight × reps" or "BW + weight"
- **Cardio**: Shows time (minutes) and distance (km)
- **Implementation**: Form validation adapts based on selected exercise type

### 3. Display Formatting
The workout list dynamically formats based on workout type:
- Weight: `50kg × 10 reps` or `100lbs × 8 reps`
- Bodyweight: `Bodyweight × 15 reps` or `BW + 10kg × 8 reps`
- Cardio: `30 min × 5 km`

## Common Commands

```bash
# Development
npm run dev          # Start development server

# Type checking
npm run typecheck    # Check TypeScript types

# Database
DATABASE_URL="postgresql://neondb_owner:npg_rSeg3hoiTdE4@ep-weathered-hat-a7mc4fdu-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require" npx prisma db push  # Push schema changes
DATABASE_URL="postgresql://neondb_owner:npg_rSeg3hoiTdE4@ep-weathered-hat-a7mc4fdu-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require" npx prisma studio  # Open Prisma Studio

# Build & Deploy
npm run build        # Build for production
git push            # Deploy to production (auto-deploys)
```

## Important Conventions

### Date Handling
- Always use `getLocalDateString()` for current date
- Dates are stored as local time, not UTC
- Use date-utils functions for consistency

### Form Validation
- Bodyweight exercises: weight is optional (can be 0 or empty)
- Regular weight exercises: weight required > 0
- Cardio: time and distance >= 0

### API Responses
- Always include workout type details (category, unit, isBodyWeight)
- Filter workouts in memory to avoid timezone issues
- Cache busting with `cache: 'no-store'` for fresh data

## Known Issues & Solutions

### Issue: Workouts showing on wrong day
**Cause**: Timezone mismatch between server and client
**Solution**: Implemented in `app/api/workouts/route.ts` - adds 10-hour offset for AEST

### Issue: History page not updating
**Solution**: Added focus event listener and cache busting

### Issue: Bodyweight exercises requiring weight
**Solution**: Dynamic validation schema based on workout type

## Testing Checklist
- [ ] Add weight training workout (kg and lbs)
- [ ] Add bodyweight workout with no weight
- [ ] Add bodyweight workout with additional weight
- [ ] Add cardio workout
- [ ] Navigate between dates
- [ ] Check History page shows correct dates
- [ ] Edit workout types and verify changes reflect
- [ ] Test on mobile for responsive design

## Future Enhancements
- User authentication
- Workout templates/routines
- Progress tracking and charts
- Export data functionality
- PWA support for offline use
- Multiple sets per exercise grouping

## Deployment
- **Platform**: Vercel (auto-deploys from GitHub main branch)
- **Database**: Neon PostgreSQL
- **Environment Variables**: DATABASE_URL set in Vercel

## Support Contact
For issues or questions about the codebase, refer to this document first, then check the README.md for user-facing documentation.