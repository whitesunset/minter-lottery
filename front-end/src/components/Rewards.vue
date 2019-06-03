<template>
  <v-card class="status-card">
    <v-flex xs12>
      <v-layout column wrap align-start>
        <span class="headline">Награды</span>
      </v-layout>
      <v-layout column wrap align-start mt-2>
        <p>Куплено билетов: <strong>{{ticketsNumber}}</strong></p>
        <p>Текущий банк: <strong>{{bank}}</strong> {{info.ticketTicker}}</p>
        <p>За 1 место: <strong>{{first}}</strong> {{info.ticketTicker}}</p>
        <p>За 2 место: <strong>{{second}}</strong> {{info.ticketTicker}}</p>
        <p>За 3 место: <strong>{{third}}</strong> {{info.ticketTicker}}</p>
        <p>4-18 места: <strong>{{others}}</strong> {{info.ticketTicker}}</p>
      </v-layout>
    </v-flex>
  </v-card>
</template>

<script>

export default {
  name: "Rewards",
  props: ['isLoading', 'ticketsNumber', 'info'],
  computed: {
    bank: function () {
      return this.info.ticketPrice * this.ticketsNumber
    },
    first: function () {
      return Math.round(this.bank * 0.35, 2)
    },
    second: function () {
      return Math.round(this.bank * 0.25, 2)
    },
    third: function () {
      return Math.round(this.bank * 0.20, 2)
    },
    others: function () {
      return Math.round(this.bank * 0.01 * 100) / 100;
    },
    returned: function () {
      return this.info.returned
    }
  }
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

