<template>
  <div class="container-div">
    <v-snackbar
      :timeout="snackBar.timeout"
      :value="snackBar.display"
      :color="snackBar.color"
      right
      top
    >
      <v-icon left> mdi-alert-circle </v-icon>
      {{ snackBar.message }}
    </v-snackbar>
    <v-card class="flat-card">
      <v-card-title class="flat-title">
        <h3>Manage Accounts</h3>
      </v-card-title>
      <div class="table-container ml-5 mr-5">
        <v-row dense>
          <v-col cols="8">
            <ul class="inline-action">
              <li>
                <v-btn class="mr-2" small @click="list()">
                  <v-icon dark> mdi-refresh </v-icon>
                  Refresh list
                </v-btn>
              </li>
              <li>
                <v-btn class="mr-2" @click="showAccountsFormDialog('', 'Add')">
                  <v-icon left dark> mdi-plus </v-icon>
                  Add
                </v-btn>
              </li>
            </ul>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              class="mb-3 pull-right"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="accounts"
              :search="search"
              class="flat-table"
            >
              <template v-slot:item="row">
                <tr>
                  <td>{{ row.item.id }}</td>
                  <td>{{ row.item.name }}</td>
                  <td>{{ row.item.number }}</td>
                  <td>{{ row.item.balance }}</td>
                  <td>
                    <v-btn
                      class="mx-2"
                      icon
                      small
                      color="primary"
                      @click="showAccountsFormDialog(row.item, 'View')"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon dark v-bind="attrs" v-on="on">
                            mdi-eye
                          </v-icon>
                        </template>
                        <span>View</span>
                      </v-tooltip>
                    </v-btn>
                    <v-btn
                      class="mx-2"
                      icon
                      small
                      color="primary"
                      @click="showAccountsFormDialog(row.item, 'Edit')"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon dark v-bind="attrs" v-on="on">
                            mdi-pencil
                          </v-icon>
                        </template>
                        <span>Edit</span>
                      </v-tooltip>
                    </v-btn>
                    <v-btn
                      class="mx-2"
                      icon
                      small
                      color="primary"
                      @click="closeAccount(row.item)"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon dark v-bind="attrs" v-on="on">
                            mdi-close-circle
                          </v-icon>
                        </template>
                        <span>Close</span>
                      </v-tooltip>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <AccountsFormDialog
      v-if="showDialog"
      v-on:response="showResponse($event)"
      v-model="showDialog"
      :account-data="account"
      :action="dialogAction"
    />
  </div>
</template>

<script>
import axios from "axios";
import AccountsFormDialog from "../dialogs/AccountsFormDialog";

export default {
  name: "AccountPage",
  components: {
    AccountsFormDialog,
  },
  data: () => ({
    loading: false,
    menu: false,
    dialogAction: "",
    showDialog: false,
    snackBar: {
      display: false,
      message: "",
      color: "",
      timeout: 2000,
    },
    headers: [
      {
        text: "Id",
        align: "start",
        filterable: true,
        value: "id",
      },
      {
        text: "Name",
        filterable: true,
        value: "name",
      },
      {
        text: "Number",
        filterable: true,
        value: "number",
      },
      {
        text: "Balance",
        filterable: true,
        value: "balance",
      },
      { text: "Action" },
    ],
    accounts: [],
    account: {
      id: "",
      name: "",
      number: "",
      balance: 0,
    },
    on: "",
    attrs: "",
    search: "",
  }),
  methods: {
    async resetSnackBar() {
      var _this = this;
      _this.snackBar = {
        display: false,
        message: "",
        color: "",
        timeout: 2000,
      };
    },
    async resetAccount() {
      this.account = {
        id: "",
        name: "",
        number: "",
        balance: 0,
      };
    },
    async list() {
      const response = await axios({
        method: "post",
        data: {
          name: this.search,
        },
        auth: {
          username: "danabijak",
          password: "iVpZk1C0AFFwDfDV",
        },
        url: "https://front-end-test-assignment.fintech-market.com/api/v1/accounts/search",
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.accounts = response.data.data;
    },
    async showAccountsFormDialog(data = "", action) {
      this.showDialog = true;
      this.account = data == "" ? this.account : data;
      this.dialogAction = action;
    },
    async showResponse(e) {
      this.resetAccount();
      this.list();
      this.showDialog = false;
      this.dialogAction = "";

      await this.resetSnackBar();
      this.snackBar.message = e.data.message;
      this.snackBar.color = "success";
      this.snackBar.display = true;
    },
    async closeAccount(data) {
      if (data.balance != 0) {
        await this.resetSnackBar();

        this.snackBar.display = true;
        this.snackBar.message =
          "You cannot close this account, balance should be equals to zero";
        this.snackBar.color = "error";
        return false;
      }

      const response = await axios({
        method: "patch",
        data: {
          data: {
            name: this.account.name,
            balance: parseFloat(this.account.balance),
          },
        },
        auth: {
          username: "danabijak",
          password: "iVpZk1C0AFFwDfDV",
        },
        url:
          "https://front-end-test-assignment.fintech-market.com/api/v1/accounts/" +
          data.id +
          "/close",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        await this.resetSnackBar();
        this.list();
        this.snackBar.message = "Account closed successfully";
        this.snackBar.color = "success";
        this.snackBar.display = true;
      } else {
        await this.resetSnackBar();
        this.list();
        this.snackBar.message = "Error!";
        this.snackBar.color = "error";
        this.snackBar.display = true;
      }
    },
  },
  mounted() {
    this.list();
  },
};
</script>
<style lang="postcss" scoped>
.container-div {
  margin: 1%;
  width: 100% !important;
}
</style>
