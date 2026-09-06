# {{ site.Title }}

{{ site.Params.description }}

{{ range where site.RegularPages "Type" "in" site.MainSections }}
## [{{ .Title }}]({{ .Permalink }})

{{ with .Description }}{{ . }}{{ else }}{{ .Summary | plainify }}{{ end }}

{{ end }}
