<template>
  <div class="DrawPage">
      <p>{{message}}</p>
      <p></p>
      <canvas id="canvas" :height="canvas_height" :width="canvas_width" ></canvas>
  </div>
</template>

<script>
class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

export default {
    name: 'DrawPage',
    data(){
        return{
            message : 'Draw!!',
            num : 1,
            canvas_height:1024,
            canvas_width:1024,
            search_results_name:["A","B","C","D","E"], // 検索元の単語
            search_results_volume:[20,20,20,20,20], // 検索結果の件数
            circle:[],
        }
    },
    mounted : function(){
        // 起動--wait-->描画とすると上手くいく
        setTimeout(() => {
            var center = new Vector2(this.canvas_width * 0.5, this.canvas_height * 0.5)
            var center_r = center.x * 0.25;
            var sum_volume = this.search_results_volume
                .reduce(function(sum, element){
                    return sum + element;
                }, 0);

            var canvas = document.getElementById('canvas');
            var c = canvas.getContext('2d');

            var sum_rad = 0;
            for(let i = 0; i < this.search_results_volume.length; i++){
                var rate = this.search_results_volume[i] / sum_volume;
                var rad = Math.PI * rate;

                c.fillStyle = "rgba(" + [0, 255, 0, 0.25] + ")";
                // パスの開始
                c.beginPath();
                c.arc(
                    center.x + Math.sin(sum_rad + rad) * center_r,
                    center.y + Math.cos(sum_rad + rad) * center_r,
                    center_r * rad, 0, 2 * Math.PI, false);
                // 描画
                c.fill();

                sum_rad += 2 * rad;
            }
        }, 10);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 canvas {
        border: 1px solid silver;
        width: 50%;
    }
</style>
