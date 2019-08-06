<template>
  <v-card class="status-card">
    <v-flex xs12>
      <v-layout column wrap align-start>
        <span class="headline">История игр</span>
      </v-layout>
      <div class="history-table">
        <v-data-table
        :headers="headers"
        :items="games"
        class="elevation-1 hidden-sm-and-down"
        >
        <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
        <template v-slot:items="props">
          <td class="text-xs-left">#{{ props.item.number }}</td>
          <td class="text-xs-left">{{ props.item.tickets }}</td>
          <td class="text-xs-left">
            <a :href="`${explorerURL}/address/${props.item.address}`" target="_blank">{{ props.item.address.substr(0,12) + '...' + props.item.address.slice(-8)}}</a>
          </td>
          <td class="text-xs-left">
            <a :href="`${explorerURL}/tx/${props.item.winTx}`" 
                target="_blank"
                v-if="props.item.winTx.length > 0"
              >
            {{ props.item.winTx.substr(0,12) + '...' + props.item.winTx.slice(-8)}}
            </a>
          </td>
        </template>
      </v-data-table>
      </div>
    </v-flex>
  </v-card>
</template>

<script>

export default {
  name: "History",
  props: ['games', 'explorerURL'],
  data() {
    return {
      headers: [
        { text: 'Игра', align: 'left', value: 'number', sortable: false },
        { text: 'Билеты', value: 'tickets', sortable: false },
        { text: 'Адрес', value: 'address', sortable: false },
        { text: 'Выплата', value: 'winTx', sortable: false },
      ],
    }
  },
  methods: { },
  computed: {
  },
}
</script>

<style lang="scss">
  .history-table {
    margin-top: 15px;
  }
  .status-card {
    width: 100%;
    padding: 15px;
  }
  .status_true {
    color: rgb(13, 182, 13);
  }
  .status_false {
    color: rgb(241, 0, 0);
  }
</style>

