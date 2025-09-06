const fs = require('fs');
const path = require('path');

// Read existing alumni stories
const existingAlumniPath = path.join(__dirname, '../knowledge/alumni-story.json');
const existingAlumni = JSON.parse(fs.readFileSync(existingAlumniPath, 'utf8'));

// Read new alumni data
const newAlumniPath = path.join(__dirname, '../data/new_alumni.json');
const newAlumniData = JSON.parse(fs.readFileSync(newAlumniPath, 'utf8'));

// Convert new alumni data to the correct format
const convertedAlumni = newAlumniData.alumni.map(alumnus => {
  // Split name into first and last
  const nameParts = alumnus.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  // Create a short achievement description
  const achievement = `${alumnus.position} at ${alumnus.company}`;
  
  // Create a short tldr
  const storyTldr = alumnus.story.split('.')[0].substring(0, 60) + '...';
  
  return {
    id: alumnus.id,
    firstName: firstName,
    lastName: lastName,
    classYear: String(alumnus.graduationYear),
    currentRole: `${alumnus.position} at ${alumnus.company}`,
    photoUrl: "/images/alumni/placeholder-alumni.jpg",
    interests: alumnus.tags || [],
    storyTldr: storyTldr,
    achievement: achievement,
    quote: alumnus.quote,
    gradeLevel: "high" // All are high school alumni
  };
});

// Check for duplicates (some alumni like Jason Kaplan are already in the system)
const existingIds = new Set(existingAlumni.stories.map(s => s.firstName.toLowerCase() + '_' + s.lastName.toLowerCase()));
const uniqueNewAlumni = convertedAlumni.filter(alumnus => {
  const checkId = alumnus.firstName.toLowerCase() + '_' + alumnus.lastName.toLowerCase();
  return !existingIds.has(checkId);
});

// Merge with existing alumni
const mergedAlumni = {
  stories: [...existingAlumni.stories, ...uniqueNewAlumni]
};

// Write back to alumni-story.json
fs.writeFileSync(existingAlumniPath, JSON.stringify(mergedAlumni, null, 2));

console.log(`✅ Successfully merged ${uniqueNewAlumni.length} new alumni profiles`);
console.log(`📊 Total alumni stories: ${mergedAlumni.stories.length}`);
console.log(`⚠️  Skipped duplicates: ${convertedAlumni.length - uniqueNewAlumni.length}`);