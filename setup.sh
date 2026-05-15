#!/bin/bash
# NeuroLingua AI — Quick Setup Script
# Run: chmod +x setup.sh && ./setup.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "  ███╗   ██╗███████╗██╗   ██╗██████╗  ██████╗ "
echo "  ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔═══██╗"
echo "  ██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║   ██║"
echo "  ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║   ██║"
echo "  ██║ ╚████║███████╗╚██████╔╝██║  ██║╚██████╔╝"
echo "  ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ "
echo -e "${NC}"
echo -e "${GREEN}  NeuroLingua AI — Setup Script${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org (v20+)"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ required. Current: $(node -v)"
  exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Install dependencies
echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm install

# Setup .env
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo -e "${YELLOW}⚠️  Created .env.local — fill in your values!${NC}"
fi

# Generate Prisma
echo -e "\n${BLUE}🗄️  Generating Prisma client...${NC}"
cd apps/api && npx prisma generate && cd ../..

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "  Next steps:"
echo -e "  1. Fill in ${YELLOW}.env.local${NC} with your API keys"
echo -e "  2. Start PostgreSQL + Redis:"
echo -e "     ${BLUE}docker compose -f infrastructure/docker/docker-compose.yml up -d postgres redis${NC}"
echo -e "  3. Run migrations:"
echo -e "     ${BLUE}npm run db:migrate${NC}"
echo -e "  4. Start development:"
echo -e "     ${BLUE}npm run dev${NC}"
echo ""
echo -e "  🌐 Web:  http://localhost:3000"
echo -e "  🔧 API:  http://localhost:4000"
echo -e "  📚 Docs: http://localhost:4000/api/docs"
echo ""
