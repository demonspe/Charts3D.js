# Charts3D.js
These are Javascript classes that allow you to get live charts that react to the movement of the mouse cursor

## 1. ChartPie3D
### 1.1 What it looks like
------------
    Normal state

![ ](/images/chart_flat.png)

    Mouse hover state

![ ](/images/chart_3d.png)


### 1.2 Example
------------
```
<body>
    <canvas id="myCanvas" height="200" width="200"></canvas>
    <script src="Charts3D.js"></script>
    <script>
        let chart1 = new ChartPie3D('myCanvas', 100, true);
        chart1.data = [
            { value: 100, ringColor: '#AAAAAA', thickness: 10, drawValue: true, fontSize: 40, fontColor: '#AAAAAA'},
            { value: 87, ringColor: '#FFA500', thickness: 15, drawValue: true, fontColor:'#FFA500',  fontSize: 40, stroke: true},
            { value: 57, ringColor: '#00AA00', thickness: 25, drawValue: true,  fontSize: 40, stroke: true}
        ];
        chart1.draw();
    </script>
</body>
```

### 1.3 Description 
------------
#### Create chart
```
let chart1 = new ChartPie3D('myCanvas', 100, true);
```
`'myCanvas'` - html id of canvas  
`100`        - max value of this chart (it is like 100%) any number  
`true`       - enable 3d effect (if it is undefined then 3d effect is enabled by default)  

#### This code add 3 rings in chart:
```
chart1.data = [
            { value: 100, ringColor: '#AAAAAA', thickness: 10, drawValue: true, fontSize: 40, fontColor: '#AAAAAA'},
            { value: 87, ringColor: '#FFA500', thickness: 15, drawValue: true, fontColor:'#FFA500',  fontSize: 40, stroke: true},
            { value: 57, ringColor: '#00AA00', thickness: 25, drawValue: true,  fontSize: 40, stroke: true}
        ];
```

#### All parameters of ring data object:

`value: 28`              - Current value of ring `required`  
`ringColor: '#FF0000'`   - color of ring `[optional]`  
`thickness: 10`          - ring thickness in px `[optional]`  
`drawValue: true`        - whether to draw the value in the center of the ring `[optional]`  
`fontSize: 20`           - font size of value `[optional]`  
`fontColor: '#FF0000'`   - font color of  value `[optional]`  
`addedChar: '%'`         - value + addedChar like: 100% `[optional]`  
`stroke: true`            - ring stroke, disables shadow from ring `[optional]`  


