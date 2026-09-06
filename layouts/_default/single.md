{{- /*
  Machine-readable representation of a page. RawContent is intentional:
  Hugo content is authored as Markdown or HTML fragments, and both are valid
  CommonMark. Keeping the source preserves links, headings, lists and code.
*/ -}}
{{- with .Title }}# {{ . }}{{ end }}

{{- with .Description }}{{ . }}{{ end }}

{{- with .Date }}Published: {{ .Format "2006-01-02" }}
{{- end }}

{{ .RawContent }}
