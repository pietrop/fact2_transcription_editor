## Changing bootswatch theme

Bootswatch is a set of themes for bootstrap

in `src/styles.css` comment out the first line that requires the `yeti` theme and uncomment the one for the desired theme. 

```css
@import url('https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/yeti/bootstrap.min.css');

/*Bootstrap basic look */
/*@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');*/

/*Bootswatch options*/
/*@import url('https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/paper/bootstrap.min.css');*/
/*@import url('https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/lumen/bootstrap.min.css');*/
/*@import url('https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/united/bootstrap.min.css');*/
```

If you'd like to use a [bootswatch theme](https://bootswatch.com) not in the code [you can get it from this CDN](https://www.bootstrapcdn.com/bootswatch/)