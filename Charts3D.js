/* font */
//<link rel="stylesheet"
//    href="https://fonts.googleapis.com/css?family=Open+Sans&effect=3d-float"></link>

/* Пример */
//<canvas id="c1" height="200" width="200"></canvas>
//<script>
//  let chart1 = new ChartPie3D('c1', 100, true);
//  chart1.data = [
//      { value:100, ringColor:'#AAAAAA', thickness:10, drawValue:true, fontSize:20, fontColor:'#AAAAAA', addedChar: '%', stroke:true },
//      { value:57,  ringColor:'#0095BB', thickness:10, drawValue:true, fontSize:20, addedChar:'%', stroke:true }
//      { value:35,  ringColor:'#00AA00' }
//    ];
//  chart1.draw();
//</script>

/* Обект определяющий параметры отрисовки кольца */
// можно не указывать всё кроме value
// {    value: 28,              /* значение от максимума */
//      ringColor: '#FF0000',   /* цвет заливки кольца */
//      thickness: 10,          /* толщина кольца в пикселях */
//      drawValue: true,        /* рисовать ли value в центре кольца */
//      fontSize: 20,           /* размер шрифта value */
//      fontColor: '#FF0000',   /* цвет шрифта value */
//      addedChar: '%',         /* value + addedChar */
//      stroke: true            /* обводка кольца, отключает тень от кольца */
// }
class ChartPie3D {
    //_canvas - контейнер для рисования
    //max_value - числовое значение соответствующее 100%
    //_effect3DEnable - вкл/откл эффекта сдвига при наведении
    constructor(_canvasId, _max_value, _effect3DEnable){

        this.canvas = document.getElementById(_canvasId);
        this.max = _max_value;
        let k_3d = 0.9;
        if(_effect3DEnable === undefined) { 
            this.effect3DEnable = true;
        }
        else{
            this.effect3DEnable = _effect3DEnable;
            k_3d = 0.7;
        }
        //Центр холста
        this.centerX = this.canvas.width/2;
        this.centerY = this.canvas.height/2;
        //Выбираем наружний радиус колец 70% от меньшей стороны
        this.r;
        
        if(this.centerY < this.centerX) {
            this.r = this.centerY*k_3d;
        }
        else {
            this.r = this.centerX*k_3d;
        }
        //Координаты курсора мгновенные
        this.x_real = this.canvas.width/2;
        this.y_real = this.canvas.height/2;
        //Координаты курсора c отстающие
        this.x_slow = this.x_real;
        this.y_slow = this.y_real;
        //Флаг отрисовки текта на нижних слоях
        this.drowBackText = false;
        //Флаг необходимости отрисовки
        this.update = false;

        //Отслеживаем положение курсора
        this.canvas.onmousemove = (e) => {
            let bbox = this.canvas.getBoundingClientRect();
            let loc_x = Math.round(e.clientX - bbox.left);
            let loc_y = Math.round(e.clientY - bbox.top);
            this.x_real = loc_x;
            this.y_real = loc_y;
            this.drowBackText = true;
        };
        //Курсор вне границ
        this.canvas.onmouseleave = (e) => {
            this.x_real = this.canvas.width/2;
            this.y_real = this.canvas.height/2;
            this.drowBackText = false;
        };
        //Массив данных для отрисовки колец
        // { value: 28,             /* значение от максимума */
        // ringColor: '#FF0000',    /* цвет заливки кольца */
        // thickness: 10,           /* толщина кольца в пикселях */
        // drawValue: true,         /* рисовать ли value в центре кольца */
        // fontSize: 20,            /* размер шрифта value */
        // fontColor: '#FF0000',    /* цвет шрифта value */
        // addedChar: '%',          /* value + addedChar */
        // stroke: true }           /* обводка кольца, отключает тень от кольца */
        this.data = [];
    }

    draw(){
        if(this.data.length === 0) return;
        let current_value = 0;
        setInterval(() => {
            if(this.x_slow != this.x_real || this.y_slow != this.y_real) {
                this.update = true;
                if(Math.abs(this.x_slow - this.x_real) < 2) {this.x_slow = this.x_real;}
                if(Math.abs(this.y_slow - this.y_real) < 2) {this.y_slow = this.y_real;}
                this.x_slow = this.x_slow - (this.x_slow - this.x_real)/4;
                this.y_slow = this.y_slow - (this.y_slow - this.y_real)/4;
            }
            else {
                this.update = false;
            }

            if(current_value < this.max) { 
                current_value += Math.round(this.max/100);
            }
            else {
                if(!this.update) {return;} 
            }
            this.clearCanvas();
            //Рисуем все кольца
            this.data.forEach((item, i, arr) => {
                if(current_value - (this.max-item.value) > 0){
                    let z = 0;
                    if(this.effect3DEnable){
                        let max_z = 30*(arr.length-1)
                        z = max_z/(arr.length-1)*i-max_z/2;
                    }
                    let th;
                    if(item.thickness) { 
                        th = item.thickness; 
                    }
                    else {
                        th = this.r/4;
                    }
                    let shadow;
                    if(!item.stroke) {
                        shadow = "#00000040";
                    }
                    //Кольцо
                    this.drawRing(
                        current_value - (this.max-item.value), 
                        th, 
                        item.ringColor, 
                        shadow, item.stroke,
                        z, this.x_slow, this.y_slow
                        );
                    //Текст в центре кольца
                    if(item.drawValue){
                        if(arr.length === i+1 || this.drowBackText){
                            let ch = '';
                            if(item.addedChar) ch = item.addedChar;
                            this.drawTextInCenter(
                                item.value + ch,
                                item.fontColor, item.fontSize,
                                z, this.x_slow, this.y_slow
                                );
                        }
                    }
                }
            });
        }, 20);
    }

    //Нарисовать кольцо
    //percent - длина дуги от 0 до 100
    //side - толщина кольца в px
    //ringColor - цвет дуги (если null, то черная)
    //shadowColor - цвет тени (если null, то не рисуется)
    drawRing(value, side, ringColor, shadowColor, stroke, z, mX, mY) {
        if (this.canvas.getContext) {
            let ctx = this.canvas.getContext('2d');
            let startAngle = this.toRad(0);
            let endAngle = this.toRad(360*(value/this.max));
            
            //Тень
            if(shadowColor){
                ctx.shadowOffsetX = this.r/30;
                ctx.shadowOffsetY = this.r/30;
                ctx.shadowBlur = this.r/10;
                ctx.shadowColor = shadowColor;
            }
            else{
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
                ctx.shadowColor = shadowColor;
            }
            let centerX_shifted;
            let centerY_shifted;
            //Рисуем дугу
            if(z && mX && mY){
                centerX_shifted = this.centerX + (mX - this.centerX)*z/100;
                centerY_shifted = this.centerY + (mY - this.centerY)*z/100;
            }
            else{
                centerX_shifted = this.centerX;
                centerY_shifted = this.centerY;
            }
            
            ctx.beginPath();
            ctx.moveTo(centerX_shifted, centerY_shifted - this.r + side);
            ctx.lineTo(centerX_shifted, centerY_shifted - this.r);
            ctx.arc(centerX_shifted, centerY_shifted, this.r, startAngle, endAngle,false);
            ctx.lineTo(
                Math.cos(endAngle)*(this.r-side)+centerX_shifted,
                Math.sin(endAngle)*(this.r-side)+centerY_shifted
                );
            ctx.arc(centerX_shifted, centerY_shifted, this.r-side, endAngle, startAngle,true);
            if(ringColor){
                ctx.fillStyle = ringColor;
            }
            ctx.fill();
            if(stroke){
                ctx.strokeStyle = "#FFF";
                ctx.stroke();
            }
        }
    }
    drawTextInCenter(text, fontColor, fontSize, z, mX, mY) {
        if (this.canvas.getContext) {
            let ctx = this.canvas.getContext('2d');
            let centerX_shifted;
            let centerY_shifted;
            if(z && mX && mY){
                centerX_shifted = this.centerX + (mX - this.centerX)*z/100;
                centerY_shifted = this.centerY + (mY - this.centerY)*z/100;
            }
            else{
                centerX_shifted = this.centerX;
                centerY_shifted = this.centerY;
            }
            //Надпись в центре
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            let size;
            if(fontSize) {
                size = fontSize;
            }
            else{
                size = this.r*0.7;
            }
            ctx.font = "lighter " + size + "px Open Sans";
            if(fontColor){
                ctx.fillStyle = fontColor;
            }
            ctx.fillText(text, centerX_shifted, centerY_shifted+size/3);
        }
    }
    clearCanvas(){
        if (this.canvas.getContext) {
            let ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    toRad(degrees){
        return (Math.PI/180)*(degrees-90);
    }
}