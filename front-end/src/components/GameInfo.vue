<template>
  <v-card class="status-card">
    <v-flex xs12>
      <v-layout column wrap align-start>
        <span v-if="status" class="headline status_true">Игра идет!</span>
        <span v-if="!status" class="headline status_false">Игра закончилась!</span>
        <span v-if="status && info.testnet === false" class="status_true">Mainnet</span>
        <span v-if="status && info.testnet === true" class="status_false">Testnet</span>
        <v-progress-linear v-model="gameProgress"></v-progress-linear>
      </v-layout>
      <v-layout column wrap align-start pt-2>
        <p v-if="status">До конца игры: <strong>{{info.end - info.currentBlock}}</strong> блоков</p>
      </v-layout>
      <v-layout v-if="status" column wrap align-start>
        <p><strong>Цена билета:</strong> {{info.ticketPrice}} {{info.ticketTicker}}</p>
        <p><strong>Адрес:</strong> {{info.address}}</p>
        <qrcode :value="info.address" :options="{ width: 200 }"></qrcode>
      </v-layout>
    </v-flex>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  name: "GameInfo",
  props: ['info'],
  computed: {
    status: function () {
      if (this.info.currentBlock >= this.info.start && this.info.currentBlock < this.info.end) {
        return true
      } else return false;
    },
    gameProgress: function () {
      let res = (this.info.currentBlock - this.info.start) / (this.info.end - this.info.start) * 100;
      return res;
    }
  },
}
</script>

<style lang="scss">
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

