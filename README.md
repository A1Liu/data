# data

- k3s in EC2 t4g.nano - may never actually do this lmao
- postgres + golang GQL thing
- skaffold + helm (`infra/`, one chart per service in `infra/charts/`)
- Someday svelte? but not today
- kafka??
- https://www.npmjs.com/package/whisper-node

Tests w/ smthn similar to https://github.com/codepunkt/vitest-environment-prisma-postgres

## Commands

- `skaffold run -f infra/infra.yml`
- `skaffold dev -f infra/dev.yml`
- `k3d cluster start`
- `k3d cluster stop`
- `skaffold dev --port-forward`
- `kubectl get svc`
- `cd plugin && web-ext run`

## Resources

- Kubernetes/skaffold/etc setup
  - https://devopsspiral.com/articles/k8s/k3d-skaffold/
- https://github.com/crewjam/saml
- https://github.com/go-pkgz/auth

## JS Tools/Libraries
- React
- ahooks
- lodash
- zod
- zustand
- in-house:
  - @a1liu/js-utils
