# Park Explorer — Helm chart

Deploys `web`, `api`, and PostgreSQL as one release. Targets **OpenShift** specifically — see [OpenShift-specific decisions](#openshift-specific-decisions) below for why a few things aren't the "default" Kubernetes choice.

## Prerequisites

- An OpenShift project (`oc new-project park-explorer` or similar) you're logged into (`oc login`).
- The `api` and `web` images (from the repo-root `Dockerfile.api` / `Dockerfile.web`) pushed somewhere the cluster can pull from — e.g. OpenShift's internal registry.

## Building and pushing images to OpenShift's internal registry

```bash
oc registry login   # or: podman login -u $(oc whoami) -p $(oc whoami -t) $(oc registry info)

docker build -f Dockerfile.api -t park-explorer-api:latest .
docker build -f Dockerfile.web -t park-explorer-web:latest .

REGISTRY=$(oc registry info)
PROJECT=$(oc project -q)

docker tag park-explorer-api:latest $REGISTRY/$PROJECT/park-explorer-api:latest
docker tag park-explorer-web:latest $REGISTRY/$PROJECT/park-explorer-web:latest
docker push $REGISTRY/$PROJECT/park-explorer-api:latest
docker push $REGISTRY/$PROJECT/park-explorer-web:latest
```

## Install

```bash
helm install park-explorer ./helm/park-explorer \
  --set image.registry=image-registry.openshift-image-registry.svc:5000/$(oc project -q)
```

Postgres gets a random password on first install (stored in the `<release>-postgresql` Secret) unless you set `postgresql.auth.password` yourself. See `values.yaml` for every other option (resource sizes, storage size/class, Route host/TLS).

Follow the printed NOTES for how to check the Route, tail migration logs, and seed sample data.

## Upgrade

```bash
helm upgrade park-explorer ./helm/park-explorer --reuse-values --set image.api.tag=v1.2.3 --set image.web.tag=v1.2.3
```

The postgres password is read back from the existing Secret on upgrade (via a `lookup`), so it never rotates under a running database.

## OpenShift-specific decisions

- **No `runAsUser`/`fsGroup` anywhere in the chart.** OpenShift's `restricted` SCC assigns a random non-root UID (and matching `fsGroup`) per namespace; hardcoding one would either be rejected or silently overridden. Every workload sets `runAsNonRoot: true`, drops all capabilities, and disallows privilege escalation — compatible with that SCC without needing any elevated permission grant.
- **`nginxinc/nginx-unprivileged` for `web`**, not plain `nginx`. Plain nginx binds port 80 (needs root) and wants root-owned cache directories — both break under an arbitrary non-root UID. The unprivileged image listens on 8080 and has permissions set up for exactly this scenario (see `Dockerfile.web`).
- **`quay.io/sclorg/postgresql-16-c9s` for postgres**, not the official `postgres` image. The official image expects to run as UID 999 and initializes `PGDATA` accordingly; under OpenShift's randomly-assigned UID, `initdb` fails. The sclorg image (the free/community twin of `registry.redhat.io/rhel9/postgresql-16`, which you can swap in if your cluster has that subscription) is built for arbitrary-UID compatibility.
- **`Route` instead of `Ingress`.** OpenShift's native way to expose HTTP(S) externally; toggle with `route.enabled`.
- **Migrations run as an initContainer on the `api` pod**, not a Helm hook Job. A `pre-install` hook Job would race against the postgres `StatefulSet`, which is a normal (non-hook) resource created in the same phase — Helm doesn't interleave the two. Running `migrate.ts` as an initContainer means a failed connection just exits non-zero and kubelet retries with backoff until postgres is actually ready, with no separate "wait for it" logic needed. It reruns on every pod start, which is safe — Drizzle's migration runner tracks what's already applied.
