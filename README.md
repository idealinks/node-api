# communities-node-api

A [graphQL](https://graphql.org/learn/) api for communities built on [apollo-server](https://www.apollographql.com/docs/apollo-server/).

## Project Tools

- [TypeScript](https://www.typescriptlang.org/index.html) adds typings to JavaScript.
- [graphQL](https://graphql.org/learn/) an application query language that is different from REST
- [apollo-server](https://www.apollographql.com/docs/apollo-server/) - Apollo Server is the best way to quickly build a production-ready, self-documenting API for GraphQL
- [Jest](https://jestjs.io/) for unit testing.
- [tslint](https://palantir.github.io/tslint/) code linting for TypeScript.
- [Prettier](https://github.com/prettier/prettier) opinionated code formatter.
- [dotenv](https://github.com/motdotla/dotenv) helps manage environment variables from .env file

## Dependencies

You will need to ensure you have [Docker](https://docs.docker.com/) installed on you local machine.

- [Install Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
- [Install Docker for Windows](https://docs.docker.com/docker-for-windows/)

## Local Development (docker)

Once you have the docker dependencies installed run the following in the command line from the root of your project.

```bash
docker-compose up
```

This will run a local graphql server in a container that can be reached at [localhost:4000](http://localhost:4000). In dev mode the server will listen for file changes, and automatically restart. As long as `NODE_ENV!=production` hitting this url will serve [GraphQL Playground](https://github.com/prisma/graphql-playground) a graphical, interactive, in-browser GraphQL IDE.

> **NOTE:** If this is your first time running the `docker-compose up` command it will take a little longer as it will need to build the docker image.

To stop your local server (container) run the following:

```bash
docker-compose down
```

## Running bash commands from the container

Please run all bash(terminal) related commands from the `communities-react-app-dev` container. This includes:

- Installing new npm modules
- Running tests
- Generating types
- Pretty much all the scripts commands in the package.json file

The one exception to this rule is the below command that will open an interactive terminal for the `communities-node-api-dev` container. Once in this interactive terminal you can now run your commands the same as you would from your local terminal.

```bash
# run from your computer's terminal
npm run docker:exec
```

If successful you should see the following in your termianl:

```bash
# This is showing me logged in as root user.
root@7a1add952cb7:/usr/api
```

By default your working directory should be `usr/api`, which is the root directory for the **graphql** server. All commands should be run from here.

To exit the interactive terminal run the following:

```bash
exit
```

## Running Tests

> **NOTE:** These commands should be run from the container. See [Running bash commands from the container](#running-bash commands-from-the-container)

All unit tests are using [Jest](https://jestjs.io/).

Single test run:

```
npm test
```

Run in watch mode:

```
npm test -- --watch
```

## Recommendations

### IDE (Code Editor)

If you want to make your life easier I recommened using [VSCode](https://code.visualstudio.com/docs/setup/setup-overview) as your IDE when working on this project, and installing the following plugins. To install simply search for them in VSCode's built in extensions panel.

- [ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

This will ensure linting, and formatting issues are detected directly in your IDE as you code. If you chose to not use VSCode I'd recommend trying to find the same extensions, if available, in your IDE.

### Git

When committing, or pushing code please use the command line if possible. We have hooks setup that will lint your code on commit, and run the unit tests on push. These hooks may not run as expected when usig third party git tools that may be built into your IDE.
