# Contributing to Lexiform

First off, thank you for considering contributing to Lexiform! It's people like you that make Lexiform such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/lexiform.git
   cd lexiform
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the local demo environment**:
   ```bash
   npm run demo
   ```
   This will start the Next.js demo app where you can test your changes to the editor.

## Development Workflow

Lexiform uses `tsup` for bundling. 

If you make changes to the `src/` directory, you should run the build command to ensure your changes are compiled:
```bash
npm run build
```
During active development, you can use the watch command:
```bash
npm run dev
```

### Making Changes
- Create a new branch for your feature or bugfix: `git checkout -b feature/my-awesome-feature`
- Make your changes and test them in the `demo/` environment.
- Follow the existing code style (we use ESLint and TypeScript).
- Write clear, descriptive commit messages.

### Pull Requests
1. Push your branch to your fork: `git push origin feature/my-awesome-feature`
2. Open a Pull Request against the `main` branch.
3. Fill out the Pull Request template completely.
4. Wait for review! A maintainer will review your code and may request some changes.

## Reporting Bugs

When reporting a bug, please include:
* A clear and descriptive title.
* Steps to reproduce the bug.
* Expected behavior vs actual behavior.
* Details about your environment (OS, Browser, React version).

## Suggesting Enhancements

We welcome feature requests! Please provide:
* A clear description of the feature.
* The problem it solves.
* Any potential alternatives you've considered.

Thank you for contributing!
