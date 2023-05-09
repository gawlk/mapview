# MapView

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Required

- a functional node environment ([Node.JS](https://nodejs.org/) 16 or higher)
- [pnpm](https://pnpm.io/installation)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## First launch

1. Clone it from the project repo (favorite passing by [ssh](https://gitlab.com/-/profile/keys))
2. Install dependencies by running:

```
pnpm install
```

3. run the project with the command

```
pnpm dev
```

## Type check

A command was created to check the quality of your TS:

```
pnpm check
```

This check is realise before each push by git hook

If you need it you can skip this step by adding `--no-verify` to your git command

## Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test
```

## Build project

To build the project run:

```
pnpm build
```

## Prod preview

You can have a preview of what you will get in prod by doing this command:

```
pnpm prod
```

## test

### Add reference files

The current test motor for export, read all files in the folder `files/`  
create a subfolder, and put all the export to test in.  
a `.mpvz` files is required for the test to work.

### Add an extendMatcher

1. Create your matcher on folder `src/extendMatchers`
2. add the new file in [vite config file](./vite.config.js) in test/setupFiles array

## Netlify

### Known problems

#### RollupError: Could not resolve .\*Configurations.\*

The rollup version used in Netlify (as of 2023/05/09) will crash like so:

```
Could not resolve "./components/dialogConfigurations" from "src/routes/index/components/bar/components/menuProject/index.tsx"
file: /opt/build/repo/src/routes/index/components/bar/components/menuProject/index.tsx
error during build:
RollupError: Could not resolve "./components/dialogConfigurations" from "src/routes/index/components/bar/components/menuProject/index.tsx"
    at error (file:///opt/build/repo/node_modules/.pnpm/rollup@3.21.5/node_modules/rollup/dist/es/shared/node-entry.js:2125:30)
    at ModuleLoader.handleInvalidResolvedId (file:///opt/build/repo/node_modules/.pnpm/rollup@3.21.5/node_modules/rollup/dist/es/shared/node-entry.js:23938:24)
    at file:///opt/build/repo/node_modules/.pnpm/rollup@3.21.5/node_modules/rollup/dist/es/shared/node-entry.js:23900:26
```

if there is `Configurations` in a path.

You can fix this simply by changing `Configuration` to `Config` or anything else.
