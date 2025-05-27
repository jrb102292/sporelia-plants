# AI MEMORY - Sporelia Plant Collection Project

**Last Updated:** May 27, 2025
**Current Status:** AI Memory System Initialization
**Active AI Session:** Session 1

## 🎯 PROJECT OVERVIEW

- **Name:** Sporelia - Plant Collection Management App
- **Tech Stack:** React + TypeScript + Tailwind + Firebase/LocalStorage
- **Purpose:** Organize, track, and care for plant collections with AI-powered care tips

## 🔧 CURRENT CONFIGURATION

- **Storage:** Dual mode (localStorage + Firebase Firestore)
- **AI Integration:** Gemini API for plant care tips
- **Image Storage:** Firebase Storage
- **Testing:** Jest + React Testing Library
- **Styling:** Tailwind CSS utility-first

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

## 🎯 CURRENT TASK

**Task:** AI Memory system with mandatory instructions
**Status:** COMPLETED ✅
**Goal:** Ensure all future AIs read memory file and follow strict workflow

## 📋 IMMEDIATE NEXT STEPS

1. ✅ Create AI_MEMORY.md file
2. ✅ Add mandatory AI instructions and workflow
3. ⏳ Wait for user testing/approval (CURRENT)
4. ⏸️ Determine next development priority

## 🔄 DEVELOPMENT WORKFLOW ESTABLISHED

**CRITICAL RULE:** Only perform ONE task at a time, then:

1. Update this AI_MEMORY.md file
2. Ask user to test the new functionality
3. Wait for approval before continuing
4. Never delete memories without user permission

## 🐛 KNOWN ISSUES

- None currently identified

## 🔧 ENVIRONMENT SETUP

- **OS:** Windows
- **Shell:** cmd.exe
- **Workspace:** c:\Users\jbickford\Documents\sporelia\sporelia-plants
- **Node/NPM:** Available (package.json exists)
- **Firebase:** Configured with diagnostic tools
- **Gemini API:** Configured via .env.local

## 📚 KEY FILES TO MONITOR

- `src/lib/PlantStoreContext.tsx` - Global state management
- `src/lib/plantService.ts` - Core business logic
- `src/App.tsx` - Main routing and layout
- `src/types.ts` - TypeScript interfaces
- `package.json` - Dependencies and scripts
- `AI_MEMORY.md` - This file (update with every change)

## 🎨 RECENT CODE PATTERNS

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

### Session 1 - May 27, 2025

- **13:00** - AI Memory system initialization
- **13:01** - Created AI_MEMORY.md with comprehensive project tracking
- **13:15** - Enhanced with mandatory AI instructions and strict workflow protocol
- **Status:** Waiting for user testing and approval of enhanced memory system

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
