import type { TipsMapping } from '../types';

// TODO: Fetch this from Backend

/*
Unleash the potential of every teams

Project
Kanban
Scrum
Issue
Sprint
Board
Report
Epic
Release
Backlog
Workflow
Permissions
Roadmap
Next-gen
Classic
Instance
Atlassian
Transition
Advanced roadmaps
Automation
free tier

https://twitter.com/Atlassian
https://twitter.com/Jira
https://elisegal.medium.com/5-tips-for-a-better-agile-board-in-jira-c4ba1296e38c

 */

const TIPS__JSW_USAGE: TipsMapping = {

	'apps--native--mac': {
		content: 'Using a Mac? Jira has a native desktop app for Mac.',
		cta: {
			target: 'https://www.atlassian.com/software/jira/mac',
		},
	},

	'apps--native--windows': {
		content: 'Using Windows? You can pin Jira like a desktop app.',
		cta: {
			target: 'https://community.atlassian.com/t5/Jira-questions/Is-there-a-Jira-Windows-app/qaq-p/875086',
		},
	},

	'apps--native--mobile': {
		content: 'Access Jira from anywhere by installing the app on your smartphone!',
		cta: {
			target: 'https://www.atlassian.com/mobile',
			text: 'Review & install',
		},
	},

	'navigation--your-work': {
		'content': 'Select "Your work" in the navigation bar (at the top) to get back to what you were working on, fast.',
	},

	'navigation --find-issues-assigned-to-you': {
		content: 'You can see all the issues assigned to you in the issues view.',
		cta: {
			target: '/issues/?jql=assignee%20in%20(currentUser())'
		},
	},

	'shortcuts--intro': {
		content: 'Jira has a lot of keyboard shortcuts to ease your life! Check them in Help ("︖" in the top right) > Keyboard shortcuts',
		// TODO CTA should opn the shortcut table
	},

	'support': {
		content: 'Did you check our resources about Jira? documentation, community help and much more!',
		cta: {
			target: 'https://support.atlassian.com/jira-software-cloud/',
		},
	},

	'marketplace': {
		content: 'The Jira marketplace is full of powerful addons to help you work faster and smarter.',
		cta: {
			target: 'https://marketplace.atlassian.com/search?hosting=cloud&product=jira',
		},
	},

	'issue--intro': {
		content: 'An "issue" is a generic term for any piece of work that need to be done in your project',
		cta: {

			target:
		}
	},

	'issue--comment': {
		content: 'You can comment on issues and @mention your colleagues.',
		cta: {
			target: '/issues/?jql=creator%20in%20(currentUser())',
			text: 'Let’s try it',
		},
	},

	'issue--link': {
		content: 'You can link an issue to another with meaningful relationships: "blocked by", "duplicates", "relates to"…',
		cta: {
			target: '/issues/?jql=creator%20in%20(currentUser())',
			text: 'Let’s do it',
		},
	},

	'issue--fields': {
		content: 'You can add custom fields to your issues and filter them against that field. Look for it in your project settings!',
	},

	'issue--types': {
		content: 'Issues have types, usually: "story", "bug", etc. You can add your own types in your project settings!'
	},

	'issue--labels': {
		content: 'You can add labels to your issues and filter them against those labels.',
	},

	/*'issues--find--quick-filters': {
		https://www.thedroidsonroids.com/blog/5-top-jira-tips-tricks-i-wish-i-knew-1-year-ago
	},*/

	'reports--intro': {
		content: 'You can track and analyze your team’s work with reports.',
		cta: {
			target: 'https://support.atlassian.com/jira-software-cloud/docs/track-and-analyze-your-teams-work-with-reports/',
		},
	},
}

const TIPS__JIRA_USAGE: TipsMapping = {

	'vision--every-team': {
		content: 'Jira is for every team: sales, marketing, HR, IT, devops, design, support, software…',
		cta: {
			target: 'https://www.atlassian.com/software/jira/guides/getting-started/overview',
			text: 'Find a case study',
		},
	},

	'jira--your-work': {
		content: 'Are you using "your work" ? It’s a dashboard of all the Jira things you worked on recently.',
		cta: {
			target: '/jira/your-work',
		},
	},

	'teams': {
		content: 'You can create a team in Jira, select "People" -> "Start a team" in the Navigation bar.'
	},

	'hotkey--c': {
		content: 'You can create a new issue from anywhere just by pressing the "C" key! Try it now!',
	}
}

const TIPS__ATLASSIAN_USAGE: TipsMapping = {

	'start.atlassian.com': {
		content: 'Are you using Atlassian Start? It’s a starting point for all your work in Atlassian products.',
		cta: {
			target: 'https://start.atlassian.com/',
		},
	},

	'cloud-status': {
		content: 'Having an outage? Check the Jira status to monitor the situation.',
		cta: {
			target: 'https://jira-software.status.atlassian.com/',
			text: 'Let’s monitor',
		},
	},

	'customize--profile': {
		content: 'Keep your profile picture and work title up to date!',
		cta: {
			target: 'https://id.atlassian.com/manage-profile/profile-and-visibility',
			text: 'Review & update',
		},
	},

	'admin.atlassian.com/': {
		content: 'Are you an admin? Manage all your Jira products from a single page.',
		cta: {
			target: 'https://admin.atlassian.com/',
			text: 'Manage',
		},
	},
}

const TIPS__AGILE: TipsMapping = {

	'agile--definition': {
		content: 'There is no accepted definition for Agile. Only one thing is clear: it’s all about delivering value better, faster and with fewer headaches.',
		cta: {
			target: 'https://www.atlassian.com/agile',
			text: 'Learn more',
		},
	},

	'agile--mindset': {
		content: 'Agile is not a process, it’s a mindset.',
		cta: {
			target: 'https://agilemanifesto.org/',
			text: 'Read the manifesto',
		},
	},

	'agile--principle--satisfaction': {
		content: 'An Agile principle: we want both the stakeholders and the developers to be happy with the project!',
		cta: {
			target: 'https://agilemanifesto.org/principles.html',
			text: 'See more',
		},
	},

	'agile--principle--face-to-face': {
		content: 'An Agile principle: talking, if possible face to face, is better than e-mails and documents!',
		cta: {
			target: 'https://agilemanifesto.org/principles.html',
			text: 'See more',
		},
	},

	'agile--principle--iteration': {
		content: 'An Agile principle: don’t spend too much time on a big piece: do a quick proof-of-concept, show it to the stakeholders, get feedback, iterate!',
		cta: {
			target: 'https://agilemanifesto.org/principles.html',
			text: 'See more',
		},
	},

	'agile--principle--feedback': {
		content: 'An Agile principle: get feedback from the stakeholders as soon as possible, don’t waste your time on stuff that may end up rejected!',
		cta: {
			target: 'https://agilemanifesto.org/principles.html',
			text: 'See more',
		},
	},

	'agile--different': {
		content: 'Every team is different, every team does Agile differently! ',
	},

	'agile--mushroom': {
		content: 'Agile is a mushroom.',
		cta: {
			target: 'https://medium.com/@ilja.vishnevski/agile-is-a-mushroom-d943efa41643',
			text: 'What?',
		},
	},

	stories
	/*'agile--terminology--backlog': {
		content: 'An Agile, we call "backlog" the big todo list of everything left to do or nice to have for the project.',
		cta: {
			target:
		},
	},*/

	'agile--blog-topic': {
		content: 'Get Agile how-to’s on the "agile" section of the Atlassian blog.',
		cta: {
			target: 'https://www.atlassian.com/blog/jira-software',
			text: 'Learn how to',
		}
	},
}

const TIPS__CROSS_FLOW: TipsMapping = {

	'cross-flow--list': {
		content: 'Jira is only one element of the Atlassian family of products. All the products are made to work together, multiplying your efficiency!',
		cta: {
			target: 'https://www.atlassian.com/software',
			text: 'Check all the products',
		},
	},

	'cross-flow--trello': {
		content: 'Do you have a small and quick project? How about using a quick Trello board instead of Jira?',
		cta: {
			target: 'https://www.atlassian.com/software/trello',
		},
	},

	// TODO all other possible cross-flow
}

const TIPS__BRAND: TipsMapping = {

	// https://hello.atlassian.net/wiki/spaces/~scott/blog/2020/08/04/802239906/How+I+explain+what+we+do+to+CIOs
	//'Atlassian is the #1 vendor that helps companies track and manage all the work across their software teams.'

	'brand--awareness': {
		content: 'The company making Jira is called Atlassian.',
		cta: {
			target: 'https://www.atlassian.com/company',
			text: 'Learn more',
		}
	},

	'brand--blog': {
		content: 'Visit the Atlassian blog to get stories on culture, tech, teams, and tips.',
		cta: {
			target: 'https://www.atlassian.com/blog',
			text: 'Learn more',
		}
	},

	'brand--blog--teamwork': {
		content: 'The "teamwork" section of the Atlassian blog can help you and your team lay a solid foundation for being more effective, more collaborative, and just plain happier at work.',
		cta: {
			target: 'https://www.atlassian.com/blog/teamwork',
			text: 'Get the tips',
		}
	},

	'brand--blog--productivity': {
		content: 'The "productivity" section of the Atlassian blog can help you work smarter, not harder! Get tips to check things off your list, handy hacks to prevent procrastination, and brain breaks to bust boredom.',
		cta: {
			target: 'https://www.atlassian.com/blog/teamwork',
			text: 'Get the tips',
		}
	},

	'brand--blog--leadership': {
		content: 'The "leadership" section of the Atlassian blog can help you lead with focus, communicate with empathy, and inspire transformational work among your team.',
		cta: {
			target: 'https://www.atlassian.com/blog/leadership',
			text: 'Get the tips',
		}
	},

	'brand--blog--technology': {
		content: 'The "technology" section of the Atlassian blog can help you stay ahead of the curve with reports on the latest trends and practices.',
		cta: {
			target: 'https://www.atlassian.com/blog/technology',
			text: 'Get the tips',
		}
	},

	'brand--blog--news:jsw': {
		content: 'Follow the latest news about Jira on this dedicated blog.',
		cta: {
			target: 'https://www.atlassian.com/blog/jira-software',
			text: 'Get up to date',
		}
	},

	'brand--blog--podcast': {
		content: 'Listen to the Atlassian "Teamistry" podcast to get stories of unsung teams that achieve the impossible.',
		cta: {
			target: 'https://www.atlassian.com/blog/podcast',
			text: 'Listen',
		}
	},

	// TODO social accounts
	// https://www.facebook.com/Atlassian
	// https://twitter.com/atlassian
	// https://www.linkedin.com/company/atlassian
	// https://www.youtube.com/user/GoAtlassian

	/*
	'brand--case-studies'
https://www.atlassian.com/software/jira/guides/use-cases/who-uses-jira

	'brand--social-validation': {
https://www.atlassian.com/customers/search
https://www.atlassian.com/customers
	},*/

	SpaceX and NASA
	https://twitter.com/Jira/status/1266825571104747521
}

const TIPS__UNIQUE_VALUE: TipsMapping = {

	'differentiator--privacy': {
		content: 'Your personal data are safe with Atlassian products',
		cta: {
			target: 'https://www.atlassian.com/trust/privacy',
			text: 'Learn more',
		}
	},

	'differentiator--security': {
		content: 'Security is Atlassian’s top priority: have a look at all our security practices.',
		cta: {
			target: 'https://www.atlassian.com/trust/security/security-practices',
			text: 'Learn more',
		}
	},

	'differentiator--security--CSA': {
		content: 'Atlassian is part of the Cloud Security Alliance, a research organization aiming to determine the best practices for secure cloud computing.',
		cta: {
			target: 'https://www.atlassian.com/trust/security/vendor-security-risk-response',
			text: 'Learn more',
		},
	},

	'differentiator--compliance': {
		content: 'Atlassian products are highly secure. Don’t just take us at our word - we encourage you to inspect and verify our security and privacy practices and operations.',
		cta: {
			target: 'https://www.atlassian.com/trust/compliance',
			text: 'Check them out',
		},
	},

// TODO differentiator privacy, platform roadmap, and more

}

const TIPS__TEAM: TipsMapping = {

	// TODO high performing team
}

const TIPS__MISC: TipsMapping = {

	'misc--ask-for-a-raise': {
		content: 'When did you last ask for a raise? Here are a few tips…',
		cta: {
			target: 'https://www.atlassian.com/blog/teamwork/how-to-ask-for-a-raise',
			text: 'I need that'
		},
	},

}

const ALL_TIPS: TipsMapping = {

	...TIPS__JSW_USAGE,
	...TIPS__JIRA_USAGE,
	...TIPS__ATLASSIAN_USAGE,
	...TIPS__AGILE,
	...TIPS__CROSS_FLOW,
	...TIPS__BRAND,
	...TIPS__UNIQUE_VALUE,
	...TIPS__TEAM,
	...TIPS__MISC,
}

export default ALL_TIPS
