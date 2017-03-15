# Touch Enabled Slider For Horizontal Navigation

This slider calculates velocity to decelerate when flicked and will snap to an element when finished.

### Features

- No dependencies
- IE9+ compatible

### Example

```HTML
<div id="slider" class="slider">
    <div class="slides">
        <div class="slide"><a href="#"><span class="number">1</span></a></div>
        <div class="slide"><a href="#"><span class="number">2</span></a></div>
        <div class="slide"><a href="#"><span class="number">3</span></a></div>
    </div>
</div>
```

<script src="slider.js"></script>
<script>
    (function () {
        const slider = new Slider('slider');
    })();
</script>



