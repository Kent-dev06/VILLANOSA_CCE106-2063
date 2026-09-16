export type Event = { id: string; title: string; category: 'Academic' | 'Community' | 'Sports' | 'Arts'; date: string; time: string; venue: string; description: string; joined: boolean };

export const events: Event[] = [
  { id: 'career-fair', title: 'Campus Career Fair', category: 'Academic', date: 'September 22', time: '9:00 AM', venue: 'Student Center Hall', description: 'Meet local employers, learn about internships, and bring your resume for quick feedback.', joined: true },
  { id: 'coastal-cleanup', title: 'Coastal Cleanup Drive', category: 'Community', date: 'September 24', time: '6:30 AM', venue: 'North Bay Walk', description: 'Join fellow students for a meaningful morning of coastal care. Gloves and water are provided.', joined: false },
  { id: 'intramural-finals', title: 'Intramural Finals', category: 'Sports', date: 'September 26', time: '3:00 PM', venue: 'University Gym', description: 'Cheer for your department as the final teams compete for this semester’s championship.', joined: false },
  { id: 'open-mic', title: 'Open Mic Night', category: 'Arts', date: 'September 27', time: '5:30 PM', venue: 'Library Courtyard', description: 'A relaxed evening for poetry, music, stories, and original performances from the campus community.', joined: true },
  { id: 'research-forum', title: 'Student Research Forum', category: 'Academic', date: 'October 1', time: '1:00 PM', venue: 'Science Building 204', description: 'Discover student-led research projects and ask presenters about their process and findings.', joined: false },
  { id: 'game-night', title: 'Board Game Social', category: 'Community', date: 'October 3', time: '4:00 PM', venue: 'Commons Lounge', description: 'Drop in, find a table, and make new friends over classic and modern board games.', joined: false },
];
