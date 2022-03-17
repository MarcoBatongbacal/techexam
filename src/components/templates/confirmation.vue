<template>
     <v-dialog
          v-model="dialog"
          persistent
          max-width="290"
     >
          <v-card>
               <v-card-title class="text-h5">
                    {{ title }}
               </v-card-title>
               <v-card-text> {{ message }} </v-card-text>
               <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                         color="dark darken-1"
                         text
                         @click="calcel"
                    >
                         Cancel
                    </v-btn>
                    <v-btn
                         :color="color + ' darken-1'"
                         text
                         @click="action"
                    >
                         Confirm
                    </v-btn>
               </v-card-actions>
          </v-card>
     </v-dialog>
</template>

<script>

import axios from 'axios'

const initialState = () => {
     return{
          dialog: false,
          title:'',
          message: '',
          color: 'error',
          url:'',
          data: {},
          page: '',
          call: ''
    }
}

export default {
     name: "vtoast",
     data() {
          return initialState()
     },
     methods:{
          show( data ) {
               this.dialog = true
               this.title = data.title || ''
               this.message = data.message || ''
               this.color = data.color || 'error'
               this.url = data.url || ''
               this.data = data.data || {}
               this.page = data.page || ''
               this.call = data.call || ''
          },
          async action () {
               const response = await axios.post( this.url , this.data )
               
               if( response.data.msg ) {
                    if( this.call.length > 0 ) {
                         await this.$root[ this.page ][ this.call ]()
                    }

                    this.$root.vtoast.show({
                         message: response.data.msg,
                    })

               }
               Object.assign( this.$data, initialState() )
               
          },
          async calcel() {
               await Object.assign( this.$data, initialState() )
          }
     }
}
</script>