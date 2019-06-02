<template>
  <v-card class="status-card">
    <v-flex xs12>
      <v-layout column wrap align-start>
        <span class="headline">Билеты</span>
      </v-layout>
      <v-alert
        v-if="!ticketsExists"
        :value="true"
        color="info"
        icon="info"
        default-sort="tickets:desc"
        pt-2
        outline
      >
        Ни один билет еще не продан. Купите первыми!
      </v-alert>
      <div v-if="ticketsExists" class="ticket-table">
        <v-data-table
        :headers="headers"
        :items="tickets"
        :loading="isLoading"
        class="elevation-1"
        >
        <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.item.owner }}</td>
          <td class="text-xs-left">{{ props.item.tickets }}</td>
        </template>
      </v-data-table>
      </div>
    </v-flex>
  </v-card>
</template>

<script>

export default {
  name: "Tickets",
  props: ['isLoading', 'tickets'],
  data() {
    return {
      headers: [
        { text: 'Owner', align: 'left', value: 'owner', sortable: false },
        { text: 'Tickets', value: 'tickets' }
      ]
    }
  },
  methods: { },
  computed: {
    ticketsExists: function() {
      if (this.tickets.length === 0) return false;
      else return true;
    }
  },
}
</script>

<style lang="scss">
  .ticket-table {
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

