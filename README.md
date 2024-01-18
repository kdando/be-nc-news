# NCNews API

A backend service for accessing data programmatically.

**Hosted version:** [https://ncnews-lh66.onrender.com/]

**Summary of available endpoints:** [https://ncnews-lh66.onrender.com/api]

---

The API connects to a PostgreSQL database and provides various endpoints for serving data to frontend. Built to MVC principles around 4 datasets - articles, comments, topics and users.

---

### Requirements

Node.js 20.10.0, Postgres 3.4.3

---

### Setup

To run this project locally...

Clone the repo:

`git clone https://github.com/kdando/be-nc-news`

For security reasons .env files are not included. Create a .env.test and .env.development file at the root level of the repo. In each, set:

`PGDATABASE=name_of_intended_database`

To either the test or development database respectively.

This project uses jest, jest-extended, jest-sorted and supertest for testing. To install each as a dev dependency run this command:

`npm install -D name_of_library`

(For further detail on each see the following links) [https://jestjs.io/docs/getting-started] [https://jest-extended.jestcommunity.dev/docs/] [https://github.com/P-Copley/jest-sorted] [https://github.com/ladjs/supertest]

---

### Instructions

To get started, run:

`npm run setup-dbs`

This will create your databases.

The test suites are set to re-seed with test data before each test runs. To seed with development data run:

`npm run seed`

The database may then be queried through any of the endpoints available.

Note: Husky, installed as a dependency, will prevent pushing to git unless all tests pass.
