# Knowledge Base Documentation

This directory contains the knowledge base files that power the RAG (Retrieval Augmented Generation) system for the Saint Stephen's tour matching application.

## File Structure

### Core Knowledge Files (Used by RAG System)

These files are directly loaded and used by the AI matching system:

- **alumni-story.json** - Alumni success stories and profiles
- **faculty-story.json** - Teacher and faculty information  
- **current-student-stories.json** - Current student stories and experiences
- **facts.json** - School facts, statistics, and achievements

## Important: Adding New Data

⚠️ **All new content MUST be added to the appropriate knowledge files to be visible to the RAG system.**

The RAG system only reads from the files listed above. Data placed elsewhere (like `/data/` folder) will NOT be processed.

## How to Add New Content

### Adding New Alumni Stories

1. Format your alumni data to match this structure:
```json
{
  "id": "firstname_lastname_year",
  "firstName": "First",
  "lastName": "Last",
  "classYear": "2020",
  "currentRole": "Job Title at Company",
  "photoUrl": "/images/alumni/placeholder-alumni.jpg",
  "interests": ["technology", "leadership", "etc"],
  "storyTldr": "Brief 60-character summary...",
  "achievement": "Major achievement or current position",
  "quote": "Inspirational quote from the alumnus",
  "gradeLevel": "high"
}
```

2. Add to `knowledge/alumni-story.json` in the `stories` array
3. Run `npm run build` to test
4. Commit and push changes

### Adding New Faculty

Add to `knowledge/faculty-story.json` following the existing structure.

### Adding Current Student Stories

Add to `knowledge/current-student-stories.json` following the existing structure.

## Merging Script

Use the provided merge script for bulk alumni imports:
```bash
node scripts/merge-alumni-data.js
```

This script will:
- Convert data to the correct format
- Check for duplicates
- Merge with existing alumni stories

## Testing Changes

After adding new data:
1. Run `npm run build` to ensure no errors
2. Test locally with `npm run dev`
3. Verify the RAG system is finding your new content
4. Check OpenRouter API calls are working

## YouTube Videos to Add

For future integration:

**Teachers:**
- Patrick Whelan: https://www.youtube.com/watch?v=v0O8tugOOLQ
- Dave Johnson: https://youtu.be/M4uIGP9yZqQ
- Mandy Herren: https://youtu.be/H5ldJA1gjYk

**Alumni:**
- General: https://youtu.be/VDFyyirQNYw
- Chase and Sydney Brown: https://youtu.be/Xq3HJUqallU

**Students:**
- Students talk about teachers: https://youtu.be/chFGkSoSXqg

## Notes

- The RAG system expects specific field names - don't change the structure
- Always test after adding new content
- Keep stories concise and relevant for matching
- Ensure all required fields are populated