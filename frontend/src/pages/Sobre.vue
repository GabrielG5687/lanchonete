<script setup>
const integrantes = [
  { nome: 'Gabriel Guedes', matricula: '202400001' },
  { nome: 'Integrante 2', matricula: '202400002' },
  { nome: 'Integrante 3', matricula: '202400003' },
]
</script>

<template>
  <v-container fluid class="pa-0">
    <v-card class="pa-6 mb-4">
      <h1 class="text-h5 mb-2">Sobre o Projeto</h1>
      <p class="text-medium-emphasis mb-5">
        Aplicacao desenvolvida com tema <strong>Lanchonete UNEMAT</strong>, simulando o
        gerenciamento de cardapio de uma lanchonete universitaria.
      </p>

      <v-row dense>
        <v-col cols="12" md="6">
          <v-card variant="tonal" color="primary" class="pa-4 h-100">
            <h2 class="text-h6 mb-2">Tema Escolhido</h2>
            <p class="mb-0">
              Sistema de cadastro, edicao e controle de disponibilidade de itens do cardapio.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card variant="tonal" color="secondary" class="pa-4 h-100">
            <h2 class="text-h6 mb-3">Integrantes</h2>
            <v-list bg-color="transparent" density="comfortable">
              <v-list-item v-for="integrante in integrantes" :key="integrante.matricula">
                <v-list-item-title>{{ integrante.nome }}</v-list-item-title>
                <v-list-item-subtitle>Matricula: {{ integrante.matricula }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
