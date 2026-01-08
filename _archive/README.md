# Archive Folder - Organized Files

This folder contains files that were moved from the main project structure for better organization. **Nothing was deleted** - everything is preserved here in categorized subfolders.

## 📁 Folder Structure

### `01_redundant_docs/` - Redundant Documentation
Contains documentation files that overlap with the main `ARCHITECTURE_SUMMARY.md` and `README.md`:

- **MICROSERVICES_AWS_ARCHITECTURE.md** - AWS architecture details (merged into main ARCHITECTURE_SUMMARY.md)
- **AWS_DEVOPS_ARCHITECTURE.md** - DevOps architecture (redundant)
- **DEVOPS_PIPELINE.md** - CI/CD pipeline details (redundant)
- **FOLDER_STRUCTURE.md** - Project structure (info in README)
- **ANALYSIS.md** - Temporary analysis file
- **KAFKA_README.md** - Kafka docs (project uses RabbitMQ)

**Why moved**: These files contain information that's either duplicated in the main documentation or no longer relevant. Keeping them archived for reference.

---

### `02_ci_cd/` - CI/CD Configuration Files
Contains Jenkins-related files and configurations:

- **JENKINS_SETUP.md** - Jenkins setup guide
- **Jenkinsfile.backend** - Backend Jenkins pipeline
- **Jenkinsfile.frontend** - Frontend Jenkins pipeline  
- **Jenkinsfile.full** - Full stack Jenkins pipeline
- **Jenkinsfile.service** - Service-specific pipeline
- **jenkins-shared-library/** - Shared Jenkins library code

**Why moved**: CI/CD files should be in a dedicated `.ci/` or `jenkins/` directory, not in project root. Archived here if you decide to use Jenkins in the future. Most modern projects use GitHub Actions or GitLab CI instead.

---

### `03_misplaced_components/` - React Components from Root
Contains React/TypeScript component files that were in the project root instead of the frontend folder:

- **AnalyticsCard.tsx** - Analytics display component
- **InstructorDashboard.tsx** - Instructor dashboard
- **InstructorNav.tsx** - Instructor navigation
- **MyCourses.tsx** - My courses component
- **layout.tsx** - Layout component
- **page.tsx** - Page component

**Why moved**: These are React components that should be in `frontend/src/components/instructor/` but were mistakenly placed in the project root. Moved here instead of to frontend to preserve original state.

**If you need these**: Copy them to `frontend/src/components/instructor/` and update imports.

---

### `04_test_scripts/` - Test & Development Scripts
Contains manual testing and development helper scripts:

- **test-api.js** - Manual API testing script (223 lines)

**Why moved**: This is an outdated manual testing approach. Modern projects should use Jest/Supertest with proper E2E tests instead of custom Node.js scripts. Kept for reference if you want to port the test cases to a proper test framework.

---

### `05_misc/` - Miscellaneous Files
Contains various other files that don't fit the main project structure:

- **LICENSE.txt** - Duplicate license file (main LICENSE file kept in root)
- **package-lock.json** - Empty lock file (no package.json in root)

**Why moved**: Duplicate or unused files that serve no purpose in the main structure.

---

## 🔄 How to Use These Files

### If You Need to Restore Something:

```bash
# Example: Restore Jenkins files
cp -r _archive/02_ci_cd/* .ci/jenkins/

# Example: Move components to proper location
cp _archive/03_misplaced_components/*.tsx frontend/src/components/instructor/
```

### If You Need the Documentation:

The archived docs contain detailed information that might be useful:
- Check `01_redundant_docs/` for specific AWS/DevOps details
- Main architecture info is consolidated in root `ARCHITECTURE_SUMMARY.md`

---

## ✅ What's Still in Main Project

The project root now only contains:
- ✅ **README.md** - Main project documentation
- ✅ **ARCHITECTURE_SUMMARY.md** - Consolidated architecture guide
- ✅ **SECURITY.md** - Security best practices
- ✅ **LICENSE** - Project license
- ✅ **backend/** - Backend microservices
- ✅ **frontend/** - React frontend
- ✅ **_archive/** - This organized archive

---

## 📊 Archive Statistics

**Total Files Archived**: ~25 files  
**Folders Created**: 5 categories  
**Space**: ~60 KB of archived content  
**Status**: ✅ All files preserved, nothing deleted  

---

**Created**: January 7, 2026  
**Purpose**: Better project organization while preserving all original files
