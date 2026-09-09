{{/*
Base chart name.
*/}}
{{- define "park-explorer.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Full release name, used as a prefix for every resource name.
*/}}
{{- define "park-explorer.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "park-explorer.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels, shared across every resource in the release.
*/}}
{{- define "park-explorer.labels" -}}
helm.sh/chart: {{ include "park-explorer.chart" . }}
{{ include "park-explorer.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "park-explorer.selectorLabels" -}}
app.kubernetes.io/name: {{ include "park-explorer.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{/*
Name of the Secret holding the postgres credentials + a ready-to-use DATABASE_URL.
*/}}
{{- define "park-explorer.postgresSecretName" -}}
{{- printf "%s-postgresql" (include "park-explorer.fullname" .) -}}
{{- end -}}

{{/*
Postgres headless Service name (also the StatefulSet's serviceName).
*/}}
{{- define "park-explorer.postgresServiceName" -}}
{{- printf "%s-postgresql" (include "park-explorer.fullname" .) -}}
{{- end -}}

{{- define "park-explorer.apiServiceName" -}}
{{- printf "%s-api" (include "park-explorer.fullname" .) -}}
{{- end -}}

{{- define "park-explorer.webServiceName" -}}
{{- printf "%s-web" (include "park-explorer.fullname" .) -}}
{{- end -}}

{{/*
Resolves an image reference from the shared registry + a per-component repository/tag.
*/}}
{{- define "park-explorer.image" -}}
{{- $root := .root -}}
{{- $component := .component -}}
{{- $registry := $root.Values.image.registry -}}
{{- $repository := $component.repository -}}
{{- $tag := $component.tag | default $root.Chart.AppVersion -}}
{{- if $registry -}}
{{- printf "%s/%s:%s" $registry $repository $tag -}}
{{- else -}}
{{- printf "%s:%s" $repository $tag -}}
{{- end -}}
{{- end -}}

{{/*
Security context compatible with OpenShift's restricted(-v2) SCC: no fixed
runAsUser (the SCC assigns one), non-root, no privilege escalation, all
capabilities dropped.
*/}}
{{- define "park-explorer.containerSecurityContext" -}}
allowPrivilegeEscalation: false
runAsNonRoot: true
capabilities:
  drop: ["ALL"]
seccompProfile:
  type: RuntimeDefault
{{- end -}}
