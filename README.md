# LLD Practice Platform

> A focused learning platform for practicing Low-Level Design through
> structured problems, design submissions, actionable feedback, attempt
> history, and repeated improvement.

## Overview

LLD Practice Platform is an MVP built around the learning loop:

**Choose Problem → Think / Design → Submit → Get Feedback → Review → Try
Again**

The platform helps software engineering learners practice LLD problems
such as Parking Lot, Library Management System, Splitwise, Elevator
System, ATM, and similar object-oriented design problems.

The product focuses on the learner's actual design process rather than
only asking for code.

## Problem Statement

LLD learners often create designs without knowing whether their solution
is good, what they missed, or how to improve it.

The platform addresses this by providing:

-   Clear LLD problem requirements
-   A structured design workspace
-   Class and relationship modeling
-   Submission and evaluation
-   Dimension-wise feedback
-   Attempt history
-   Easy retry and iteration

## Core Learning Loop

``` text
Choose Problem
      ↓
Think / Design
      ↓
Submit Solution
      ↓
Get Feedback
      ↓
Review
      ↓
Try Again
```
----
## Live Demo

The LLD Practice Platform is deployed and available online.

- **Live Application:** https://lld-practice-platform-t5f1-two.vercel.app
- **Backend API:** https://lld-practice-platform-api-ce9w.onrender.com
- **Health Check:** https://lld-practice-platform-api-ce9w.onrender.com/api/health


---

## MVP Features

### Problem Library

Learners can browse LLD problems with:

-   Title
-   Description
-   Difficulty
-   Estimated time
-   Tags
-   Practice status

The library supports search and filtering.

### Problem Details

Each problem provides:

-   Problem statement
-   Functional requirements
-   Assumptions
-   Difficulty
-   Estimated time
-   Expected design areas

### Design Workspace

Learners can submit:

-   Requirements and assumptions
-   Classes
-   Attributes
-   Methods
-   Responsibilities
-   Relationships
-   Design explanation
-   Optional code/pseudocode

The workspace supports saving drafts before submission.

### Structured Evaluation

Submissions can be evaluated on:

  Dimension                     Score
  --------------------------- -------
  Requirement Understanding       /10
  Object/Class Modeling           /10
  Responsibility Assignment       /10
  Encapsulation                   /10
  Relationships                   /10
  Extensibility                   /10
  Design Patterns                 /10
  Simplicity                      /10
  Code/Pseudocode Quality         /10
  Design Reasoning                /10

The result includes:

-   Overall score
-   Dimension-wise scores
-   Strengths
-   Improvements
-   Missing concepts
-   Recommended next steps

### AI Evaluation

The application can integrate Claude or OpenAI for evaluation.

The evaluator receives the problem requirements, learner submission, and
rubric and returns structured feedback.

A strict JSON response is expected, for example:

``` json
{
  "overallScore": 78,
  "dimensions": [
    {
      "name": "Requirement Understanding",
      "score": 8,
      "feedback": "The main requirements are covered clearly."
    },
    {
      "name": "Responsibility Assignment",
      "score": 6,
      "feedback": "Some responsibilities are concentrated in one class."
    }
  ],
  "strengths": [],
  "improvements": [],
  "missingConcepts": [],
  "nextSteps": []
}
```

### Mock Evaluation

The platform works without an external AI key.

Use:

``` env
AI_PROVIDER=mock
```

This provides deterministic demo feedback while keeping the architecture
ready for real AI providers.

### Attempt History

Every submission is stored as an attempt.

Learners can review:

-   Problem
-   Attempt number
-   Date
-   Score
-   Submission
-   Evaluation
-   Improvement areas

They can start another attempt from previous feedback.

### Dashboard

The dashboard can show:

-   Problems attempted
-   Problems completed
-   Total attempts
-   Average score
-   Best score
-   Recent activity

Keep analytics focused on useful learning information.

## Example Problems

The seed data should include realistic problems such as:

-   Parking Lot
-   Library Management System
-   Splitwise
-   Tic Tac Toe
-   Elevator System
-   Snake and Ladder
-   BookMyShow
-   ATM
-   Ride Sharing System
-   Chess Game

Each problem should contain requirements, assumptions, expected design
areas, difficulty, and tags.

## User Flow

``` text
Dashboard
   ↓
Problem Library
   ↓
Problem Details
   ↓
Design Workspace
   ↓
Save Draft / Submit
   ↓
Evaluation
   ↓
Review Feedback
   ↓
Attempt History
   ↓
Try Again
```

## Screenshots

### Home

![Home](./lld-practice-platform/screenshot/home.png)

### My Attempts

![My Attempts](./lld-practice-platform/screenshot/myattemp.png)

### Problem

![Problem](./lld-practice-platform/screenshot/problem.png)

### Progress

![Progress](./lld-practice-platform/screenshot/progress.png)
## Technology Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Router
-   TanStack Query

### Backend

-   Node.js
-   Express.js
-   TypeScript

### Database

-   MongoDB
-   Mongoose

### AI

-   Claude API and/or OpenAI API
-   Mock evaluation fallback

## Architecture

``` text
React + TypeScript
        │
        │ REST API
        ▼
Express + TypeScript
        │
        ├── Problem Service
        ├── Attempt Service
        ├── Evaluation Service
        │
        ▼
MongoDB + Mongoose
        │
        ▼
Claude / OpenAI / Mock Evaluator
```

## Main Data Models

### User

``` text
id
name
email
createdAt
```

### Problem

``` text
id
title
slug
description
difficulty
estimatedTime
tags
requirements
assumptions
expectedAreas
createdAt
```

### Attempt

``` text
id
userId
problemId
attemptNumber
submission
status
createdAt
```

### Evaluation

``` text
id
attemptId
overallScore
dimensions
strengths
improvements
missingConcepts
nextSteps
createdAt
```

## API Design

### Problems

``` http
GET /api/problems
GET /api/problems/:id
```

### Attempts

``` http
POST /api/attempts
GET /api/attempts
GET /api/attempts/:id
GET /api/problems/:id/attempts
```

### Evaluation

``` http
POST /api/attempts/:id/evaluate
```

### Dashboard

``` http
GET /api/dashboard
```

## Suggested Project Structure

``` text
lld-practice-platform/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── features/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── validators/
│   └── package.json
├── docs/
│   └── PRODUCT_DECISIONS.md
├── .env.example
├── README.md
└── package.json
```

## Environment Variables

Example:

``` env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lld-practice-platform

AI_PROVIDER=mock

ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

## Running Locally

``` bash
git clone <repository-url>
cd lld-practice-platform
npm install
```

Create `.env` from `.env.example`.

Start MongoDB, then seed sample data if the project provides a seed
command:

``` bash
npm run seed
```

Start the backend:

``` bash
npm run dev
```

Start the frontend:

``` bash
npm run dev
```

Open the URL shown by Vite.

## Demo Scenario

A complete demo can be performed using **Parking Lot**:

1.  Open Dashboard.
2.  Open Problems.
3.  Select Parking Lot.
4.  Read the requirements.
5.  Start Practice.
6.  Add requirements and assumptions.
7.  Add classes and responsibilities.
8.  Add relationships.
9.  Explain the design.
10. Save draft.
11. Submit.
12. Receive evaluation.
13. Review strengths and improvements.
14. Click Try Again.
15. Submit a second attempt.
16. Review both attempts in history.

## Product Decisions

### Why structured submission?

A single large text box makes it difficult to evaluate individual LLD
dimensions.

Structured fields make the learner's thinking easier to understand and
allow more targeted feedback.

### Why feedback instead of only a score?

A score alone does not explain how the learner should improve.

The platform therefore focuses on:

**Score + Strengths + Problems + Missing Concepts + Next Steps**

### Why attempt history?

LLD improves through iteration. Previous attempts help learners
understand whether their design decisions are improving.

### Why mock AI?

The product should remain usable without an external API key. Mock
evaluation makes the MVP easy to demonstrate while keeping the
architecture ready for real AI providers.

### Why avoid over-engineering?

The assignment focuses on product thinking and the learner workflow.
Kubernetes, microservices, complex real-time systems, and unnecessary
infrastructure do not directly improve the core learning loop.

## Evaluation Philosophy

The evaluator should consider:

-   Requirement understanding
-   Appropriate abstraction
-   Class modeling
-   Responsibility assignment
-   Encapsulation
-   Relationships
-   Extensibility
-   Design patterns
-   Simplicity
-   Design reasoning

Feedback should explain **why** a change may improve the design and
provide a concrete direction for improvement.

## Error Handling

The application should gracefully handle:

-   Invalid submissions
-   Missing required fields
-   API failures
-   Database failures
-   Missing problems
-   AI provider failures
-   Invalid AI responses
-   Empty states

Users should receive understandable messages instead of raw stack
traces.

## Loading States

Important operations should show clear status:

``` text
Loading problems...
Saving draft...
Submitting...
Evaluating your design...
```

## Design Principles

### Focus on the learner

Every feature should help the learner practice or understand LLD better.

### Feedback should be actionable

Avoid generic feedback such as:

> Improve your design.

Prefer feedback such as:

> ParkingLot currently handles both allocation and pricing. Consider
> separating these responsibilities so each component has a clearer
> purpose.

### Keep the MVP narrow

The product should demonstrate the core learning loop rather than
attempting to solve every possible learning problem.

### Make iteration easy

The learner should be able to move from feedback directly into another
attempt.

## Intentionally Out of Scope

The MVP does not require:

-   Kubernetes
-   Microservices
-   Complex authentication
-   Real-time collaboration
-   Video courses
-   Live instructor sessions
-   Large-scale social features
-   Advanced gamification
-   Complex recommendation engines
-   Production-scale distributed infrastructure

## Future Improvements

Possible future improvements:

-   Interactive UML/class diagram editor
-   Automatic diagram analysis
-   Personalized problem recommendations
-   Adaptive difficulty
-   Peer review
-   Instructor review
-   Code execution
-   Deeper AI evaluation
-   Learning streaks
-   Topic-level mastery
-   Personalized revision plans
-   Collaborative design sessions
-   Interview simulation mode

## Success Criteria

The MVP is successful when a learner can:

1.  Select an LLD problem.
2.  Understand the requirements.
3.  Create a structured design.
4.  Save or submit it.
5.  Receive meaningful evaluation.
6.  Review strengths and weaknesses.
7.  Open previous attempts.
8.  Start another attempt.
9.  Use feedback to improve.

## Conclusion

LLD Practice Platform is built around one simple idea:

> **LLD improves through practice, feedback, and iteration.**

The platform turns that idea into a focused experience where learners
can:

**Practice → Submit → Learn → Improve → Try Again**

The MVP prioritizes the learner workflow and quality of feedback over
unnecessary technical complexity.
