# How to change keyboard Shortcuts

In [`/src/app/views/transcription_view.js`](../src/app/views/transcription_view.js) under `keyboardEvents` at line `160`, change the [Mousetrap](https://craig.is/killing/mice) keyboard shortcuts. using the [backbone events convention](http://backbonejs.org/#View-events)


Briefly , without wating to give an exausting explanation of backbone events, but the minimum needed to change the keyboards shortcuts if we consider ` 'esc'        : 'play',` the first element `esc` is the key, and the second `play` corresponds to a function present in [`transcription_view.js`](../src/app/views/transcription_view.js) view that gets triggered. 

so you'd change them here

```js
  keyboardEvents: {
    'esc'        : 'play',
    'ctrl+1'     : 'rewind',
    'f1'         : 'rewind',
    'ctrl+2'     : 'forward',
    'f2'         : 'forward',
    'ctrl+0'     : 'stop',
    'ctrl+3'     : 'descreaseSpeed',
    'f3'         : 'descreaseSpeed',
    'ctrl+4'     : 'increaseSpeed',
    'f4'         : 'increaseSpeed',
    'ctrl+k'     : 'changeCurrentTime',
    'f5'         : 'rollBack',
    'ctrl+5'     : 'rollBack',
    "ctrl+/"    : 'showKeyboardShortcuts',
    'ctrl+6'     : 'addSpeaker',
    'ctrl+7'      : 'addDescription',
    'ctrl+s'      : 'intermediateSaveLocally'
  },
```

and then update the cheat sheet accordingly for the users, in [`/src/app/templates/transcription_show.html.ejs`](../src/app/templates/transcription_show.html.ejs) at line `143` where the bootstrap html `Keyboard Shortcuts` table is


```html
<table class="table table-striped  table-hover">
<thead>
<tr>
<th >Control</th>
<th> Shortcut</td>
<th>Alternative</td>
</tr>
<thead>
<tbody>
<tr>
<td scope="row">Play/pause</th>
<td> <kbd>esc</kbd></td>
<td></td>
</tr>
<tr>
<td scope="row">Rewind to start</th>
<td> <kbd>ctrl</kbd>+<kbd>0</kbd> </td>
<td></td>
</tr>
<tr>
<td scope="row">Skip backwards</th>
<td> <kbd>ctrl</kbd>+<kbd>1</kbd> </td>
<td><kbd>f1</kbd></td>
</tr>
<tr>
<td scope="row">Skip Forward</th>
<td> <kbd>ctrl</kbd>+<kbd>2</kbd> </td>
<td><kbd>f2</kbd></td>
</tr>
<tr>
<td scope="row">Jump to time</th>
<td> <kbd>ctrl</kbd>+<kbd>k</kbd> </td>
<td></td>
</tr>
<tr>
<td scope="row">Speed Down</th>
<td> <kbd>ctrl</kbd>+<kbd>3</kbd> </td>
<td><kbd>f3</kbd></td>
</tr>
<tr>
<td scope="row">Speed Up</th>
<td> <kbd>ctrl</kbd>+<kbd>4</kbd> </td>
<td><kbd>f4</kbd></td>
</tr>

<tr>
<td scope="row">Roll Back</th>
<td> <kbd>ctrl</kbd>+<kbd>5</kbd> </td>
<td><kbd>f5</kbd></td>
</tr>
<tr>
<td scope="row">Show/Hide shortcuts</th>
<td> <kbd>ctrl</kbd>+<kbd>/</kbd> </td>
<td></td>
</tr>

<tr>
<td scope="row">Add Speaker</th>
<td> <kbd>ctrl</kbd>+<kbd>6</kbd> </td>
<td></td>
</tr>
<tr>
<td scope="row">Add Description</th>
<td> <kbd>ctrl</kbd>+<kbd>7</kbd> </td>
<td></td>
</tr>
<tr>
<td scope="row">Intermediate save</th>
<td> <kbd>ctrl</kbd>+<kbd>s</kbd> </td>
<td></td>
</tr>

</tbody>
</table>
```