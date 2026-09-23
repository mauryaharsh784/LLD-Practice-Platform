import { store, DEMO_USER } from "./repository";
import { mockEvaluate, newId } from "../services/mockEvaluator";
import { DesignSubmission } from "../types/domain";

const parkingLotAttempt1: DesignSubmission = {
  requirementsAndAssumptions:
    "Parking lot with multiple floors. Vehicles enter and get a spot. Ticket created. Payment on exit.",
  classes: [
    { id: "c1", name: "ParkingLot", responsibility: "manages everything", attributes: "floors", methods: "parkVehicle" },
    { id: "c2", name: "Vehicle", responsibility: "represents a vehicle", attributes: "type, number", methods: "" },
  ],
  relationships: [{ id: "r1", classA: "ParkingLot", relationshipType: "aggregation", classB: "Vehicle" }],
  designExplanation: "ParkingLot handles parking a vehicle by finding a free spot and creating a ticket.",
  pseudocode: "",
};

const parkingLotAttempt2: DesignSubmission = {
  requirementsAndAssumptions:
    "Parking lot has multiple floors, each with spots sized for motorcycle/car/bus. Vehicles enter through a gate, get assigned the smallest suitable spot, and receive a ticket with entry time. On exit, a payment is calculated from duration and vehicle type. Assumption: pricing is a flat hourly rate per vehicle type.",
  classes: [
    { id: "c1", name: "ParkingLot", responsibility: "coordinates floors and delegates spot allocation", attributes: "floors: Floor[]", methods: "parkVehicle(vehicle), unparkVehicle(ticket)" },
    { id: "c2", name: "Floor", responsibility: "owns a set of parking spots on one level", attributes: "spots: ParkingSpot[]", methods: "findAvailableSpot(type)" },
    { id: "c3", name: "ParkingSpot", responsibility: "tracks whether a single spot is occupied and by what size vehicle", attributes: "size, isOccupied", methods: "assign(vehicle), release()" },
    { id: "c4", name: "Vehicle", responsibility: "represents a vehicle and its size category", attributes: "licensePlate, type", methods: "" },
    { id: "c5", name: "Ticket", responsibility: "records entry details for a parked vehicle", attributes: "entryTime, spotId", methods: "" },
    { id: "c6", name: "SpotAllocationStrategy", responsibility: "decides which spot to assign for a given vehicle, independent of ParkingLot", attributes: "", methods: "selectSpot(floor, vehicle)" },
  ],
  relationships: [
    { id: "r1", classA: "ParkingLot", relationshipType: "composition", classB: "Floor" },
    { id: "r2", classA: "Floor", relationshipType: "composition", classB: "ParkingSpot" },
    { id: "r3", classA: "ParkingSpot", relationshipType: "association", classB: "Vehicle" },
    { id: "r4", classA: "ParkingLot", relationshipType: "dependency", classB: "SpotAllocationStrategy" },
  ],
  designExplanation:
    "ParkingLot no longer decides which spot to assign directly — it delegates to a SpotAllocationStrategy interface, so a new allocation rule (e.g. nearest-to-entrance) can be added without touching ParkingLot. Floor owns its ParkingSpots via composition since spots don't make sense outside a floor. A Ticket is created on entry and consulted on exit to compute payment.",
  pseudocode:
    "function parkVehicle(vehicle):\n  floor = floors.find(f => f.hasAvailableSpot(vehicle.type))\n  spot = strategy.selectSpot(floor, vehicle)\n  spot.assign(vehicle)\n  return new Ticket(spot.id, now())",
};

export function seedSampleAttempts() {
  const problem = store.getProblem("prob_parking_lot")!;

  const attempt1 = store.createAttempt({
    userId: DEMO_USER.id,
    problemId: problem.id,
    attemptNumber: 1,
    submission: parkingLotAttempt1,
    status: "evaluated",
  });
  const eval1 = mockEvaluate(problem, parkingLotAttempt1);
  store.saveEvaluation({
    ...eval1,
    id: newId("eval"),
    attemptId: attempt1.id,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  });

  const attempt2 = store.createAttempt({
    userId: DEMO_USER.id,
    problemId: problem.id,
    attemptNumber: 2,
    submission: parkingLotAttempt2,
    status: "evaluated",
  });
  const eval2 = mockEvaluate(problem, parkingLotAttempt2);
  store.saveEvaluation({
    ...eval2,
    id: newId("eval"),
    attemptId: attempt2.id,
    createdAt: new Date().toISOString(),
  });
}

// Allow running as a standalone script too: `npm run seed`
if (require.main === module) {
  seedSampleAttempts();
  console.log("Seeded sample attempts for demo user.");
}
