# CI pipeline reference

Reference material for automating the deploy described in `SKILL.md`. Nothing here is active — copy it into `.github/workflows/` only when the user asks for it.

## One-time cluster setup

CI must not authenticate as a human user. Create a service account scoped to the target project:

```bash
PROJECT=$(oc project -q)
oc create serviceaccount deployer -n "$PROJECT"
oc policy add-role-to-user edit -z deployer -n "$PROJECT"

# Long-lived token (OpenShift 4.11+ no longer auto-creates one)
oc create token deployer -n "$PROJECT" --duration=8760h
```

Store as GitHub repository secrets:

| Secret | Value |
| --- | --- |
| `OPENSHIFT_SERVER` | `oc whoami --show-server` |
| `OPENSHIFT_TOKEN` | the token printed above |
| `OPENSHIFT_NAMESPACE` | the project name |

## Image registry

GHCR packages are private by default, so the cluster needs a pull secret linked to the service account that runs the pods:

```bash
oc create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io \
  --docker-username=<github-user> \
  --docker-password=<PAT with read:packages>

oc secrets link default ghcr-pull --for=pull
```

Linking to the `default` service account matters: the chart intentionally has no `imagePullSecrets` value, so the secret must be attached at the service-account level. Making the package public instead removes this step entirely.

## Workflow

```yaml
name: deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io/${{ github.repository_owner }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Set image tag
        run: echo "TAG=$(git rev-parse --short HEAD)" >> "$GITHUB_ENV"

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push api
        uses: docker/build-push-action@v6
        with:
          context: .
          file: Dockerfile.api
          push: true
          tags: ${{ env.REGISTRY }}/park-explorer-api:${{ env.TAG }}

      - name: Build and push web
        uses: docker/build-push-action@v6
        with:
          context: .
          file: Dockerfile.web
          push: true
          tags: ${{ env.REGISTRY }}/park-explorer-web:${{ env.TAG }}

      - uses: redhat-actions/oc-login@v1
        with:
          openshift_server_url: ${{ secrets.OPENSHIFT_SERVER }}
          openshift_token: ${{ secrets.OPENSHIFT_TOKEN }}
          namespace: ${{ secrets.OPENSHIFT_NAMESPACE }}

      - uses: azure/setup-helm@v4

      - name: Lint chart
        run: helm lint helm/park-explorer

      - name: Deploy
        run: |
          helm upgrade --install park-explorer helm/park-explorer \
            --namespace "${{ secrets.OPENSHIFT_NAMESPACE }}" \
            --set image.registry="${{ env.REGISTRY }}" \
            --set image.api.tag="${{ env.TAG }}" \
            --set image.web.tag="${{ env.TAG }}" \
            --atomic --timeout 10m

      - name: Smoke test
        run: |
          HOST=$(oc get route park-explorer-web -o jsonpath='{.spec.host}')
          curl -sf "https://$HOST/trpc/parks.getParks" > /dev/null
```

## Notes

- The build context is the repo root for both images — `apps/web` compiles against `apps/api`'s generated types, so a narrower context breaks the build.
- `--atomic` makes a failed rollout self-reverting, so a red pipeline leaves the previous release running rather than a half-applied one.
- The smoke test is the meaningful gate: it proves Route → nginx → api → Postgres works, which a green `helm upgrade` alone does not.
- Migrations run as an initContainer on the api pod, so the pipeline needs no migration step. A migration that fails will hold the pod in `Init:`, `--atomic` will time out, and the release rolls back — but the schema change may already be applied. Forward-fix rather than assuming rollback restored the database.
- CI cannot recover the generated Postgres password; it is created on first install and preserved across upgrades via the chart's `lookup`. Set `postgresql.auth.password` from a secret if the pipeline itself needs it.
