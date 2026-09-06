# {{ .Title }}

{{ with .Description }}{{ . }}{{ end }}

{{ range .Pages }}
## [{{ .Title }}]({{ .Permalink }})

{{ with .Description }}{{ . }}{{ else }}{{ .Summary | plainify }}{{ end }}

{{ end }}
