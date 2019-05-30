<template>
  <div class="home">
    <div class="card">
      <GameInfo :info="info" />
    </div>
    <div class="card">
      <HowToPlay />
    </div>
    <div v-if="status" class="card">
      <Tickets :tickets="tickets" :isLoading="ticketsIsLoading" />
    </div>
    <div v-if="status" class="card">
      <Rewards :ticketsNumber="ticketsNumber" :isLoading="ticketsIsLoading" :info="info" />
    </div>
  </div>
</template>

<script>
import GameInfo from '../components/GameInfo';
import HowToPlay from '../components/HowToPlay';
import Tickets from '../components/Tickets';
import Rewards from '../components/Rewards';

import { HTTP } from '../http';

export default {
  name: 'home',
  components: {
    GameInfo,
    HowToPlay,
    Tickets,
    Rewards
  },
  data() {
    return {
      info: {},
      tickets: [],
      ticketsIsLoading: true,
      ticketsNumber: 0
    }
  },
  methods: {
    getInfo: function () {
      HTTP.get('status')
      .then((res) => {
        this.info = res.data;
      })
    },
    getTickets: function () {
      this.ticketsIsLoading = true;
      HTTP.get('tickets')
      .then((res) => {
        setTimeout(() => {
          this.ticketsIsLoading = false;
        }, 2000);

        this.tickets = [];
        this.ticketsNumber = res.data.length;

        for (let i = 0; i < res.data.length; i++) {
          let ticketCounter = 0;
          for (let j = 0; j < res.data.length; j++) {
            if (res.data[i].owner === res.data[j].owner) ticketCounter++;
          }
          let skip = false;
          for (let j = 0; j < this.tickets.length; j++) {
            if (this.tickets[j].owner === res.data[i].owner) skip = true;
          }
          if (skip === false) this.tickets.push({
            owner: res.data[i].owner,
            tickets: ticketCounter
          })
        }
      })
    }
  },
  created() {
    this.getInfo();
    this.getTickets();
    setInterval(() => {
      this.getInfo();
    }, 5000);
    setInterval(() => {
      this.getTickets();
    }, 10000);
  },
  computed: {
    status: function () {
      if (this.info.currentBlock >= this.info.start && this.info.currentBlock < this.info.end) {
        return true
      } else return false;
    },
  },
}
</script>

<style lang="scss" scoped>
  .home {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;

    .card {
      display: flex;
      flex-flow: row nowrap;
      max-width: 100%;
    }
  }

  @media screen and (max-width: 800px) {
    .home {
      display: grid;
      grid-template-columns: 1fr;
      grid-row-gap: 10px;
    }
  }
</style>

