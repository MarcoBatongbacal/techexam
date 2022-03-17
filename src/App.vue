<template>
  <v-app>
    <v-app-bar app flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="drawer == true">
        <v-icon>mdi-chevron-left</v-icon>
      </v-app-bar-nav-icon>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="drawer == false">
        <v-icon>mdi-chevron-right</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      app
      width="260"
      class="navigation-bar"
      v-model="drawer"
    >
      <v-list nav dense shaped class="pl-0">
        <v-list-item-content class="text-center">
          <v-list-item-title class="text-h6 title-side">{{
            title
          }}</v-list-item-title>
          <v-list-item-title class="title-side"
            ><small>by: Marco Batongbacal</small></v-list-item-title
          >
        </v-list-item-content>
        <v-divider></v-divider>
        <v-list-item to="/accounts">
          <v-list-item-title class="text-subtitle-1">
            <v-icon class="mdi mdi-account-box"></v-icon>
            Accounts
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="/payments">
          <v-list-item-title class="text-subtitle-1">
            <v-icon class="mdi mdi-credit-card-outline"></v-icon>
            Payments
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main tag="router-view"></v-main>
  </v-app>
</template>

<script>

export default {
  name: "App",
  components: {
  },
  data: () => ({
    title: "Technical Exam",
    drawer: true,
  }),
};
</script>

<style lang="scss">
@import "./styles/custom.scss";
</style>
