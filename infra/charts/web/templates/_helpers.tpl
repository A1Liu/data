{{/* Name shared by every resource in this chart. */}}
{{- define "web.name" -}}
{{- default .Chart.Name .Values.nameOverride -}}
{{- end -}}

{{- define "web.labels" -}}
app: {{ include "web.name" . }}
{{- end -}}
