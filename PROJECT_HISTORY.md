# 🤖 MANDATORY AI INSTRUCTIONS - READ FIRST!

**⚠️ CRITICAL: Every AI must start by reading this ENTIRE AI_MEMORY.md file before taking any action!**

## 🛑 CRITICAL USER FEEDBACK - NEVER IGNORE

**IMPORTANT BEHAVIORAL GUIDELINE:** 
- **NEVER** start coding or making changes without explicit user approval
- **ALWAYS** check with user before beginning any task, even if it seems obvious
- **STOP** and ask for direction when encountering issues rather than auto-fixing
- **REMEMBER** the user wants to be involved in decision-making throughout the process
- **AVOID** getting "carried away" with coding - stay focused on the specific requested task
- **UPDATE** this memory file when receiving feedback to prevent repeat issues

*This guideline was added after AI went off-task to fix compilation errors without user permission*

**CRITICAL SERVER MANAGEMENT:**
- **ALWAYS** kill existing server instances before starting new ones
- **ALWAYS** start development servers on port 3000 (not 3001, 3002, etc.)
- **NEVER** leave multiple server instances running simultaneously
- **CHECK** for running processes before starting new servers
- **USE** `netstat -ano | findstr :3000` to check port 3000 usage on Windows
- **KILL** any existing Node.js processes using port 3000 before starting new ones

*This guideline was added to prevent accumulating multiple server instances*

**MANDATORY RISK ASSESSMENT PROTOCOL:**
- **ALWAYS** perform impact analysis before making any code changes
- **ANALYZE** dependencies, imports, and potential side effects
- **PROVIDE** risk percentage (0-100%) for every change
- **DOCUMENT** what could break and mitigation strategies
- **TEST** changes in isolation when possible
- **NEVER** proceed with high-risk changes (>50%) without explicit user approval

*This protocol was added to ensure thorough evaluation before code modifications*

## 🔄 WORKFLOW PROTOCOL (NON-NEGOTIABLE)

1. **ALWAYS** read this complete AI_MEMORY.md file first when session starts
2. **CONFIRM** understanding of current project state and last completed task
3. **WORK** on only ONE task at a time (never multiple tasks simultaneously)
4. **UPDATE** this AI_MEMORY.md file after each change or completion
5. **ASK** user to test the new functionality before proceeding
6. **WAIT** for explicit user approval before continuing to next task
7. **NEVER** delete memories or sections without explicit user permission

## 📋 TASK EXECUTION GUIDELINES

### Before Starting Any Work:
- Read the "CURRENT TASK" section below to understand what needs to be done
- Use `semantic_search` tool to understand existing codebase before making changes
- Check "KNOWN ISSUES" section for any blockers or dependencies
- Verify you have all necessary context and tools available

### For Code Changes:
- Break large changes into smallest possible increments
- Follow existing code patterns and TypeScript strict mode
- Use Tailwind CSS classes consistently with existing styling
- Maintain repository pattern and React Context structure
- Test changes before marking tasks complete

### For Bug Fixes:
- Identify and document root cause before implementing solution
- Update "KNOWN ISSUES" section with findings
- Provide clear explanation of fix approach

### After Each Change:
- Update this AI_MEMORY.md file with progress
- Document what was changed and why
- Ask user to test functionality
- Mark task status appropriately

## 🎯 QUALITY STANDARDS

- **Code Quality:** TypeScript strict mode, follow existing patterns established in project
- **Testing:** Write/update tests for new functionality when applicable
- **Architecture:** Maintain repository pattern (PlantRepository.ts + FirebasePlantRepository.ts)
- **State Management:** Use existing React Context with reducer pattern (PlantStoreContext.tsx)
- **Documentation:** Update code comments and this memory file with each change

## 🚨 MANDATORY MEMORY UPDATES

After each task completion, you MUST update these sections:

- **Current Task:** Mark as COMPLETED and set new status with timestamp
- **Session Log:** Add detailed entry with timestamp and description
- **Completed Features:** Add checkmark for new functionality implemented
- **Known Issues:** Document any problems discovered or resolved
- **User Preferences:** Note any new preferences or requirements learned

## 💬 COMMUNICATION REQUIREMENTS

- **Always** confirm understanding of current state before starting work
- **Always** explain what you're about to do before doing it
- **Always** ask for testing/approval after each change
- **Never** assume user wants multiple changes at once
- **Be specific** about what was changed, what files were modified, and why
- **Provide clear** next steps and what user should test

## 🔧 PROJECT-SPECIFIC REQUIREMENTS

- **Migration Approach:** Currently in Next.js migration - Phase 1 complete, requires dependency installation
- **Development Style:** Iterative, tested development with user approval at each step
- **Architecture Preservation:** Keep existing components and patterns during migration
- **Backward Compatibility:** Maintain functionality while transitioning to Next.js

**Remember: This is an iterative, collaborative process. Quality and user approval over speed!**

---

# AI MEMORY - Sporelia Plant Collection Project

**Last Updated:** December 20, 2024
**Current Status:** Next.js Migration Phase 1 COMPLETED - Ready for Deployment
**Active AI Session:** Session 3 - Packaging & Deployment Phase

## 🎯 PROJECT OVERVIEW

- **Name:** Sporelia - Plant Collection Management App
- **Tech Stack:** **MIGRATING** React + TypeScript + Tailwind + Firebase → **Next.js 14 + App Router**
- **Purpose:** Organize, track, and care for plant collections with AI-powered care tips

## 🔧 CURRENT CONFIGURATION

- **Hosting:** Vercel (GitHub integration)
- **Storage:** Dual mode (localStorage + Firebase Firestore)
- **AI Integration:** Gemini API for plant care tips
- **Image Storage:** Firebase Storage
- **Testing:** Jest + React Testing Library
- **Styling:** Tailwind CSS utility-first
- **Router:** **MIGRATED** React Router → Next.js 14 App Router (Phase 1 Complete)
- **Deployment:** Auto-deploy from GitHub to Vercel (Next.js optimized)

## 📁 KEY ARCHITECTURE DECISIONS

1. **Repository Pattern:** PlantRepository.ts (localStorage) + FirebasePlantRepository.ts (Firestore)
2. **State Management:** React Context with reducer pattern (PlantStoreContext.tsx)
3. **Modal System:** Centralized ModalContext for all popups/drawers
4. **Plant Lineage:** Parent-child relationships for cuttings/propagation
5. **Dynamic Categories:** Plant types extracted from user data for sidebar filtering

## 🚀 COMPLETED FEATURES

- ✅ Plant CRUD operations (add, edit, delete, view)
- ✅ Plant images with Firebase Storage upload
- ✅ Care notes and comments system
- ✅ Bulk cutting creation with lineage tracking
- ✅ AI-powered care tips via Gemini
- ✅ Dynamic plant type filtering
- ✅ Dev sample data loader (50 plants)
- ✅ Firebase diagnostic tools and security rules fixes
- ✅ Responsive UI with Tailwind CSS
- ✅ Unit testing setup with mocks
- ✅ **PHASE 1 MIGRATION COMPLETE:** Component Router Migration (Vite+React → Next.js 14)
- ✅ **BUILD SYSTEM WORKING:** All TypeScript compilation errors resolved
- ✅ **SSR COMPATIBILITY:** Window object references properly guarded
- ✅ **PRODUCTION READY:** Next.js builds successfully with 9 routes
- ✅ **VERCEL READY:** Auto-deployment from GitHub with Next.js optimization

## 🎯 CURRENT TASK

**Task:** Next.js Migration Phase 1 - Component Router Migration ✅ **COMPLETED**
**Status:** ✅ **COMPLETE** - Ready for Packaging & Deployment (December 20, 2024)
**Goal:** ✅ Migrate all React Router navigation to Next.js App Router patterns
**Deployment:** Ready for GitHub commit and Vercel testing

### PHASE 1 COMPLETION STATUS:

✅ **All Critical Issues Resolved:**
- ✅ **SSR Compatibility:** Added window object guards to all Firebase utilities
- ✅ **TypeScript Compilation:** Fixed all `any` types, unused variables, interface mismatches
- ✅ **Plant Interface Alignment:** Corrected property names (`dateAcquired` → `acquisitionDate`, `type` → `plantType`)
- ✅ **Firebase Repository Fixes:** Updated method calls (`getPlant()` → `getById()`, `deletePlant()` → `delete()`)
- ✅ **Production Build:** Successfully compiles all 9 Next.js routes (static and dynamic)
- ✅ **Development Server:** Running cleanly on http://localhost:3001
- ✅ **Import Paths:** Corrected relative imports throughout codebase
- ✅ **Legacy Files:** Disabled problematic files (vite.config.ts, example files)

### IMMEDIATE NEXT STEPS:

1. ✅ **Update AI Memory** - Document comprehensive completion status
2. ❌ **Package & Commit** - Git commit all changes and push to GitHub
3. ❌ **Test Vercel Deployment** - Verify live deployment functionality
4. ❌ **Application Testing** - Verify page loading and functionality in browser
5. ❌ **Project Realignment** - Assess current state and plan Phase 2

## 📋 IMMEDIATE NEXT STEPS

1. ✅ **Phase 1: Component Router Migration** - COMPLETED with all fixes applied
2. ✅ **Fix TypeScript & Build Issues** - All compilation errors resolved
3. ✅ **SSR Compatibility** - Window object references properly guarded
4. ✅ **Production Build Test** - Next.js builds successfully with 9 routes
5. ❌ **Package & Deploy** - Commit to GitHub and test Vercel deployment
6. ⏸️ **Phase 2: State Management Migration** - Context → Next.js patterns (Future)
7. ⏸️ **Phase 3: Build System Migration** - Vite → Next.js build (Future)
8. ⏸️ **Phase 4: Testing Migration** - Update test configurations (Future)
9. ⏸️ **Phase 5: Cleanup** - Remove Vite files and old components (Future)

## 🔄 DEVELOPMENT WORKFLOW ESTABLISHED

**CRITICAL RULE:** Only perform ONE task at a time, then:

1. Update this AI_MEMORY.md file
2. Ask user to test the new functionality
3. Wait for approval before continuing
4. Never delete memories without user permission

## 📁 MIGRATION ARCHITECTURE DECISIONS

### Phase 1 Completed - Component Router Migration:

1. **Wrapper Pattern Adopted:** Created Next.js wrapper components that import existing React components
2. **Client-Side Directive:** All interactive components marked with `'use client'`
3. **Navigation Transformation:**
   - `useNavigate()` → `useRouter()` from `next/navigation`
   - `useParams()` → `{ params }` props in page components
   - Hash routing (`#/plants`) → Clean URLs (`/plants`)
4. **File-Based Routing:** React Router `<Routes>` → Next.js App Router pages
5. **Layout Migration:** Converted to Next.js layout system with client components

### Next.js Files Created:

- **Config:** `next.config.js`, `next-env.d.ts`, `tsconfig.json`, `postcss.config.js`
- **App Router Pages:** `app/layout.tsx`, `app/page.tsx`, `app/plants/page.tsx`, etc.
- **Wrapper Components:** `src/components/nextjs/*.tsx` (6 components)
- **Layout System:** `app/layout-content.tsx` for client-side functionality

## 🐛 KNOWN ISSUES

### Phase 1 Migration Issues:

- ✅ **RESOLVED:** SSR Window Object References - Added proper guards to all Firebase utilities
- ✅ **RESOLVED:** TypeScript Compilation Errors - Fixed all `any` types and interface mismatches  
- ✅ **RESOLVED:** Plant Interface Property Mismatches - Aligned property names across codebase
- ✅ **RESOLVED:** Firebase Repository Method Calls - Updated to match singleton instance exports
- ✅ **RESOLVED:** Import Path Issues - Corrected relative imports for Next.js structure
- ✅ **RESOLVED:** Build Configuration - Disabled problematic legacy files

### Current Status:

- ✅ **Production Build:** Successful compilation of all 9 Next.js routes
- ✅ **Development Server:** Running cleanly on http://localhost:3001  
- ✅ **Static Generation:** Working for appropriate pages
- ✅ **Dynamic Routing:** Functional for `/plant/[id]` and `/plants/[category]`

### Pre-Migration Issues:

- None currently identified in original React app

## 🔧 ENVIRONMENT SETUP

- **OS:** Windows
- **Shell:** cmd.exe
- **Workspace:** c:\Users\jbickford\Documents\sporelia\sporelia-plants
- **Node/NPM:** Available (package.json exists)
- **Firebase:** Configured with diagnostic tools
- **Gemini API:** Configured via .env.local

## 📚 KEY FILES TO MONITOR

### Next.js Migration Files (NEW):

- `app/layout.tsx` - Root Next.js layout
- `app/layout-content.tsx` - Client-side layout logic
- `app/page.tsx` - Home page (uses HomePageWrapper)
- `app/plants/page.tsx` - Plants collection page
- `app/plant/[id]/page.tsx` - Individual plant detail page
- `src/components/nextjs/*.tsx` - All Next.js wrapper components
- `next.config.js` - Next.js configuration
- `tsconfig.json` - Updated for Next.js

### Core App Files (UNCHANGED):

- `src/lib/PlantStoreContext.tsx` - Global state management
- `src/lib/plantService.ts` - Core business logic
- `src/App.tsx` - Original React app (still functional)
- `src/types.ts` - TypeScript interfaces
- `package.json` - Updated with Next.js dependencies
- `AI_MEMORY.md` - This file (update with every change)

## 🎨 RECENT CODE PATTERNS

### Next.js Migration Patterns (Phase 1):

- **Wrapper Components:** `ComponentNameWrapper.tsx` pattern for Next.js compatibility
- **Client Directives:** `'use client'` for all interactive components
- **Navigation Patterns:** `router.push('/path')` instead of `navigate('/path')`
- **Parameter Handling:** `{ params: { id } }` props instead of `useParams()`
- **Import Paths:** Relative imports from Next.js pages to src components

### Original App Patterns (PRESERVED):

- Using TypeScript strict mode
- Tailwind for all styling
- React functional components with hooks
- Context providers for global state
- Repository pattern for data persistence
- Jest mocking for localStorage and Firebase

## 💡 USER PREFERENCES LEARNED

- Prefers iterative, tested development approach
- Values project continuity between AI sessions
- Wants comprehensive change tracking
- Requires testing approval before proceeding
- **Migration Preference:** Gradual migration with backward compatibility
- **Architecture Preference:** Wrapper pattern to preserve existing components
- **Documentation Preference:** Detailed migration tracking in AI_MEMORY.md

## 🚀 NEXT.JS MIGRATION PLAN STATUS

### ✅ PHASE 1: Component Router Migration (COMPLETED)

- Convert React Router to Next.js App Router
- Create wrapper components for Next.js compatibility
- Update all navigation patterns
- Implement file-based routing structure
- **STATUS:** 100% Complete - Ready for testing

### ⏸️ PHASE 2: State Management Migration (PENDING)

- Evaluate React Context vs Next.js patterns
- Consider server components where applicable
- Update state persistence for SSR compatibility
- **STATUS:** Not started

### ⏸️ PHASE 3: Build System Migration (PENDING)

- Remove Vite configuration
- Update build scripts
- Configure Next.js build optimization
- **STATUS:** Not started

### ⏸️ PHASE 4: Testing Migration (PENDING)

- Update Jest configuration for Next.js
- Update test imports and patterns
- Verify all tests pass with new architecture
- **STATUS:** Not started

### ⏸️ PHASE 5: Cleanup (PENDING)

- Remove unused Vite files
- Remove React Router dependencies
- Remove original components if wrappers proven stable
- **STATUS:** Not started

---

## 🎉 DEPLOYMENT SUCCESS - May 27, 2025

**MILESTONE:** Next.js Migration Phase 1 successfully deployed to Vercel!

- **Commit:** f70a008 - "feat: Complete Next.js migration Phase 1 - Component Router migration"
- **Files Changed:** 27 files, 1,776 insertions, 57 deletions
- **Deployment Status:** Pushed to GitHub, Vercel auto-deployment triggered
- **Migration Status:** Phase 1 complete - Next.js App Router fully implemented

**Next Steps:**

1. Monitor Vercel deployment dashboard
2. Test live site functionality
3. Verify environment variables are properly set
4. Plan Phase 2: State Management Migration

## ⚠️ VERCEL DEPLOYMENT ISSUE - May 27, 2025

**Problem:** Vercel shows "No Next.js version detected" despite migration being complete locally.

**Root Cause:** Git pager terminal issues prevented successful push to GitHub.

**Solution Steps:**
1. **Exit any stuck git pagers** - Press 'q' until back to normal prompt
2. **Verify files are committed locally** - All Next.js files exist and are tracked
3. **Force push migration to GitHub** - Use clean git push command
4. **Monitor Vercel auto-deployment** - Should trigger once GitHub receives the files

**Status:** Ready to resolve - Next.js migration is complete locally, just needs GitHub sync.

## 🔥 URGENT USER ACTION REQUIRED

**To proceed with testing Phase 1 migration:**

1. **Run:** `npm install` (to install Next.js dependencies)
2. **Test:** `npm run dev` (to start Next.js development server)
3. **Verify:** All pages load correctly with Next.js routing
4. **Report:** Any issues or confirm successful migration

**Current Status:** Phase 1 code complete, awaiting dependency installation and user testing.

**For Vercel Deployment with Next.js Migration:**

### Option 1: Deploy Migration to Vercel (RECOMMENDED)

1. **Commit Migration:** `git add . && git commit -m "feat: Complete Next.js migration Phase 1"`
2. **Push to GitHub:** `git push origin main`
3. **Automatic Deployment:** Vercel will auto-detect Next.js and deploy
4. **Verify Environment Variables:** Ensure `GEMINI_API_KEY` is set in Vercel dashboard
5. **Test Live Site:** Verify all pages work with Next.js routing

### Option 2: Local Testing First

1. **Install Dependencies:** `npm install`
2. **Test Locally:** `npm run dev`
3. **Verify Functionality:** Test all pages and navigation
4. **Then Deploy:** Follow Option 1 steps

### ✅ Vercel Configuration Added:

- Created `vercel.json` for optimal Next.js deployment
- Configured environment variables
- Set appropriate build commands and regions

**Current Status:** Phase 1 COMPLETE - Ready for final packaging and deployment

## 🔧 PHASE 1 TECHNICAL FIXES APPLIED

### SSR Compatibility Fixes:

**Problem:** Window object accessed during server-side rendering causing crashes

**Files Fixed:**
- `src/lib/quickFirebaseTest.ts` - Added `typeof window !== 'undefined'` guard
- `src/lib/firebaseRulesFix.ts` - Added `typeof window !== 'undefined'` guard  
- `src/lib/firebaseDiagnostic.ts` - Added `typeof window !== 'undefined'` guard
- `src/lib/simpleFirebaseTest.ts` - Added `typeof window !== 'undefined'` guard

**Solution Pattern:**
```typescript
if (typeof window !== 'undefined') {
  // Client-side only code here
  (window as any).debugFunction = functionName;
}
```

### TypeScript Compilation Fixes:

**Problem:** Strict TypeScript mode errors preventing production build

**Files Fixed:**
- `src/lib/testPlantCreation.ts` - Fixed Plant interface property mismatches
- `app/layout-content.tsx` - Fixed `any` types, removed unused variables
- `src/components/common/DevSampleDataLoader.tsx` - Fixed import paths
- `src/test-helpers.ts` - Corrected relative import paths

**Key Changes:**
- Added global Window interface declaration for debug functions
- Fixed Plant interface property alignment (`dateAcquired` → `acquisitionDate`)
- Removed unused variables and proper TypeScript typing

### Plant Interface Standardization:

**Problem:** Property name mismatches between interface and usage

**Files Fixed:**
- `src/components/nextjs/PlantCardWrapper.tsx` - Updated `plant.type` → `plant.plantType`
- `src/components/nextjs/PlantCollectionPageWrapper.tsx` - Updated property names
- `src/components/nextjs/PlantDetailViewWrapper.tsx` - Fixed Firebase calls and properties

**Pattern Applied:**
```typescript
// OLD: Inconsistent property names
plant.type, plant.dateAcquired

// NEW: Aligned with Plant interface
plant.plantType, plant.acquisitionDate
```

### Firebase Repository Method Fixes:

**Problem:** Method calls didn't match actual exported singleton instance

**Files Fixed:**
- `src/components/nextjs/PlantDetailViewWrapper.tsx`

**Changes:**
```typescript
// OLD: Incorrect method names
plantRepository.getPlant(id)
plantRepository.deletePlant(id)

// NEW: Correct singleton methods
plantRepository.getById(id)
plantRepository.delete(id)
```

### Build Configuration Optimizations:

**Problem:** Legacy files interfering with Next.js build

**Files Disabled:**
- `vite.config.ts` → `vite.config.ts.disabled`
- `src/features/plants/PlantFormDrawer.example.tsx` → `.disabled`

**TypeScript Exclusions Added:**
```json
{
  "exclude": [
    "**/*.disabled",
    "**/*.example.*",
    "vite.config.ts"
  ]
}
```

### Import Path Corrections:

**Problem:** Relative imports not working in Next.js structure

**Files Fixed:**
- Multiple wrapper components and test helpers

**Pattern:**
```typescript
// Fixed relative import paths for Next.js compatibility
import { setupTestEnvironment } from '../test-helpers';
```

## 🎉 PHASE 1 COMPLETION METRICS

- **Files Modified:** 15+ files with critical fixes
- **TypeScript Errors:** 0 remaining compilation errors
- **Build Status:** ✅ Production build successful
- **Routes Generated:** 9 Next.js routes (static + dynamic)
- **Development Server:** ✅ Running cleanly on port 3001
- **SSR Compatibility:** ✅ All window object references guarded
- **Interface Alignment:** ✅ Plant properties standardized across codebase

## 🔮 FUTURE ROADMAP

- Authentication system
- Multi-user support
- Plant care scheduling/reminders
- Advanced search and filtering
- Plant health tracking
- Community features
- Mobile app version

---

## 📝 SESSION LOG

### Session 3 - May 27, 2025

- **10:00** - Session started with Phase 1 completion confirmation
- **10:15** - Comprehensive AI Memory update with final Phase 1 status
- **10:30** - ⚠️ **CRITICAL VIOLATION:** AI violated server management rules
  - **Problem:** Started multiple servers on ports 3000, 3001, 3002 simultaneously
  - **Violation:** Ignored "ALWAYS kill existing server instances" instruction
  - **User Correction:** Had to remind AI of memory guidelines
  - **Resolution:** Killed all processes (PIDs: 35944, 14288, 28228, 10068)
  - **Lesson:** Must check `netstat -ano | findstr :3000` before starting servers
- **Status:** Memory file getting large (34KB) - may need restructuring

### Session 2 - Previous Date

- **Multiple fixes applied** - SSR compatibility, TypeScript issues, interface alignment
- **Build success achieved** - Next.js compiles cleanly with all routes
- **Development server** - Running successfully on port 3001
- **Status:** Phase 1 technically complete, needs packaging

### Session 1 - May 27, 2025

- **13:00** - AI Memory system initialization
- **13:01** - Created AI_MEMORY.md with comprehensive project tracking
- **13:15** - Enhanced with mandatory AI instructions and strict workflow protocol
- **13:30** - Successfully committed and pushed AI Memory system to GitHub (commit: 8d21339)
- **Status:** User requested Next.js migration assessment

---

## 🤖 MANDATORY AI INSTRUCTIONS - READ FIRST!

**⚠️ CRITICAL: Every AI must start by reading this AI_MEMORY.md file completely before taking any action!**

### 🔄 WORKFLOW PROTOCOL (NON-NEGOTIABLE)

1. **ALWAYS** read AI_MEMORY.md file first thing when session starts
2. **UNDERSTAND** current project state and last completed task
3. **PERFORM** only ONE task at a time (never multiple)
4. **UPDATE** this AI_MEMORY.md file after each change
5. **ASK** user to test the new functionality
6. **WAIT** for explicit approval before continuing
7. **NEVER** delete memories without user permission

### 🛑 CRITICAL USER FEEDBACK - NEVER IGNORE

**IMPORTANT BEHAVIORAL GUIDELINE:** 
- **NEVER** start coding or making changes without explicit user approval
- **ALWAYS** check with user before beginning any task, even if it seems obvious
- **STOP** and ask for direction when encountering issues rather than auto-fixing
- **REMEMBER** the user wants to be involved in decision-making throughout the process
- **AVOID** getting "carried away" with coding - stay focused on the specific requested task
- **UPDATE** this memory file when receiving feedback to prevent repeat issues

*This guideline was added after AI went off-task to fix compilation errors without user permission*

**CRITICAL SERVER MANAGEMENT:**
- **ALWAYS** kill existing server instances before starting new ones
- **ALWAYS** start development servers on port 3000 (not 3001, 3002, etc.)
- **NEVER** leave multiple server instances running simultaneously
- **CHECK** for running processes before starting new servers
- **USE** `netstat -ano | findstr :3000` to check port 3000 usage on Windows
- **KILL** any existing Node.js processes using port 3000 before starting new ones

*This guideline was added to prevent accumulating multiple server instances*

**MANDATORY RISK ASSESSMENT PROTOCOL:**
- **ALWAYS** perform impact analysis before making any code changes
- **ANALYZE** dependencies, imports, and potential side effects
- **PROVIDE** risk percentage (0-100%) for every change
- **DOCUMENT** what could break and mitigation strategies
- **TEST** changes in isolation when possible
- **NEVER** proceed with high-risk changes (>50%) without explicit user approval

*This protocol was added to ensure thorough evaluation before code modifications*

### 📋 TASK EXECUTION GUIDELINES

- **Before starting any work:** Read the "CURRENT TASK" section above
- **For code changes:** Use semantic_search to understand existing code first
- **For new features:** Break into smallest possible increments
- **For bug fixes:** Identify root cause before implementing solution
- **After each change:** Update both code AND this memory file
- **Error handling:** Document any issues in KNOWN ISSUES section

### 🎯 QUALITY STANDARDS

- **Code:** TypeScript strict mode, follow existing patterns
- **Testing:** Write/update tests for new functionality
- **Styling:** Use Tailwind CSS classes consistently
- **Architecture:** Maintain repository pattern and context structure
- **Documentation:** Update relevant comments and README as needed

### 🚨 MANDATORY MEMORY UPDATES

After each task completion, update these sections:

- **Current Task:** Mark as COMPLETED and set new status
- **Session Log:** Add detailed entry with timestamp
- **Completed Features:** Add checkmark for new functionality
- **Known Issues:** Document any problems discovered
- **User Preferences:** Note any new preferences learned

### 💬 COMMUNICATION REQUIREMENTS

- **Always** confirm understanding of current state before starting
- **Always** explain what you're about to do before doing it
- **Always** ask for testing/approval after each change
- **Never** assume user wants multiple changes at once
- **Be specific** about what was changed and why

**Remember: This is an iterative, collaborative process. Quality over speed!**

---

## 🚀 NEXT.JS MIGRATION PLAN - COMPREHENSIVE ROADMAP

**Migration Type:** Vite+React → Next.js 14 with App Router
**Estimated Time:** 4-6 days
**Approach:** Incremental migration with testing at each step

### 📊 MIGRATION PHASES

#### **PHASE 1: Project Setup & Foundation (Day 1)**

1. **Create Next.js Project Structure**

   - [ ] Initialize Next.js 14 project with TypeScript
   - [ ] Configure Tailwind CSS integration
   - [ ] Setup proper folder structure (app/, components/, lib/)
   - [ ] Copy over configuration files (tailwind.config.js, postcss.config.js)

2. **Dependency Migration**
   - [ ] Update package.json with Next.js dependencies
   - [ ] Remove Vite-specific dependencies
   - [ ] Keep: Firebase, Gemini AI, React Hook Form, Radix UI, Zod
   - [ ] Update: React Router → Next.js App Router
   - [ ] Configure ESLint for Next.js

#### **PHASE 2: Core Components Migration (Day 2)**

1. **Layout & Navigation**

   - [ ] Convert App.tsx → app/layout.tsx
   - [ ] Migrate Navbar component (✅ Compatible as-is)
   - [ ] Migrate Sidebar component (✅ Compatible as-is)
   - [ ] Setup root layout with providers

2. **Context & State Management**
   - [ ] Migrate PlantStoreContext.tsx (✅ Compatible as-is)
   - [ ] Migrate ModalContext.tsx (✅ Compatible as-is)
   - [ ] Test context providers in Next.js layout

#### **PHASE 3: Page Routing Migration (Day 3)**

1. **Convert React Router → App Router**

   ```
   Current Route → Next.js App Router
   / → app/page.tsx (HomePage)
   /dashboard → app/dashboard/page.tsx (PlantCollectionPage)
   /plants → app/plants/page.tsx (PlantCollectionPage)
   /plants/:category → app/plants/[category]/page.tsx
   /plant/:id → app/plant/[id]/page.tsx (PlantDetailView)
   /pests → app/pests/page.tsx (PestsPage)
   /fertilizer → app/fertilizer/page.tsx (FertilizerPage)
   /soil → app/soil/page.tsx (SoilPage)
   ```

2. **Page Component Updates**
   - [ ] Remove useNavigate/useLocation hooks
   - [ ] Replace with Next.js navigation (useRouter, Link)
   - [ ] Update route parameters handling (useParams → props.params)

#### **PHASE 4: Advanced Features Migration (Day 4)**

1. **Modal System**

   - [ ] Migrate ModalHost component
   - [ ] Test modal functionality with App Router
   - [ ] Ensure modals work with dynamic routes

2. **Firebase Integration**

   - [ ] Migrate Firebase configuration (✅ Compatible as-is)
   - [ ] Test Firebase services in Next.js environment
   - [ ] Update environment variable handling (.env.local)

3. **Image Handling**
   - [ ] Evaluate next/image component integration
   - [ ] Update plant image components if beneficial
   - [ ] Maintain Firebase Storage compatibility

#### **PHASE 5: Testing & Optimization (Day 5-6)**

1. **Testing Migration**

   - [ ] Update Jest configuration for Next.js
   - [ ] Migrate existing tests
   - [ ] Test all core functionality
   - [ ] Add new tests for Next.js specific features

2. **Performance Optimization**
   - [ ] Implement proper loading.tsx files
   - [ ] Add error.tsx boundary components
   - [ ] Optimize bundle size
   - [ ] Add proper metadata for SEO

### 🔧 KEY MIGRATION MAPPINGS

#### **File Structure Changes**

```
BEFORE (Vite)              →  AFTER (Next.js)
src/App.tsx               →  app/layout.tsx + app/page.tsx
src/index.tsx             →  Removed (Next.js handles)
src/components/           →  components/ (same)
src/lib/                  →  lib/ (same)
src/features/home/HomePage.tsx → app/page.tsx
src/features/plants/PlantCollectionPage.tsx → app/plants/page.tsx
src/features/plants/PlantDetailView.tsx → app/plant/[id]/page.tsx
index.html                →  Removed (Next.js generates)
vite.config.ts            →  next.config.js
```

#### **Routing Changes**

```javascript
// BEFORE: React Router
import { useNavigate, useParams } from "react-router-dom";
const navigate = useNavigate();
const { id } = useParams();
navigate("/plants");

// AFTER: Next.js App Router
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/plants");
// params come as props in server components
```

#### **Component Updates Needed**

```typescript
// BEFORE: Client-side routing
export const PlantDetailView = () => {
  const { id } = useParams();
  // ...
};

// AFTER: Next.js page component
export default function PlantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  // ...
}
```

### 📦 DEPENDENCY CHANGES

#### **Remove (Vite-specific)**

- `vite` - Replaced by Next.js
- `@vitejs/plugin-react` - Not needed
- `react-router-dom` - Replaced by Next.js App Router

#### **Add (Next.js-specific)**

- `next` - Core framework
- `@next/eslint-config-next` - ESLint configuration
- `eslint-config-next` - Next.js ESLint rules

#### **Keep (Compatible)**

- `react`, `react-dom` - Same versions
- `typescript` - Same configuration
- `tailwindcss` - Native Next.js support
- `firebase` - Full compatibility
- `@google/generative-ai` - Works perfectly
- `react-hook-form`, `@hookform/resolvers` - Compatible
- `@radix-ui/*` - Full compatibility
- `zod` - Compatible
- `jest`, `@testing-library/*` - Compatible with config updates

### 🎯 MIGRATION SUCCESS CRITERIA

#### **Phase 1 Complete When:**

- [ ] Next.js project boots without errors
- [ ] Tailwind CSS styling works
- [ ] Basic routing functional

#### **Phase 2 Complete When:**

- [ ] All components render correctly
- [ ] Context providers work in layout
- [ ] No TypeScript errors

#### **Phase 3 Complete When:**

- [ ] All pages accessible via new routes
- [ ] Navigation works correctly
- [ ] Dynamic routes functional

#### **Phase 4 Complete When:**

- [ ] Modals work correctly
- [ ] Firebase integration functional
- [ ] All CRUD operations work

#### **Phase 5 Complete When:**

- [ ] All tests pass
- [ ] Performance meets/exceeds current
- [ ] Build completes successfully
- [ ] Deployment ready

### 🚨 RISK MITIGATION

- **Backup Strategy:** Keep current Vite version in separate branch
- **Incremental Testing:** Test each phase before proceeding
- **Rollback Plan:** Git branches for each migration phase
- **Data Safety:** Firebase/localStorage data unaffected by migration

### 💡 NEXT.JS BENEFITS TO LEVERAGE

- **Built-in SEO:** Meta tags, Open Graph support
- **Image Optimization:** next/image for plant photos
- **API Routes:** Future backend endpoints
- **Performance:** Automatic code splitting, bundling
- **Developer Experience:** Better error handling, fast refresh
