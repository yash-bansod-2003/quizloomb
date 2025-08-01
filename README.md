# QuizLoom

This is a repository for the backend service of a Quiz application named QuizLoom, built using Node.js, Express.js, TypeScript, and PostgreSQL. The application is designed to be scalable and fault-tolerant, with a focus on providing a seamless user experience.

## Setup Installation

### TypeScript

First, install TypeScript using npm by running the following command:

```bash
npm install --save-dev typescript
```

Next, initialize TypeScript by running the following command: Yes

```bash
npx tsc --init
```

### Migrations

To generate the migrations with the help of TypeORM:

```bash
npm run migration:generate -- src/migrations/migration -d src/data-source.ts
```

To run generated migrations:

```bash
npm run migration:run -- -d src/data-source.ts
```
