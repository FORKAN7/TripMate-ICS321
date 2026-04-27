# TripMate

> A React-based travel planning web application that helps users discover, organize, and plan trips across Saudi Arabia — all in one place.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech](#tech)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Team Members](#team-members)

---

## Project Description

**TripMate** is a frontend web application built with React that allows users to explore destinations across Saudi Arabia, create personalized multi-day trip itineraries, manage trip members, and discover places by category (landmarks, food, nature, shopping, and entertainment).

Users can sign up, log in, build trips with custom durations, add places to each day of their itinerary, invite members, and manage everything through a clean and intuitive interface.

---

## Features

| Feature        | Description |
|----------------|---|
| Home Page      | Landing page with a full-page background image, gradient overlay, hero text, "Continue as Guest" mode, and a Features section |
| Login          | Email and password login with show/hide password toggle, success and error banners, and a back-to-home arrow |
| Sign Up        | Full name, email, password, and confirm password form with duplicate email detection, password validation, and account creation |
| User Profile   | Displays the user's name, real-time location (via Geolocation + OpenStreetMap), join date, trip count, photo count, trips tab with Organizer badge, and a photos upload tab |
| Create Trip    | Build a trip with name, destination, duration, itinerary, and members |
| Explore Places | Browse and filter places by city and category |
| Admin Panel    | Admin management dashboard |

### Create Trip — Detailed Features
- Create multiple trips with a name, destination city, and duration **(1–12 days)**
- Add and remove days dynamically from the itinerary
- Filter places by category: **All, Landmarks, Local Food, Nature, Shopping, Entertainment**
- Filter places by city: **Riyadh, Jeddah, Abha, AlUla, Al Hassa**
- Add places to specific days in the itinerary
- Invite trip members by name and email (with validation of the email format)
- Remove members (organizer is protected)
- Delete entire trips
- Trip data is persisted per user session

---

## Tech

- **Framework:** React (with Hooks)
- **Styling:** CSS stylesheets
- **Language:** JavaScript (JSX)
- **State Management:** React `useState`
- **Routing:** Custom `onNavigate` prop-based navigation
- **Build Tool:** Vite

---

## Folder Structure

```
TripMate/
├── public/
├── src/
│   ├── assets/
│   │   └── imgs/
│   ├── components/
│   │   ├── AdminComponents/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── DashboardView.jsx
│   │   │   ├── UsersView.jsx
│   │   │   ├── CitiesView.jsx
│   │   │   ├── PlacesView.jsx
│   │   │   └── ReportsView.jsx
│   │   ├── PlanTripComponents/
│   │   │   ├── data/
│   │   │   │   ├── members.js
│   │   │   │   └── places.js
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── CityTabs.jsx
│   │   │   ├── DayTabs.jsx
│   │   │   ├── ItineraryPanel.jsx
│   │   │   ├── MemberPanel.jsx
│   │   │   ├── PlaceCard.jsx
│   │   │   ├── PlaceDetailModal.jsx
│   │   │   └── TripForm.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── AdminPage.jsx
│   │   ├── CreateTrip.jsx
│   │   ├── ExplorePlaces.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── SignUp.jsx
│   ├── styles/
│   │   ├── admin.css
│   │   ├── auth.css
│   │   ├── CategoryFilter.css
│   │   ├── CityTabs.css
│   │   ├── createTrip.css
│   │   ├── ExplorePlaces.css
│   │   ├── home.css
│   │   ├── PlaceCard.css
│   │   ├── PlaceDetailModal.css
│   │   └── profile.css
│   ├── utils/
│   │   ├── auth.js
│   │   └── trips.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

---

## Setup & Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) 

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tripmate.git
   cd tripmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**

   Visit `http://localhost:5173` (default Vite port)

---

## Usage

### Home Page

- The landing page is shown on first visit.
- Click **Get Started** to go to the Sign Up page, or **Log In** if you already have an account.
- Click **Continue as Guest** to browse the app without an account. Plan Trip and Explore will be hidden in guest mode.

### Signing Up

1. Click **Get Started** from the home page.
2. Fill in your **Full Name**, **Email**, **Password**, and **Confirm Password**.
3. Click **Create Account** — you'll be taken to your profile on success.

### Logging In

1. Click **Log In** from the home page or navbar.
2. Enter your **Email** and **Password**.
3. Click **Log In** — you'll be taken to your profile on success.

### User Profile

- View your name, location, join date, and stats.
- **Trips tab:** see all trips you've created, each marked with an **Organizer** badge.
- **Photos tab:** click **+ Add Photo** to upload images, which will appear in a grid.

### Creating a Trip

1. Navigate to the **Plan Your Trip** page from the navbar.
2. Enter a **Trip Name**, select a **Destination City**, and choose the **Duration** (number of days).
3. Click **+ Create Trip** — your trip will appear in the sidebar.
4. Use the **Category Filter** or **City Tabs** to browse places.
5. Click the **+** button on any place card to add it to the currently active day.
6. Use **Day Tabs** to switch between days or add/remove days.
7. Use the **Members Panel** to invite people by name and email.
8. Delete any trip using the 🗑️ icon next to it in the sidebar.

### Exploring Places

- Navigate to **Explore Places** to browse all destinations.
- Filter by city or category to find relevant spots.
- Click on a place card for more details and add reviews. (Note: Reviews are stored in-memory and will reset on page refresh.)
---

### Admin Panel Usage

To access the Admin Panel, the user must log in using the admin account credentials.

- Email: admin@gmail.com  
- Password: admin123  

After logging in with these credentials, the user will be redirected to the Admin Panel.
Inside the Admin Panel, the administrator can navigate between different sections using the sidebar, including:
- Dashboard
- Users
- Cities
- Popular Places
- Reports

4. In the **Users** section, the administrator can edit user information or delete user accounts.

> Note: (Note: Reviews are stored in-memory and will reset on page refresh.)
## Team Members

| Name | Role |
|---|---|
| **Rayhanah Alobaid** | Create Trip Page |
| **Naba Alali** | Explore Places Page |
| **Bana Jaber** | Home Page, Login & Sign Up, User Profile |
| **Forqan Alsalman** | Admin Page |

---

## License

This project was built as part of an academic course project. All rights reserved by the team members listed above.