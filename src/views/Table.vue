<template>
    <v-container>
        <h6 class="text-h6 text-md-h5 font-weight-black">表格</h6>

        <v-row>
            <v-col cols="12">
                <v-data-table-virtual
                    :headers="headers"
                    :items="items"
                    class="elevation-1"
                    height="400"
                    item-value="name"
                ></v-data-table-virtual>
            </v-col>
        </v-row>
 
    </v-container>
  
</template>

<script>
import { reactive, ref } from 'vue'
export default {
    name: 'Table',
    components: {

    },

    setup(){

        // 表頭
        const headers = reactive([
          { title: 'id', key: 'id' },
          { title: 'TagName', key: 'TagName' },
          { title: 'name', key: 'name' },
          { title: 'value', key: 'value' },
        ])
        
        // 資料
        const items = ref([])
        for( let i = 0 ; i < 50; i++ ){
            items.value.push( {id: i+1, TagName: '#Tag1', name: `HaHa${i}`, value: '123'} )
            items.value.push( {id: 50+i+1, TagName: '#Tag2', name: `MiMi${i}`, value: '123'} )
            items.value.push( {id: 100+i+1, TagName: '#Tag3', name: `CoCo${i}`, value: '123'} )
        }
        items.value.sort((a, b) => a['id'] - b['id'])
    

        return {
            headers, items
        }
    }
}
</script>

