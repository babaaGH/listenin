import type { MeetingSummary } from '../types/meeting';

export const demoMeetings: MeetingSummary[] = [
  {
    id: 'demo_sales_call',
    framework: 'sales',
    overview: 'Productive sales call with Acme Corp discussing their enterprise plan. Strong interest shown with budget confirmed at $50K. Main objection around implementation timeline addressed. Next steps include sending proposal by Friday and scheduling technical demo.',
    chapters: [
      {
        timestamp: '00:00',
        title: 'Introduction & Discovery',
        summary: 'Opening pleasantries and initial discovery about their current pain points with manual meeting documentation.'
      },
      {
        timestamp: '05:30',
        title: 'Product Demo',
        summary: 'Walked through key features including real-time transcription, AI summaries, and framework-specific analysis.'
      },
      {
        timestamp: '12:45',
        title: 'Objections & Concerns',
        summary: 'Discussed implementation timeline concerns and addressed data security questions.'
      },
      {
        timestamp: '18:20',
        title: 'Pricing & Next Steps',
        summary: 'Confirmed budget, presented pricing options, and agreed on next steps with clear deadlines.'
      }
    ],
    highlights: [
      {
        quote: 'We absolutely need this for our sales team, the manual note-taking is killing productivity',
        speaker: 'John Smith (CTO)',
        timestamp: '03:15',
        importance: 'high'
      },
      {
        quote: 'Budget is approved for $50K annually if we can get this implemented by Q2',
        speaker: 'Sarah Johnson (VP Sales)',
        timestamp: '16:42',
        importance: 'high'
      },
      {
        quote: 'Can we integrate this with Salesforce? That would be a game-changer',
        speaker: 'John Smith (CTO)',
        timestamp: '14:30',
        importance: 'medium'
      }
    ],
    actionItems: [
      {
        task: 'Send detailed proposal with enterprise pricing',
        assignee: 'Sales Rep',
        priority: 'high',
        dueDate: 'Friday, Jan 17',
        completed: false
      },
      {
        task: 'Schedule technical demo with engineering team',
        assignee: 'Sales Rep',
        priority: 'high',
        dueDate: 'Next Week',
        completed: false
      },
      {
        task: 'Provide Salesforce integration documentation',
        assignee: 'Product Team',
        priority: 'medium',
        dueDate: 'Jan 20',
        completed: false
      },
      {
        task: 'Follow up on security questionnaire',
        assignee: 'Sarah Johnson',
        priority: 'medium',
        dueDate: 'Next Week',
        completed: false
      }
    ],
    participants: ['John Smith (CTO)', 'Sarah Johnson (VP Sales)', 'Sales Rep'],
    duration: '23:15',
    recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    transcript: 'This is a demo sales call transcript. In a real meeting, this would contain the full conversation...'
  },
  {
    id: 'demo_brainstorm',
    framework: 'brainstorm',
    overview: 'Energetic brainstorming session for the new mobile app redesign. Generated 15+ ideas across UI improvements, feature additions, and onboarding flow. Converged on top 3 priorities: dark mode toggle, offline support, and improved onboarding. Team will prototype dark mode first.',
    chapters: [
      {
        timestamp: '00:00',
        title: 'Divergent Brainstorming',
        summary: 'Free-flowing idea generation without constraints. Team members shared wild ideas for improving the mobile experience.'
      },
      {
        timestamp: '08:15',
        title: 'Grouping & Themes',
        summary: 'Organized ideas into themes: UI/UX improvements, new features, performance, and onboarding.'
      },
      {
        timestamp: '15:30',
        title: 'Convergent Decision Making',
        summary: 'Voted on top priorities using dot voting. Dark mode, offline support, and onboarding emerged as winners.'
      },
      {
        timestamp: '22:45',
        title: 'Next Steps',
        summary: 'Assigned owners for each priority and set timeline for initial prototypes.'
      }
    ],
    highlights: [
      {
        quote: 'What if we made the entire app gesture-based? Swipe actions for everything!',
        speaker: 'Alex Chen (Designer)',
        timestamp: '04:20',
        importance: 'medium'
      },
      {
        quote: 'Dark mode is the #1 request from users. We need to ship this ASAP',
        speaker: 'Maria Rodriguez (Product)',
        timestamp: '17:35',
        importance: 'high'
      },
      {
        quote: 'Let\'s build a quick prototype of the dark mode this week and test with users',
        speaker: 'David Kim (Engineering)',
        timestamp: '25:10',
        importance: 'high'
      }
    ],
    actionItems: [
      {
        task: 'Create dark mode design mockups',
        assignee: 'Alex Chen',
        priority: 'high',
        dueDate: 'Wednesday',
        completed: false
      },
      {
        task: 'Research offline storage solutions',
        assignee: 'David Kim',
        priority: 'high',
        dueDate: 'Friday',
        completed: false
      },
      {
        task: 'Design new onboarding flow wireframes',
        assignee: 'Alex Chen',
        priority: 'medium',
        dueDate: 'Next Week',
        completed: false
      },
      {
        task: 'Schedule user testing sessions',
        assignee: 'Maria Rodriguez',
        priority: 'medium',
        dueDate: 'Next Week',
        completed: false
      },
      {
        task: 'Build dark mode toggle prototype',
        assignee: 'David Kim',
        priority: 'high',
        dueDate: 'Next Friday',
        completed: false
      }
    ],
    participants: ['Alex Chen (Designer)', 'Maria Rodriguez (Product)', 'David Kim (Engineering)', 'Lisa Park (UX Research)'],
    duration: '28:42',
    recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    transcript: 'This is a demo brainstorming session transcript. In a real meeting, this would contain the full conversation...'
  }
];

export const initializeDemoMeetings = (): void => {
  const hasInitialized = localStorage.getItem('demo_meetings_initialized');

  if (!hasInitialized) {
    // Check if there are any existing meetings
    const existingMeetings = localStorage.getItem('listenin_summaries');

    if (!existingMeetings || JSON.parse(existingMeetings).length === 0) {
      // Add demo meetings
      localStorage.setItem('listenin_summaries', JSON.stringify(demoMeetings));
      localStorage.setItem('demo_meetings_initialized', 'true');
    }
  }
};
