# 🔍 MANDATORY RISK ASSESSMENT TEMPLATES

## 🚨 MANDATORY OUTPUT FORMAT

Every AI response MUST follow this structure:

### 📋 **TASK UNDERSTANDING**
- Current request: [what user asked for]
- Files involved: [list specific files]
- Scope: [exactly what will be changed]

### 🔍 **RISK ASSESSMENT**
- **Risk Level: [0-100%]**
- **Impact:** [what could break]
- **Dependencies:** [what else might be affected]
- **Rollback:** [how to undo if needed]

### ⚠️ **PRE-EXECUTION CHECKLIST**
- [ ] Port 3000 check: `netstat -ano | findstr :3000`
- [ ] Kill existing servers if found
- [ ] User approval received: YES/NO

### 🎯 **PROPOSED ACTION**
[Exactly what you will do, step by step]

**STOP HERE - WAIT FOR USER APPROVAL BEFORE PROCEEDING**

## 📊 RISK LEVEL GUIDELINES

- **0-25%:** Low risk (config changes, documentation updates)
- **26-50%:** Medium risk (component updates, minor logic changes)  
- **51-75%:** High risk (major refactoring, state management changes)
- **76-100%:** Critical risk (architecture changes, data migration)

## 🛑 HIGH RISK TRIGGERS (>50%)
- Modifying core state management
- Changing database schemas
- Major routing changes
- Build system modifications
- Dependency version updates

## 🔧 COMPLIANCE VERIFICATION
Before proceeding with any task:
1. Use the mandatory output format above
2. Provide specific risk percentage
3. Check server management rules
4. Get explicit user approval
5. Document all changes made
