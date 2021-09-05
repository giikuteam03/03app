    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>


<template>
 <div id="app">   
     <h1>チェックボックス12</h1>
    
        <h5>あなたの持っている技術は何ですか？</h5>
        <li v-for="tech in technologies" :key="tech">
        <input type="checkbox" :value="tech.id" v-model="selectedTechIds" @change="onChangeTech">
            <span v-text="tech.name"></span>
            &nbsp;
        </li>
        <h5>あなたが知りたいものは何ですか？</h5>
        <li v-for="want in filteredWants" :key="want">
            <input type="checkbox" :value="want.id" v-model="selectedWantIds">
            <span v-text="want.name"></span>
            &nbsp;&nbsp;
        </li>
        <hr>
        <div>
            <h5>【選択された値】</h5>
            持っている技術: <strong v-text="selectedTechIds"></strong><br>
            やりたい技術: <strong v-text="selectedWantIds"></strong>
        </div>
    </div>
</template>

    


    <script>

        export default({
            data() {
                return{
                      technologies: [],
                wants: [],
                selectedTechIds: [],
                selectedWantIds: []
            }
            },
            methods: {
                onChangeTech() {

                    this.selectedWantIds = [];

                    if(!this.selectedTechIds) {

                        this.selectedTechIds = [];

                    }
                }
                
            },
            computed: {
                filteredWants() {

                    let filteredWants = [];

                    for(let i = 0 ; i < this.wants.length ; i++) {

                        let want = this.wants[i];

                        if(this.selectedTechIds.includes(want.techId)) {

                            let tech = this.technologies.find((tech) => {

                                return (tech.id );

                            });

                            filteredWants.push({
                                id: want.id,
                                name: want.name
                            });

                        }

                    }

                    return filteredWants;

                }
            },
            mounted() {

                axios.get('/text.json')
                    .then((response) => {

                        this.technologies = response.data.technologies;
                        this.wants = response.data.wants;

                    });
                        // POST
             
                
            }
        });
    </script>
