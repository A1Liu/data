{{/* Name shared by every resource in this chart. */}}
{{- define "api.name" -}}
{{- default .Chart.Name .Values.nameOverride -}}
{{- end -}}

{{- define "api.labels" -}}
app: {{ include "api.name" . }}
{{- end -}}
