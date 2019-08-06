<template>
  <div>
    <div class="home">
      <div class="card">
        <GameInfo :info="info" />
      </div>
      <div class="card">
        <HowToPlay :ticketTicker="info.ticketTicker" />
      </div>
      <div v-if="status" class="card">
        <Tickets :tickets="info.tickets" :isLoading="ticketsIsLoading" :explorerURL="explorerURL" />
      </div>
      <div v-if="status" class="card">
        <Rewards :ticketsNumber="info.ticketsNumber" :isLoading="ticketsIsLoading" :info="info" :coinPrice="coinPrice" />
      </div>
    </div>
    <div class="completed-games hidden-sm-and-down" >
      <History :games="history" :explorerURL="explorerURL" />
    </div>
  </div>
</template>

<script>
import GameInfo from '../components/GameInfo';
import HowToPlay from '../components/HowToPlay';
import Tickets from '../components/Tickets';
import Rewards from '../components/Rewards';
import History from '../components/History';

import { HTTP } from '../http';
import { Minter, SendTxParams } from "minter-js-sdk";

const minterSDK = new Minter({apiType: 'node', baseURL: 'https://api.minter.one'});

export default {
  name: 'Home',
  components: {
    GameInfo,
    HowToPlay,
    Tickets,
    Rewards,
    History
  },
  data() {
    return {
      info: {},
      history: [],
      ticketsIsLoading: true,
      ticketsNumber: 0,
      coinPrice: 0
    }
  },
  methods: {
    getInfo: function () {
      this.ticketsIsLoading = true;
      HTTP.get('status')
      .then((res) => {
        this.info = res.data;

        setTimeout(() => {
          this.ticketsIsLoading = false;
        }, 1000);
      }).catch(() => {
        this.info = {
          currentBlock: 2,
          end: 1
        }
      })
    },
    getHistory: function () {
      HTTP.get('history')
      .then((res) => {
        this.history = res.data;
      })
    }
  },
  created() {
    this.getInfo();
    this.getHistory();
    setInterval(() => {
      this.getInfo();
    }, 5000);
    setInterval(() => {
      this.getHistory();
    }, 20000);

    setTimeout(() => {
      if (this.info.ticketTicker === 'BIP') this.coinPrice = 1;
      else {
        minterSDK.estimateCoinSell({
          coinToSell: this.info.ticketTicker,
          valueToSell: '1',
          coinToBuy: 'BIP',
        }).then((result) => {
            this.coinPrice = result.will_get;
        })
      }
    }, 2000);
  },
  computed: {
    status: function () {
      if (this.info.currentBlock >= this.info.start && this.info.currentBlock < this.info.end) {
        return true
      } else return false;
    },
    explorerURL: function () {
      if (this.info.testnet === true) return 'https://testnet.explorer.minter.network';
      else return 'https://minterscan.net'
    }
  },
}
</script>

<style lang="scss">
  .home {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }

  .completed-games {
    display: flex;
    flex-flow: column wrap;
    margin-top: 20px;
  }

  .card {
      display: flex;
      flex-flow: row nowrap;
      max-width: 100%;
    }

  @media screen and (max-width: 800px) {
    .home {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: unset;
      grid-row-gap: 10px;
    }
  }
</style>

