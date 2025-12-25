import "@testing-library/jest-dom";
import { clearDB, connectDB, disconnectDB, isDBconnected } from "@/tests/config/db-integration";

jest.mock("@/auth", () => ({ auth: jest.fn(() => Promise.resolve({ user: null })) }));

beforeAll(async () => {
  await connectDB();
}, 30000);

beforeEach(async () => {
  if (isDBconnected()) await clearDB();
}, 10000);

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await disconnectDB();
});

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});
