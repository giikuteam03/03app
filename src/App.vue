<script src="https://www.promisejs.org/polyfills/promise-7.0.4.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<template>
  <div class="DrawPage">
      <p>{{message}}</p>
      <li v-for="item in search_results_name" :key="item">{{ item }}</li>
      <canvas id="canvas" :height="canvas_height" :width="canvas_width" ></canvas>
  </div>
</template>


<script>
import DrawPageVue from './components/DrawPage.vue';
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
            search_results_name:[], // 検索元の単語
            search_results_volume:[20,20,20,20,20], // 検索結果の件数
            circle:[],
        }
    },

    methods: {
            getdata:  async function(){
              // jsonファイルはpublicの下
                const response =  await axios.get('./sample.json')
                const gengo_id = response.data.gengo_id
                const gengo = ["C", "python", "Ruby"];
                const gengo1 = gengo[gengo_id[0].id];
                const gengo2 = gengo[gengo_id[1].id];
                console.log(gengo1);
                this.search_results_name.push(...[gengo1, gengo2]);
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
            //getdata関数
            this.getdata();
            console.log(this.search_results_name);
            
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
