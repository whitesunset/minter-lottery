<template>
  <v-card class="status-card">
    <v-flex xs12>
      <v-layout column wrap align-start>
        <span class="headline">Награды</span>
      </v-layout>
      <v-layout column wrap align-start mt-2>
        <p>Куплено билетов: <strong>{{ticketsNumber}}</strong></p>
        <p>Текущий банк: <strong>{{bank}}</strong> {{info.ticketTicker}} ({{Math.round(bank * coinPrice * 100) /100}} BIP ~ ${{Math.round(bank * coinPrice * 0.11 * 100) / 100}})</p>
        <p>За 1 место: <strong>{{first}}</strong> {{info.ticketTicker}} ({{Math.round(first * coinPrice * 100) /100}} BIP ~ ${{Math.round(first * coinPrice * 0.11 * 100) / 100}})</p>
        <p>За 2 место: <strong>{{second}}</strong> {{info.ticketTicker}} ({{Math.round(second * coinPrice * 100) /100}} BIP ~ ${{Math.round(second * coinPrice * 0.11 * 100) / 100}})</p>
        <p>За 3 место: <strong>{{third}}</strong> {{info.ticketTicker}} ({{Math.round(third * coinPrice * 100) /100}} BIP ~ ${{Math.round(third * coinPrice * 0.11 * 100) / 100}})</p>
        <p>4-10 места: <strong>{{m4_10}}</strong> {{info.ticketTicker}} ({{Math.round(m4_10 * coinPrice * 100) /100}} BIP ~ ${{Math.round(m4_10 * coinPrice * 0.11 * 100) / 100}})</p>
        <p>10-20 места: <strong>{{m10_20}}</strong> {{info.ticketTicker}} ({{Math.round(m10_20 * coinPrice * 100) /100}} BIP ~ ${{Math.round(m10_20 * coinPrice * 0.11 * 100) / 100}})</p>
      </v-layout>
    </v-flex>
  </v-card>
</template>

<script>

export default {
  name: "Rewards",
  props: ['isLoading', 'ticketsNumber', 'info', 'coinPrice'],
  computed: {
    bank: function () {
      return this.info.ticketPrice * this.ticketsNumber
    },
    first: function () {
      return Math.round(this.bank * 0.3 * 100) / 100;
    },
    second: function () {
      return Math.round(this.bank * 0.25 * 100) / 100;
    },
    third: function () {
      return Math.round(this.bank * 0.2 * 100) / 100;
    },
    m4_10: function () {
      return Math.round(this.bank * 0.01 * 100) / 100;
    },
    m10_20: function () {
      return Math.round(this.bank * 0.008 * 100) / 100;
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

