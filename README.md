# Next.js serverExternalPackages with monorepo

This repository is example for monorepo issue with `serverExternalPackages`.

Issue:

* When the `serverExternalPackages` in `next.config.ts` is set to a workspace name like `@my-project/common`, it should
  not be bundled into the server bundle. Current behavior is that it is bundled like all other local files.

To reproduce:

1. Check-out the repository.
2. Run `npm i`
3. Run `npm run build`
4. Observe that file `packages/ui/.next/server/app/page.js` contains database code instead of import from
   `@my-project/common`.
