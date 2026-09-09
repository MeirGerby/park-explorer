---
name: helm-openshift-deploy
description: Build, publish, and deploy Park Explorer to OpenShift using the Helm chart in helm/park-explorer. Use when deploying, shipping, releasing, or promoting a build; running helm install/upgrade/rollback; cutting a new image tag; or debugging a failed rollout (ImagePullBackOff, CrashLoopBackOff, stuck migrations, pending PVC, Route not serving) on OpenShift.
---

# Deploying Park Explorer to OpenShift

The chart lives at `helm/park-explorer` and deploys three components in one release: `web` (nginx serving the Vite build), `api` (NestJS/tRPC), and `postgresql` (a StatefulSet). Migrations run automatically as an initContainer on the api pod — there is no separate migration step to invoke.

## 1. Preconditions

Run these checks before anything else; stop and report if one fails rather than guessing.

```bash
oc whoami                 # not logged in -> ask the user to `oc login`, do not attempt to authenticate for them
oc project -q             # confirm the target project/namespace
helm version              # missing -> see "Helm not installed" below
```

Never run a deploy against a project the user did not name or confirm. `oc project -q` returning something unexpected is a stop-and-ask, not a proceed.

## 2. Choose how images reach the cluster

The chart does not build images. Decide the delivery path **once**, then stay on it:

```bash
oc get route default-route -n openshift-image-registry 2>/dev/null
```

- **Route exists** → push directly to the internal registry (§3a).
- **No route** (typical on Red Hat Developer Sandbox, where the registry is not exposed for external push) → either build in-cluster from the repo (§3b) or push to an external registry such as `ghcr.io`/`quay.io` and set `image.registry` to it. Ask the user which they want before picking.

Always tag with something immutable — `TAG=$(git rev-parse --short HEAD)`. Do not deploy `:latest`: the chart's `pullPolicy` is `IfNotPresent`, so a node that already cached `latest` will silently keep running the old image.

### 3a. Build locally and push to the internal registry

```bash
TAG=$(git rev-parse --short HEAD)
PROJECT=$(oc project -q)
REGISTRY=$(oc get route default-route -n openshift-image-registry -o jsonpath='{.spec.host}')

docker login -u "$(oc whoami)" -p "$(oc whoami -t)" "$REGISTRY"
docker build -f Dockerfile.api -t "$REGISTRY/$PROJECT/park-explorer-api:$TAG" .
docker build -f Dockerfile.web -t "$REGISTRY/$PROJECT/park-explorer-web:$TAG" .
docker push "$REGISTRY/$PROJECT/park-explorer-api:$TAG"
docker push "$REGISTRY/$PROJECT/park-explorer-web:$TAG"
```

Deploy with the **internal** service address (pods pull from inside the cluster, not via the external route):

```
--set image.registry=image-registry.openshift-image-registry.svc:5000/$PROJECT
```

### 3b. Build in-cluster (no external registry access)

```bash
TAG=$(git rev-parse --short HEAD)
for app in api web; do
  oc new-build --name="park-explorer-$app" --binary --strategy=docker \
    --dockerfile-path="Dockerfile.${app}" 2>/dev/null || true
  oc start-build "park-explorer-$app" --from-dir=. --follow
  oc tag "park-explorer-$app:latest" "park-explorer-$app:$TAG"
done
```

Then deploy with `--set image.registry=image-registry.openshift-image-registry.svc:5000/$(oc project -q)`.

Note: the build context is the whole repo (both Dockerfiles need the monorepo — `apps/web` builds against `apps/api`'s compiled types). `.dockerignore` keeps `node_modules`/`dist` out of the upload.

## 4. Deploy

Always render and lint before applying:

```bash
helm lint helm/park-explorer
helm template park-explorer helm/park-explorer --set image.registry=... --set image.api.tag=$TAG --set image.web.tag=$TAG
```

Then:

```bash
helm upgrade --install park-explorer helm/park-explorer \
  --namespace "$(oc project -q)" \
  --set image.registry="image-registry.openshift-image-registry.svc:5000/$(oc project -q)" \
  --set image.api.tag="$TAG" \
  --set image.web.tag="$TAG" \
  --atomic --timeout 10m
```

`--atomic` rolls back automatically if the release does not become ready, which is what you want for an unattended deploy. Pass image tags explicitly on every upgrade; avoid `--reuse-values`, which silently pins old chart defaults when the chart changes.

Rendering caveat: `helm template` and client-side `--dry-run` cannot run the chart's `lookup`, so the rendered Secret shows a **freshly generated** postgres password. That is a rendering artifact, not a rotation — a real `helm upgrade` reads the existing Secret back. Use `--dry-run=server` if you need to see the true value.

## 5. Verify

```bash
oc rollout status deploy/park-explorer-api --timeout=5m
oc rollout status deploy/park-explorer-web --timeout=5m
oc get pods -l app.kubernetes.io/instance=park-explorer
oc logs deploy/park-explorer-api -c migrate      # migration initContainer output
curl -sf "https://$(oc get route park-explorer-web -o jsonpath='{.spec.host}')/trpc/parks.getParks"
```

The last command exercises the whole path end to end: Route → nginx → api Service → Postgres. A 200 with JSON means the deploy is genuinely good; a healthy-looking `oc get pods` alone does not prove that.

Optional seed data (safe to re-run; skips rows that already exist):

```bash
oc exec deploy/park-explorer-api -- sh -c "cd /app/packages/db && node_modules/.bin/tsx src/seed/index.ts"
```

## 6. Rollback

```bash
helm history park-explorer
helm rollback park-explorer <REVISION> --wait --timeout 10m
```

Rollback reverts manifests only. It does **not** undo a database migration — if a bad release migrated the schema, the previous image may not run against it. Check `oc logs deploy/park-explorer-api -c migrate` and say so explicitly rather than assuming a rollback is clean.

`helm uninstall` leaves the Postgres PVC behind (Kubernetes never garbage-collects `volumeClaimTemplates` claims). Reinstalling reattaches the existing data. To truly discard the database, delete `data-park-explorer-postgresql-0` deliberately — never as a shortcut to fix a broken deploy, and never without asking.

## Troubleshooting

Read this before inventing a fix; these are the failures this chart actually produces.

| Symptom | Cause | Fix |
| --- | --- | --- |
| api pod stuck `Init:0/1`, migrate container restarting | Postgres not ready yet | Expected for the first ~30s. If it persists, check the StatefulSet pod and the PVC. |
| migrate initContainer fails with a connection error | Wrong `DATABASE_URL`, or Postgres never started | `oc get pods -l app.kubernetes.io/component=postgresql`; check the `park-explorer-postgresql` Secret. |
| Postgres pod `CrashLoopBackOff` with permission/`initdb` errors | An image that assumes UID 999 (the official `postgres` image) was substituted | Keep `postgresql.image.repository` on the sclorg image — it is the one built for OpenShift's arbitrary-UID SCC. |
| web pod crashes on start, cannot bind or write | Plain `nginx` image instead of `nginx-unprivileged` | `Dockerfile.web` must stay on `nginxinc/nginx-unprivileged` (port 8080). |
| `ImagePullBackOff` | Wrong `image.registry`, or tag never pushed | Confirm with `oc get istag`. Remember `image.registry` applies only to api/web — the postgres image is fully qualified and deliberately independent of it. |
| PVC `Pending` | No default StorageClass, or quota exhausted | `oc get sc`; set `postgresql.persistence.storageClassName`. |
| Route serves the SPA but `/trpc` 502s | api Service unreachable from the web pod | The nginx ConfigMap templates the api Service name; confirm `oc get svc park-explorer-api` and re-check the rendered ConfigMap. |
| Pods rejected by SCC | A fixed `runAsUser`/`fsGroup` was added to the chart | Do not set them. OpenShift assigns both; the chart only sets `runAsNonRoot`, drops capabilities, and disables privilege escalation. |

## Helm not installed

Helm is not bundled with `oc`. Install it (`winget install Helm.Helm`, `choco install kubernetes-helm`, or `brew install helm`), or fetch a portable binary from `https://get.helm.sh` and invoke it by path. Do not install system-wide tooling without asking first.

## Running this in CI

For an automated pipeline (GitHub Actions building images and running the same `helm upgrade --install` against OpenShift with a service-account token), see `references/ci-pipeline.md`. It is reference material — nothing is wired into `.github/` unless the user asks.
