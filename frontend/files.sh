#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting 01Blog Angular Project Generation...${NC}"
echo ""

# # Check if Angular CLI is installed
# if ! command -v ng &> /dev/null; then
#     echo -e "${RED}❌ Angular CLI is not installed. Please install it first:${NC}"
#     echo "npm install -g @angular/cli"
#     exit 1
# fi

# Create new Angular project
echo -e "${YELLOW}📦 Creating Angular project 'blog-frontend'...${NC}"
ng new blog-frontend --routing --style=scss --skip-git --package-manager=npm
cd blog-frontend

echo -e "${GREEN}✅ Project created successfully!${NC}"
echo ""

# Create directory structure
echo -e "${YELLOW}📁 Creating directory structure...${NC}"

# Core directories
mkdir -p src/app/core/{guards,interceptors,services,models,constants}
mkdir -p src/app/shared/{components,directives,pipes,validators}
mkdir -p src/app/features/{auth,home,posts,profile,notifications,reporting,admin,settings}
mkdir -p src/app/layout/{main-layout,admin-layout,auth-layout}

# Assets directories  
mkdir -p src/assets/{images/{logos,icons,placeholders,backgrounds},styles,data}

echo -e "${GREEN}✅ Directory structure created!${NC}"
echo ""

# Generate Core Services
echo -e "${YELLOW}🛠️ Generating core services...${NC}"
ng generate service core/services/auth --skip-tests
ng generate service core/services/storage --skip-tests
ng generate service core/services/notification --skip-tests

# Generate Guards
echo -e "${YELLOW}🛡️ Generating guards...${NC}"
ng generate guard core/guards/auth --skip-tests
ng generate guard core/guards/admin --skip-tests  
ng generate guard core/guards/no-auth --skip-tests

# Generate Interceptors
echo -e "${YELLOW}🔄 Generating interceptors...${NC}"
ng generate interceptor core/interceptors/auth --skip-tests
ng generate interceptor core/interceptors/error --skip-tests
ng generate interceptor core/interceptors/loading --skip-tests

# Generate Shared Components
echo -e "${YELLOW}🧩 Generating shared components...${NC}"
ng generate component shared/components/header --skip-tests
ng generate component shared/components/footer --skip-tests
ng generate component shared/components/loading-spinner --skip-tests
ng generate component shared/components/confirmation-dialog --skip-tests
ng generate component shared/components/post-card --skip-tests
ng generate component shared/components/media-preview --skip-tests
ng generate component shared/components/user-avatar --skip-tests

# Generate Shared Directives
echo -e "${YELLOW}📝 Generating shared directives...${NC}"
ng generate directive shared/directives/auto-resize --skip-tests
ng generate directive shared/directives/infinite-scroll --skip-tests

# Generate Shared Pipes
echo -e "${YELLOW}🔧 Generating shared pipes...${NC}"
ng generate pipe shared/pipes/time-ago --skip-tests
ng generate pipe shared/pipes/safe-html --skip-tests
ng generate pipe shared/pipes/truncate --skip-tests

# Generate Layout Components
echo -e "${YELLOW}🏗️ Generating layout components...${NC}"
ng generate component layout/main-layout --skip-tests
ng generate component layout/admin-layout --skip-tests
ng generate component layout/auth-layout --skip-tests

# Generate Auth Feature
echo -e "${YELLOW}🔐 Generating authentication feature...${NC}"
mkdir -p src/app/features/auth/{components,services}
ng generate component features/auth/components/login --skip-tests
ng generate component features/auth/components/register --skip-tests
ng generate component features/auth/components/forgot-password --skip-tests
ng generate service features/auth/services/auth-api --skip-tests

# Generate Home Feature
echo -e "${YELLOW}🏠 Generating home feature...${NC}"
mkdir -p src/app/features/home/{components,services}
ng generate component features/home/components/home --skip-tests
ng generate component features/home/components/feed --skip-tests
ng generate component features/home/components/sidebar --skip-tests
ng generate service features/home/services/feed --skip-tests

# Generate Posts Feature
echo -e "${YELLOW}📝 Generating posts feature...${NC}"
mkdir -p src/app/features/posts/{components,services}
ng generate component features/posts/components/post-create --skip-tests
ng generate component features/posts/components/post-edit --skip-tests
ng generate component features/posts/components/post-detail --skip-tests
ng generate component features/posts/components/comment-section --skip-tests
ng generate component features/posts/components/comment-item --skip-tests
ng generate component features/posts/components/media-upload --skip-tests
ng generate service features/posts/services/post --skip-tests
ng generate service features/posts/services/comment --skip-tests
ng generate service features/posts/services/media --skip-tests

# Generate Profile Feature
echo -e "${YELLOW}👤 Generating profile feature...${NC}"
mkdir -p src/app/features/profile/{components,services}
ng generate component features/profile/components/profile --skip-tests
ng generate component features/profile/components/profile-header --skip-tests
ng generate component features/profile/components/profile-posts --skip-tests
ng generate component features/profile/components/profile-edit --skip-tests
ng generate component features/profile/components/followers-list --skip-tests
ng generate component features/profile/components/following-list --skip-tests
ng generate service features/profile/services/profile --skip-tests
ng generate service features/profile/services/subscription --skip-tests

# Generate Notifications Feature
echo -e "${YELLOW}🔔 Generating notifications feature...${NC}"
mkdir -p src/app/features/notifications/{components,services}
ng generate component features/notifications/components/notification-list --skip-tests
ng generate component features/notifications/components/notification-item --skip-tests
ng generate component features/notifications/components/notification-badge --skip-tests
ng generate service features/notifications/services/notification-api --skip-tests

# Generate Reporting Feature
echo -e "${YELLOW}🚨 Generating reporting feature...${NC}"
mkdir -p src/app/features/reporting/{components,services}
ng generate component features/reporting/components/report-dialog --skip-tests
ng generate component features/reporting/components/report-button --skip-tests
ng generate service features/reporting/services/report --skip-tests

# Generate Admin Feature
echo -e "${YELLOW}⚙️ Generating admin feature...${NC}"
mkdir -p src/app/features/admin/{components,services}
ng generate component features/admin/components/admin-dashboard --skip-tests
ng generate component features/admin/components/user-management --skip-tests
ng generate component features/admin/components/post-management --skip-tests
ng generate component features/admin/components/report-management --skip-tests
ng generate component features/admin/components/analytics --skip-tests
ng generate component features/admin/components/admin-sidebar --skip-tests
ng generate service features/admin/services/admin --skip-tests
ng generate service features/admin/services/user-management --skip-tests
ng generate service features/admin/services/analytics --skip-tests

# Generate Settings Feature
echo -e "${YELLOW}⚙️ Generating settings feature...${NC}"
mkdir -p src/app/features/settings/{components,services}
ng generate component features/settings/components/settings --skip-tests
ng generate component features/settings/components/theme-toggle --skip-tests
ng generate component features/settings/components/privacy-settings --skip-tests
ng generate service features/settings/services/theme --skip-tests
ng generate service features/settings/services/settings --skip-tests