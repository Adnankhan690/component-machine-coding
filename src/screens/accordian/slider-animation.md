Viewed accordianV2.css:11-53

In CSS Grid, **`grid-template-rows`** is a property used to define the heights of the rows in a grid layout. 

For example:
```css
.container {
  display: grid;
  grid-template-rows: 100px 200px; /* Row 1 is 100px tall, Row 2 is 200px tall */
}
```

---

### How does the Accordion animation work with `grid-template-rows`?

Historically, you could not animate `height: 0` to `height: auto` using pure CSS transitions because browsers cannot calculate how to transition to an unknown `"auto"` height value. 

However, modern browsers **can transition fractional grid tracks (`fr` units)**. By using CSS Grid, we can bypass the `height: auto` limitation:

#### 1. The Collapsed State (`0fr`)
```css
.accordion-content-v2 {
    display: grid;
    grid-template-rows: 0fr; /* Row gets 0 fraction of the height */
    transition: grid-template-rows 0.3s ease-out;
    overflow: hidden;
}
```
At `0fr`, the grid track is instructed to take up `0` space, collapsing the element's height to `0`.

#### 2. The Expanded State (`1fr`)
```css
.accordion-content-v2.open {
    grid-template-rows: 1fr; /* Row expands to fill the content size */
}
```
At `1fr`, the grid track expands to fit the size of the contents inside it (acting exactly like `height: auto`). The browser translates `0fr` to `1fr` over `0.3s`, animating the slide.

---

### Why is `min-height: 0` required on the inner child?
```css
.accordion-inner-v2 {
    min-height: 0;
}
```
By default, grid items have an implicit minimum height of `min-height: auto` (which is the size of their text/content). 

Without setting `min-height: 0` on the direct child, the grid row will refuse to shrink smaller than the text height, preventing the accordion from collapsing to `0px`. Setting `min-height: 0` allows the grid track to collapse completely.