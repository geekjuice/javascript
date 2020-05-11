# style

> style

personal style guide and configuration manager

features include:

- **minimal dependency management.** package come pre-bundled with:
  - [`eslint`](https://eslint.org)
  - [`prettier`](https://prettier.io)
  - [`husky`](https://github.com/typicode/husky)
  - [`lint-staged`](https://github.com/okonet/lint-staged)
- **sensible configurations.** consistent styles and process that just work™
- **javascript and typescript.** configured to handle both
- **opinionated.** because personal :man_shrugging:

## getting started

to start the guided setup process:

```sh
❯ npx @geekjuice/style init
```

or fire and forget:

```sh
❯ npx @geekjuice/style init --yes
```

## commands

### `init`

this command is used to initially setup your project by:

- updating your `package.json` to include the necessary dependencies and scripts
- adding (or replacing) the following configuration files:
  - `.eslintrc.js` - can also extend `node` and `react` variants
  - `.prettierrc.js`
  - `.huskyrc.js`
  - `.lintstagedrc.js`
- running `npm install` to have your project ready to go

the command can be re-run to set your project up again or pick up updates.

### `check`

used to check files for linting and formatting issues without actually making changes. underneath the hood this command is running the following in parallel:

- `eslint` against all javascript and typescript files unless files specified
- `prettier --check` against many supported file types unless files specified

### `fix`

similar to `check`, but will attempt to fix problems if possible. underneath the hood this command is running the following in serial:

- `eslint --fix` against all javascript and typescript files unless files specified
- `prettier` against many supported file types unless files specified

running this command with `--dry` flag will delegate it back to the `check` command.

## credit

- [google/gts](https://github.com/google/gts)
- [standard/standard](https://github.com/standard/standard)

## license

[mit](license) - copyright © [nicholas hwang](https://undefined.engineer)
