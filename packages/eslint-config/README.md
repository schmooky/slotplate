# @slotplate/eslint-config

## Overview

This package offers a comprehensive set of ESLint configurations tailored for various development scenarios. Whether
you're working on a library, a Next.js project, or a React application, we've got you covered. Additionally, we provide
a shareable configuration specifically optimized for game development.

## Internal ESLint Configurations:

- `library.js`:Configuration for developing libraries.
- `next.js`:Configuration optimized for Next.js projects.
- `react-internal.js`:Configuration tailored for internal React projects.

## Game Share ESLint Configuration

- `game.js`:Shareable configuration optimized for game development.

## Installation

To get started with using our ESLint configurations, follow these steps:

1. Install the Main Package and Dependencies

- Use `npx install-peerdeps` to install the main package along with the correct versions of each package listed in
  peerDependencies:

```sh
$ npx install-peerdeps --dev @slotplate/eslint-config
```

- Alternatively, install only the main package:

```sh
$ npm install --dev @slotplate/eslint-config
```

- You can find the correct versions of each package by running:

```sh
$ npm info "@slotplate/eslint-config@latest" peerDependencies
```

2. Configure ESLint

- Add the ESLint configuration to your .eslintrc.js file. You can choose from two options:

```json
{
  "extends": [
    "@slotplate/eslint-config"
  ]
}
```

3. Enjoy Clean and Consistent Code

- With the configurations in place, you're all set to enjoy the beauty of well-maintained code!

