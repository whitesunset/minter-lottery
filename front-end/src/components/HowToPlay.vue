<template>
  <v-card class="status-card">
    <v-flex xs12>
      <v-layout column wrap align-start>
        <span class="headline">Инструкция</span>
      </v-layout>
      <v-layout column wrap align-start justify-start align-content-start pt-2>
        <span>Вам понадобятся монеты <strong>{{ticketTicker}}</strong>.</span>
        <span>Получить их вы можете в своем кошельке в разделе обмена.</span>
        <p></p>
        <span>1. Убедитесь, что игра идет (до конца не менее 10 блоков)</span>
        <span>2. Отправьте на указанный адрес нужное количество монет {{ticketTicker}}</span>
        <span>Например, если цена билета 100 {{ticketTicker}}, то 2000 {{ticketTicker}} = 20 билетов.</span>
        <span>3. Теперь у вас есть билеты!</span>
        <span>4. Надейтесь на удачу и ждите выигрыша :)</span>
      </v-layout>
      <v-layout column wrap align-start justify-start align-content-start  pt-2>
        <strong>Примечания</strong>
          <span>1 место: 30% от банка</span>
          <span>2 место: 25% от банка</span>
          <span>3 место: 20% от банка</span>
          <span>4-10 место: 1% от банка</span>
          <span>10-20 место: 0.8% от банка</span>
          <strong style="margin-top: 10px">Чем больше у Вас билетов - тем выше шанс на победу!</strong> 
      </v-layout>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  name: "HowToPlay",
  props: ['ticketTicker']
}
</script>

<style>
  .status-card {
    width: 100%;
    padding: 15px;
    text-align: left;
  }
</style>
