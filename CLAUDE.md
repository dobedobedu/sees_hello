# CLAUDE.md - Project Specification & Engineering Guidelines

## 🎯 Project Goal
Create a simple, effective prototype for Saint Stephen's Episcopal School that converts website visitors into purposeful tour bookings by matching families with relevant student stories and programs.

## 📋 Project Overview
- **Name**: Had Me At Hello
- **Production URL**: visit.saintstephens.org (Vercel deployment)
- **Target Users**: Prospective students and families
- **Primary Goal**: Generate qualified, purposeful tour bookings
- **Timeline**: Deploy ASAP, iterate based on feedback
- **Current Status**: Working prototype, needs production setup

## ✅ Core Requirements

### User Experience
- [ ] Mobile-first responsive design
- [ ] Load time under 3 seconds
- [ ] Clear, friendly messaging
- [ ] Simple 6-step quiz flow
- [ ] Fallback for API failures

### Quiz Flow Improvements
- [ ] **Redesign "Tell Me About Your Kid" question**
  - Replace open text with structured checklist
  - Categories: Academic, Social, Extracurricular, Special Needs
  - Allow multiple selections with optional text
  - Keep voice as supplementary option
- [ ] **Create shared checklist output**
  - Generate summary for families
  - Same format for admissions office
  - Include all quiz selections

### Technical Setup
- [ ] Configure OpenRouter API (not LMStudio)
  ```env
  OPENROUTER_API_KEY=your_key_here
  OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
  OPENROUTER_MODEL=anthropic/claude-3-haiku
  ```
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Set up environment variables
- [ ] Enable Vercel Analytics

### Integration Requirements
- [ ] **Email Template Generation**
  - Family contact info
  - Quiz responses summary
  - Selected interests/programs
  - Preferred tour timeline
- [ ] **Google Calendar Integration**
  - Generate pre-filled email
  - Include tour preferences
  - Manual booking (low volume)
- [ ] **Copy to Clipboard**
  - One-click copy of results
  - Formatted for email

## 🚀 Quick Commands
```bash
npm run dev          # Start local development
npm run build        # Build for production
npm run lint         # Check code quality
vercel              # Deploy to staging
vercel --prod       # Deploy to production
```

## 🛠 Engineering Guidelines

### DO's
✅ Keep it simple - prototype mindset
✅ Ship fast, get feedback, iterate
✅ Mobile-first always
✅ Use existing patterns in codebase
✅ Test on real phones before deploy
✅ Commit frequently

### DON'Ts
❌ Over-engineer features
❌ Add complex state management
❌ Skip mobile testing
❌ Commit secrets or API keys
❌ Worry about scaling (low volume)

## 📱 Essential Testing
- [ ] iPhone Safari (current iOS)
- [ ] Android Chrome
- [ ] Quiz completion flow
- [ ] API fallback behavior
- [ ] Email template generation

## 🔑 Environment Variables
```env
# .env.local
OPENROUTER_API_KEY=sk-or-v1-xxxxx
NEXT_PUBLIC_SCHOOL_NAME=Saint Stephen's Episcopal School
NEXT_PUBLIC_TOUR_EMAIL=admissions@saintstephens.org
```

## 📊 Success Metrics
- Quiz completion rate >50%
- Tour booking conversion >25%
- Page load <3 seconds
- Mobile usability score >90

## 🚢 Deployment Checklist
1. [ ] Update .env.local with production keys
2. [ ] Run `npm run build` locally
3. [ ] Test build with `npm start`
4. [ ] Push to main branch
5. [ ] Deploy to Vercel staging
6. [ ] Test core flows on mobile
7. [ ] Deploy to production
8. [ ] Verify domain routing

## 📝 Current TODOs

### High Priority
1. **Child Description Redesign**
   - Convert to checklist format
   - Add structured categories
   - Make data shareable

2. **OpenRouter Integration**
   - Replace LMStudio config
   - Add API key management
   - Test with live API

3. **Email Template System**
   - Format quiz responses
   - Create shareable summary
   - Add copy functionality

### Medium Priority
- Add tour confirmation page
- Implement basic analytics
- Create admin view (future)

### Low Priority
- A/B testing framework
- Advanced matching algorithm
- Automated email sending

## 🤝 Key Information
- **Admissions Email**: admissions@saintstephens.org
- **Tour Booking**: Manual via Google Calendar
- **Expected Volume**: <10 bookings/day
- **Support Contact**: TBD

## 📄 Data Flow
```
1. Family completes quiz
   ↓
2. AI matches with stories/faculty
   ↓
3. Results page shows matches
   ↓
4. Family selects tour interests
   ↓
5. Generate email template
   ↓
6. Family sends to admissions
   ↓
7. Admissions books via Google Calendar
```

## 🔧 Troubleshooting
- **API Timeout**: Fallback to cached responses
- **Mobile Issues**: Test on real devices, not just DevTools
- **Vercel Deploy**: Check environment variables
- **Domain Setup**: Verify CNAME records

---
*Last Updated: January 2025*
*Focus: Simple, effective, mobile-first prototype that converts visitors to tours*