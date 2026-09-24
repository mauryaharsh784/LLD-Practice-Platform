# 🧩 LLD Practice Platform

<p align="center">
  <img src="./lld-practice-platform/client/public/logo.png" alt="LLD Practice Platform Logo" width="120" />
</p>

<h1 align="center">LLD Practice Platform</h1>

<p align="center">
  <strong>Practice. Design. Get Feedback. Improve.</strong>
</p>

<p align="center">
  A focused learning platform for practicing Low-Level Design through
  structured problems, design submissions, actionable feedback,
  attempt history, and repeated improvement.
</p>

<p align="center">
  <a href="https://lld-practice-platform-t5f1-two.vercel.app">
    🚀 <strong>Live Demo</strong>
  </a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="https://lld-practice-platform-api-ce9w.onrender.com/api/health">
    ⚙️ <strong>API Health</strong>
  </a>
</p>

<p align="center">
  Built with ❤️ by <strong>Harsh Vardhan Maurya</strong>
</p>

<p align="center">
  React • TypeScript • Node.js • Express • MongoDB • AI Evaluation
</p>

---

## 📌 Overview

**LLD Practice Platform** is an MVP designed to help software
engineering learners practice **Low-Level Design** through a structured
learning workflow.

The platform is built around a simple learning loop:

```text
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

Instead of focusing only on writing code, the platform focuses on the
learner's **design thinking, object modeling, responsibilities,
relationships, extensibility, and reasoning**.

---

## 🎯 Problem Statement

LLD learners often create designs without knowing:

- Whether their design is structured correctly
- Whether responsibilities are assigned properly
- Which concepts they missed
- Whether their classes are well modeled
- How their design can be improved
- Whether their second attempt is better than their first attempt

The platform addresses these problems through:

- Clear LLD problem requirements
- Structured design workspace
- Class and relationship modeling
- Design submission
- Dimension-wise evaluation
- Actionable feedback
- Attempt history
- Retry and iteration
- Progress tracking

---

## 🚀 Live Demo

The LLD Practice Platform is deployed and available online.

| Service | Link |
|---|---|
| 🌐 Frontend | https://lld-practice-platform-t5f1-two.vercel.app |
| ⚙️ Backend API | https://lld-practice-platform-api-ce9w.onrender.com |
| ❤️ API Health | https://lld-practice-platform-api-ce9w.onrender.com/api/health |

### Quick Start

👉 **[Open Live Application](https://lld-practice-platform-t5f1-two.vercel.app)**

---

## ✨ Core Features

### 📚 Problem Library

Learners can browse LLD problems with:

- Title
- Description
- Difficulty
- Estimated time
- Tags
- Practice status
- Search
- Filtering

---

### 📖 Problem Details

Each problem provides:

- Problem statement
- Functional requirements
- Assumptions
- Difficulty
- Estimated time
- Expected design areas
- Relevant tags

This helps learners understand the problem before starting the design.

---

### 🧠 Structured Design Workspace

Instead of using one large text box, learners can structure their
solution into multiple sections.

Learners can submit:

- Requirements
- Assumptions
- Classes
- Attributes
- Methods
- Responsibilities
- Relationships
- Design explanation
- Optional code
- Optional pseudocode

The workspace also supports **saving drafts before submission**.

---

### 📝 Structured Evaluation

Each submission can be evaluated across multiple LLD dimensions.

| Dimension | Score |
|---|---:|
| Requirement Understanding | /10 |
| Object/Class Modeling | /10 |
| Responsibility Assignment | /10 |
| Encapsulation | /10 |
| Relationships | /10 |
| Extensibility | /10 |
| Design Patterns | /10 |
| Simplicity | /10 |
| Code/Pseudocode Quality | /10 |
| Design Reasoning | /10 |

The evaluation provides:

- Overall score
- Dimension-wise scores
- Strengths
- Improvements
- Missing concepts
- Recommended next steps

---

## 🤖 AI Evaluation

The platform is designed with an abstraction layer for AI-powered
evaluation.

It can integrate with:

- Claude API
- OpenAI API
- Mock evaluator

The evaluator receives:

```text
Problem Requirements
        +
Learner Submission
        +
Evaluation Rubric
        ↓
AI / Mock Evaluator
        ↓
Structured JSON Feedback
```

Example response:

```json
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

---

## 🧪 Mock Evaluation

The application can work without an external AI API key.

Set:

```env
AI_PROVIDER=mock
```

The mock evaluator provides deterministic feedback for demonstrations
and development.

This allows the product to remain usable even when no external AI
provider is configured.

---

## 🔄 Attempt History

Every submission is stored as an attempt.

Learners can review:

- Problem
- Attempt number
- Date
- Score
- Submission
- Evaluation
- Improvement areas

Learners can also start another attempt after reviewing feedback.

This makes the platform focused on **iteration instead of one-time
submission**.

---

## 📊 Dashboard

The dashboard provides useful learning information such as:

- Problems attempted
- Problems completed
- Total attempts
- Average score
- Best score
- Recent activity
- Recommended problems

The goal is to show meaningful learning progress without unnecessary
analytics.

---

## 📈 Progress Tracking

The progress section helps learners understand their practice history.

It can show:

- Problem-wise performance
- Latest score
- Best score
- Attempt count
- Completed problems
- Improvement over time

---

## 🔁 Core Learning Loop

```text
┌─────────────────┐
│  Choose Problem │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Think / Design │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Submit Solution │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Get Feedback   │
└────────┬────────┘
         ↓
┌─────────────────┐
│      Review     │
└────────┬────────┘
         ↓
┌─────────────────┐
│    Try Again    │
└────────┬────────┘
         │
         └──────────────→ Improve
```

---

## 📚 Example Problems

The seed data includes realistic LLD problems such as:

- 🅿️ Parking Lot
- 📚 Library Management System
- 💰 Splitwise
- ❌⭕ Tic Tac Toe
- 🛗 Elevator System
- 🐍 Snake and Ladder
- 🎬 BookMyShow
- 🏧 ATM
- 🚗 Ride Sharing System
- ♟️ Chess Game

Each problem can contain:

- Requirements
- Assumptions
- Expected design areas
- Difficulty
- Estimated time
- Tags

---

## 👨‍💻 User Flow

```text
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

---

# 📸 Screenshots

## 🏠 Home

![Home](./lld-practice-platform/screenshot/home.png)

---

## 📝 My Attempts

![My Attempts](./lld-practice-platform/screenshot/myattemp.png)

---

## 📖 Problem Details

![Problem](./lld-practice-platform/screenshot/problem.png)

---

## 📊 Progress

![Progress](./lld-practice-platform/screenshot/progress.png)

---

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- MongoDB
- Mongoose

## AI

- Claude API
- OpenAI API
- Mock Evaluation

## Deployment

- Vercel
- Render
- MongoDB Atlas

---

# 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │   TypeScript + Vite  │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ↓
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │      TypeScript      │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ↓                ↓                ↓
       ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
       │   Problem   │  │   Attempt   │  │  Evaluation  │
       │   Service   │  │   Service   │  │   Service    │
       └─────────────┘  └─────────────┘  └──────┬───────┘
                                                │
                                                ↓
                                      ┌──────────────────┐
                                      │ AI / Mock        │
                                      │ Evaluator        │
                                      └──────────────────┘

                               │
                               ↓

                    ┌──────────────────────┐
                    │       MongoDB        │
                    │      Mongoose        │
                    └──────────────────────┘
```

---

# 🗂️ Main Data Models

## User

```text
id
name
email
createdAt
```

## Problem

```text
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

## Attempt

```text
id
userId
problemId
attemptNumber
submission
status
createdAt
```

## Evaluation

```text
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

---

# 🔌 API Design

## Problems

```http
GET /api/problems
GET /api/problems/:id
```

## Attempts

```http
POST /api/attempts
GET /api/attempts
GET /api/attempts/:id
GET /api/problems/:id/attempts
```

## Evaluation

```http
POST /api/attempts/:id/evaluate
```

## Dashboard

```http
GET /api/dashboard
```

---

# 📁 Project Structure

```text
lld-practice-platform/
│
├── client/
│   ├── public/
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── features/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── validators/
│   │
│   ├── package.json
│   └── .env.example
│
├── docs/
│   └── PRODUCT_DECISIONS.md
│
├── screenshot/
│   ├── home.png
│   ├── myattemp.png
│   ├── problem.png
│   └── progress.png
│
├── .gitignore
├── README.md
└── package.json
```

---

# ⚙️ Environment Variables

Example:

```env
NODE_ENV=development

PORT=4000

MONGODB_URI=mongodb://localhost:27017/lld-practice-platform

AI_PROVIDER=mock

ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

> Never commit real API keys, database passwords, or secrets to GitHub.

---

# 💻 Running Locally

## 1. Clone Repository

```bash
git clone <repository-url>
cd lld-practice-platform
```

## 2. Install Dependencies

```bash
npm install
```

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd ../server
npm install
```

---

## 3. Configure Environment Variables

Create `.env` inside the server directory.

Example:

```env
PORT=4000
DB_MODE=mongo
MONGODB_URI=mongodb://localhost:27017/lld-practice-platform

AI_PROVIDER=mock

ANTHROPIC_API_KEY=
OPENAI_API_KEY=

SEED_SAMPLE_DATA=true
```

---

## 4. Start Backend

From the `server` directory:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:4000
```

---

## 5. Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will provide the frontend URL.

Usually:

```text
http://localhost:5173
```

---

# 🧪 Demo Scenario

A complete demo can be performed using **Parking Lot**.

### Step 1

Open the Dashboard.

### Step 2

Open the Problem Library.

### Step 3

Select **Parking Lot**.

### Step 4

Read the requirements and assumptions.

### Step 5

Start the practice session.

### Step 6

Add:

- Requirements
- Assumptions
- Classes
- Responsibilities
- Relationships

### Step 7

Explain the design.

### Step 8

Save the design as a draft.

### Step 9

Submit the solution.

### Step 10

Receive structured evaluation.

### Step 11

Review:

- Score
- Strengths
- Improvements
- Missing concepts
- Next steps

### Step 12

Click **Try Again**.

### Step 13

Create a second attempt.

### Step 14

Compare both attempts in history.

---

# 🧠 Product Decisions

## Why Structured Submission?

A single large text box makes it difficult to evaluate individual LLD
dimensions.

Structured fields make the learner's thinking easier to understand and
allow more targeted feedback.

---

## Why Feedback Instead of Only a Score?

A score alone does not explain how the learner should improve.

The platform therefore focuses on:

```text
Score
  +
Strengths
  +
Problems
  +
Missing Concepts
  +
Next Steps
```

---

## Why Attempt History?

LLD improves through iteration.

Previous attempts help learners understand whether their design
decisions are improving.

---

## Why Mock AI?

The product should remain usable without an external API key.

Mock evaluation makes the MVP easy to demonstrate while keeping the
architecture ready for real AI providers.

---

## Why Avoid Over-Engineering?

The assignment focuses on product thinking and the learner workflow.

Technologies such as:

- Kubernetes
- Microservices
- Complex real-time systems
- Unnecessary infrastructure

do not directly improve the core learning loop for this MVP.

---

# 🎯 Evaluation Philosophy

The evaluator should consider:

- Requirement understanding
- Appropriate abstraction
- Class modeling
- Responsibility assignment
- Encapsulation
- Relationships
- Extensibility
- Design patterns
- Simplicity
- Design reasoning

Feedback should explain **why** a change may improve the design and
provide a concrete direction for improvement.

Example:

> Instead of placing parking allocation and pricing logic inside
> `ParkingLot`, consider separating these responsibilities into
> dedicated components.

---

# 🛡️ Error Handling

The application should gracefully handle:

- Invalid submissions
- Missing required fields
- API failures
- Database failures
- Missing problems
- AI provider failures
- Invalid AI responses
- Empty states

Users should receive understandable messages instead of raw stack
traces.

---

# ⏳ Loading States

Important operations should show clear status messages:

```text
Loading problems...
Saving draft...
Submitting...
Evaluating your design...
```

---

# 🎨 Design Principles

## Focus on the Learner

Every feature should help the learner practice or understand LLD better.

## Make Feedback Actionable

Avoid generic feedback such as:

> Improve your design.

Prefer feedback such as:

> ParkingLot currently handles both allocation and pricing. Consider
> separating these responsibilities so each component has a clearer
> purpose.

## Keep the MVP Narrow

The product should demonstrate the core learning loop instead of
attempting to solve every possible learning problem.

## Make Iteration Easy

The learner should be able to move from feedback directly into another
attempt.

---

# 🚫 Intentionally Out of Scope

The MVP does not require:

- Kubernetes
- Microservices
- Complex authentication
- Real-time collaboration
- Video courses
- Live instructor sessions
- Large-scale social features
- Advanced gamification
- Complex recommendation engines
- Production-scale distributed infrastructure

---

# 🔮 Future Improvements

Possible future improvements include:

- Interactive UML/Class Diagram Editor
- Automatic Diagram Analysis
- Personalized Problem Recommendations
- Adaptive Difficulty
- Peer Review
- Instructor Review
- Code Execution
- Deeper AI Evaluation
- Learning Streaks
- Topic-Level Mastery
- Personalized Revision Plans
- Collaborative Design Sessions
- Interview Simulation Mode

---

# ✅ Success Criteria

The MVP is successful when a learner can:

1. Select an LLD problem.
2. Understand the requirements.
3. Create a structured design.
4. Save or submit the design.
5. Receive meaningful evaluation.
6. Review strengths and weaknesses.
7. Open previous attempts.
8. Start another attempt.
9. Use feedback to improve.

---

# 🏆 Project Highlights

```text
✓ Structured LLD Practice
✓ Problem Library
✓ Design Workspace
✓ Class & Relationship Modeling
✓ Draft Saving
✓ Submission Workflow
✓ AI / Mock Evaluation
✓ Dimension-wise Feedback
✓ Attempt History
✓ Progress Dashboard
✓ Retry Workflow
✓ REST API
✓ MongoDB Persistence
✓ Vercel Deployment
✓ Render Backend
```

---

# 👨‍💻 Author

<p align="center">
  <strong>Harsh Vardhan Maurya</strong>
</p>

<p align="center">
  B.Tech Computer Science & Engineering
</p>

<p align="center">
  Full Stack Developer • AI Developer • LLD Enthusiast
</p>

<p align="center">
  <strong>Building practical software and learning through design.</strong>
</p>

---

# ⭐ Project Philosophy

LLD is not learned by reading class diagrams alone.

It improves through:

```text
Practice
   ↓
Design
   ↓
Feedback
   ↓
Review
   ↓
Improvement
   ↓
Practice Again
```

> **LLD Practice Platform turns this loop into a practical learning
> experience.**

---

<p align="center">
  Made with ❤️ by <strong>Harsh Vardhan Maurya</strong>
</p>

<p align="center">
  <strong>Practice → Submit → Learn → Improve → Try Again</strong>
</p>
