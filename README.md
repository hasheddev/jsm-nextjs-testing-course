# jsm-nextjs-testing-course

This repository serves as the central workspace for notes, transcripts, and starter code for the JavaScript Software Testing course. It covers modern testing methodologies, strategies (Pyramid, Trophy, Diamond), and essential tools for both frontend and backend development.

## 🚀 Quick Start

The course uses Node.js/npm for its environment.

1.  **Install Dependencies:** Navigate to the root of the repo and install all required packages.
    ```bash
    npm install
    ```
2.  **Start Working:** Navigate to the relevant section subdirectory (e.g., `unit-testing-01-starter-form`) to begin the exercise.

---

## 📂 Repository Structure

| Path                            | Contents                                                        | Purpose                                                 |
| :------------------------------ | :-------------------------------------------------------------- | :------------------------------------------------------ |
| `unit-testing-01-starter-form/` | Starter code for specific lessons (e.g., Profile Form testing). | Contains the base code required for specific exercises. |
| `tests.*.txt`                   | Raw transcripts and detailed notes on concepts and tools.       | Reference for detailed definitions and comparisons.     |
| `package.json`                  | Project dependencies (Jest, RTL, Supertest, etc.).              | Defines the tools used throughout the course.           |

---

## 🧪 Deep Dive: Testing Theory & Strategy

This section covers the core theoretical concepts that underpin modern software testing: the four key dimensions, the definitions of test scopes, and the popular strategic models used in development.

### 1. The Four Dimensions of a Complete Testing Strategy

All four connect to form a complete testing strategy:

1.  **Scope:** Unit, Component, Integration, End-to-End
2.  **Knowledge:** Black Box, White Box, Gray Box
3.  **Purpose:** Functional, Non-Functional
4.  **Execution:** Manual, Automated

### 2. Testing by Scope: The Focus of Testing

Scope decides the focus of testing—how much of the system is being tested at once.

| Scope                        | Description & Key Strengths                                                                                                                                                                                              | Limitations & When to Avoid                                                                                         |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Unit Testing**             | Examines the smallest testable part in complete isolation. Precise, fast, excels at catching logic errors, business logic, algorithms, and data transformation.                                                          | Limited by isolation (due to mocking). Not great for UI, network communications, or complex cross-system workflows. |
| **Component Testing**        | Tests a self-contained UI piece (logic + presentation). Simulates user interaction and verifies behavior within context. Tests user perception and is relatively isolated.                                               | Requires simulating context (props, state, UI interactions).                                                        |
| **Integration Testing**      | Tests two or more locked components/systems/services working together. Complex to manage due to system quirks.                                                                                                           | Complexity and overhead due to managing system interactions.                                                        |
| **End-to-End (E2E) Testing** | Most complex, expensive, and costly. Uses real browser automation, network requests, and external services to test the app as a user experiences it (full workflows). Focuses on critical, business-affecting workflows. | Breaks if any system fails. Expensive to maintain; changes may break multiple tests. Slowest feedback loop.         |

### 3. Testing by Knowledge: Internal Visibility

Deals with how much you know about the internal workings of the system, which affects the type of bugs caught and how tests are written.

| Knowledge     | Description                                                                                                                                                        | Use Cases & Benefits                                                                                                                                       | Maintenance Risk                                                                                    |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| **Black Box** | Customer perspective; focus entirely on input and output (external perspective). Internal working is of no concern.                                                | Stable for long-term maintenance. Forces developers to think from a user perspective. Catches confusing errors, unexpected behavior, and missing features. | Limited for edge cases and internal error/state testing.                                            |
| **White Box** | Full knowledge of internal structure, logic, and implementation. Tests code paths, algorithms, and internal logic. Excels at thorough code testing and edge cases. | Great for testing algorithms, data structures, security functions, and core business logic.                                                                | Tightly coupled with implementation; may break easily on refactoring; creates maintenance overhead. |
| **Gray Box**  | Mix of black and white. Test with some knowledge of internal working but primarily from an external perspective.                                                   | Allows for more targeted testing for riskiest areas and use of realistic test data. Relatively stable. Works well for integration testing.                 |                                                                                                     |

### 4. Testing by Purpose & Execution

#### Purpose (Why We Test)

**Functional Testing:** Verifies software performs according to requirements.

- **Smoke Testing:** Quick, high-level test for most critical functionalities; first test after deploying code.
- **Sanity Testing:** Tests if small changes do not affect the functioning of the affected area; catches regressions quickly.
- **Regression Testing:** Tests if existing functionality does not break due to new features; time consuming.
- **User Acceptance Test (UAT):** Actual users verify the system meets needs and expectations; reveals confusing workflows or integration issues.

**Non-Functional Testing:** Tests if apps work quickly, securely, and reliably.

- **Performance Testing:**
  - _Load Testing:_ Simulates normal usage.
  - _Stress Testing:_ Finds system breaking point due to overload.
  - _Volume Testing:_ Focuses on large data in the app.
- **Security Testing:** Authentication, input validation, encryption, basic security checks.
- **Usability Testing:** Checks how easy and pleasant the app is to use (navigation, form design, accessibility).
- **Compatibility Testing:** Ensures app works well across various environments.

#### Execution (How Tests Run)

- **Manual Testing:** Poking around the app (exploratory testing). Good for noticing UX issues and where people hesitate.
- **Automated Testing:** Hands tests to software tools. Fast, consistent, and scalable. Great for regression testing.
  - _Tools:_ Jest, Mocha (Unit), Playwright, Cypress (Browser/E2E), Jenkins, GitHub Actions (CI/CD).

### 5. Testing Strategies: Patterns for Reliability

Strategies address under-test (missing critical bugs) or over-test (slow, brittle tests) by providing patterns for resource allocation and building effective test suites.

| Strategy               | Structure                                                                                                                          | Core Principle                                                                                                                                     | Best Fit / Notes                                                                                                                               |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Testing Pyramid**    | Lots of Unit Tests (Base) -> Some Integration Tests (Mid) -> Few Acceptance (E2E) Tests (Top).                                     | Economic reality: speed, cost, and confidence are mathematically related. Cost of failure increases up the pyramid.                                | Apps with heavy business logic (finance, science), and TDD practitioners.                                                                      |
| **Ice Cream Cone**     | **Anti-Pattern:** Lots of E2E (Base) -> Barely any Unit Tests (Top).                                                               | Ignores the real-world cost of running tests. Feedback becomes slow, debugging is hard, creates false confidence.                                  | **Avoid at all costs.**                                                                                                                        |
| **The Testing Trophy** | Static Analysis (Base) -> Smaller Unit Tests -> **Largest layer: Integration Tests** -> Few E2E Tests (Top).                       | Most modern web app bugs occur at integration boundaries (service boundaries, API data transfer). Integration tests are realistic and fast enough. | Modern frontend-heavy apps (React, Vue, Angular) with simple logic and complex integrations. Perfect for CI/CD.                                |
| **The Honeycomb**      | Recognizes modern apps are collections of services (microservices). Each service has its own optimal strategy based on complexity. | Test where it matters most for each individual component/service. Scales beautifully in microservice architectures.                                | Distributed and polyglot environments. Needs strong coordination and observability.                                                            |
| **Testing Diamond**    | Balanced approach: substantial Unit, Integration, and E2E layers. Still mostly Integration, but more E2E than the Trophy.          | Comprehensive testing and practical methodology. Works well when the cost of failure is high.                                                      | Medium-to-large SaaS platforms, E-commerce, or healthcare apps that need logic validation, strong integration, and critical workflow coverage. |

### 6. Strategy Selection and Evolution

The choice depends on the app, team, development style, and risk tolerance.

- **App Architecture:** Complex logic needs Unit Tests. Complex UI/integrations need Integration Tests. Critical workflows need E2E tests.
- **Risk Context:** If cost of failure is catastrophic (finance, healthcare), emphasize Unit Tests. For social/content apps, focus on UX/Integration.
- **Evolution:** Build a strategy that fits current needs but evolves over time. Measure impact (bugs caught, feedback loop speed) and adjust.

**Summary:** Focus where failures hurt most. Invest where tests give the best return on investment. Always make testing serve you and not slow you down.

---

_Tip: Use Docker for repeatable, reliable, and isolated tests, ensuring every test runs in the same environment._

## 🛠️ Essential Testing Tools Reference

This section outlines the key terminology and the major tools used across Unit, Frontend, Backend, and End-to-End testing in the JavaScript ecosystem.

### 1. Key Testing Terminology

| Term             | Definition                                                                                                                                                | Analogy                                                                          |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **Assertion**    | A statement that checks if a condition is true. The core check in any test.                                                                               | Asking a question like: "Is this value equal to 5?"                              |
| **Test Runner**  | The engine that executes tests, finds them, runs them in order, and reports pass/fail results.                                                            | The engine that runs the tests; without it, tests are just files.                |
| **Mocking**      | Creating fake versions of real dependencies (like network calls, database access, or services) to isolate the code being tested and prevent side effects. | A "mock" email service that pretends to send emails but doesn't actually do it.  |
| **Test Suite**   | A collection of related tests grouped together for organization.                                                                                          | Organizing tests into a folder (e.g., "Authentication Test Suite").              |
| **Test Fixture** | Pre-prepared, reusable data used by tests to ensure a consistent, predictable setup.                                                                      | A template of test data that can be copied for any test needing the same setup.  |
| **Coverage**     | A measurement (usually a percentage) of how much of your code is executed by your tests.                                                                  | If 100 lines of code execute 80, coverage is 80%. Helps identify untested areas. |

### 2. Unit Testing Tools (Runners and Assertions)

| Tool             | Type                                                         | Key Strengths                                                                                                                                    | Considerations                                                                                                                                       |
| :--------------- | :----------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Jest**         | All-in-one framework (Runner, Assertion, Mocking, Coverage). | "It just works" out of the box. Simple built-in mocking, clear errors, snapshot testing, parallel test runs. Maintained by Meta (used by React). | Can be slower than lighter-weight runners for very large test suites due to sandboxing overhead. Snapshot tests can be hard to maintain if overused. |
| **Vitest**       | Newer, fast runner built for modern JS/Vite/ES Modules.      | Extremely fast test runs, excellent TypeScript support, smooth integration with Vite, Jest-compatible API (easy migration).                      | Newer framework; fewer community resources and examples. Tooling for reporting and IDE integration is less mature.                                   |
| **Mocha + Chai** | **Mocha:** Test Runner. **Chai:** Assertion Library.         | Very flexible and customizable. Large ecosystem of plugins. Allows for choosing specific libraries for specific needs.                           | Requires more setup and configuration; less beginner-friendly than all-in-one solutions.                                                             |

### 3. Frontend UI Testing Tools

| Tool                            | Focus                                                                                                                       | Key Benefit                                                                                                                                   | Contrast with Legacy (Enzyme)                                                                                                                                                  |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React Testing Library (RTL)** | **Behavioral Testing:** Focuses on what the user sees and does. Finds elements the way a user would (by text, label, role). | Makes tests more valuable and less fragile upon refactoring because they test the user experience, not implementation details (state, props). | **Enzyme (Deprecated):** Focused on testing component internals (state, props), leading to tests tightly coupled to implementation details that broke easily upon refactoring. |

#### Browser Simulation (Required for running RTL in Node.js)

| Tool          | Purpose                                                            | Comparison                                                                                       |
| :------------ | :----------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **JSDOM**     | Simulates a full browser environment in Node.js.                   | Older, more established, more complete simulation of browser APIs, but tends to be slower.       |
| **Happy DOM** | Newer alternative for simulating a browser environment in Node.js. | Significantly faster than JSDOM, but the full browser API surface is not yet completely covered. |

### 4. Backend API & HTTP Tools

| Tool                          | Focus                                                                               | Key Strengths                                                                                                                                       | Limitations & Use Case                                                                                                                                                               |
| :---------------------------- | :---------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supertest**                 | **Testing Node.js HTTP Servers** (e.g., Express).                                   | Provides a clean, fluent interface for making requests and asserting responses _directly_ in test code without manual server setup.                 | Node.js specific. Limited support for advanced HTTP features (WebSockets, streaming). Can be slower for huge test suites. **Use for:** Testing your own internal Node.js API routes. |
| **Axios**                     | Full-featured HTTP client (Node.js and browser).                                    | Fine-grained control over requests (headers, interceptors, timeouts). Great for testing real-world external APIs.                                   | More verbose than Supertest. Requires manual server management in testing. **Use for:** Testing external APIs or when advanced HTTP features are needed.                             |
| **Mock Service Worker (MSW)** | Intercepts HTTP requests at the network level and serves controlled mock responses. | Mocks API requests realistically in the browser or Node.js. Great for simulating various API states (success, error, loading) in integration tests. |                                                                                                                                                                                      |
| **Node Fetch**                | Brings the browser’s native `fetch()` API into Node.js.                             | Minimal, clean, familiar syntax. Good for simple HTTP testing and code parity.                                                                      | Extremely lightweight; lacks testing-specific features and assertion helpers. Requires manual server management.                                                                     |

### 5. Backend Database & Environment Tools

Backend testing requires speed, isolation, and production parity.

| Tool                   | Mechanism                                                                                                 | Key Benefits                                                                                                                                                                                                                            | When to Use                                                                                                                                |
| :--------------------- | :-------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **In-Memory Database** | Stores data in RAM; exists only while the program runs and vanishes instantly afterward.                  | **Speed** (no disk I/O), **Isolation** (each test gets a fresh database), **Simplicity** (no complex cleanup).                                                                                                                          | Great for unit and integration tests where production parity isn't strictly needed (e.g., using SQLite in memory).                         |
| **Testcontainers**     | Spins up real, isolated service instances (PostgreSQL, Redis, etc.) inside Docker containers for testing. | **Production Parity** (tests run against the exact same database versions/configs as production), **Reliability** (eliminates "works on my machine" issues), **Automation** (handles start, port mapping, and tear-down automatically). | When testing database-specific features or complex interactions between multiple services.                                                 |
| **Docker Compose**     | Defines and runs multi-container Docker applications using a YAML file.                                   | Good for defining shared, stable development environments.                                                                                                                                                                              | Less flexible per test; requires more manual orchestration (waiting for services, cleaning state) compared to programmatic Testcontainers. |

### 6. End-to-End (E2E) Testing Tools

E2E testing simulates complete user workflows using real browsers.

| Tool                   | Focus                                                   | Key Strengths                                                                                                                                                                                                            | Limitations                                                                                                                               |
| :--------------------- | :------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Playwright**         | Modern E2E automation tool (Microsoft).                 | **Reliability:** Automatically waits for elements. **Cross-Browser:** Supports Chrome, Firefox, Safari. **Developer Experience:** Provides trace files, step-by-step debugging, and screenshots. Runs tests in parallel. |                                                                                                                                           |
| **Cypress**            | E2E automation with focus on Developer Experience (DX). | **Visual Runner:** Real-time visual test runner with "time travel" debugging. Intuitive and top-notch documentation.                                                                                                     | Only supports Firefox and Chrome-based browsers. Has trouble with multi-tab or cross-domain scenarios (e.g., OAuth logins).               |
| **Selenium WebDriver** | The original browser automation tool.                   | Still valuable in large enterprise systems with existing Selenium-based test infrastructure. Supports complex browser versions.                                                                                          | Slower, harder to set up, requires more boilerplate code than newer tools. Debugging is more painful due to the older WebDriver protocol. |

## 🛑 Common Mistake: Confusing Runners with Scope

A crucial concept to grasp is the distinction between a **Test Runner** (the tool that executes code) and the **Test Scope** (what part of the system is being tested).

### The Universal Engine: Test Runners

**Jest, Vitest, and Mocha** aren’t just for unit testing. They’re test runners, and their job is simply to find your tests, run them, and show results. That’s it.

- **Scope Agnostic:** They don’t care what kind of tests you’re writing—functions, APIs, databases, or full systems. As long as it’s JavaScript and follows the right structure, they’re all good.
- **Universal Tool:** Think of them as a universal “test engine.” Whether you’re testing a small utility or a full system interaction, your test runner stays the same; it’s just the scope of your tests that changes.

### Applying Runners Across Scopes

| Scope                      | Runner Compatibility                              | Clarification                                                                                                                                                                                                                                                                                 |
| :------------------------- | :------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit Tests**             | **Perfect fit.**                                  | This is where these tools are most famous. They run fast and are easy to set up for small, isolated checks of logic (e.g., testing if `calculateTotal()` returns the right value).                                                                                                            |
| **Integration Tests**      | **Perfect fit.**                                  | When your code starts talking to other parts (e.g., API endpoint calling a database), you still use Jest, Vitest, or Mocha. You simply pair them with tools like Supertest (for Express APIs) or Testcontainers (for real databases). The runner stays the same.                              |
| **End-to-End (E2E) Tests** | **Technically possible, but highly inefficient.** | This is where the confusion lies. E2E testing needs browser automation (clicks, navigation, waiting for dynamic content). Jest/Mocha don't handle that directly. You’d have to add tools like Puppeteer or Playwright to make them work, which is "like using a screwdriver to hammer nails." |

### Why Dedicated E2E Tools Exist

Modern E2E frameworks like **Playwright** and **Cypress** come with everything built in:

- Their own test runners.
- Browser controllers.
- Screenshot/video utilities.
- Automatic waiting strategies.

They are designed from the ground up to handle full user workflows and not just isolated code execution.
