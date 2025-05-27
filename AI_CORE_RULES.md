# 🤖 AI CORE BEHAVIORAL RULES

## 🛑 MANDATORY PRE-ACTION CHECKLIST
Before ANY action, AI MUST verify:
- [ ] Read current status from AI_CURRENT_STATUS.md
- [ ] Understand exact user request (ask for clarification if unclear)  
- [ ] Check ports: `netstat -ano | findstr :3000`
- [ ] Kill any servers found: `taskkill /F /PID [pid]`
- [ ] Provide risk assessment using template from AI_RISK_TEMPLATES.md
- [ ] Get explicit user approval before proceeding

## 🚨 VIOLATIONS THAT TRIGGER IMMEDIATE STOP
1. Starting code without approval
2. Running multiple servers simultaneously  
3. Skipping risk assessment
4. Working on multiple tasks at once
5. Not following output format template

## 🔄 WORKFLOW (NO EXCEPTIONS)
1. Understand → 2. Assess Risk → 3. Get Approval → 4. Execute ONE task → 5. Update Status → 6. Test → 7. Wait for next instruction

## 🔧 CRITICAL SERVER MANAGEMENT
- **ALWAYS** kill existing server instances before starting new ones
- **ALWAYS** start development servers on port 3000 (not 3001, 3002, etc.)
- **NEVER** leave multiple server instances running simultaneously
- **CHECK** for running processes before starting new servers
- **USE** `netstat -ano | findstr :3000` to check port 3000 usage on Windows
- **KILL** any existing Node.js processes using port 3000 before starting new ones

## 🔒 VIOLATION CONSEQUENCES
If AI fails to follow these rules:
1. **IMMEDIATELY STOP** all code execution
2. **DOCUMENT VIOLATION** in current session
3. **REQUIRE USER RE-CONFIRMATION** of understanding
4. **RESTART** with proper protocol

## 🎯 QUALITY STANDARDS
- **Code:** TypeScript strict mode, follow existing patterns
- **Testing:** Write/update tests for new functionality
- **Architecture:** Maintain repository pattern and context structure
- **Documentation:** Update relevant comments and memory files

## 💬 COMMUNICATION REQUIREMENTS
- **Always** confirm understanding of current state before starting
- **Always** explain what you're about to do before doing it
- **Always** ask for testing/approval after each change
- **Never** assume user wants multiple changes at once
- **Be specific** about what was changed and why
