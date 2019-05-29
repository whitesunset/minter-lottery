<template>
  <div class="home">
    <div class="card">
      <GameInfo />
    </div>
    <div class="card">
      <HowToPlay />
    </div>
  </div>
</template>

<script>
import GameInfo from '../components/GameInfo';
import HowToPlay from '../components/HowToPlay';

export default {
  name: 'home',
  components: {
    GameInfo,
    HowToPlay
  }
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
      width: 100%;
    }
  }

  @media screen and (max-width: 800px) {
    .home {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 0px;
    }
  }
</style>

