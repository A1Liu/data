{{/* Name shared by every resource in this chart. */}}
{{- define "postgres.name" -}}
{{- default .Chart.Name .Values.nameOverride -}}
{{- end -}}

{{- define "postgres.labels" -}}
app: {{ include "postgres.name" . }}
{{- end -}}
