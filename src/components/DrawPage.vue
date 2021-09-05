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

class Info{
    constructor(){
        this.name;
    }
}

class Circle{
    constructor(x, y, r) {
      this.postion = new Vector2(x,y);
      this.r = r;
      this.color = '#ff000000';
      this.Info = new Info();
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
            select_circles:[],
            search_circles:[],
            center_cricle:null,
        }
    },
    mounted : function(){
        this.canvas = document.getElementById('canvas');
        let ctx = this.canvas.getContext('2d');

        const center = new Vector2(this.canvas_width * 0.5, this.canvas_height * 0.5)
        const center_r = center.y * 0.3;

        this.center_cricle = new Circle(center.x, center.y, center_r * 1.8);
        this.center_cricle.setColor(0.10, 0, 0, 0);

        var sum_volume = this.select_volumes
            .reduce(function(sum, element){
                return sum + element;
            }, 0);
        var sum_rad = 0;
        for(let i = 0; i < this.select_volumes.length; i++){
            let rate = this.select_volumes[i] / sum_volume;
            let rad = Math.PI * rate;
            let circle = new Circle(
                center.x + Math.sin(sum_rad + rad) * center_r,
                center.y + Math.cos(sum_rad + rad) * -center_r,
                center_r * rad);
            circle.setColor(0.25, 0, 255, 0);
            circle.Info.name = this.select_names[i];
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
                center.x + Math.sin(sum_rad + rad) * center_r * 2.75,
                center.y + Math.cos(sum_rad + rad) * center_r * 2.75,
                center_r * rad);
            circle.setColor(0.25, 0, 0, 255);
            circle.Info.name = this.search_results_names[i];
            this.search_circles.push(circle);
            sum_rad += 2 * rad;
        }
        // 起動--wait-->描画とすると上手くいく
        setTimeout(() => {
            // 描画
            this.center_cricle.draw(ctx);
            this.select_circles.forEach(element => {
                element.draw(ctx);
                ctx.fillText(element.Info.name, element.postion.x, element.postion.y);
            });
            this.search_circles.forEach(element => {
                element.draw(ctx);
                ctx.fillText(element.Info.name, element.postion.x, element.postion.y);
            });
        }, 10);
    },
    methods:{
        canvesClickEvent:function(event){
            // マウスの座標をCanvas内の座標とあわせるため
            const rect = this.canvas.getBoundingClientRect();
            const point = new Vector2(
                event.clientX - rect.left,
                event.clientY - rect.top
            );
            this.select_circles.forEach(element => {
                if(element.isHit(point.x, point.y)){
                    console.log("click!");
                }
            });
            this.search_circles.forEach(element => {
                if(element.isHit(point.x, point.y)){
                    console.log("click!");
                }
            });
        },
        DrawInit:function(){

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
