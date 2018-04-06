var dbService = require('./dbService');

populate_module = function(mod_obj, mod_str){
	dbService.query(
		// "INSERT INTO modules(module_name, module_number, module_description, module_content) VALUES(?,?,?,?)",
		"UPDATE modules SET module_content=? WHERE modules.module_number =?;",
		[mod_str, mod_obj.moduleNumber],
		function(err, rows) {
			if (err) {
				console.log(JSON.stringify(err));
			}
			else {
				console.log("It seems to have worked...");
			}
		}
	);
}

var mod1 = {
			moduleNumber: 1,
			moduleName: 'Find Professionals at Your Ideal Company to Network With',
			numOfSteps: 3,
			numSSonFinal: 2,
			intro: 'The first step to networking is to find the right professionals to network with. Below, you\'ll learn how to find professionals to network with in companies you want to work for. At least 50% of job openings are never advertised. Most jobs are filled by word of mouth, or networking. That\'s why it\'s so important to build relationships with professionals who have taken the path you want to pursue.',
			img: '/4/step1-3-keyword.png', //need
			steps: [
				{
					number: 0,
					numSubsteps: 1,
					name: 'Leverage Your Existing Network',
					why: 'The best networking results are achieved by students who have strong relationships with their networks. You will save a lot of time by networking with those you already know.',
					whatLearn: [
						'Learn how to totally BS bullet points 100% of the time',
						'Especially on things that really imporant',
						'Get all you need done with just a few words you threw together'
					], //need
					img: '/4/step1-3-keyword.png', //nice to have
					substeps: [
						{
							title: null,
							number: 0,
							introText: null,
							videoLink: null,
							pictures: null,
							paragraphs: [
								{
									text: 'Talk to people in your existing networks to see if anyone knows anyone who works for the company/organization you\'re interested in working for.',
									picture: null
								},
								{
									text: 'Your existing networks include your family, friends, church groups, clubs, societies, work, and any other groups you\'re apart of!',
									picture: null
								},
								{
									text: 'As you are referred to individuals who work at your ideal company, record their names in the \"Network Relationship Manager\"', // Link to NRM
									picture: null
								}
							],
							bullets: null,
							outroText: null,
						}
					]
				},
				{
					number: 1,
					numSubsteps: 2,
					name: 'Use LinkedIn to develop networking leads',
					why: 'LinkedIn is a great tool to be used with networking, as it can provide detailed information about individuals career, as well as a large list of potential contacts', // need
					whatLearn: [
						'Learn how to totally BS bullet points 100% of the time',
						'Especially on things that really imporant',
						'Get all you need done with just a few words you threw together'
					], // need
					img: '/4/step1-3-keyword.png', //nice to have
					substeps: [
						{
							title: null,
							number: 0,
							introText: 'Watch the video tutorial (with written guidlines). Make sure to use your "Network Relationship Manager" to record the names and information of those you want to connect with!', //needs rewording
							videoLink: 'https://www.youtube.com/embed/wcJ46Uw3W-Y',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: null,
						},
						{
							title: null,
							number: 1,
							introText: 'Complete the following steps',
							videoLink: null,
							pictures: null,
							paragraphs: null,
							bullets: [
								{
									title: null,
									numbered: false,
									list: [
										'Click on the magnifying glass symbol or select "search for people with filters" in the LinkedIn search bar.',
										'Enter a role of interest in the "Title" field in the "Keywords" section. (You have to click on "Keywords" to see the "Title" field.)',
										'Enter or select a company of interest in the "Current companies" field.',
										'Use the various different fields to narrow your search further. For example, select a geographic location that you want to live in.',
										'At this point, simply record the name, current company, and role of the contacts you find. (You can click the button below at the end of this section to record that information.)'
									],
									picture: null
								}
							],
							outroText: null,
						}
					]
				},
				{
					number: 2,
					numSubsteps: 2,
					name: 'Use LinkedIn to find recruiters to network with',
					why: 'This step will allow you to contact James so he can fix this text.', //need
					whatLearn: [
						'Learn how to totally BS bullet points 100% of the time',
						'Especially on things that really imporant',
						'Get all you need done with just a few words you threw together'
					], //need
					img: '/4/step1-3-keyword.png', //nice to have
					substeps: [
						{
							title: null,
							number: 0, 
							introText: 'Watch the video tutorial (with written guidlines). Make sure to use your "Network Relationship Manager" to record the names and information of those you want to connect with!', //needs rewording
							videoLink: 'https://www.youtube.com/embed/Uvam3-7LFOE',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: null,
						},
						{
							title: null,
							number: 1,
							introText: 'Complete the following steps',
							videoLink: null,
							pictures: null,
							paragraphs: null,
							bullets: [
								{
									title: null,
									numbered: false,
									list: [
										'Click on the magnifying glass symbol or select "search for people with filters" in the LinkedIn search bar.',
										'Enter "recruiter," "talent acquisition," or something similar in the "Title" field in the "Keywords" section. (You have to click on "Keywords" to see the "Title" field.)',
										'Enter or select a company of interest in the "Current companies" field.',
										'Up in the actual search bar, type the type of role your interested in. (Something like marketing, finance, operations - you get the picture.)',
										'Use the various different fields to narrow your search further. For example, select a geographic location that you want to live in.',
										'At this point, simply record the name, current company, and role of the contacts you find in the Network Relationship Manager' // needs rewording
									],
									picture: null
								}
							],
							outroText: null,
						}
					]
				}
			]
		};
var mod1_str = JSON.stringify(mod1);

var mod2 = {
			moduleNumber: 2,
			moduleName: 'Begin to Build Relationships with Professionals',
			numOfSteps: 2,
			numSSonFinal: 3,
			intro: 'At least 50% of available job opportunities aren\'t posted anywhere. Most companies prefer to hire candidates who have some sort of tie to the company already. It is critical to build relationships with professionals at companies you want to work for to have access to the other 50% of job opportunities out there.',
			img: '/4/step1-3-keyword.png', //nice to have
			steps: [
				{
					number: 0,
					numSubsteps: 3,
					name: 'Update your Professional Presence',
					why: '1st impressions are very important. Before you build relationships that can help you get great internships, you need to look as awesome as you are. Present yourself well and finding your internship will be 100% easier.',
					whatLearn: [
						'Learn how to totally BS bullet points 100% of the time',
						'Especially on things that really imporant',
						'Get all you need done with just a few words you threw together'
					], //need
					img: '/4/step1-3-keyword.png', //nice to have
					substeps: [
						{
							title: 'Update your LinkedIn profile',
							number: 0,
							introText: 'A lot of the communication you\'ll have with professionals will originate on LinkedIn. It\'s important to have a LinkedIn profile that exemplifies your value and shows you in the best light. Watch and listen to this video to learn how to stand out to professionals on LinkedIn:',
							
							videoLink: 'https://www.youtube.com/embed/4UcXDN9eGNE',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: null,
						},
						{
							title: 'Update your Resume',
							number: 1,
							introText: 'If you develop good relationships with professionals, it\'s likely you\'ll be asked for your resume. It\'s important that you have an effective and professional resume to show an employer. Go to www.joyfuljobsearch.com/tips to find articles to help you put together a great resume. Also, watch and listen to this video to learn how to create an effective and professional resume:',
							
							videoLink: 'https://youtube.com/embed/dI_RwRHPFTk',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: null,
						},
						{
							title: 'Learn to write a Cover Letter',
							number: 2,
							introText: 'Here are a few questions we hear a lot and their answers',
							videoLink: null,
							pictures: null,
							paragraphs: null,
							bullets: [
								{
									title: 'What is a cover letter?',
									numbered: false,
									list: [
										'A cover letter explains your interest and fit for a specific company and position.',
									],
									picture: null
								},
								{
									title: 'Why are cover letters important?',
									numbered: false,
									list: [
										'Cover letters allow you to make a case for yourself in complete sentences. Cover letters allow you get your passion accross for a role and or company more powerfully than a resume can. Almost no one knows how to make a good cover letter; that means that if you write a good one, you will instantly stand out.'
									],
									picture: null
								},
								{
									title: 'Do companies care about cover letters?',
									numbered: false,
									list: [
										'Many companies and professionals have started to disregard cover letters because they don\'t do a good job of convincing the employer of anything. Most people treat cover letters as a 150-word essay they have to write to pass a class. Therefore, if you put a little bit of extra effort into your cover letter, you should see increased interest from companies and hiring managers.'
									],
									picture: null
								}
							],
							outroText: null,
						}
					]
				},
				{
					number: 1,
					numSubsteps: 3,
					name: 'Make 1st Contact',
					why: 'Every thousand mile journey begins with a single step. Focusing on making a good first impression when you contact someone you want to learn from is critical; (that\'s why the first step in this module was to refine your LinkedIn profile and resume.) If you make a great impression with your first outreach effort, you\'re likely to get through to the person the next time you try and the time after that.',
					whatLearn: [
						'Learn how to totally BS bullet points 100% of the time',
						'Especially on things that really imporant',
						'Get all you need done with just a few words you threw together'
					], //need
					img: '/4/step1-3-keyword.png', //nice to have
					substeps: [
						{
							title: 'Choose the best way to reach out to your contact',
							number: 0,
							introText: null,
							videoLink: null,
							pictures: null,
							paragraphs: [
								{
									text: 'LinkedIn, Email, Phone, text message, Twitter, and Facebook are all legitimite ways to reach out to someone you hope to build a relationship with. Unless you know your contact won\'t mind getting a phone call, text message, or Facebook message from you, LinkedIn, Email, and Twitter are the best places to start.',
									picture: '/4/step1-3-keyword.png' // need graphic
								}
							],
							
							bullets: null,
							outroText: null,
						},
						{
							title: 'Email',
							number: 1,
							introText: 'Email is the socially safest way to reach out to someone you\'ve never met. An email is more likely to cross someone\'s eyes than a LinkedIn message and its less invasive than a phone call. Of course, a phone call isn\'t a bad thing, but starting with an email is usually the best course of action. Here\'s a tutorial to show you how to write a simple intorduction email:',
							
							videoLink: 'https://youtube.com/embed/b3tZ-HdWck8',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: null,
						},
						{
							title: 'LinkedIn',
							number: 2,
							introText: 'LinkedIn is a great way to reach out to someone you hope to build a relationship with. Watch this video to learn how to send a great introductory message to someone using LinkedIn:',
							
							videoLink: 'https://youtube.com/embed/D-zSy9p_R5k',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: 'Be aware that while LinkedIn is great, you shouldn\'t expect everyone to respond to you. Email will get a much higher response rate.',
						}
					]
				}
			]
		};
var mod2_str = JSON.stringify(mod2);

var mod4 = {
			moduleNumber: 4,
			moduleName: 'How to Nail Job/Internship Interviews',
			numOfSteps: 3,
			numSSonFinal: 2,
			intro: 'If you\'ve made it to the point where you have an interview lined up, congratulations! You\'ve obviously impressed the hiring managers at the company, now you get to seal the deal. Even if you feel comfortable with your interviewing abilities, this module will help you interview at a higher level.',
			img: '/4/step1-3-keyword.png', // needs
			steps: [
				{
					number: 0,
					numSubsteps: 5,
					name: 'Prepare',
					why: 'It\'s easy to get so excited for an interview that we become captivated by the thought of the job. When that happens, preparing for the interview becomes an afterthought. Preparing for the interview can help you an amount of confidence to match your excitement.',
					whatLearn: [
						'Learn how to totally BS bullet points 100% of the time',
						'Especially on things that really imporant',
						'Get all you need done with just a few words you threw together'
					], // need
					img: '/4/step1-3-keyword.png', // would be nice
					substeps: [
						{
							title: 'Do a keywords analysis on the job description',
							number: 0,
							introText: null,
							videoLink: 'https://youtube.com/embed/hxIPJhIpx9s',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: null,
						},
						{
							title: 'Compare the keywords analysis with your resume',
							number: 1,
							introText: null,
							videoLink: null,
							pictures: [
                              '4/step1-2-keyword.png',
                              '4/step1-2-resume.png'
							],
							paragraphs: null,
							bullets: null,
							outroText: null,
						},
						{
							title: 'Find matching keywords to learn which experiences you\'ve had that will make you stand you to your interviewer.',
							number: 2,
							introText: null,
							videoLink: null,
							pictures: [
                              '4/step1-3-keyword.png',
                              '4/step1-3-resume.png'
							],
							
							paragraphs: null,
							bullets: null,
							outroText: 'Wow, development is a big deal to this company and so is creativity. You should definitely share that experience about how you created and developed that website in your last job.',
						},
						{
							title: 'Research the Company/Organization',
							number: 3,
							introText: null,
							videoLink: 'https://youtube.com/embed/71c6sHbRjCY',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: null,
						},
						{
							title: 'Prepare Questions to Ask the Interviewer',
							number: 4,
							introText: 'At the end of every interview, you will be asked "so, do you have any questions for me?" Coming to an interview prepared with good questions to ask communicates your intelligence and interest to the interviewer. Use the research you\'ve conducted on the company to ask intelligent questions. Here are some ways to come up with great questions to ask at the end of your interview:',
							
							videoLink: 'https://youtube.com/embed/uvkcKv2QJWk',
							pictures: null,
							paragraphs: null,
							bullets: null,
							outroText: null,
						}
					]
				},
				{
					number: 1,
					numSubsteps: 4,
					name: null,
					why: 'At some point, the actual interview will happen. You need to be prepared for anything the interviewer has up their sleeve.',
					whatLearn: [
						'Learn how to totally BS bullet points 100% of the time',
						'Especially on things that really imporant',
						'Get all you need done with just a few words you threw together'
					], // needs
					img: '/4/step1-3-keyword.png', // nice to have
					substeps: [
						{
							title: 'Be On Time',
							number: 0,
							introText: null,
							videoLink: null,
							pictures: null,
							paragraphs: null,
							bullets: [
								{
									title: 'Do whatever you have to do to be on time!',
									numbered: false,
									list: [
										'Leave hours early if you have to and hunker down in a coffee shop next to the office. Be on time!'
									],
									picture: null
								},
								{
									title: 'Why?',
									numbered: false,
									list: [
										'It\'s an issue of respect. If you don\'t show up on time, the interviewer will assume you don\'t respect her time or authority.'
									],
									picture: null
								},
								{
									title: 'How to fix it...',
									numbered: false,
									list: [
										'If you find yourself running late, call, text, or email the interviewer to explain your circumstances',
										'Heavy sleeper? If the interview takes place earlier in the morning than you\'re accustomed to, buy an extra alarm clock and put it in the hallway. '
									],
									picture: null
								}
							],
							outroText: null,
						},
						{
							title: 'Dress Up',
							number: 1,
							introText: null,
							videoLink: null,
							pictures: null,
							paragraphs: null,
							bullets: [
								{
									title: 'Men',
									numbered: false,
									list: [
										'Wear a suit and tie! Get your suit dry cleaned!'
									],
									picture: '/4/step1-3-keyword.png' //would be nice
								},
								{
									title: 'Women',
									numbered: false,
									list: [
										'(Have Stella do this)'
									],
									picture: '/4/step1-3-keyword.png' //would be nice
								}
							],
							outroText: null,
						},
						{
							title: 'Treat the Interview Like a Conversation, Not an Interrogation',
							number: 2,
							introText: null,
							videoLink: null,
							pictures: null,
							paragraphs: [
								{
									text: 'Most have an incorrect notion about job interviews. They believe that the job of the interviewer is to ask all of the questions and the job of the interviewee is to give all the answers.',
									picture: null
								},
								{
									text: 'This is not true.',
									picture: null
								},
								{
									text: 'Think back to the last engaging conversation you had with someone and think about the elements that made it great. Both parties were asking questions, stories were shared, and a sort of bond was made.',
									picture: null
								},
								{
									text: 'Do your best to turn your job interview into an interesting job conversation. (Don’t take over the interview, rather, contribute to the experience in a meaningful way.)',
									picture: null
								}
							],
							bullets: null,
							outroText: null,
						},
						{
							title: 'Be Specific',
							number: 3,
							introText: null,
							videoLink: null,
							pictures: null,
							paragraphs: null,
							bullets: [
								{
									title: 'Let\'s take an interview question:',
									numbered: false,
									list: [
										'How would you describe your leadership style?'
									],
									picture: null
								},
								{
									title: 'Here\'s an example of a nonspecific answer to that interview question:',
									numbered: false,
									list: [
										'I am a disciplinarian.'
									],
									picture: null
								},
								{
									title: 'See any problems with that answer? How on earth is the interviewer supposed to make a decision based on your value with that response?',
									numbered: false,
									list: [
										null
									],
									picture: null
								},
								{
									title: 'Instead, take a look at a specific answer to that question:',
									numbered: false,
									list: [
										'"I know how to instill a proper sense of discipline in those whom I\'ve had the pleasure to lead throughout my career. For example, I was promoted to a district manager position in my previous company. Before I took over, we had an abysmal reputation throughout the business for turning in work late. I installed several processes to hold everyone in the department responsible for their work. As a result, we only turned in one assignment late through my 6 years in that position. It was an awesome team effort."'
									],
									picture: null
								},
								{
									title: null,
									numbered: false,
									list: [
										'See the improvement? The employer now has the ability to judge you based on something you achieved.'
									],
									picture: null
								}
							],
							outroText: null,
						}
					]
				},
				{
					number: 2,
					numSubsteps: 2,
					name: 'Follow Up',
					why: 'Most candidates leave the interview and wait to hear back. Separate youself by taking intitiative. Prove that you want the job more than anyone else by taking the appropriate actions to follow up.',
					whatLearn: [
						'Learn how to totally BS bullet points 100% of the time',
						'Especially on things that really imporant',
						'Get all you need done with just a few words you threw together'
					], // needs
					img: '/4/step1-3-keyword.png', //would be nice
					substeps: [
						{
							title: 'Write Thank-You Letters',
							number: 0,
							introText: 'Remember all the times you received a letter/hand-written note from someone. How did you feel when that happened? Probably pretty good.',
							videoLink: null,
							pictures: null,
							paragraphs: [
								{
									text: 'Here\'s how to do it:',
									picture: null
								}
							],
							bullets: [
								{
									title: null,
									numbered: false,
									list: [
										'Find something professional looking.',
										'Be sincere, most pieces of advice on thank you notes say to use the opportunity to remind the interviewer of your strengths and achievements. This is incorrect. Take the opportunity to express gratitude for the opportunity to interview.',
										'Send it immediately! After you get out of the interview, the first item on your to-do list is to write and send thank-notes to all of the professionals you interacted with.',
										'Here\'s an example of what your thank-note might sound like:'
									],
									picture: '4/step3-1-thankyou.jpg'
								}
							],
							outroText: null,
						},
						{
							title: 'Reach Out',
							number: 1,
							introText: null,
							videoLink: null,
							pictures: null,
							paragraphs: [
								{
									text: 'After you\'ve sent a thank-you note, you should wait for about a week. If you haven\'t heard from the interviewer at that point, you should send an email or make a call.',
									picture: null
								},
								{
									text: 'This will keep you on the interviewer\'s mind. Most interviewers are busy, by reaching out, you might prompt an action to happen sooner rather than later.',
									picture: null
								},
								{
									text: 'An email might look like this:',
									picture: 'step3-2-email.png'
								}
							],
							bullets: null,
							outroText: null,
						}
					]
				}
			]
		};
var mod4_str = JSON.stringify(mod4);



populate_module(mod1, mod1_str);
// populate_module(mod2, mod2_str);
// populate_module(mod4, mod4_str);