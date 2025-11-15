# AGENTS.md

Project: **shoe-box** - Lightweight personal portfolio gallery

## Documentation Location
All implementation details, stack specifications, and architectural decisions are in `/docs`:

- `docs/STACK.md` - Technology stack and rationale
- `docs/IMPLEMENTATION.md` - Build plan, timeline, deployment
- `docs/FEATURES.md` - Feature specifications with visual mockups

## Mandatory Requirements
- Modern coding practices (ES6+, semantic HTML5, CSS Grid/Flexbox)
- Consistency across all files (naming, formatting, structure)
- Performance-first: optimize for weak server hardware
- Zero build complexity: runnable in <5 minutes on any machine

### Run instructions
Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) globally once, then every clone uses the pinned `.nvmrc` (Node 20.19.5):

```bash
nvm install    # installs the .nvmrc version
nvm use        # activates it in the current shell

npm install
npm run dev    # or npm run build
```

All project scripts source `scripts/_nvm-load.sh`, so they refuse to run if the wrong Node version is active. Dependencies always live in the local `node_modules/` folder (gitignored).
