/**
 * ─────────────────────────────────────────────────────────────────────────────
 * InternHub End-to-End Demo Seed
 * ─────────────────────────────────────────────────────────────────────────────
 * Covers the full project flow:
 *   Organization → InternProfile → Placement (supervisor assigned)
 *   → Logbook entries (DRAFT/SUBMITTED/APPROVED/REJECTED)
 *   → Supervisor Feedback → Evaluations → Notifications
 *
 
 *
 *   Student Intern      intern@internhub.com       / Password123!
 *   Program Supervisor  supervisor@internhub.com   / Password123!
 *   System Administrator admin@internhub.com       / Password123!
 *
 * Usage:
 *   npm run prisma:seed          → idempotent (removes & re-creates DEMO rows only)
 *   npm run prisma:seed:reset    → wipes every table first (clean demo database)
 * ─────────────────────────────────────────────────────────────────────────────
 */
import 'dotenv/config';
import bcrypt from 'bcrypt';
import {
  PrismaClient,
  UserRole,
  IndustrySector,
  PlacementStatus,
  LogEntryType,
  LogStatus,
  FeedbackType,
  EvaluationStatus,
  NotificationType,
} from '@prisma/client';

const prisma = new PrismaClient();

const RESET = process.argv.includes('--reset');
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const DEMO_PASSWORD = 'Password123!';

// ─── Date helper: negative = past, positive = future ─────────────────────────
const at = (offsetDays: number, hour = 9, minute = 0): Date => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d;
};

/** Mirrors EvaluationService.calculateOverallScore (scores are 1-10). */
const overallScore = (scores: number[]): number =>
  Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 10)) * 100);

// ─── Organizations (Nigerian partner companies / agencies) ───────────────────
const ORGANISATIONS = [
  {
    name: 'Flutterwave Technology Solutions Ltd',
    sector: IndustrySector.TECHNOLOGY,
    address: '9 Adeola Odeku Street, Victoria Island, Lagos',
    email: 'careers@flutterwavego.com',
    phone: '+234 700 835 8827',
    website: 'https://flutterwave.com',
  },
  {
    name: 'Interswitch Group',
    sector: IndustrySector.TECHNOLOGY,
    address: '1648C Oko-Awo Close, Victoria Island, Lagos',
    email: 'internships@interswitchgroup.com',
    phone: '+234 700 468 6379',
    website: 'https://interswitchgroup.com',
  },
  {
    name: 'Nigerian Communications Commission (NCC)',
    sector: IndustrySector.GOVERNMENT,
    address: 'Plot 423 Aguiyi Ironsi Street, Maitama, Abuja',
    email: 'info@ncc.gov.ng',
    phone: '+234 9 461 7000',
    website: 'https://ncc.gov.ng',
  },
  {
    name: 'Zenith Bank Plc',
    sector: IndustrySector.FINANCE,
    address: '84 Ajose Adeogun Street, Victoria Island, Lagos',
    email: 'hr@zenithbank.com',
    phone: '+234 700 946 3378',
    website: 'https://zenithbank.com',
  },
  {
    name: 'Seplat Energy Plc',
    sector: IndustrySector.ENGINEERING,
    address: '16A Temple Road, Ikoyi, Lagos',
    email: 'graduates@seplatenergy.com',
    phone: '+234 1 271 5443',
    website: 'https://seplatenergy.com',
  },
  {
    name: 'Andela Nigeria',
    sector: IndustrySector.TECHNOLOGY,
    address: '3 Bourdillon Road, Ikoyi, Lagos',
    email: 'recruitment@andela.com',
    phone: '+234 1 227 1000',
    website: 'https://andela.com',
  },
  {
    name: 'Nigerian Breweries Plc',
    sector: IndustrySector.MANUFACTURING,
    address: '1 Abebe Village Road, Iganmu, Lagos',
    email: 'graduate.scheme@nbplc.com',
    phone: '+234 1 271 8600',
    website: 'https://nbplc.com',
  },
  {
    name: 'Wema Bank Plc',
    sector: IndustrySector.FINANCE,
    address: '54 Marina Road, Lagos Island, Lagos',
    email: 'talent@wemabank.com',
    phone: '+234 700 936 2265',
    website: 'https://wemabank.com',
  },
] as const;

// ─── Staff accounts (Admin / Supervisors / Mentor) ───────────────────────────
const STAFF = [
  {
    email: 'admin@internhub.com', // Welcome-page demo login
    firstName: 'Musa',
    lastName: 'Abdullahi',
    role: UserRole.ADMIN,
    phone: '+234 803 411 7290',
    department: 'ICT & Administration',
    program: null as string | null,
  },
  {
    email: 'supervisor@internhub.com', // Welcome-page demo login
    firstName: 'Ngozi',
    lastName: 'Eze',
    role: UserRole.SUPERVISOR,
    phone: '+234 806 552 1184',
    department: 'Industrial Training & Placement Unit',
    program: null,
  },
  {
    email: 'superadmin@internhub.com',
    firstName: 'Halima',
    lastName: 'Suleiman',
    role: UserRole.SUPER_ADMIN,
    phone: '+234 809 773 4416',
    department: 'Registry & Academic Affairs',
    program: null,
  },
  {
    email: 'bello.adamu@internhub.com',
    firstName: 'Bello',
    lastName: 'Adamu',
    role: UserRole.SUPERVISOR,
    phone: '+234 803 226 9087',
    department: 'Faculty of Engineering',
    program: null,
  },
  {
    email: 'funmilayo.adebayo@internhub.com',
    firstName: 'Funmilayo',
    lastName: 'Adebayo',
    role: UserRole.SUPERVISOR,
    phone: '+234 805 664 3321',
    department: 'Career Services Directorate',
    program: null,
  },
  {
    email: 'mentor@internhub.com',
    firstName: 'Yusuf',
    lastName: 'Garba',
    role: UserRole.MENTOR,
    phone: '+234 807 918 2255',
    department: 'Software Engineering Practice',
    program: null,
  },
];

// ─── Interns (Nigerian students on industrial attachment / SIWES) ────────────
interface SeedIntern {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  program: string;
  department: string;
  matricNumber: string;
  faculty: string;
  institution: string;
  organisation: string;
  supervisorEmail: string;
  placementRole: string;
  placementDepartment: string;
  placementStatus: PlacementStatus;
  startOffset: number; // days relative to today
  endOffset: number;
  notes: string;
}

const INTERNS: SeedIntern[] = [
  {
    email: 'intern@internhub.com', // Welcome-page demo login
    firstName: 'Adaeze',
    lastName: 'Nwosu',
    phone: '+234 802 314 7788',
    program: 'B.Sc. Computer Science',
    department: 'Software Engineering',
    matricNumber: '200401045',
    faculty: 'Faculty of Science',
    institution: 'University of Lagos (UNILAG)',
    organisation: 'Flutterwave Technology Solutions Ltd',
    supervisorEmail: 'supervisor@internhub.com',
    placementRole: 'Backend Engineering Intern',
    placementDepartment: 'Engineering - Payments & Settlements',
    placementStatus: PlacementStatus.ACTIVE,
    startOffset: -96,
    endOffset: 84,
    notes: 'SIWES 6-month industrial attachment. Assigned to the Payments squad.',
  },
  {
    email: 'oluwaseun.adeyemi@internhub.com',
    firstName: 'Oluwaseun',
    lastName: 'Adeyemi',
    phone: '+234 811 908 4471',
    program: 'B.Sc. Software Engineering',
    department: 'Software Engineering',
    matricNumber: '210203118',
    faculty: 'College of Science and Technology',
    institution: 'Covenant University, Ota',
    organisation: 'Andela Nigeria',
    supervisorEmail: 'supervisor@internhub.com',
    placementRole: 'Software Engineering Intern',
    placementDepartment: 'Platform Engineering',
    placementStatus: PlacementStatus.ACTIVE,
    startOffset: -88,
    endOffset: 92,
    notes: 'Remote-first attachment; reports to the Ikoyi learning hub.',
  },
  {
    email: 'tunde.balogun@internhub.com',
    firstName: 'Tunde',
    lastName: 'Balogun',
    phone: '+234 806 445 9922',
    program: 'B.Eng. Mechanical Engineering',
    department: 'Engineering Operations',
    matricNumber: '190702233',
    faculty: 'Faculty of Engineering',
    institution: 'Ahmadu Bello University, Zaria',
    organisation: 'Seplat Energy Plc',
    supervisorEmail: 'supervisor@internhub.com',
    placementRole: 'Mechanical Engineering Intern',
    placementDepartment: 'Operations & Maintenance',
    placementStatus: PlacementStatus.ACTIVE,
    startOffset: -104,
    endOffset: 76,
    notes: 'Rotational attachment across the Lagos and Warri operations bases.',
  },
  {
    email: 'chiamaka.obi@internhub.com',
    firstName: 'Chiamaka',
    lastName: 'Obi',
    phone: '+234 814 220 6633',
    program: 'B.Sc. Accounting',
    department: 'Finance & Audit',
    matricNumber: '200803091',
    faculty: 'Faculty of Business Administration',
    institution: 'University of Nigeria, Nsukka (UNN)',
    organisation: 'Zenith Bank Plc',
    supervisorEmail: 'bello.adamu@internhub.com',
    placementRole: 'Internal Audit Intern',
    placementDepartment: 'Internal Control & Audit',
    placementStatus: PlacementStatus.ACTIVE,
    startOffset: -70,
    endOffset: 110,
    notes: 'Assigned to the Ajose Adeogun head office audit team.',
  },

  {
    email: 'ibrahim.musa@internhub.com',
    firstName: 'Ibrahim',
    lastName: 'Musa',
    phone: '+234 803 771 5520',
    program: 'B.Sc. Electrical & Electronics Engineering',
    department: 'Telecom & Networks',
    matricNumber: '200105477',
    faculty: 'Faculty of Engineering',
    institution: 'University of Ibadan (UI)',
    organisation: 'Nigerian Communications Commission (NCC)',
    supervisorEmail: 'bello.adamu@internhub.com',
    placementRole: 'Spectrum Management Intern',
    placementDepartment: 'Spectrum Administration',
    placementStatus: PlacementStatus.ACTIVE,
    startOffset: -60,
    endOffset: 120,
    notes: 'Abuja head office attachment supporting the spectrum monitoring station.',
  },
  {
    email: 'fatima.bello@internhub.com',
    firstName: 'Fatima',
    lastName: 'Bello',
    phone: '+234 815 337 8801',
    program: 'B.Sc. Mass Communication',
    department: 'Corporate Communications',
    matricNumber: '190305862',
    faculty: 'Faculty of Communication',
    institution: 'Bayero University, Kano (BUK)',
    organisation: 'Nigerian Breweries Plc',
    supervisorEmail: 'funmilayo.adebayo@internhub.com',
    placementRole: 'Corporate Affairs Intern',
    placementDepartment: 'Corporate Communications',
    placementStatus: PlacementStatus.COMPLETED,
    startOffset: -175,
    endOffset: -20,
    notes: 'Completed the 5-month attachment; final report submitted to the department.',
  },
  {
    email: 'emeka.okafor@internhub.com',
    firstName: 'Emeka',
    lastName: 'Okafor',
    phone: '+234 802 663 1190',
    program: 'B.Tech. Information Technology',
    department: 'Quality Assurance',
    matricNumber: '200604719',
    faculty: 'School of Computing',
    institution: 'Federal University of Technology, Akure (FUTA)',
    organisation: 'Interswitch Group',
    supervisorEmail: 'funmilayo.adebayo@internhub.com',
    placementRole: 'QA Engineering Intern',
    placementDepartment: 'Quality Engineering',
    placementStatus: PlacementStatus.ON_HOLD,
    startOffset: -120,
    endOffset: 60,
    notes: 'Attachment paused pending resumption of the on-site test lab cycle.',
  },
  {
    email: 'zainab.yusuf@internhub.com',
    firstName: 'Zainab',
    lastName: 'Yusuf',
    phone: '+234 809 114 7723',
    program: 'B.Sc. Business Administration',
    department: 'Retail Banking',
    matricNumber: '210409255',
    faculty: 'Faculty of Management Sciences',
    institution: 'Lagos State University (LASU)',
    organisation: 'Wema Bank Plc',
    supervisorEmail: 'bello.adamu@internhub.com',
    placementRole: 'Retail Banking Intern',
    placementDepartment: 'Retail & SME Banking',
    placementStatus: PlacementStatus.PENDING,
    startOffset: 12,
    endOffset: 132,
    notes: 'Awaiting onboarding clearance before resumption at the Marina head office.',
  },
];

// ─── Logbook plan per intern (offsets are days relative to today) ─────────────
interface SeedLog {
  offset: number;
  entryType: LogEntryType;
  status: LogStatus;
  activity: string;
  skills: string;
  hours: number;
  notes?: string;
  reviewNotes?: string;
}

const LOGBOOK: Record<string, SeedLog[]> = {
  // Adaeze Nwosu — Backend Engineer @ Flutterwave (demo intern login)
  'intern@internhub.com': [
    {
      offset: -1, entryType: LogEntryType.DAILY, status: LogStatus.DRAFT,
      activity: 'Prepared the demo script for the new transfer status endpoint and drafted this week\'s squad progress note.',
      skills: 'Technical documentation, Presentation', hours: 6.5,
    },
    {
      offset: -2, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED,
      activity: 'Implemented the retry policy for failed BVN and NIN verification callbacks and covered it with integration tests.',
      skills: 'Node.js, Jest, Webhooks', hours: 8,
    },
    {
      offset: -3, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED,
      activity: 'Worked on the NIP (NIBSS Instant Payment) reconciliation job and validated reversals against the sandbox ledger.',
      skills: 'TypeScript, PostgreSQL, NIBSS APIs', hours: 8.5,
    },
    {
      offset: -5, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED,
      activity: 'Pair-programmed on idempotency keys for the card-charge endpoint to stop duplicate customer debits.',
      skills: 'API design, Redis, Idempotency', hours: 7.5,
    },
    {
      offset: -4, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED,
      activity: 'Optimised the merchant payout settlement query; p95 latency dropped from 1.8s to 640ms on the Lagos cluster.',
      skills: 'SQL optimisation, Performance tuning', hours: 8,
      notes: 'Benchmarked with k6 against staging data.',
      reviewNotes: 'Excellent improvement. Kindly add the before/after benchmark to the squad wiki.',
    },
    {
      offset: -6, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED,
      activity: 'Instrumented Grafana panels for POS terminal failure rates across the Abuja and Port Harcourt clusters.',
      skills: 'Grafana, Observability', hours: 7,
    },
    {
      offset: -7, entryType: LogEntryType.DAILY, status: LogStatus.REJECTED,
      activity: 'Attended the CBN open banking workshop and wrote up the new API guideline notes for the platform team.',
      skills: 'Regulatory awareness, Technical writing', hours: 6,
      reviewNotes: 'Good write-up, but please resubmit with the official circular reference and the workshop date attached.',
    },
    {
      offset: -9, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED,
      activity: 'Refactored the merchant webhook dispatcher onto a Redis-backed queue, eliminating dropped notifications.',
      skills: 'Redis, Queue design, Node.js', hours: 8.5,
    },
    {
      offset: -11, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED,
      activity: 'Fixed N+1 queries in the merchant onboarding API and added composite indexes on the settlement history table.',
      skills: 'Prisma, Database indexing', hours: 7.5,
    },
    {
      offset: -13, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED,
      activity: 'Wrote Postman collections for the airtime top-up regression suite together with the QA squad.',
      skills: 'API testing, Postman', hours: 6.5,
    },
    {
      offset: -15, entryType: LogEntryType.WEEKLY, status: LogStatus.APPROVED,
      activity: 'Week 5 summary: completed NIP reconciliation, webhook queue migration and merchant onboarding fixes; presented findings to the Payments squad.',
      skills: 'Sprint reporting, Payments domain', hours: 36,
    },
    {
      offset: -18, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED,
      activity: 'Set up the local Docker Compose environment and documented onboarding steps for the next intern cohort.',
      skills: 'Docker, Documentation, Onboarding', hours: 7,
    },
  ],

  // Oluwaseun Adeyemi — Software Engineer @ Andela Nigeria
  'oluwaseun.adeyemi@internhub.com': [
    { offset: -2, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED, activity: 'Built the onboarding wizard for the multi-tenant feature flag service and added Cypress end-to-end coverage.', skills: 'React, Cypress, Feature flags', hours: 8 },
    { offset: -4, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED, activity: 'Documented the API contract for the notifications microservice using the OpenAPI specification.', skills: 'OpenAPI, Technical writing', hours: 6.5 },
    { offset: -8, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Migrated the legacy session store to Redis with a rolling deployment window on the Ikoyi cluster.', skills: 'Redis, Deployment', hours: 8, reviewNotes: 'Clean migration plan. Approved.' },
    { offset: -12, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Reviewed two pull requests from the platform squad and left structured feedback on error handling.', skills: 'Code review, Collaboration', hours: 7 },
  ],

  // Tunde Balogun — Mechanical Engineering Intern @ Seplat Energy
  'tunde.balogun@internhub.com': [
    { offset: -3, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED, activity: 'Logged vibration readings for the Warri flow station pumps and flagged unit P-204 for bearing inspection.', skills: 'Condition monitoring, Vibration analysis', hours: 9 },
    { offset: -6, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Assisted the maintenance team with the 500-hour service of the Lagos generator set and updated the asset register.', skills: 'Preventive maintenance, Asset management', hours: 8.5 },
    { offset: -10, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Prepared the HSE toolbox talk on safe manual handling for the workshop crew.', skills: 'HSE compliance, Communication', hours: 6 },
    { offset: -14, entryType: LogEntryType.WEEKLY, status: LogStatus.APPROVED, activity: 'Week summary: completed pump vibration survey, generator servicing support and the HSE toolbox briefing.', skills: 'Reporting, Maintenance planning', hours: 40 },
  ],

  // Chiamaka Obi — Internal Audit Intern @ Zenith Bank
  'chiamaka.obi@internhub.com': [
    { offset: -1, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED, activity: 'Reconciled the Ikeja branch cash-in-transit register against the vault control sheets for the month of August.', skills: 'Reconciliation, Internal controls', hours: 8 },
    { offset: -5, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Supported the spot check of ATM cash holdings across three Lagos Island branches.', skills: 'Audit fieldwork, Documentation', hours: 7.5, reviewNotes: 'Well documented working papers. Approved.' },
    { offset: -9, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Drafted the exception report on unclaimed dividend accounts for management review.', skills: 'Reporting, IFRS awareness', hours: 7 },
  ],
  // Ibrahim Musa — Spectrum Management Intern @ NCC Abuja
  'ibrahim.musa@internhub.com': [
    { offset: -2, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED, activity: 'Logged FM band spectrum occupancy readings from the Abuja monitoring station and exported the daily capture.', skills: 'RF measurement, Spectrum monitoring', hours: 8 },
    { offset: -7, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Supported the interference investigation reported by a broadcast station in Nasarawa State.', skills: 'Interference analysis, Field work', hours: 9, reviewNotes: 'Good field notes. Approved.' },
    { offset: -12, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Updated the licence database entries for 42 newly issued VSAT permits.', skills: 'Data entry, Regulatory records', hours: 6.5 },
  ],

  // Fatima Bello — Corporate Affairs Intern @ Nigerian Breweries (completed)
  'fatima.bello@internhub.com': [
    { offset: -30, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Drafted the press release for the Iganmu brewery water-recycling project with the sustainability team.', skills: 'Copywriting, Media relations', hours: 7 },
    { offset: -45, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Coordinated the intern volunteering day at the Iwaya community school and compiled the photo report.', skills: 'Event coordination, CSR', hours: 8 },
    { offset: -60, entryType: LogEntryType.WEEKLY, status: LogStatus.APPROVED, activity: 'Month-end summary: stakeholder newsletter, community engagement report and internal magazine contribution.', skills: 'Reporting, Stakeholder engagement', hours: 38 },
    { offset: -95, entryType: LogEntryType.DAILY, status: LogStatus.REJECTED, activity: 'Prepared the first draft of the sustainability brochure layout.', skills: 'Design review, Brand guidelines', hours: 5, reviewNotes: 'Draft used unapproved brand colours; please rework with the current brand kit and resubmit.' },
  ],

  // Emeka Okafor — QA Engineering Intern @ Interswitch (on hold)
  'emeka.okafor@internhub.com': [
    { offset: -40, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Automated the Verve card transaction regression pack with Selenium and reduced the manual cycle to 35 minutes.', skills: 'Selenium, Test automation', hours: 8 },
    { offset: -52, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Logged 14 defects from the Quickteller bill-payment release candidate and verified the fixes.', skills: 'Defect management, Jira', hours: 7.5 },
    { offset: -80, entryType: LogEntryType.DAILY, status: LogStatus.SUBMITTED, activity: 'Prepared the test plan for the Point-of-Sale terminal certification cycle.', skills: 'Test planning, POS certification', hours: 6 },
  ],

  // Zainab Yusuf — Retail Banking Intern @ Wema Bank (pending onboarding)
  'zainab.yusuf@internhub.com': [
    { offset: -20, entryType: LogEntryType.DAILY, status: LogStatus.APPROVED, activity: 'Completed the pre-resumption orientation on the ALAT digital banking product suite.', skills: 'Product knowledge, Digital banking', hours: 5 },
    { offset: -35, entryType: LogEntryType.DAILY, status: LogStatus.DRAFT, activity: 'Drafted the KYC document checklist for the SME account opening desk.', skills: 'KYC/AML awareness, Process design', hours: 4 },
  ],
};

// ─── Supervisor feedback plan ────────────────────────────────────────────────
interface SeedFeedback {
  internEmail: string;
  supervisorEmail: string;
  logOffset?: number;
  type: FeedbackType;
  rating: number;
  content: string;
  strengths: string;
  improvements: string;
  isPrivate: boolean;
  offset: number;
}

const FEEDBACK: SeedFeedback[] = [
  {
    internEmail: 'intern@internhub.com', supervisorEmail: 'supervisor@internhub.com', logOffset: -4,
    type: FeedbackType.PERFORMANCE, rating: 5,
    content: 'Outstanding quarter so far. The settlement query optimisation work on the Flutterwave payments ledger was well executed and clearly documented.',
    strengths: 'Ownership of the NIP reconciliation task and disciplined benchmarking before shipping.',
    improvements: 'Keep the squad wiki updated as you ship; other interns rely on those notes.',
    isPrivate: false, offset: -4,
  },
  {
    internEmail: 'intern@internhub.com', supervisorEmail: 'supervisor@internhub.com', logOffset: -11,
    type: FeedbackType.SKILLS, rating: 4,
    content: 'Strong progress with Prisma and database indexing. Your N+1 fix removed the fastest-growing request path from the slow query log.',
    strengths: 'Practical debugging and willingness to profile before optimising.',
    improvements: 'Add unit tests around the new indexes so future migrations do not regress them.',
    isPrivate: false, offset: -11,
  },
  {
    internEmail: 'intern@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    type: FeedbackType.CONDUCT, rating: 5,
    content: 'Punctual and professional throughout the attachment. You represented the university well at the CBN open banking workshop.',
    strengths: 'Reliability, clear communication with the squad leads.',
    improvements: 'None noted - keep the same standard for the remaining weeks.',
    isPrivate: false, offset: -9,
  },
  {
    internEmail: 'intern@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    type: FeedbackType.GOAL, rating: 4,
    content: 'Next milestone: land the Redis-backed webhook dispatcher in production and present the rollout plan at the squad demo.',
    strengths: 'Good grasp of queue-based architecture.',
    improvements: 'Prepare a rollback plan before the production cut-over.',
    isPrivate: true, offset: -13,
  },
  {
    internEmail: 'oluwaseun.adeyemi@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    type: FeedbackType.PERFORMANCE, rating: 4,
    content: 'The feature-flag onboarding wizard is clean and testable. Please tighten the Cypress selectors so the suite stays stable.',
    strengths: 'Front-end craft and good use of automation.',
    improvements: 'Avoid coupling tests to volatile CSS class names.',
    isPrivate: false, offset: -6,
  },
  {
    internEmail: 'tunde.balogun@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    type: FeedbackType.GENERAL, rating: 4,
    content: 'Your condition-monitoring logs at the Warri flow station were accurate and caught the P-204 bearing issue early.',
    strengths: 'Attention to detail during field measurements.',
    improvements: 'Submit HSE toolbox talk notes within 24 hours of delivery.',
    isPrivate: false, offset: -5,
  },
  {
    internEmail: 'chiamaka.obi@internhub.com', supervisorEmail: 'bello.adamu@internhub.com',
    type: FeedbackType.SKILLS, rating: 4,
    content: 'Working papers for the Ikeja branch reconciliation were well referenced, in line with the bank internal audit standard.',
    strengths: 'Structured documentation and sound understanding of internal controls.',
    improvements: 'Speed up the sampling of ATM cash holdings per branch.',
    isPrivate: false, offset: -4,
  },
  {
    internEmail: 'ibrahim.musa@internhub.com', supervisorEmail: 'bello.adamu@internhub.com',
    type: FeedbackType.PERFORMANCE, rating: 3,
    content: 'Spectrum capture work is reliable but the monthly reporting pack was submitted late this cycle.',
    strengths: 'Consistent field data capture at the Abuja monitoring station.',
    improvements: 'Submit the licence database update before the month-end deadline.',
    isPrivate: false, offset: -7,
  },
  {
    internEmail: 'fatima.bello@internhub.com', supervisorEmail: 'funmilayo.adebayo@internhub.com',
    type: FeedbackType.PERFORMANCE, rating: 4,
    content: 'Excellent wrap-up on the attachment. The stakeholder newsletter and community engagement report were both published.',
    strengths: 'Strong copywriting and stakeholder coordination.',
    improvements: 'Always confirm brand colours before layout work goes out for review.',
    isPrivate: false, offset: -40,
  },
  {
    internEmail: 'emeka.okafor@internhub.com', supervisorEmail: 'funmilayo.adebayo@internhub.com',
    type: FeedbackType.GENERAL, rating: 3,
    content: 'Regression automation was a solid contribution before the attachment was paused. Report resumption date to the placement unit.',
    strengths: 'Test automation initiative.',
    improvements: 'Keep the test plan artefacts current while the lab cycle is on hold.',
    isPrivate: true, offset: -50,
  },
];

// ─── Evaluation plan (criteria are scored 1-10) ──────────────────────────────
// scores = [attendance, technicalSkills, communication, teamwork, initiative,
//           problemSolving, professionalConduct]
interface SeedEvaluation {
  internEmail: string;
  supervisorEmail: string;
  status: EvaluationStatus;
  scores: number[];
  strengths: string;
  improvements: string;
  comments: string;
  offset: number;
}

const EVALUATIONS: SeedEvaluation[] = [
  {
    internEmail: 'intern@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    status: EvaluationStatus.REVIEWED, scores: [10, 9, 9, 9, 9, 9, 10], offset: -12,
    strengths: 'Exceptional ownership of the NIP reconciliation and settlement optimisation workstreams.',
    improvements: 'Broaden exposure to front-end work in the final phase of the attachment.',
    comments: 'Mid-term review signed off. On track for a distinction-level SIWES report.',
  },
  {
    internEmail: 'intern@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    status: EvaluationStatus.REVIEWED, scores: [9, 9, 8, 9, 8, 9, 10], offset: -45,
    strengths: 'Reliable, coachable and quick to absorb new tooling within the payments domain.',
    improvements: 'Continue building confidence when presenting to non-technical stakeholders.',
    comments: 'First quarterly assessment. Attendance at the Yaba hub has been excellent.',
  },
  {
    internEmail: 'intern@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    status: EvaluationStatus.COMPLETED, scores: [9, 8, 8, 9, 9, 8, 9], offset: -70,
    strengths: 'Strong grasp of webhook reliability patterns and integration testing.',
    improvements: 'Document rollback steps alongside every production change.',
    comments: 'Completed by the squad lead; awaiting programme office review.',
  },
  {
    internEmail: 'oluwaseun.adeyemi@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    status: EvaluationStatus.COMPLETED, scores: [9, 8, 8, 8, 7, 8, 9], offset: -30,
    strengths: 'High quality front-end delivery and good automation habits.',
    improvements: 'Reduce coupling between UI tests and styling implementation details.',
    comments: 'Consistent performer across the Platform Engineering squad.',
  },
  {
    internEmail: 'tunde.balogun@internhub.com', supervisorEmail: 'supervisor@internhub.com',
    status: EvaluationStatus.COMPLETED, scores: [8, 7, 7, 8, 7, 7, 8], offset: -34,
    strengths: 'Careful field measurements and sound HSE discipline at the Warri base.',
    improvements: 'Improve turnaround time on maintenance documentation.',
    comments: 'Solid engineering exposure; rotational programme completed as planned.',
  },
  {
    internEmail: 'chiamaka.obi@internhub.com', supervisorEmail: 'bello.adamu@internhub.com',
    status: EvaluationStatus.REVIEWED, scores: [9, 8, 9, 8, 8, 8, 9], offset: -20,
    strengths: 'Well referenced audit working papers and strong internal controls awareness.',
    improvements: 'Increase the sample size during branch spot checks.',
    comments: 'Reviewed with the Internal Control & Audit lead at the head office.',
  },
  {
    internEmail: 'ibrahim.musa@internhub.com', supervisorEmail: 'bello.adamu@internhub.com',
    status: EvaluationStatus.COMPLETED, scores: [8, 7, 7, 7, 7, 8, 8], offset: -25,
    strengths: 'Consistent spectrum monitoring output from the Abuja station.',
    improvements: 'Meet the month-end reporting deadline for the licence database.',
    comments: 'Attendance good; timeliness of reports is the main development area.',
  },
  {
    internEmail: 'fatima.bello@internhub.com', supervisorEmail: 'funmilayo.adebayo@internhub.com',
    status: EvaluationStatus.REVIEWED, scores: [8, 7, 8, 8, 7, 7, 8], offset: -25,
    strengths: 'Clear corporate writing and dependable event coordination.',
    improvements: 'Follow brand guidelines strictly before circulating drafts.',
    comments: 'Final assessment submitted; attachment closed successfully.',
  },
  {
    internEmail: 'emeka.okafor@internhub.com', supervisorEmail: 'funmilayo.adebayo@internhub.com',
    status: EvaluationStatus.IN_PROGRESS, scores: [7, 6, 7, 7, 6, 6, 7], offset: -28,
    strengths: 'Initiated test automation for the Verve regression pack.',
    improvements: 'Defect triage discipline needs to improve.',
    comments: 'Assessment on hold because the attachment is currently paused.',
  },
  {
    internEmail: 'zainab.yusuf@internhub.com', supervisorEmail: 'bello.adamu@internhub.com',
    status: EvaluationStatus.PENDING, scores: [], offset: -5,
    strengths: '',
    improvements: '',
    comments: 'Scheduled to begin once onboarding clearance is issued by Wema Bank.',
  },
];

// ─── In-app notifications ────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { recipient: 'intern@internhub.com', type: NotificationType.DEADLINE, isRead: false, offset: -1, title: 'Weekly logbook deadline', message: 'Submit your Week 6 log entry before Friday 5:00 PM.', link: '/logbook' },
  { recipient: 'intern@internhub.com', type: NotificationType.SUCCESS, isRead: false, offset: -4, title: 'Log entry approved', message: 'Dr. Ngozi Eze approved your entry on settlement query optimisation.', link: '/logbook' },
  { recipient: 'intern@internhub.com', type: NotificationType.WARNING, isRead: false, offset: -7, title: 'Log entry returned', message: 'Your CBN workshop write-up was returned for resubmission with the circular reference.', link: '/logbook' },
  { recipient: 'intern@internhub.com', type: NotificationType.EVALUATION, isRead: true, offset: -12, title: 'Mid-term evaluation reviewed', message: 'Your mid-term evaluation has been reviewed by the programme office.', link: '/intern/evaluations' },
  { recipient: 'supervisor@internhub.com', type: NotificationType.INFO, isRead: false, offset: -1, title: '3 log entries awaiting review', message: 'Adaeze Nwosu, Oluwaseun Adeyemi and Chiamaka Obi submitted new log entries.', link: '/supervisor/submitted-logs' },
  { recipient: 'supervisor@internhub.com', type: NotificationType.EVALUATION, isRead: false, offset: -3, title: 'Evaluation window closing', message: 'Complete pending evaluations for your assigned interns before 30 September.', link: '/supervisor/dashboard/stats' },
  { recipient: 'admin@internhub.com', type: NotificationType.INFO, isRead: false, offset: -1, title: 'Placement awaiting approval', message: 'Zainab Yusuf (Wema Bank Plc) is due to resume in 12 days.', link: '/placements' },
  { recipient: 'admin@internhub.com', type: NotificationType.WARNING, isRead: false, offset: -2, title: 'Attachment on hold', message: 'Emeka Okafor (Interswitch Group) placement is paused pending lab resumption.', link: '/placements' },
  { recipient: 'admin@internhub.com', type: NotificationType.SUCCESS, isRead: true, offset: -6, title: 'New partner organization', message: 'Wema Bank Plc was added to the partner network this quarter.', link: '/organizations' },
  { recipient: 'admin@internhub.com', type: NotificationType.INFO, isRead: true, offset: -9, title: 'Cohort summary ready', message: '8 interns are registered across 8 partner organizations for this cohort.', link: '/reports' },
];

const TITLES: Record<string, string> = {
  'supervisor@internhub.com': 'Dr.',
  'bello.adamu@internhub.com': 'Engr.',
  'funmilayo.adebayo@internhub.com': 'Mrs.',
  'mentor@internhub.com': 'Mr.',
};

const displayName = (email: string, first: string, last: string): string =>
  `${TITLES[email] || ''} ${first} ${last}`.trim();

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('\n\x1b[32m🌱  InternHub — Nigerian demo data seed\x1b[0m');
  console.log('─'.repeat(64));

  const demoEmails = [...STAFF.map((s) => s.email), ...INTERNS.map((i) => i.email)];
  const demoOrgNames = ORGANISATIONS.map((o) => o.name);

  // ── 1. Clean slate (opt-in) ────────────────────────────────────────────────
  if (RESET) {
    console.log('⚠️   --reset supplied: wiping every table...');
    await prisma.feedback.deleteMany();
    await prisma.logEntry.deleteMany();
    await prisma.evaluation.deleteMany();
    await prisma.placement.deleteMany();
    await prisma.internProfile.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
  }

  // ── 2. Remove only previously seeded demo rows (idempotency) ───────────────
  const clearedUsers = await prisma.user.deleteMany({ where: { email: { in: demoEmails } } });
  const clearedOrgs = await prisma.organization.deleteMany({ where: { name: { in: [...demoOrgNames] } } });
  console.log(`↺   cleared ${clearedUsers.count} demo user(s) and ${clearedOrgs.count} demo organization(s)`);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

  // ── 3. Organizations ──────────────────────────────────────────────────────
  const orgIdByName = new Map<string, string>();
  for (const org of ORGANISATIONS) {
    const created = await prisma.organization.create({
      data: { ...org, sector: org.sector as IndustrySector },
    });
    orgIdByName.set(created.name, created.id);
  }
  console.log(`✔   ${orgIdByName.size} partner organizations created`);

  // ── 4. Staff accounts (admin, super admin, supervisors, mentor) ────────────
  const staffIdByEmail = new Map<string, string>();
  const staffNameByEmail = new Map<string, string>();
  for (const s of STAFF) {
    const created = await prisma.user.create({
      data: {
        email: s.email,
        password: passwordHash,
        firstName: s.firstName,
        lastName: s.lastName,
        role: s.role,
        phone: s.phone,
        department: s.department,
        program: s.program,
        isActive: true,
        lastLoginAt: at(-1, 8, 15),
      },
    });
    staffIdByEmail.set(s.email, created.id);
    staffNameByEmail.set(s.email, displayName(s.email, s.firstName, s.lastName));
  }
  console.log(`✔   ${staffIdByEmail.size} staff accounts created`);

  // ── 5. Interns + intern profiles ──────────────────────────────────────────
  const internUserIdByEmail = new Map<string, string>();
  const internProfileIdByEmail = new Map<string, string>();

  for (const i of INTERNS) {
    const user = await prisma.user.create({
      data: {
        email: i.email,
        password: passwordHash,
        firstName: i.firstName,
        lastName: i.lastName,
        role: UserRole.INTERN,
        phone: i.phone,
        program: i.program,
        department: i.department,
        isActive: true,
        lastLoginAt: at(-1, 8, 45),
      },
    });
    internUserIdByEmail.set(i.email, user.id);

    const profile = await prisma.internProfile.create({
      data: {
        userId: user.id,
        matricNumber: i.matricNumber,
        faculty: i.faculty,
        institution: i.institution,
        startDate: at(i.startOffset),
        endDate: at(i.endOffset),
        supervisorName: staffNameByEmail.get(i.supervisorEmail) || null,
        organizationName: i.organisation,
      },
    });
    internProfileIdByEmail.set(i.email, profile.id);
  }
  console.log(`✔   ${internUserIdByEmail.size} interns + intern profiles created`);

  // ── 6. Placements ─────────────────────────────────────────────────────────
  for (const i of INTERNS) {
    const organizationId = orgIdByName.get(i.organisation);
    if (!organizationId) throw new Error(`Organization not found for "${i.organisation}"`);

    await prisma.placement.create({
      data: {
        internId: internProfileIdByEmail.get(i.email)!,
        organizationId,
        supervisorId: staffIdByEmail.get(i.supervisorEmail) || null,
        status: i.placementStatus,
        role: i.placementRole,
        department: i.placementDepartment,
        startDate: at(i.startOffset),
        endDate: at(i.endOffset),
        notes: i.notes,
      },
    });
  }
  console.log(`✔   ${INTERNS.length} placements created`);

  // ── 7. Logbook entries ────────────────────────────────────────────────────
  let logCount = 0;
  const logIdByKey = new Map<string, string>(); // `${internEmail}:${offset}` → log id

  for (const intern of INTERNS) {
    const internUserId = internUserIdByEmail.get(intern.email)!;
    const reviewerId = staffIdByEmail.get(intern.supervisorEmail)!;
    const entries = LOGBOOK[intern.email] || [];

    for (const log of entries) {
      const logDate = at(log.offset, 8, 30);
      const isReviewed = log.status === LogStatus.APPROVED || log.status === LogStatus.REJECTED;

      const created = await prisma.logEntry.create({
        data: {
          internId: internUserId,
          entryType: log.entryType,
          status: log.status,
          logDate,
          activity: log.activity,
          skills: log.skills,
          hoursWorked: log.hours,
          notes: log.notes || null,
          reviewedBy: isReviewed ? reviewerId : null,
          reviewedAt: isReviewed ? at(log.offset + 1, 14, 0) : null,
          reviewNotes: isReviewed ? log.reviewNotes || 'Reviewed and approved. Keep up the good work.' : null,
          createdAt: logDate,
        },
      });

      logIdByKey.set(`${intern.email}:${log.offset}`, created.id);
      logCount += 1;
    }
  }
  console.log(`   ${logCount} logbook entries created`);

  // ── 8. Supervisor feedback ────────────────────────────────────────────────
  for (const fb of FEEDBACK) {
    await prisma.feedback.create({
      data: {
        supervisorId: staffIdByEmail.get(fb.supervisorEmail)!,
        internId: internUserIdByEmail.get(fb.internEmail)!,
        logEntryId: fb.logOffset !== undefined ? logIdByKey.get(`${fb.internEmail}:${fb.logOffset}`) || null : null,
        type: fb.type,
        rating: fb.rating,
        content: fb.content,
        strengths: fb.strengths,
        improvements: fb.improvements,
        isPrivate: fb.isPrivate,
        createdAt: at(fb.offset, 11, 0),
      },
    });
  }
  console.log(`✔   ${FEEDBACK.length} feedback records created`);

  // ── 9. Evaluations ────────────────────────────────────────────────────────
  // The demo intern's placement is used for her own evaluation rows; every other
  // evaluation references the intern's first placement.
  const adminId = staffIdByEmail.get('admin@internhub.com')!;
  const placementIdByInternProfile = new Map<string, string>();
  const allPlacements = await prisma.placement.findMany({ select: { id: true, internId: true } });
  for (const p of allPlacements) placementIdByInternProfile.set(p.internId, p.id);

  for (const ev of EVALUATIONS) {
    const internProfileId = internProfileIdByEmail.get(ev.internEmail)!;
    const placementId = placementIdByInternProfile.get(internProfileId);
    if (!placementId) throw new Error(`Placement missing for intern "${ev.internEmail}"`);

    const [attendance, technicalSkills, communication, teamwork, initiative, problemSolving, professionalConduct] = ev.scores;
    const isReviewed = ev.status === EvaluationStatus.REVIEWED;

    await prisma.evaluation.create({
      data: {
        internId: internProfileId,
        supervisorId: staffIdByEmail.get(ev.supervisorEmail)!,
        placementId,
        status: ev.status,
        attendance: attendance ?? null,
        technicalSkills: technicalSkills ?? null,
        communication: communication ?? null,
        teamwork: teamwork ?? null,
        initiative: initiative ?? null,
        problemSolving: problemSolving ?? null,
        professionalConduct: professionalConduct ?? null,
        overallScore: ev.scores.length ? overallScore(ev.scores) : null,
        strengths: ev.strengths || null,
        improvements: ev.improvements || null,
        comments: ev.comments || null,
        reviewedBy: isReviewed ? adminId : null,
        reviewedAt: isReviewed ? at(ev.offset + 2, 10, 0) : null,
        createdAt: at(ev.offset, 12, 0),
      },
    });
  }
  console.log(`   ${EVALUATIONS.length} evaluations created`);

  // ── 10. Notifications ─────────────────────────────────────────────────────
  for (const n of NOTIFICATIONS) {
    const recipientId = staffIdByEmail.get(n.recipient) || internUserIdByEmail.get(n.recipient);
    if (!recipientId) continue;
    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        link: n.link,
        createdAt: at(n.offset, 7, 30),
      },
    });
  }
  console.log(`   ${NOTIFICATIONS.length} notifications created`);

  // ── 11. Summary ───────────────────────────────────────────────────────────
  const [users, orgs, profiles, placements, logs, feedbacks, evals, notifs] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.internProfile.count(),
    prisma.placement.count(),
    prisma.logEntry.count(),
    prisma.feedback.count(),
    prisma.evaluation.count(),
    prisma.notification.count(),
  ]);

  console.log('─'.repeat(64));
  console.log('\x1b[32m  Seed complete\x1b[0m');
  console.log(
    `   users: ${users}   organizations: ${orgs}   intern profiles: ${profiles}   placements: ${placements}`,
  );
  console.log(
    `   log entries: ${logs}   feedback: ${feedbacks}   evaluations: ${evals}   notifications: ${notifs}`,
  );
  console.log('\n\x1b[36m  Demo logins (Welcome page → Quick Demo Access)\x1b[0m');
  console.log(`   Student Intern       ${'intern@internhub.com'.padEnd(28)} ${DEMO_PASSWORD}`);
  console.log(`   Program Supervisor   ${'supervisor@internhub.com'.padEnd(28)} ${DEMO_PASSWORD}`);
  console.log(`   System Administrator ${'admin@internhub.com'.padEnd(28)} ${DEMO_PASSWORD}`);
  console.log('\n   Extra accounts (same password):');
  console.log('   superadmin@internhub.com | mentor@internhub.com | bello.adamu@internhub.com');
  console.log('   funmilayo.adebayo@internhub.com | oluwaseun.adeyemi@internhub.com');
  console.log('   tunde.balogun@internhub.com | chiamaka.obi@internhub.com');
  console.log('   ibrahim.musa@internhub.com | fatima.bello@internhub.com');
  console.log('   emeka.okafor@internhub.com | zainab.yusuf@internhub.com\n');
}

main()
  .catch((error) => {
    console.error('\n\x1b[31m Seed failed:\x1b[0m\n', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
