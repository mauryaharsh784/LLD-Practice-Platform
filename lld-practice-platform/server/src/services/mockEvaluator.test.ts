import { describe, expect, it } from "vitest";
import { mockEvaluate } from "./mockEvaluator";
import { problems } from "../data/problems";
import { DesignSubmission } from "../types/domain";

const parkingLot = problems.find((p) => p.slug === "parking-lot")!;

describe("mockEvaluate", () => {
  it("scores a thin submission low across most dimensions", () => {
    const thin: DesignSubmission = {
      requirementsAndAssumptions: "",
      classes: [],
      relationships: [],
      designExplanation: "",
      pseudocode: "",
    };
    const result = mockEvaluate(parkingLot, thin);
    expect(result.overallScore).toBeLessThan(30);
    expect(result.missingConcepts.length).toBeGreaterThan(0);
  });

  it("scores a well-structured submission notably higher than a thin one", () => {
    const rich: DesignSubmission = {
      requirementsAndAssumptions:
        "Parking lot has multiple floors, each with spots sized for motorcycle/car/bus. Vehicles enter through a gate, get assigned a suitable spot, and receive a ticket. Payment is calculated on exit based on duration and vehicle type.",
      classes: [
        { name: "ParkingLot", responsibility: "coordinates floors and delegates spot allocation", attributes: "floors", methods: "parkVehicle" },
        { name: "Floor", responsibility: "owns the parking spots on one level", attributes: "spots", methods: "findAvailableSpot" },
        { name: "ParkingSpot", responsibility: "tracks occupancy for a single spot", attributes: "size, isOccupied", methods: "assign, release" },
        { name: "SpotAllocationStrategy", responsibility: "decides which spot to assign, independent of ParkingLot", attributes: "", methods: "selectSpot" },
      ],
      relationships: [
        { classA: "ParkingLot", relationshipType: "composition", classB: "Floor" },
        { classA: "Floor", relationshipType: "composition", classB: "ParkingSpot" },
        { classA: "ParkingLot", relationshipType: "dependency", classB: "SpotAllocationStrategy" },
      ],
      designExplanation:
        "ParkingLot delegates spot selection to a SpotAllocationStrategy interface so a new allocation rule can be introduced without modifying ParkingLot. This keeps the design open for extension while composition models the true ownership of floors and spots.",
      pseudocode: "function parkVehicle(vehicle):\n  floor = pickFloor(vehicle)\n  spot = strategy.selectSpot(floor, vehicle)\n  spot.assign(vehicle)",
    };
    const result = mockEvaluate(parkingLot, rich);
    expect(result.overallScore).toBeGreaterThan(65);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("references the learner's actual class names in class-modeling feedback", () => {
    const submission: DesignSubmission = {
      requirementsAndAssumptions: "some requirements text that is reasonably descriptive of the problem",
      classes: [
        { name: "Elevator", responsibility: "tracks its own state and moves between floors", attributes: "currentFloor", methods: "moveTo" },
        { name: "ElevatorController", responsibility: "dispatches requests to elevators", attributes: "", methods: "dispatch" },
      ],
      relationships: [{ classA: "ElevatorController", relationshipType: "association", classB: "Elevator" }],
      designExplanation: "The controller dispatches requests using a strategy that can be swapped without changing Elevator.",
      pseudocode: "",
    };
    const result = mockEvaluate(parkingLot, submission);
    const classModeling = result.dimensions.find((d) => d.name === "Class Modeling")!;
    expect(classModeling.feedback).toContain("Elevator");
  });
});

describe("problems data", () => {
  it("has 8 seeded problems, each with required fields", () => {
    expect(problems.length).toBe(8);
    for (const p of problems) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.functionalRequirements.length).toBeGreaterThan(0);
      expect(["Easy", "Medium", "Hard"]).toContain(p.difficulty);
    }
  });
});
