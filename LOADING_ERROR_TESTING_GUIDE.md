# Loading Skeletons & Error Boundaries - Testing Guide

## 📋 Overview

This guide walks you through testing the implemented loading skeleton states and error boundaries in the CollabLedger application. The implementation uses Next.js 13+ App Router conventions with `loading.tsx` and `error.tsx` files.

## ✅ Implementation Checklist

- ✅ Created `src/components/ui/Skeleton.tsx` - Reusable skeleton components
- ✅ Created `src/app/dashboard/loading.tsx` - Dashboard loading state
- ✅ Created `src/app/dashboard/error.tsx` - Dashboard error boundary
- ✅ Created `src/app/projects/[id]/loading.tsx` - Project details loading state
- ✅ Created `src/app/projects/[id]/error.tsx` - Project details error boundary
- ✅ Added 2-second simulated delay to dashboard data fetch
- ✅ Added 2-second simulated delay to project details fetch
- ✅ Updated README with documentation and best practices

## 🚀 Quick Start Testing

### 1. Start the Application

```bash
# Terminal 1 - Start the dev server
cd c:\Users\chitt\S63-0126-APP-FullStacks-with-Next.js-CollabLedger
npm run dev

# Server runs on http://localhost:3000
```

### 2. Open Browser DevTools

```
Press F12 to open Developer Tools
```

## 📊 Test Scenarios

### Scenario 1: Dashboard Loading State (with Network Throttling)

**Objective**: Visualize the skeleton loading UI while data is being fetched.

**Steps:**

1. **Ensure logged in** (or navigate to `/login` first and authenticate)

2. **Open DevTools**
   - Press `F12` to open Developer Tools
   - Click on the **Network** tab

3. **Enable Network Throttling**
   - Look for the throttling dropdown (usually shows "No throttling" by default)
   - Click the dropdown
   - Select **"Slow 3G"** (simulates ~2000ms latency)
   - Alternatively, select **"Custom"** and set:
     - Download: 100 Kbps
     - Upload: 20 Kbps
     - Latency: 2000 ms

4. **Navigate to Dashboard**
   - Go to `http://localhost:3000/dashboard`
   - **OR** if already on dashboard, press `Ctrl+Shift+R` (hard refresh)

5. **Observe the Loading State**
   - **0ms**: Skeleton UI appears immediately
     - 4 stat card skeletons at the top
     - Grid of 6 project card skeletons
     - Animated bouncing dots with "Loading your dashboard..." text
   - **~2 seconds**: Real dashboard data replaces skeletons
     - Stats show animated count-up numbers
     - Project cards populate with real data

6. **What to Look For**
   - [ ] Skeleton appears instantly (no white screen)
   - [ ] Skeletons match the layout of real content
   - [ ] Animated pulse creates breathing effect on skeleton boxes
   - [ ] Bouncing animation on loading indicator dots
   - [ ] Content smoothly transitions from skeleton to real data
   - [ ] Network tab shows pending API requests

### Scenario 2: Project Details Loading State (with Network Throttling)

**Objective**: Test loading state for dynamic route with parameters.

**Steps:**

1. **Prerequisites**
   - Must be logged in
   - Must have at least one project in dashboard
   - Network throttling should still be enabled from Scenario 1

2. **Navigate to a Project**
   - From dashboard, click on any project card
   - OR manually navigate: `http://localhost:3000/projects/[project-id]`
   - You can find a valid project ID in the browser console or by copying from URL after clicking a project

3. **Observe the Loading State**
   - **0ms**: Project skeleton loading screen appears
     - Skeleton for project header (title, description, status badge)
     - Skeleton for task list items (4-5 items)
     - Sidebar skeleton for project metadata
   - **~2 seconds**: Real project data replaces skeletons

4. **What to Look For**
   - [ ] Back link appears first
   - [ ] Project header skeleton matches final layout
   - [ ] Task items skeleton grid appears
   - [ ] Sidebar info skeleton appears
   - [ ] All skeletons animate with pulse effect
   - [ ] Transition is smooth when real data loads
   - [ ] Green bouncing dots in loading indicator

### Scenario 3: Error Boundary - Dashboard

**Objective**: Test error handling and recovery mechanism.

**Steps:**

1. **Method A: Simulate Network Error**
   - Keep DevTools open (Network tab)
   - Check the **Offline** checkbox to simulate network failure
   - Navigate to `/dashboard`
   - All API calls fail (you'll see red 'failed' indicators in Network tab)
   - Error boundary renders instead of page

2. **Method B: Check for Errors (Development)**
   - If you want to test intentionally, you can temporarily modify the code:
   - In `src/app/dashboard/page.tsx`, add to useEffect:
     ```tsx
     throw new Error("Test error for error boundary");
     ```
   - Navigate to dashboard
   - Error boundary catches and displays the error

3. **Observe the Error State**
   - Alert icon in red circle
   - Title: "Oops! Dashboard Error"
   - Friendly message: "We encountered an unexpected error..."
   - Error details (in development mode only) showing the actual error
   - Two action buttons:
     - **"Try Again"** button (blue, primary action)
     - **"Go Home"** button (secondary, navigation)

4. **Test Recovery**
   - If you used Offline mode:
     - Uncheck the **Offline** checkbox
     - Click **"Try Again"** button
     - API calls resume and succeed
     - Dashboard loads with real data
   - If you threw an error:
     - Remove the test error from the code
     - Click **"Try Again"** button
     - Dashboard loads successfully

5. **What to Look For**
   - [ ] Error message is user-friendly (no technical jargon)
   - [ ] Error details visible in development (not in production)
   - [ ] Professional error UI with centered layout
   - [ ] "Try Again" button successfully calls `reset()` function
   - [ ] "Go Home" button navigates to home page
   - [ ] After fixing issue and clicking Try Again, page recovers gracefully

### Scenario 4: Error Boundary - Project Details

**Objective**: Test error handling for dynamic routes.

**Steps:**

1. **Method A: Invalid Project ID**
   - In address bar, navigate to: `http://localhost:3000/projects/invalid-id-12345`
   - API tries to fetch non-existent project
   - May return 404 or permission error
   - Error boundary renders

2. **Method B: Network Offline**
   - Enable Offline mode in DevTools (Network tab)
   - Navigate to a valid project: `http://localhost:3000/projects/[actual-id]`
   - All API calls fail
   - Error boundary catches and displays error

3. **Observe the Error State**
   - Back link: "Back to Dashboard"
   - Alert icon in red circle
   - Title: "Project Not Found"
   - Message explains possible reasons:
     - "It may have been deleted, or you might not have permission to view it"
   - Two action buttons:
     - **"Try Again"** (re-fetch the project)
     - **"Return to Dashboard"** (navigate back)

4. **Test Recovery**
   - Enable network connection (uncheck Offline)
   - Click **"Try Again"** button
   - If project exists, it loads successfully
   - If project doesn't exist, error persists

5. **What to Look For**
   - [ ] Back link available for quick return
   - [ ] Error message specific to projects ("Project Not Found")
   - [ ] "Try Again" button retries the fetch
   - [ ] "Return to Dashboard" provides fallback navigation
   - [ ] Error details visible in development only

### Scenario 5: Production vs Development Error Display

**Objective**: Verify that error details are handled securely.

**Steps:**

1. **Check Development Mode**
   - Open DevTools Console
   - Trigger an error in dashboard or projects
   - Error boundary displays error message WITH detailed error stack
   - Example: "Error: Cannot read property 'map' of undefined"

2. **Verify Security (would need production build)**
   - Error details should be hidden in production
   - Only user-friendly message shown
   - Stack traces never exposed
   - Implementation in `error.tsx`:
     ```tsx
     {process.env.NODE_ENV === 'development' && error.message && (
       <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
         <p className="text-sm font-mono text-red-700">{error.message}</p>
       </div>
     )}
     ```

3. **What to Look For**
   - [ ] Development: Error details shown for debugging
   - [ ] Production: Error details hidden, only message shown
   - [ ] No database queries, API keys, or system information exposed
   - [ ] User-friendly message remains the same in both modes

## 🎨 Visual Design Review

### Skeleton Styling

Check that skeletons match the design:
- [ ] **Color**: Neutral gray (`bg-neutral-200`)
- [ ] **Animation**: Subtle pulse breathing effect (`animate-pulse`)
- [ ] **Shapes**: Rounded corners matching real components
- [ ] **Sizing**: Proportional to actual content
- [ ] **Layout**: Matches grid and flex layouts of real content

Example visual inspection:
```
Expected:
┌─────────────────────┐
│ █████████ Skeleton  │ ← Gray animated box
└─────────────────────┘

Actual:
┌─────────────────────┐
│ My Project Title    │ ← Real content replaces skeleton
└─────────────────────┘
```

### Error Boundary Styling

Check error UI components:
- [ ] **Icon**: Red alert circle for attention
- [ ] **Title**: Large, clear, dark text
- [ ] **Message**: Helpful explanation without technical jargon
- [ ] **Buttons**: Clear primary (blue "Try Again") and secondary (gray "Go Home")
- [ ] **Layout**: Centered, professional appearance
- [ ] **Color Scheme**: Red/neutral theme for errors

## 📱 Mobile Testing

### Test on Mobile Devices (or DevTools Mobile Emulation)

1. **Enable Device Emulation**
   - DevTools → Click device icon in top-left
   - Select "iPhone 12" or your preferred device

2. **Test at Mobile Viewports**
   - 375px width (iPhone SE)
   - 390px width (iPhone 12)
   - 414px width (iPhone 13 Pro Max)

3. **Verify Responsive Design**
   - [ ] Skeleton grid changes from 3 columns to 1-2 columns
   - [ ] Skeleton cards are readable at mobile size
   - [ ] Error message fits without overflow
   - [ ] Buttons are large enough (at least 44px height for touchable)
   - [ ] Text is readable without zooming

## 🔍 Console & Network Inspection

### Network Tab Analysis

When testing loading states, observe in Network tab:

```
Expected network timeline:

0ms:   GET /api/projects?mine=true            [Pending...]
0ms:   GET /api/auth/me                       [Pending...]
0ms:   GET /api/projects?contributed=true     [Pending...]
0ms:   GET /api/projects?open=true            [Pending...]
↓
2000ms: (simulated delay)
↓
2500ms: All requests complete and resolve
        [Status: 200, Size: ~2KB each]
```

### Console Logs

Check for expected log messages:

```javascript
// In browser console, you should see:
"[DASHBOARD] Component mounted, fetching data..."
"[DASHBOARD] Starting data fetch..."
"[DASHBOARD][MY_CREATED_PROJECTS] Loaded X projects"
"[DASHBOARD][CONTRIBUTED_PROJECTS] Loaded X projects"
"[DASHBOARD][OPEN_PROJECTS] Loaded X projects"
"[DASHBOARD][CURRENT_USER] Loaded user X"
"[DASHBOARD] Data fetch complete"
```

## 📋 Test Results Template

Copy and fill this out for your testing report:

```markdown
## Loading States Test Results

### Dashboard Loading (Slow 3G)
- [ ] Skeleton appears immediately (0ms)
- [ ] Skeleton animates with pulse effect
- [ ] Real content loads after ~2 seconds
- [ ] Transition is smooth
- [ ] All API calls visible in Network tab

### Project Details Loading (Slow 3G)
- [ ] Skeleton appears immediately
- [ ] Project header skeleton matches final layout
- [ ] Task list skeleton displays
- [ ] Content loads after ~2 seconds

### Dashboard Error Handling
- [ ] Error message displays clearly
- [ ] "Try Again" button calls reset()
- [ ] "Go Home" button navigates to home
- [ ] Error details visible in development

### Project Error Handling
- [ ] Error displays for invalid project ID
- [ ] Back link available
- [ ] "Try Again" retries the fetch
- [ ] "Return to Dashboard" navigates back

### Mobile Responsive
- [ ] Skeleton responsive on mobile (375px)
- [ ] Error message readable on mobile
- [ ] Buttons large enough for touch (44px)

### Accessibility
- [ ] ARIA labels on buttons
- [ ] Sufficient color contrast in error UI
- [ ] Keyboard navigation works

## Notes:
[Your observations here]
```

## 🎬 Capture Evidence

For submission/documentation, capture:

1. **Screenshot: Loading State**
   - Show skeleton UI with bouncing animation indicator
   - Show Network tab with pending requests
   - Show timestamp (0-2000ms mark)

2. **Screenshot: Error State**
   - Show error message with icon and buttons
   - Show error details in development console
   - Show "Try Again" button highlighted

3. **Screenshot: Successful Recovery**
   - Show error state → clicked "Try Again" → data loaded successfully
   - Show Network tab showing successful API responses

4. **Screen Recording (Optional but recommended)**
   - Record 30-second video:
     - Start: Click on Dashboard link
     - Show: Skeleton loading for ~2 seconds
     - Show: Content transition to real data
     - Show: Network throttling in DevTools
   - Save as GIF or MP4

## 🧪 Performance Metrics

While testing, note these metrics:

| Metric | Expected | Actual | Notes |
|--------|----------|--------|-------|
| Skeleton appearance time | <50ms | | Time from navigation to skeleton visible |
| Content load time (Slow 3G) | ~2000ms | | Due to simulated delay |
| Transition smooth | Yes | | No janky transitions |
| Error recovery time | <1s | | Time from clicking "Try Again" to page rendering |

## 🐛 Troubleshooting

### Issue: Skeleton not appearing
- **Solution**: Check that `loading.tsx` file exists in the route folder
- **Check**: File path must be exactly `src/app/dashboard/loading.tsx` (or `projects/[id]/loading.tsx`)
- **Verify**: Export default function that returns JSX

### Issue: Error boundary not catching errors
- **Solution**: Ensure `error.tsx` has `'use client'` directive at the top
- **Check**: The error boundary must be a Client Component ('use client')
- **Verify**: Function signature: `error.tsx` receives `error` and `reset` props

### Issue: "Try Again" button doesn't work
- **Solution**: Verify `reset()` function is being called correctly
- **Check**: Button onClick handler calls `reset()` function
- **Code Check**:
  ```tsx
  <button onClick={() => reset()}>Try Again</button>
  ```

### Issue: No delay visible even with throttling
- **Solution**: The 2-second delay is simulated in the code with:
  ```tsx
  await new Promise(r => setTimeout(r, 2000));
  ```
- **Check**: Ensure the delay code is still in the fetch functions
- **Production note**: This delay should be removed in production

## 📚 File Reference

Quick reference for implemented files:

| File | Purpose |
|------|---------|
| `src/components/ui/Skeleton.tsx` | Reusable skeleton components |
| `src/app/dashboard/loading.tsx` | Dashboard loading state |
| `src/app/dashboard/error.tsx` | Dashboard error boundary |
| `src/app/projects/[id]/loading.tsx` | Project details loading state |
| `src/app/projects/[id]/error.tsx` | Project details error boundary |
| `src/app/dashboard/page.tsx` | Dashboard page (has 2s delay) |
| `src/app/projects/[id]/page.tsx` | Project details page (has 2s delay) |

## ✨ Summary

This comprehensive testing guide covers:

✅ Loading skeleton visualization  
✅ Error boundary functionality  
✅ Network recovery and retry logic  
✅ Mobile responsiveness  
✅ Development vs production behavior  
✅ Performance observations  
✅ Evidence capture methods  
✅ Troubleshooting guide  

Follow these scenarios to thoroughly test and validate the implementation of loading states and error boundaries in CollabLedger.

---

**Need help?** Check the main README.md for more details on the implementation architecture.
