# Intern Management System - Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    %% ==============================
    %% AUTH & USER MANAGEMENT
    %% ==============================
    User {
        uuid id PK
        string email UK
        string password
        enum UserRole role
        string firstName
        string lastName
        string phone "nullable"
        string department "nullable"
        string program "nullable"
        boolean isActive
        string refreshToken "nullable"
        string resetToken "nullable"
        datetime resetTokenExp "nullable"
        datetime lastLoginAt "nullable"
        datetime createdAt
        datetime updatedAt
    }

    RefreshToken {
        uuid id PK
        string token UK
        uuid userId FK
        datetime expiresAt
        datetime createdAt
        boolean revoked
    }

    Notification {
        uuid id PK
        uuid userId FK
        string title
        string message
        enum NotificationType type
        boolean isRead
        string link "nullable"
        datetime createdAt
    }

    %% ==============================
    %% INTERN PROFILE
    %% ==============================
    InternProfile {
        uuid id PK
        uuid userId FK "unique"
        string matricNumber UK "nullable"
        string faculty "nullable"
        string institution "nullable"
        string avatarUrl "nullable"
        datetime startDate "nullable"
        datetime endDate "nullable"
        string supervisorName "nullable"
        string organizationName "nullable"
        datetime createdAt
        datetime updatedAt
    }

    %% ==============================
    %% ORGANIZATION & PLACEMENT
    %% ==============================
    Organization {
        uuid id PK
        string name
        string address "nullable"
        string email "nullable"
        string phone "nullable"
        string website "nullable"
        enum IndustrySector sector
        string description "nullable"
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    Placement {
        uuid id PK
        uuid internId FK
        uuid organizationId FK
        uuid supervisorId FK "nullable"
        enum PlacementStatus status
        string role "nullable"
        string department "nullable"
        datetime startDate "nullable"
        datetime endDate "nullable"
        string notes "nullable"
        datetime createdAt
        datetime updatedAt
        @@unique internId + organizationId
    }

    %% ==============================
    %% PERFORMANCE EVALUATION
    %% ==============================
    Evaluation {
        uuid id PK
        uuid internId FK
        uuid supervisorId FK
        uuid placementId FK
        enum EvaluationStatus status
        smallint attendance "nullable, 1-10"
        smallint technicalSkills "nullable, 1-10"
        smallint communication "nullable, 1-10"
        smallint teamwork "nullable, 1-10"
        smallint initiative "nullable, 1-10"
        smallint problemSolving "nullable, 1-10"
        smallint professionalConduct "nullable, 1-10"
        float overallScore "nullable"
        text strengths "nullable"
        text improvements "nullable"
        text comments "nullable"
        uuid reviewedBy FK "nullable"
        datetime reviewedAt "nullable"
        datetime createdAt
        datetime updatedAt
    }

    %% ==============================
    %% DIGITAL ACTIVITY LOGBOOK
    %% ==============================
    LogEntry {
        uuid id PK
        uuid internId FK
        enum LogEntryType entryType
        enum LogStatus status
        datetime logDate
        text activity
        text skills "nullable"
        float hoursWorked "nullable"
        text notes "nullable"
        uuid reviewedBy FK "nullable"
        datetime reviewedAt "nullable"
        text reviewNotes "nullable"
        datetime createdAt
        datetime updatedAt
    }

    %% ==============================
    %% SUPERVISOR FEEDBACK
    %% ==============================
    Feedback {
        uuid id PK
        uuid supervisorId FK
        uuid internId FK
        uuid logEntryId FK "nullable"
        enum FeedbackType type
        smallint rating "nullable"
        text content
        text strengths "nullable"
        text improvements "nullable"
        boolean isPrivate
        datetime createdAt
        datetime updatedAt
    }

    %% ==============================
    %% RELATIONSHIPS
    %% ==============================

    %% User -> RefreshToken (1:N)
    User ||--o{ RefreshToken : "has"

    %% User -> Notification (1:N)
    User ||--o{ Notification : "receives"

    %% User -> InternProfile (1:1)
    User ||--|| InternProfile : "has profile"

    %% InternProfile -> Placement (1:N)
    InternProfile ||--o{ Placement : "placed in"

    %% Organization -> Placement (1:N)
    Organization ||--o{ Placement : "hosts"

    %% User (Supervisor) -> Placement (1:N)
    User ||--o{ Placement : "supervises (PlacementSupervisor)"

    %% InternProfile -> Evaluation (1:N)
    InternProfile ||--o{ Evaluation : "receives (EvaluationIntern)"

    %% User (Supervisor) -> Evaluation (1:N)
    User ||--o{ Evaluation : "creates (EvaluationSupervisor)"

    %% User (Reviewer) -> Evaluation (1:N)
    User ||--o{ Evaluation : "reviews (EvaluationReviewer)"

    %% Placement -> Evaluation (1:N)
    Placement ||--o{ Evaluation : "has (PlacementEvaluations)"

    %% User (Intern) -> LogEntry (1:N)
    User ||--o{ LogEntry : "writes"

    %% User (Reviewer) -> LogEntry (1:N)
    User ||--o{ LogEntry : "reviews (LogReviewer)"

    %% LogEntry -> Feedback (1:N)
    LogEntry ||--o{ Feedback : "receives"

    %% User (Supervisor) -> Feedback (1:N)
    User ||--o{ Feedback : "gives (SupervisorFeedback)"

    %% User (Intern) -> Feedback (1:N)
    User ||--o{ Feedback : "receives (InternFeedback)"
```

## Entity Summary

| # | Entity | Table Name | Description |
|---|--------|------------|-------------|
| 1 | **User** | `users` | Core user account (all roles: SUPER_ADMIN, ADMIN, SUPERVISOR, MENTOR, INTERN) |
| 2 | **RefreshToken** | `refresh_tokens` | JWT refresh tokens for authentication |
| 3 | **Notification** | `notifications` | In-app notifications for users |
| 4 | **InternProfile** | `intern_profiles` | Extended profile data specific to interns |
| 5 | **Organization** | `organizations` | Companies/organizations hosting interns |
| 6 | **Placement** | `placements` | Links interns to organizations with supervisor assignment |
| 7 | **Evaluation** | `evaluations` | Performance evaluations with scoring criteria (1-10) |
| 8 | **LogEntry** | `log_entries` | Daily/weekly activity logbook entries |
| 9 | **Feedback** | `feedbacks` | Supervisor feedback on intern performance/logs |

## Relationship Summary

| From | To | Type | Description |
|------|----|------|-------------|
| User | RefreshToken | 1:N | A user can have multiple refresh tokens |
| User | Notification | 1:N | A user can receive many notifications |
| User | InternProfile | 1:1 | A user (intern role) has one extended profile |
| InternProfile | Placement | 1:N | An intern can have multiple placements |
| Organization | Placement | 1:N | An organization can host multiple placements |
| User (Supervisor) | Placement | 1:N | A supervisor can oversee multiple placements |
| InternProfile | Evaluation | 1:N | An intern can receive multiple evaluations |
| User (Supervisor) | Evaluation | 1:N | A supervisor can create many evaluations |
| User (Reviewer) | Evaluation | 1:N | A reviewer can review many evaluations |
| Placement | Evaluation | 1:N | A placement can have multiple evaluations |
| User (Intern) | LogEntry | 1:N | An intern can write many log entries |
| User (Reviewer) | LogEntry | 1:N | A reviewer can review many log entries |
| LogEntry | Feedback | 1:N | A log entry can receive multiple feedbacks |
| User (Supervisor) | Feedback | 1:N | A supervisor can give many feedbacks |
| User (Intern) | Feedback | 1:N | An intern can receive many feedbacks |

## Enums

| Enum | Values |
|------|--------|
| **UserRole** | SUPER_ADMIN, ADMIN, SUPERVISOR, MENTOR, INTERN |
| **NotificationType** | INFO, WARNING, SUCCESS, ERROR, DEADLINE, EVALUATION |
| **EvaluationStatus** | PENDING, IN_PROGRESS, COMPLETED, REVIEWED |
| **IndustrySector** | TECHNOLOGY, FINANCE, HEALTHCARE, EDUCATION, ENGINEERING, MANUFACTURING, RETAIL, MEDIA, CONSULTING, NON_PROFIT, GOVERNMENT, OTHER |
| **PlacementStatus** | ACTIVE, COMPLETED, TERMINATED, ON_HOLD, PENDING |
| **LogEntryType** | DAILY, WEEKLY |
| **LogStatus** | DRAFT, SUBMITTED, APPROVED, REJECTED |
| **FeedbackType** | GENERAL, PERFORMANCE, SKILLS, CONDUCT, GOAL |