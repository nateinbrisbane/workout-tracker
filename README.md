# 💪 Workout Tracker

A simple workout tracking application built with Next.js, React, and TypeScript. Track your exercises, manage workout types, and view your progress!

🚀 **Live App**: Track your workouts online!

## Features

- 🏋️ **Simple Workout Logging**: Add sets with exercise, weight (kg), and reps
- ⚙️ **Custom Exercise Types**: Manage your own exercise library in Settings
- 📱 **Mobile-Friendly**: Optimized for iPhone and Android
- 📊 **Today's Focus**: Track today's workout with date display
- 🗂️ **Workout History**: View all your previous workout sessions
- 🔄 **Dynamic Dropdowns**: Exercise list updates automatically from your settings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Storage**: Local file-based SQLite database

## Getting Started

### Prerequisites

- Node.js 18 or higher

### Installation & Testing Locally

1. **Navigate to the project directory**:
```bash
cd "C:\Users\me\OneDrive\Desktop\Workout Tracker"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up the database**:
```bash
npx prisma generate
npx prisma db push
```

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser**:
   - Go to [http://localhost:3000](http://localhost:3000)
   - The app will create a SQLite database file automatically

### Testing the App

1. **Add a workout**:
   - Fill in workout name (e.g., "Push Day")
   - Select type (Weights or Cardio)
   - Add exercises with appropriate metrics:
     - **Weights**: Exercise name, weight (kg), reps
     - **Cardio**: Exercise name, distance (km), time (minutes)

2. **Navigate between dates**:
   - Use Previous Day, Today, Next Day buttons
   - Each day can have multiple workouts

3. **View history**:
   - Click "History" to see all days with workouts
   - Click on any day to view its workouts

4. **Check trends**:
   - Click "Trends" to see progress charts
   - Select specific exercises and metrics
   - Choose different date ranges

## Database

The app uses a local SQLite database file (`prisma/dev.db`) with these tables:
- `Workout` - Individual workout sessions
- `Exercise` - Exercises within workouts

All data is stored locally on your computer - no external services required!

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# Reset database (if needed)
rm prisma/dev.db
npx prisma db push
```

## File Structure

```
├── app/                    # Next.js app router pages
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema and SQLite file
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License