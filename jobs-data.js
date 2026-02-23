// Local dataset for Job Notification Tracker
// 60 realistic Indian tech job postings

const JOBS = [
  {
    id: "job-1",
    title: "SDE Intern",
    company: "Amazon",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "Fresher",
    skills: ["Java", "Data Structures", "Algorithms", "Problem Solving"],
    source: "LinkedIn",
    postedDaysAgo: 1,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://www.amazon.jobs/en/jobs/IN-SDE-INT-001",
    description: `Work with experienced engineers on services that power large-scale systems.
Contribute to feature development in a mentored environment.
Learn how to design, build, test, and deploy backend components.
Ideal for final-year students with strong CS fundamentals.`,
  },
  {
    id: "job-2",
    title: "Graduate Engineer Trainee",
    company: "Infosys",
    location: "Pune, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Java", "Spring Boot", "SQL", "Git"],
    source: "Naukri",
    postedDaysAgo: 3,
    salaryRange: "3–5 LPA",
    applyUrl: "https://careers.infosys.com/jobs/GET-2025-PUNE",
    description: `Join the delivery team to build and maintain enterprise applications.
Get structured training across backend, testing, and deployment practices.
Collaborate with senior developers to translate requirements into clean code.
Open to 2024 and 2025 graduates from CS and related branches.`,
  },
  {
    id: "job-3",
    title: "Frontend Intern",
    company: "Flipkart",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["JavaScript", "React", "HTML", "CSS"],
    source: "LinkedIn",
    postedDaysAgo: 0,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.flipkart.com/jobs/FE-INT-2025",
    description: `Assist in building customer-facing interfaces for the ecommerce platform.
Work closely with product designers to implement accessible UI components.
Improve performance and reliability across browsers and devices.
Best suited for candidates with solid React basics and personal projects.`,
  },
  {
    id: "job-4",
    title: "Junior Backend Developer",
    company: "Razorpay",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "1-3",
    skills: ["Node.js", "REST APIs", "PostgreSQL", "Microservices"],
    source: "LinkedIn",
    postedDaysAgo: 2,
    salaryRange: "6–10 LPA",
    applyUrl: "https://razorpay.com/jobs/BE-DEV-RAZ-01",
    description: `Build and maintain backend services that process payments at scale.
Own small features end-to-end from design to rollout.
Collaborate with SRE and product teams to keep systems reliable.
Ideal for engineers with prior internship or 1+ year industry experience.`,
  },
  {
    id: "job-5",
    title: "Data Analyst Intern",
    company: "Swiggy",
    location: "Bengaluru, India",
    mode: "Remote",
    experience: "0-1",
    skills: ["SQL", "Excel", "Python", "Data Visualization"],
    source: "Naukri",
    postedDaysAgo: 5,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.swiggy.com/jobs/DA-INT-2025",
    description: `Support analytics projects that improve delivery and customer experience.
Work with large datasets to generate clear operational insights.
Build dashboards that help business teams track key metrics.
Good role for analytical graduates comfortable with SQL and Python.`,
  },
  {
    id: "job-6",
    title: "Python Developer (Fresher)",
    company: "TCS",
    location: "Hyderabad, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Python", "Django", "REST APIs", "Git"],
    source: "Indeed",
    postedDaysAgo: 4,
    salaryRange: "3–5 LPA",
    applyUrl: "https://careers.tcs.com/jobs/PY-FRESH-HYD",
    description: `Contribute to internal tools and client-facing web applications.
Use Python and Django to build stable, testable features.
Participate in code reviews and follow established engineering practices.
Suitable for freshers with strong programming fundamentals and mini projects.`,
  },
  {
    id: "job-7",
    title: "React Developer (1-3)",
    company: "Capgemini",
    location: "Mumbai, India",
    mode: "Hybrid",
    experience: "1-3",
    skills: ["React", "TypeScript", "Redux", "REST APIs"],
    source: "LinkedIn",
    postedDaysAgo: 6,
    salaryRange: "6–10 LPA",
    applyUrl: "https://www.capgemini.com/in-en/jobs/REACT-DEV-MUM",
    description: `Develop modular frontends for enterprise clients across domains.
Write clean, maintainable React components with clear state management.
Collaborate with backend teams to integrate REST APIs reliably.
Role requires at least one year of hands-on React experience in production.`,
  },
  {
    id: "job-8",
    title: "QA Intern",
    company: "Cognizant",
    location: "Chennai, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Manual Testing", "Test Cases", "Basic SQL"],
    source: "Naukri",
    postedDaysAgo: 7,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.cognizant.com/jobs/QA-INT-CHN",
    description: `Assist QA teams in planning and executing test cycles.
Prepare clear test cases from functional specifications.
Log defects with reproducible steps and coordinate with developers.
Good starting point for candidates interested in quality and reliability.`,
  },
  {
    id: "job-9",
    title: "Java Developer (0-1)",
    company: "Wipro",
    location: "Hyderabad, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["Java", "Spring", "Hibernate", "SQL"],
    source: "Indeed",
    postedDaysAgo: 8,
    salaryRange: "3–5 LPA",
    applyUrl: "https://careers.wipro.com/jobs/JAVA-DEV-HYD",
    description: `Join a cross-functional squad delivering features for enterprise clients.
Use Java and Spring to implement backend services and integrations.
Pair with senior engineers to understand design and deployment flows.
Open to candidates with up to one year of relevant experience.`,
  },
  {
    id: "job-10",
    title: "SDE Intern",
    company: "Paytm",
    location: "Noida, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["Java", "Kotlin", "Microservices", "REST"],
    source: "LinkedIn",
    postedDaysAgo: 2,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://paytm.com/careers/jobs/SDE-INT-NOIDA",
    description: `Support development of wallet and payments features.
Work on microservices that handle high-volume transactions.
Follow coding standards and write basic unit tests.
Best suited for interns comfortable with JVM languages and APIs.`,
  },
  {
    id: "job-11",
    title: "Junior Backend Developer",
    company: "PhonePe",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "1-3",
    skills: ["Java", "Spring Boot", "Kafka", "MySQL"],
    source: "LinkedIn",
    postedDaysAgo: 1,
    salaryRange: "10–18 LPA",
    applyUrl: "https://careers.phonepe.com/jobs/JR-BE-DEV-01",
    description: `Build services that support payments and merchant experiences.
Participate in system design discussions with senior engineers.
Write reliable, observable backend code with clear metrics.
Good fit for engineers with exposure to distributed systems basics.`,
  },
  {
    id: "job-12",
    title: "Data Analyst Intern",
    company: "Freshworks",
    location: "Chennai, India",
    mode: "Remote",
    experience: "Fresher",
    skills: ["SQL", "Tableau", "Python", "Excel"],
    source: "Naukri",
    postedDaysAgo: 0,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.freshworks.com/jobs/DA-INT-2025",
    description: `Assist analytics teams with product and customer behaviour analysis.
Use SQL to query data warehouses and prepare structured datasets.
Build simple dashboards that answer recurring stakeholder questions.
Ideal for graduates comfortable with numbers and clear communication.`,
  },
  {
    id: "job-13",
    title: "React Developer (1-3)",
    company: "Zoho",
    location: "Chennai, India",
    mode: "Onsite",
    experience: "1-3",
    skills: ["React", "JavaScript", "CSS", "REST APIs"],
    source: "Indeed",
    postedDaysAgo: 4,
    salaryRange: "6–10 LPA",
    applyUrl: "https://careers.zoho.com/jobs/REACT-DEV-CHN",
    description: `Implement user interfaces for SaaS products used globally.
Collaborate with designers to translate wireframes into usable flows.
Optimize components for performance on varied network conditions.
Role requires at least one prior frontend project in production.`,
  },
  {
    id: "job-14",
    title: "Python Developer (Fresher)",
    company: "IBM",
    location: "Pune, India",
    mode: "Hybrid",
    experience: "Fresher",
    skills: ["Python", "Flask", "APIs", "Git"],
    source: "LinkedIn",
    postedDaysAgo: 6,
    salaryRange: "3–5 LPA",
    applyUrl: "https://careers.ibm.com/jobs/PY-FRESH-PUNE",
    description: `Develop internal services and scripts that support enterprise clients.
Follow coding guidelines and documentation practices.
Engage with global teams across time zones through structured communication.
Good for freshers who are comfortable learning new tools on the job.`,
  },
  {
    id: "job-15",
    title: "Java Developer (0-1)",
    company: "Oracle",
    location: "Bengaluru, India",
    mode: "Onsite",
    experience: "0-1",
    skills: ["Java", "SQL", "Spring Boot"],
    source: "Naukri",
    postedDaysAgo: 5,
    salaryRange: "6–10 LPA",
    applyUrl: "https://careers.oracle.com/jobs/JAVA-DEV-BLR",
    description: `Work on modules of large-scale enterprise products.
Assist in design, implementation, and troubleshooting of backend components.
Write unit tests and contribute to continuous integration pipelines.
Suitable for early-career engineers with strong Java foundations.`,
  },
  {
    id: "job-16",
    title: "SDE Intern",
    company: "CRED",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["Go", "Microservices", "Kubernetes"],
    source: "LinkedIn",
    postedDaysAgo: 3,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.cred.club/jobs/SDE-INT-2025",
    description: `Help build and maintain backend services for credit products.
Work in small teams with high ownership and clear expectations.
Learn modern tooling around observability, deployments, and reviews.
Open to candidates who show strong problem solving through projects.`,
  },
  {
    id: "job-17",
    title: "Graduate Engineer Trainee",
    company: "Accenture",
    location: "Gurugram, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Java", "SQL", "Testing", "Agile"],
    source: "Indeed",
    postedDaysAgo: 7,
    salaryRange: "3–5 LPA",
    applyUrl: "https://accenture.com/careers/jobs/GET-GGN-2025",
    description: `Join multi-disciplinary teams delivering digital transformation projects.
Rotate across development, testing, and support roles in the first year.
Learn structured delivery practices followed across global accounts.
Suitable for fresh graduates open to working across domains.`,
  },
  {
    id: "job-18",
    title: "Junior Backend Developer",
    company: "Juspay",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "1-3",
    skills: ["Java", "Scala", "Functional Programming"],
    source: "LinkedIn",
    postedDaysAgo: 2,
    salaryRange: "10–18 LPA",
    applyUrl: "https://juspay.in/careers/jobs/JR-BE-DEV",
    description: `Work on payment processing rails used by multiple large apps.
Contribute to highly reliable systems with strong correctness guarantees.
Pair with experienced engineers to learn functional programming practices.
Best suited for developers comfortable with mathematical thinking.`,
  },
  {
    id: "job-19",
    title: "Frontend Intern",
    company: "Freshdesk Labs",
    location: "Chennai, India",
    mode: "Remote",
    experience: "Fresher",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    source: "Indeed",
    postedDaysAgo: 9,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://jobs.freshdesklabs.com/FE-INT-CHN",
    description: `Collaborate with UX designers to prototype new support workflows.
Implement clean, reusable components with clear documentation.
Focus on accessibility and keyboard-friendly interactions.
Good internship for candidates who enjoy polishing UI details.`,
  },
  {
    id: "job-20",
    title: "Data Analyst Intern",
    company: "Razorpay",
    location: "Bengaluru, India",
    mode: "Remote",
    experience: "0-1",
    skills: ["SQL", "Power BI", "Excel"],
    source: "Naukri",
    postedDaysAgo: 4,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://razorpay.com/jobs/DA-INT-2025",
    description: `Support reporting on payments, merchants, and risk signals.
Prepare datasets and dashboards for product and operations teams.
Document definitions so metrics remain consistent across stakeholders.
Ideal for graduates who enjoy data storytelling and clear visuals.`,
  },
  {
    id: "job-21",
    title: "React Developer (1-3)",
    company: "PhonePe",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "1-3",
    skills: ["React", "TypeScript", "Webpack"],
    source: "LinkedIn",
    postedDaysAgo: 1,
    salaryRange: "10–18 LPA",
    applyUrl: "https://careers.phonepe.com/jobs/REACT-DEV-01",
    description: `Build and refine user journeys across consumer-facing flows.
Work in close partnership with designers to maintain visual consistency.
Ensure performance remains smooth across mid-range Android devices.
Suitable for engineers who care about nuance in front-end experiences.`,
  },
  {
    id: "job-22",
    title: "Java Developer (0-1)",
    company: "SAP",
    location: "Bengaluru, India",
    mode: "Onsite",
    experience: "0-1",
    skills: ["Java", "OOP", "SQL"],
    source: "Indeed",
    postedDaysAgo: 8,
    salaryRange: "6–10 LPA",
    applyUrl: "https://jobs.sap.com/JAVA-DEV-BLR-0-1",
    description: `Contribute to modules of core enterprise software suites.
Participate in code reviews and follow architectural guidelines.
Help maintain performance and stability across releases.
Open to applicants with project work in Java and basic database skills.`,
  },
  {
    id: "job-23",
    title: "SDE Intern",
    company: "Zoho",
    location: "Chennai, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["C++", "Java", "Problem Solving"],
    source: "Naukri",
    postedDaysAgo: 3,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.zoho.com/jobs/SDE-INT-2025",
    description: `Work with small teams owning features in SaaS products.
Solve practical engineering problems around performance and usability.
Learn to debug complex issues in live environments carefully.
Good role for students who enjoy hands-on coding challenges.`,
  },
  {
    id: "job-24",
    title: "Graduate Engineer Trainee",
    company: "Dell",
    location: "Hyderabad, India",
    mode: "Hybrid",
    experience: "Fresher",
    skills: ["C#", ".NET", "SQL", "Testing"],
    source: "LinkedIn",
    postedDaysAgo: 5,
    salaryRange: "3–5 LPA",
    applyUrl: "https://jobs.dell.com/GET-HYD-2025",
    description: `Join product engineering teams building tools for global customers.
Rotate across development and validation responsibilities.
Follow clear processes for documentation and risk reviews.
Ideal for graduates willing to work across the stack with guidance.`,
  },
  {
    id: "job-25",
    title: "Frontend Intern",
    company: "CredFlow Labs",
    location: "Gurugram, India",
    mode: "Remote",
    experience: "Fresher",
    skills: ["React", "Tailwind", "REST"],
    source: "LinkedIn",
    postedDaysAgo: 6,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.credflowlabs.com/jobs/FE-INT",
    description: `Help design and implement dashboards for fintech customers.
Translate Figma designs into predictable, responsive layouts.
Work with senior engineers to keep components consistent and simple.
Good fit for interns who have shipped side projects on the web.`,
  },
  {
    id: "job-26",
    title: "Data Analyst Intern",
    company: "StackRoute Analytics",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["SQL", "Python", "Pandas"],
    source: "Indeed",
    postedDaysAgo: 7,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://stackrouteanalytics.com/careers/DA-INT",
    description: `Assist in building analytical reports for technology clients.
Clean and validate datasets before they move into production dashboards.
Document assumptions so stakeholders understand how metrics are built.
Ideal for early-career professionals who like structured analysis work.`,
  },
  {
    id: "job-27",
    title: "React Developer (1-3)",
    company: "QuickHire Tech",
    location: "Pune, India",
    mode: "Remote",
    experience: "1-3",
    skills: ["React", "TypeScript", "GraphQL"],
    source: "LinkedIn",
    postedDaysAgo: 2,
    salaryRange: "6–10 LPA",
    applyUrl: "https://quickhiretech.com/jobs/REACT-DEV",
    description: `Build candidate and recruiter interfaces for a hiring platform.
Focus on predictable state management and testable components.
Collaborate with backend teams on GraphQL API design decisions.
Role suits engineers who enjoy product discussions and iteration.`,
  },
  {
    id: "job-28",
    title: "Java Developer (0-1)",
    company: "FreshCart Digital",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["Java", "Spring Boot", "REST"],
    source: "Naukri",
    postedDaysAgo: 9,
    salaryRange: "3–5 LPA",
    applyUrl: "https://freshcartdigital.in/jobs/JAVA-JR",
    description: `Implement backend services for an online grocery platform.
Participate in daily standups and sprint rituals with cross-functional teams.
Learn how to monitor and debug services in production safely.
Suitable for junior developers eager to work in consumer tech.`,
  },
  {
    id: "job-29",
    title: "Python Developer (Fresher)",
    company: "MetroData Labs",
    location: "Hyderabad, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Python", "APIs", "PostgreSQL"],
    source: "Indeed",
    postedDaysAgo: 4,
    salaryRange: "3–5 LPA",
    applyUrl: "https://metrodata.in/careers/PY-DEV-FRESH",
    description: `Support development of data ingestion and transformation pipelines.
Implement small features and bug fixes with clear guidance.
Write simple tests to keep scripts maintainable over time.
Good first role for engineers moving into data-heavy backends.`,
  },
  {
    id: "job-30",
    title: "SDE Intern",
    company: "HireSense AI",
    location: "Bengaluru, India",
    mode: "Remote",
    experience: "Fresher",
    skills: ["Python", "FastAPI", "MongoDB"],
    source: "LinkedIn",
    postedDaysAgo: 0,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://hiresense.ai/careers/SDE-INT",
    description: `Contribute to backend services powering an AI hiring assistant.
Work on well-scoped tasks reviewed by experienced mentors.
Learn how to design APIs that are easy for clients to consume.
Ideal for final-year students curious about ML-backed products.`,
  },
  {
    id: "job-31",
    title: "Graduate Engineer Trainee",
    company: "Infosys",
    location: "Chennai, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Java", "Testing", "SQL"],
    source: "Naukri",
    postedDaysAgo: 3,
    salaryRange: "3–5 LPA",
    applyUrl: "https://careers.infosys.com/jobs/GET-CHENNAI-2025",
    description: `Be part of teams delivering application development and maintenance.
Learn processes used to manage large codebases responsibly.
Engage with peers through structured training and labs.
Well suited for graduates seeking broad technology exposure.`,
  },
  {
    id: "job-32",
    title: "Junior Backend Developer",
    company: "TCS",
    location: "Kolkata, India",
    mode: "Onsite",
    experience: "1-3",
    skills: ["Java", "Spring Boot", "REST"],
    source: "Indeed",
    postedDaysAgo: 6,
    salaryRange: "6–10 LPA",
    applyUrl: "https://careers.tcs.com/jobs/JR-BE-KOL",
    description: `Work on backend systems for banking and insurance clients.
Take responsibility for small modules with clear acceptance criteria.
Participate in estimation, development, and deployment cycles.
Ideal for engineers with prior service-based company experience.`,
  },
  {
    id: "job-33",
    title: "Frontend Intern",
    company: "Zoho",
    location: "Tenkasi, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["JavaScript", "HTML", "CSS"],
    source: "LinkedIn",
    postedDaysAgo: 5,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.zoho.com/jobs/FE-INT-TENKASI",
    description: `Build and refine UI for internal and customer-facing tools.
Follow design guidelines to keep experiences consistent across products.
Fix UI bugs reported from internal teams and customers.
Good for candidates who like solving visual and interaction issues.`,
  },
  {
    id: "job-34",
    title: "Data Analyst Intern",
    company: "PhonePe",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["SQL", "Excel", "Dashboards"],
    source: "Naukri",
    postedDaysAgo: 1,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.phonepe.com/jobs/DA-INT",
    description: `Assist in building reports that track key business health metrics.
Automate recurring data pulls and checks with simple scripts.
Communicate findings clearly to product and operations stakeholders.
Ideal for early-career folks who care about rigor in numbers.`,
  },
  {
    id: "job-35",
    title: "React Developer (1-3)",
    company: "StackRoute Analytics",
    location: "Bengaluru, India",
    mode: "Remote",
    experience: "1-3",
    skills: ["React", "TypeScript", "Charts"],
    source: "Indeed",
    postedDaysAgo: 4,
    salaryRange: "6–10 LPA",
    applyUrl: "https://stackrouteanalytics.com/careers/REACT-DEV",
    description: `Develop responsive dashboards for analytics customers.
Work with designers to keep information hierarchy clear.
Integrate charting libraries while keeping bundles lean.
Good fit for developers who enjoy data-heavy interfaces.`,
  },
  {
    id: "job-36",
    title: "Java Developer (0-1)",
    company: "Cognizant",
    location: "Pune, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["Java", "Spring", "REST"],
    source: "LinkedIn",
    postedDaysAgo: 7,
    salaryRange: "3–5 LPA",
    applyUrl: "https://careers.cognizant.com/jobs/JAVA-JR-PUNE",
    description: `Join teams implementing features for global enterprise clients.
Contribute to coding, unit testing, and basic troubleshooting.
Follow documentation and review practices used across accounts.
Suitable for junior developers comfortable working in structured setups.`,
  },
  {
    id: "job-37",
    title: "Python Developer (Fresher)",
    company: "Accenture",
    location: "Hyderabad, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Python", "APIs", "SQL"],
    source: "Naukri",
    postedDaysAgo: 8,
    salaryRange: "3–5 LPA",
    applyUrl: "https://accenture.com/careers/jobs/PY-FRESH-HYD",
    description: `Support teams implementing data-driven integrations.
Build small utilities that simplify manual workflows.
Learn patterns for secure handling of data in client environments.
Good for freshers interested in backend and data processing work.`,
  },
  {
    id: "job-38",
    title: "SDE Intern",
    company: "Paytm",
    location: "Bengaluru, India",
    mode: "Remote",
    experience: "Fresher",
    skills: ["Java", "Microservices", "Testing"],
    source: "LinkedIn",
    postedDaysAgo: 2,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://paytm.com/careers/jobs/SDE-INT-BLR",
    description: `Contribute to microservices that support merchant onboarding.
Work on well-defined tasks with clear acceptance criteria.
Write tests under guidance from senior engineers.
Ideal internship for students serious about backend engineering.`,
  },
  {
    id: "job-39",
    title: "Graduate Engineer Trainee",
    company: "Capgemini",
    location: "Mumbai, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Java", "Testing", "SQL"],
    source: "Indeed",
    postedDaysAgo: 3,
    salaryRange: "3–5 LPA",
    applyUrl: "https://www.capgemini.com/in-en/jobs/GET-MUM-2025",
    description: `Undergo structured training before joining delivery teams.
Work under mentors on live projects with real timelines.
Participate in design and testing discussions to learn trade-offs.
Open to engineering graduates from 2024 and 2025 batches.`,
  },
  {
    id: "job-40",
    title: "Junior Backend Developer",
    company: "MetroData Labs",
    location: "Hyderabad, India",
    mode: "Hybrid",
    experience: "1-3",
    skills: ["Python", "Django", "PostgreSQL"],
    source: "Naukri",
    postedDaysAgo: 1,
    salaryRange: "6–10 LPA",
    applyUrl: "https://metrodata.in/careers/JR-BE-DJ",
    description: `Implement APIs that serve analytics dashboards and reports.
Contribute to data access layers with clear separation of concerns.
Collaborate with analysts to understand how endpoints are consumed.
Good step for developers moving into data platform engineering.`,
  },
  {
    id: "job-41",
    title: "Frontend Intern",
    company: "Amazon",
    location: "Hyderabad, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["React", "JavaScript", "CSS"],
    source: "LinkedIn",
    postedDaysAgo: 0,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://www.amazon.jobs/en/jobs/IN-FE-INT-001",
    description: `Work on frontends used by internal operations teams.
Build small features end-to-end with strong code review support.
Work across browsers and devices while meeting accessibility standards.
Ideal for students who enjoy building clear, usable interfaces.`,
  },
  {
    id: "job-42",
    title: "Data Analyst Intern",
    company: "Flipkart",
    location: "Bengaluru, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["SQL", "Excel", "Reporting"],
    source: "Indeed",
    postedDaysAgo: 5,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.flipkart.com/jobs/DA-INT-01",
    description: `Support analytics for supply chain and marketplace teams.
Prepare weekly and monthly views of critical operational metrics.
Respond to ad-hoc analysis requests with clear, structured outputs.
Strong role for those who like close collaboration with business teams.`,
  },
  {
    id: "job-43",
    title: "React Developer (1-3)",
    company: "HireSense AI",
    location: "Bengaluru, India",
    mode: "Remote",
    experience: "1-3",
    skills: ["React", "TypeScript", "Design Systems"],
    source: "LinkedIn",
    postedDaysAgo: 2,
    salaryRange: "10–18 LPA",
    applyUrl: "https://hiresense.ai/careers/REACT-DEV",
    description: `Own pieces of the candidate and recruiter experience.
Collaborate with design on a consistent, calm design system.
Keep performance and accessibility in focus as new features ship.
Ideal for developers who like pairing craftsmanship with business impact.`,
  },
  {
    id: "job-44",
    title: "Java Developer (0-1)",
    company: "Zoho",
    location: "Chennai, India",
    mode: "Onsite",
    experience: "0-1",
    skills: ["Java", "Web Services", "SQL"],
    source: "Naukri",
    postedDaysAgo: 9,
    salaryRange: "3–5 LPA",
    applyUrl: "https://careers.zoho.com/jobs/JAVA-JR-CHN",
    description: `Implement backend logic for SaaS modules used globally.
Participate in code reviews to learn established practices.
Handle bug fixes and small enhancements in a steady manner.
Suited for early-career engineers with strong problem solving.`,
  },
  {
    id: "job-45",
    title: "Python Developer (Fresher)",
    company: "Juspay",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "Fresher",
    skills: ["Python", "Scripting", "APIs"],
    source: "Indeed",
    postedDaysAgo: 6,
    salaryRange: "3–5 LPA",
    applyUrl: "https://juspay.in/careers/PY-DEV-FRESH",
    description: `Write scripts and microservices that support payment platforms.
Focus on well-tested, maintainable code with simple designs.
Learn from engineers who handle production systems with care.
Good for freshers looking to grow in backend engineering.`,
  },
  {
    id: "job-46",
    title: "SDE Intern",
    company: "Freshworks",
    location: "Chennai, India",
    mode: "Hybrid",
    experience: "Fresher",
    skills: ["Java", "REST", "Testing"],
    source: "LinkedIn",
    postedDaysAgo: 4,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.freshworks.com/jobs/SDE-INT-CHN",
    description: `Contribute to features in one of the core product teams.
Implement small stories with clearly defined success criteria.
Participate in agile ceremonies and structured feedback cycles.
Great internship for learning how mature SaaS teams operate.`,
  },
  {
    id: "job-47",
    title: "Graduate Engineer Trainee",
    company: "Wipro",
    location: "Hyderabad, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Java", "Testing", "Support"],
    source: "Naukri",
    postedDaysAgo: 7,
    salaryRange: "3–5 LPA",
    applyUrl: "https://careers.wipro.com/jobs/GET-HYD-2025",
    description: `Train across development, testing, and support functions.
Learn how to work within global teams and established delivery models.
Contribute to low-risk tasks initially with gradual responsibility growth.
Suited for fresh graduates seeking stable, structured environments.`,
  },
  {
    id: "job-48",
    title: "Junior Backend Developer",
    company: "Flipkart",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "1-3",
    skills: ["Java", "Spring Boot", "Redis"],
    source: "LinkedIn",
    postedDaysAgo: 1,
    salaryRange: "10–18 LPA",
    applyUrl: "https://careers.flipkart.com/jobs/JR-BE-01",
    description: `Implement and maintain backend services for marketplace flows.
Engage in design reviews to understand system trade-offs.
Work with operations teams to keep services resilient during peaks.
Ideal for engineers with prior backend experience in Java.`,
  },
  {
    id: "job-49",
    title: "Frontend Intern",
    company: "Razorpay",
    location: "Bengaluru, India",
    mode: "Remote",
    experience: "Fresher",
    skills: ["React", "CSS", "Testing"],
    source: "Indeed",
    postedDaysAgo: 3,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://razorpay.com/jobs/FE-INT",
    description: `Assist in building UI for merchant dashboards and internal tools.
Write simple tests and documentation for components you touch.
Collaborate with engineers and designers in short feedback loops.
Good opportunity for interns who enjoy working on polished UIs.`,
  },
  {
    id: "job-50",
    title: "Data Analyst Intern",
    company: "Swiggy",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["SQL", "Python", "Visualization"],
    source: "Naukri",
    postedDaysAgo: 2,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.swiggy.com/jobs/DA-INT-BLR",
    description: `Work with operations and product teams to understand data needs.
Own well-defined analyses from question to final presentation.
Build dashboards that stay useful beyond a single meeting.
Ideal for analytical graduates who enjoy working with large datasets.`,
  },
  {
    id: "job-51",
    title: "React Developer (1-3)",
    company: "QuickHire Tech",
    location: "Hyderabad, India",
    mode: "Remote",
    experience: "1-3",
    skills: ["React", "TypeScript", "REST"],
    source: "LinkedIn",
    postedDaysAgo: 5,
    salaryRange: "6–10 LPA",
    applyUrl: "https://quickhiretech.com/jobs/REACT-DEV-HYD",
    description: `Build recruiter-facing tools for shortlisting and scheduling.
Design components that can be reused across different flows.
Balance visual polish with straightforward implementation choices.
Suitable for developers who like thinking from a user’s perspective.`,
  },
  {
    id: "job-52",
    title: "Java Developer (0-1)",
    company: "FreshCart Digital",
    location: "Mumbai, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["Java", "Spring", "MySQL"],
    source: "Indeed",
    postedDaysAgo: 8,
    salaryRange: "3–5 LPA",
    applyUrl: "https://freshcartdigital.in/jobs/JAVA-JR-MUM",
    description: `Implement backend features for order and inventory management.
Collaborate with product and frontend teams during requirement grooming.
Learn how to safely roll out and roll back changes in production.
Good first role for engineers interested in commerce platforms.`,
  },
  {
    id: "job-53",
    title: "Python Developer (Fresher)",
    company: "MetroData Labs",
    location: "Pune, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["Python", "ETL", "APIs"],
    source: "Naukri",
    postedDaysAgo: 6,
    salaryRange: "3–5 LPA",
    applyUrl: "https://metrodata.in/careers/PY-FRESH-PUNE",
    description: `Assist in building and maintaining ETL jobs for data pipelines.
Write robust scripts that can recover gracefully from failures.
Document jobs clearly so they remain maintainable over time.
Ideal for freshers aiming at data engineering career paths.`,
  },
  {
    id: "job-54",
    title: "SDE Intern",
    company: "StackRoute Analytics",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "Fresher",
    skills: ["Java", "APIs", "Testing"],
    source: "LinkedIn",
    postedDaysAgo: 1,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://stackrouteanalytics.com/careers/SDE-INT",
    description: `Support engineering efforts for analytics products and tools.
Work on manageable stories with clear scope and mentorship.
Write tests and basic documentation for components you build.
Suited for interns who want exposure to both data and engineering.`,
  },
  {
    id: "job-55",
    title: "Graduate Engineer Trainee",
    company: "Dell",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "Fresher",
    skills: ["Java", "C#", "Testing"],
    source: "Indeed",
    postedDaysAgo: 4,
    salaryRange: "3–5 LPA",
    applyUrl: "https://jobs.dell.com/GET-BLR-2025",
    description: `Get trained on modern enterprise engineering practices.
Contribute to both new feature development and maintenance work.
Rotate across teams to understand different product areas.
Good opportunity for graduates seeking stable, long-term roles.`,
  },
  {
    id: "job-56",
    title: "Junior Backend Developer",
    company: "HireSense AI",
    location: "Bengaluru, India",
    mode: "Remote",
    experience: "1-3",
    skills: ["Python", "FastAPI", "PostgreSQL"],
    source: "LinkedIn",
    postedDaysAgo: 2,
    salaryRange: "10–18 LPA",
    applyUrl: "https://hiresense.ai/careers/JR-BE",
    description: `Build and maintain APIs powering an AI-driven hiring workflow.
Collaborate with ML engineers to integrate models safely.
Instrument services with metrics and logs for observability.
Ideal for backend developers comfortable working in lean teams.`,
  },
  {
    id: "job-57",
    title: "Frontend Intern",
    company: "Infosys",
    location: "Mysuru, India",
    mode: "Onsite",
    experience: "Fresher",
    skills: ["HTML", "CSS", "JavaScript"],
    source: "Naukri",
    postedDaysAgo: 7,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://careers.infosys.com/jobs/FE-INT-MYS",
    description: `Build UI components for internal portals and tooling.
Ensure layouts remain usable on standard company hardware.
Follow coding and accessibility guidelines shared by senior developers.
Suitable for interns starting their journey in front-end engineering.`,
  },
  {
    id: "job-58",
    title: "Data Analyst Intern",
    company: "Capgemini",
    location: "Mumbai, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["SQL", "Excel", "Power BI"],
    source: "Indeed",
    postedDaysAgo: 8,
    salaryRange: "₹15k–₹40k/month Internship",
    applyUrl: "https://www.capgemini.com/in-en/jobs/DA-INT-MUM",
    description: `Assist cross-functional teams with routine and ad-hoc reporting.
Document data sources and report assumptions clearly.
Help automate simple manual reporting workflows where possible.
Role fits analytical candidates looking for structured environments.`,
  },
  {
    id: "job-59",
    title: "React Developer (1-3)",
    company: "CredFlow Labs",
    location: "Gurugram, India",
    mode: "Remote",
    experience: "1-3",
    skills: ["React", "TypeScript", "APIs"],
    source: "LinkedIn",
    postedDaysAgo: 3,
    salaryRange: "6–10 LPA",
    applyUrl: "https://careers.credflowlabs.com/jobs/REACT-DEV",
    description: `Implement and maintain UI for revenue intelligence workflows.
Work with design on clear, non-distracting interfaces.
Integrate APIs while keeping components small and testable.
Ideal for engineers who like focused, product-centric teams.`,
  },
  {
    id: "job-60",
    title: "Java Developer (0-1)",
    company: "Swiggy",
    location: "Bengaluru, India",
    mode: "Hybrid",
    experience: "0-1",
    skills: ["Java", "Spring Boot", "Kafka"],
    source: "Naukri",
    postedDaysAgo: 5,
    salaryRange: "6–10 LPA",
    applyUrl: "https://careers.swiggy.com/jobs/JAVA-JR-BLR",
    description: `Work on services that power order placement and tracking.
Collaborate with operations and product to refine requirements.
Write code that can be rolled out gradually and monitored safely.
Suited for early-career developers who enjoy fast-paced environments.`,
  },
];

window.JOBS = JOBS;

