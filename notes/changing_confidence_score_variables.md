
## changing colors for confidence scores

> `>`95% = no color
>  80-95% = light yellow
> 60-80% = yellow
> `<` 60% = red

- `transcription_show_html.ejs` is where the confidence scores are set. at line `258`.
- At the moment in `src/style.css` is where the color preferences are set for line `236` for class `confidenceScore2`, `confidenceScore3`,`confidenceScore4`.
