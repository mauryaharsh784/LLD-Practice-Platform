import { Problem } from "../types/domain";

export const problems: Problem[] = [
  {
    id: "prob_parking_lot",
    slug: "parking-lot",
    title: "Parking Lot",
    shortDescription:
      "Design a multi-floor parking lot that assigns spots to different vehicle types and handles ticketing and payment.",
    difficulty: "Medium",
    estimatedTimeMinutes: 45,
    tags: ["OOP Basics", "Strategy Pattern", "Allocation"],
    problemStatement:
      "Design a parking lot system for a commercial building. The system must manage available spots across multiple floors, support different vehicle types, issue entry tickets, and calculate a payment on exit.",
    functionalRequirements: [
      "Parking lot has multiple floors, each with a fixed number of spots.",
      "Vehicles can enter and exit through designated gates.",
      "Different vehicle types (motorcycle, car, bus) require different spot sizes.",
      "The system should assign the most suitable available spot automatically.",
      "A ticket is generated on entry with the entry time and assigned spot.",
      "Payment is calculated and collected on exit based on duration and vehicle type.",
      "The system should report real-time spot availability per floor.",
    ],
    assumptions: [
      "A single parking lot instance is being modeled (not a chain of lots).",
      "Pricing is a simple hourly rate per vehicle type unless the learner chooses otherwise.",
      "Payment processing itself can be modeled as an interface/mock, not a real gateway integration.",
    ],
    expectedDesignAreas: [
      "Class modeling for ParkingLot, Floor, ParkingSpot, Vehicle, Ticket, Payment",
      "Spot allocation strategy that can vary without changing ParkingLot",
      "Relationships between lot, floor, spot and vehicle",
      "Extensibility for new vehicle types or pricing rules",
    ],
    submissionExpectations: [
      "Identify the core classes and their single responsibility.",
      "Describe how a spot is chosen for a given vehicle.",
      "Explain how the design would change to support a new vehicle type.",
    ],
  },
  {
    id: "prob_library_management",
    slug: "library-management-system",
    title: "Library Management System",
    shortDescription:
      "Design a system to manage books, members, borrowing, returns, and late fees for a community library.",
    difficulty: "Easy",
    estimatedTimeMinutes: 30,
    tags: ["OOP Basics", "State Management"],
    problemStatement:
      "A community library needs a system to catalog books, register members, and track borrowing and returns, including overdue fee calculation.",
    functionalRequirements: [
      "Books can have multiple copies; each copy is tracked individually.",
      "Members can borrow up to a fixed number of books at a time.",
      "The system tracks due dates and calculates late fees on return.",
      "Members can search the catalog by title, author, or category.",
      "Librarians can add, remove, or update book records.",
    ],
    assumptions: [
      "One library branch is being modeled.",
      "Reservations/holds are optional and can be left out of the first design.",
    ],
    expectedDesignAreas: [
      "Book vs BookCopy modeling",
      "Borrowing/Loan lifecycle and state transitions",
      "Fee calculation responsibility placement",
    ],
    submissionExpectations: [
      "Model the distinction between a Book (title) and a physical copy.",
      "Describe the loan lifecycle from checkout to return.",
    ],
  },
  {
    id: "prob_splitwise",
    slug: "splitwise",
    title: "Splitwise",
    shortDescription:
      "Design an expense-splitting system that tracks group expenses and settles balances between users.",
    difficulty: "Hard",
    estimatedTimeMinutes: 60,
    tags: ["Graphs", "Strategy Pattern", "Financial Modeling"],
    problemStatement:
      "Design a system, similar to Splitwise, where users can create groups, add shared expenses, split them in different ways (equal, exact, percentage), and see simplified balances between members.",
    functionalRequirements: [
      "Users can create groups and add members.",
      "An expense can be split equally, by exact amounts, or by percentage.",
      "The system tracks who owes whom and how much.",
      "Balances should be simplified (minimize the number of settlements).",
      "Users can settle up a balance with another user.",
    ],
    assumptions: [
      "Multi-currency support is out of scope for the first design.",
      "Simplification algorithm can be described conceptually rather than fully coded.",
    ],
    expectedDesignAreas: [
      "Split strategy abstraction (equal/exact/percentage)",
      "Balance/ledger modeling between users",
      "Group and Expense relationships",
      "Extensibility for new split types",
    ],
    submissionExpectations: [
      "Show how a new split type could be added without modifying Expense.",
      "Explain how balances are computed and simplified.",
    ],
  },
  {
    id: "prob_tic_tac_toe",
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    shortDescription:
      "Design a two-player Tic Tac Toe game with a configurable board size and win detection.",
    difficulty: "Easy",
    estimatedTimeMinutes: 25,
    tags: ["Game Design", "OOP Basics"],
    problemStatement:
      "Design a two-player Tic Tac Toe game. The design should support a standard 3x3 board but be extensible to other board sizes.",
    functionalRequirements: [
      "Two players take turns placing their symbol on the board.",
      "The system detects a win, loss, or draw after each move.",
      "Invalid moves (occupied cell, out of turn) are rejected.",
      "The board size should be configurable (e.g., 3x3, 5x5).",
    ],
    assumptions: [
      "No networking/multiplayer-over-network concerns — local two-player only.",
      "A simple console or in-memory representation is enough; no UI rendering required.",
    ],
    expectedDesignAreas: [
      "Board and Cell modeling",
      "Turn management and game state",
      "Win-condition checking that scales with board size",
    ],
    submissionExpectations: [
      "Describe how win detection works for an N x N board.",
      "Explain how game state (in-progress, won, draw) is tracked.",
    ],
  },
  {
    id: "prob_elevator_system",
    slug: "elevator-system",
    title: "Elevator System",
    shortDescription:
      "Design the control logic for a bank of elevators serving multiple floors with an efficient dispatch strategy.",
    difficulty: "Hard",
    estimatedTimeMinutes: 60,
    tags: ["Scheduling", "State Machine", "Strategy Pattern"],
    problemStatement:
      "Design a system to control multiple elevators in a building. The system should handle external floor requests and internal cabin requests, and dispatch the most appropriate elevator.",
    functionalRequirements: [
      "The building has multiple elevators and multiple floors.",
      "Users can request an elevator from a floor (up/down) and select a destination inside the cabin.",
      "The system dispatches the most suitable elevator for a request.",
      "Each elevator has a state (idle, moving up, moving down, doors open).",
      "The design should support adding a new dispatch strategy later.",
    ],
    assumptions: [
      "Physical door/motor hardware is out of scope; model logical states only.",
      "A single dispatch strategy needs to be implemented; more are a stretch goal.",
    ],
    expectedDesignAreas: [
      "Elevator state machine",
      "Dispatch strategy abstraction",
      "Request queue modeling per elevator",
    ],
    submissionExpectations: [
      "Describe the elevator's state transitions.",
      "Explain how a request is matched to an elevator.",
    ],
  },
  {
    id: "prob_atm",
    slug: "atm",
    title: "ATM",
    shortDescription:
      "Design an ATM system handling authentication, cash withdrawal, deposits, and balance inquiries.",
    difficulty: "Medium",
    estimatedTimeMinutes: 40,
    tags: ["State Machine", "OOP Basics"],
    problemStatement:
      "Design an ATM machine that authenticates a user via card and PIN, and supports withdrawal, deposit, and balance inquiry operations while managing its own cash inventory.",
    functionalRequirements: [
      "A user authenticates using a card number and PIN.",
      "The user can withdraw cash in valid denominations, subject to account balance and ATM cash availability.",
      "The user can deposit cash or check balance.",
      "The ATM tracks its own available cash by denomination.",
      "Incorrect PIN attempts beyond a limit should lock the card.",
    ],
    assumptions: [
      "Bank-side account verification can be modeled as a service interface, not a real bank integration.",
      "Only a single ATM instance is modeled.",
    ],
    expectedDesignAreas: [
      "ATM state machine (idle, authenticating, transaction, dispensing)",
      "Cash dispensing algorithm across denominations",
      "Separation between ATM hardware state and account/banking logic",
    ],
    submissionExpectations: [
      "Describe the withdrawal flow step by step.",
      "Explain how denomination dispensing is decided.",
    ],
  },
  {
    id: "prob_snake_and_ladder",
    slug: "snake-and-ladder",
    title: "Snake and Ladder",
    shortDescription:
      "Design a multiplayer Snake and Ladder board game with dice rolls, snakes, and ladders.",
    difficulty: "Easy",
    estimatedTimeMinutes: 30,
    tags: ["Game Design", "OOP Basics"],
    problemStatement:
      "Design a Snake and Ladder game for 2 or more players on a 100-cell board with a configurable set of snakes and ladders.",
    functionalRequirements: [
      "Players take turns rolling a dice and moving forward.",
      "Landing on a snake's head moves the player down to its tail.",
      "Landing on a ladder's bottom moves the player up to its top.",
      "The first player to reach the final cell wins.",
      "The board's snakes and ladders should be configurable, not hardcoded.",
    ],
    assumptions: [
      "Dice can be modeled as a simple random number generator (1-6).",
      "No real-time multiplayer networking is required.",
    ],
    expectedDesignAreas: [
      "Board, Snake, Ladder modeling",
      "Player turn management",
      "Move resolution (dice roll -> snake/ladder application -> win check)",
    ],
    submissionExpectations: [
      "Describe how a player's move is resolved on the board.",
      "Explain how snakes/ladders are configured without hardcoding cell numbers in game logic.",
    ],
  },
  {
    id: "prob_bookmyshow",
    slug: "bookmyshow",
    title: "BookMyShow",
    shortDescription:
      "Design a movie ticket booking system covering theatres, shows, seat selection, and concurrent booking safety.",
    difficulty: "Hard",
    estimatedTimeMinutes: 60,
    tags: ["Concurrency", "Strategy Pattern", "Booking Systems"],
    problemStatement:
      "Design a movie ticket booking platform like BookMyShow. Users browse movies playing in a city, pick a showtime, select seats, and complete a booking. The design must prevent two users from booking the same seat.",
    functionalRequirements: [
      "Users can search movies by city and see available shows.",
      "Each show has a seating layout with seat categories (e.g., Silver, Gold, Premium).",
      "Users select seats and proceed to payment.",
      "The system must prevent double-booking of the same seat for the same show.",
      "A booking can be cancelled, releasing the seats.",
    ],
    assumptions: [
      "Payment gateway integration can be modeled as an interface/mock.",
      "Seat locking during checkout can be described conceptually (e.g., temporary hold with timeout).",
    ],
    expectedDesignAreas: [
      "Movie, Theatre, Show, Seat, Booking relationships",
      "Seat locking / concurrency-safety strategy",
      "Pricing by seat category",
    ],
    submissionExpectations: [
      "Explain how the design prevents two users from booking the same seat.",
      "Describe the seat-hold-then-confirm flow.",
    ],
  },
];
