<template>
  <v-card class="status-card">
    <v-flex xs12>
      <v-layout column wrap align-start>
        <span class="headline">Инструкция</span>
      </v-layout>
      <v-layout column wrap align-start justify-start align-content-start pt-2>
        <span>Вам понадобятся монеты <strong>LOTTERY</strong>.</span>
        <span>Получить их вы можете в своем кошельке в разделе обмена.</span>
        <p></p>
        <span>1. Убедитесь, что игра идет (до конца не менее 10 блоков)</span>
        <span>2. Отправьте на указанный адрес нужное количество монет LOTTERY</span>
        <span>Например, если цена билета 100 LOTTERY, то 2000 LOTTERY = 20 билетов.</span>
        <span>3. Теперь у вас есть билеты!</span>
        <span>4. Надейтесь на удачу и ждите выигрыша :)</span>
      </v-layout>
      <v-layout column wrap align-start justify-start align-content-start  pt-2>
        <strong>Примечания</strong>
          <span>1 место: 35% от банка</span>
          <span>2 место: 25% от банка</span>
          <span>3 место: 20% от банка</span>
          <span>Случайные 15 билетов: 1% от банка</span>
          <span style="margin-top: 10px">Чем больше у Вас билетов - тем выше шанс выиграть</span>
          <span>Все платежи в других монетах будут возвращены обратно за вычетом комиссии</span>    
      </v-layout>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  name: "HowToPlay"
}
</script>

<style>
  .status-card {
    width: 100%;
    padding: 15px;
  }
</style>
