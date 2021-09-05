<script src="https://www.promisejs.org/polyfills/promise-7.0.4.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<template>
  <div class="add">
      <li v-for ="item in SelectedNames" :key="item">{{ item }}</li>
      <draw-page
        v-bind:select_names = SelectedNames
        v-bind:select_volumes = SelectedVolumes
        v-bind:search_results_names = SearchedNames
        v-bind:search_results_volumes = SearchedVolumes
      ></draw-page>
  </div>
</template>


<script>
import DrawPage from './components/DrawPage.vue';

export default {
    name: 'App',
    components:{
        DrawPage
    },
    data(){
        return{
            SelectedNames:[],
            SelectedVolumes:[],
            SearchedNames:[],
            SearchedVolumes:[],
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
            gengo_id.forEach(e => {
                this.SelectedNames.push(gengo[e.id]);
            });
            //this.search_results_name.push(...[gengo1, gengo2]);
            // テスト用
            for (let i = 0; i < this.SelectedNames.length; i++) {
                this.SelectedVolumes.push(1);
            }
            this.SearchedNames = ["A","B","C","D"];
            this.SearchedVolumes = [25,25,25,25];
        }
        },


    mounted : function(){
        //getdata関数
        this.getdata();
        console.log(this.SelectedNames);
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
