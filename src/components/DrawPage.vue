<template>
  <div class="DrawPage">
        <p>{{message}}</p>
        <p></p>
        <canvas
            id="canvas"
            :height="canvas_height"
            :width="canvas_width"
            v-on:click="canvesClickEvent">
        </canvas>
  </div>
</template>

<script>
class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

class Circle{
    constructor(x, y, r) {
        this.postion = new Vector2(x,y);
        this.r = r;
        this.color = '#ff000000';
        this.name = "noname";
        this.show = true;
    }

    setColor(a, r, g, b){
        this.color = "rgba(" + [r, g, b, a] + ")";
        return this;
    }

    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.postion.x, this.postion.y, this.r, 0, Math.PI * 2, true);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

    isHit(x, y) {
      return (
        Math.pow(this.postion.x - x, 2) + Math.pow(this.postion.y - y, 2) <= Math.pow(this.r, 2)
      );
    }
}


export default {
    name: 'DrawPage',
    props:{
        select_names : Array,
        select_volumes :Array,
        search_results_names : Array,
        search_results_volumes : Array,
    },
    data(){
        return{
            message : 'Draw!!',
            num : 1,
            canvas_width:990,
            canvas_height:540,
            render_context:null,
            buffer_context:null,
            select_circles:[],
            search_circles:[],
            center_cricle:null,
        }
    },
    mounted : function(){
        // 起動--wait-->描画とすると上手くいく
        setTimeout(() => {
            this.canvas = document.getElementById('canvas');
            this.render_context = this.canvas.getContext('2d');
            this.buffer_context = document.getElementById('canvas').getContext('2d');
            // 初期化
            this.DrawInitialize();
           // 描画
           this.DrawCanvas();
        }, 20);
    },
    methods:{
        DrawInitialize:function(){
            const center = new Vector2(this.canvas_width * 0.5, this.canvas_height * 0.5)

            this.center_cricle = new Circle(center.x, center.y, center.y * 0.5);
            this.center_cricle.setColor(255, 230, 230, 230);
            this.center_cricle.name = "";

            var sum_volume = this.select_volumes
                .reduce(function(sum, element){
                    return sum + element;
                }, 0);
            var sum_rad = 0;
            for(let i = 0; i < this.select_volumes.length; i++){
                let rate = this.select_volumes[i] / sum_volume;
                let rad = Math.PI * rate;
                let circle = new Circle(
                    center.x + Math.sin(sum_rad + rad) * this.center_cricle.r * 0.5,
                    center.y + Math.cos(sum_rad + rad) * -this.center_cricle.r * 0.5,
                    this.center_cricle.r * rate);
                circle.setColor(255, 192, 255, 192);
                circle.name = this.select_names[i];
                this.select_circles.push(circle);
                sum_rad += 2 * rad;
            }

            sum_volume = this.search_results_volumes
                .reduce(function(sum, element){
                    return sum + element;
                }, 0);
            sum_rad = 0;
            for(let i = 0; i < this.search_results_volumes.length; i++){
                let rate = this.search_results_volumes[i] / sum_volume;
                let rad = Math.PI * rate;
                let circle = new Circle(
                    center.x + Math.sin(sum_rad + rad) * this.center_cricle.r * 1.6,
                    center.y + Math.cos(sum_rad + rad) * this.center_cricle.r * 1.6,
                    this.center_cricle.r * 0.5);
                circle.setColor(255, 192, 192, 255);
                circle.name = this.search_results_names[i];
                this.search_circles.push(circle);
                sum_rad += 2 * rad;
            }
        },
        canvesClickEvent:function(event){
            // マウスの座標をCanvas内の座標とあわせるため
            const rect = this.canvas.getBoundingClientRect();
            const point = new Vector2(
                event.clientX - rect.left,
                event.clientY - rect.top
            );
            let flag = false;
            this.select_circles.forEach(element => {
                if(element.isHit(point.x, point.y)){
                    console.log("click!");
                    flag = true;
                    this.ClickEvent(element);
                }
            });
            this.search_circles.forEach(element => {
                if(element.isHit(point.x, point.y)){
                    console.log("click!");
                    flag = true;
                }
            });
            if(flag == false){
                this.DrawInitialize();
                this.DrawCanvas();
            }
        },
        ClickEvent:function(circle){
            this.center_cricle.name = circle.name;
            this.center_cricle.color = circle.color;
            this.select_circles.forEach(element => {
                element.show = false;
            });
            this.DrawCanvas();
        },
        DrawCanvas:function(){
            this.buffer_context.clearRect(0,0,this.canvas_width, this.canvas_width);
            // 描画
            if(this.center_cricle.show){
                this.center_cricle.draw(this.buffer_context);
                this.buffer_context.fillText(this.center_cricle.name,this.center_cricle.postion.x, this.center_cricle.postion.y);
            }
            this.select_circles.forEach(element => {
                if(element.show){
                    element.draw(this.buffer_context);
                    this.buffer_context.fillText(element.name, element.postion.x, element.postion.y);
                }
            });
            this.search_circles.forEach(element => {
                if(element.show){
                    element.draw(this.buffer_context);
                    this.buffer_context.fillText(element.name, element.postion.x, element.postion.y);
                }
            });
            let image = this.buffer_context.getImageData(0,0,this.canvas_width, this.canvas_width);
            this.render_context.putImageData(image,  0, 0);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
        border: 1px solid silver;
        /* ↓ click 処理がバグる */
        /* width: 100%; */
}
</style>
