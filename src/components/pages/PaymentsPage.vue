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
        <h3>Manage Payments</h3>
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
                <v-btn class="mr-2" @click="showPaymentFormDialog('', 'Add')">
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
              :items="payments"
              :search="search"
              class="flat-table"
            >
              <template v-slot:item="row">
                <tr>
                  <td>{{ row.item.id }}</td>
                  <td>{{ row.item.description }}</td>
                  <td>{{ row.item.type_key }}</td>
                  <td>{{ row.item.amount }}</td>
                  <td>
                    <v-btn
                      class="mx-2"
                      icon
                      small
                      color="primary"
                      @click="showPaymentFormDialog(row.item, 'View')"
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
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <PaymentsFormDialog
      v-if="showDialog"
      v-on:response="showResponse($event)"
      v-model="showDialog"
      :payment-data="payment"
      :action="dialogAction"
    />
  </div>
</template>

<script>
import axios from "axios";
import PaymentsFormDialog from "../dialogs/PaymentsFormDialog";

export default {
  name: "PaymentPage",
  components: {
    PaymentsFormDialog,
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
        text: "Description",
        filterable: true,
        value: "description",
      },
      {
        text: "Type",
        filterable: true,
        value: "type_key",
      },
      {
        text: "Amount",
        filterable: true,
        value: "amount",
      },
      { text: "Action" },
    ],
    payments: [],
    payment: {
      id: "",
      description: "",
      amount: 0,
      type_key: "",
      remitter: {
        id: "",
        name: "",
        number: ""
      },
      beneficiary: {
        id: "",
        name: "",
        number: ""
      },
      
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
    async resetPayment() {
      this.payment = {
        id: "",
        description: "",
        amount: 0,
        type_key: 0,
        remitter_account_id: "",
        beneficiary_account_id: "",
        beneficiary_account_number: "",
        beneficiary_name: "",
        remitter_name: "",
        remitter_account_number: "",
        remitter: [],
        beneficiary: []
      };
    },
    async list() {
      const response = await axios({
        method: "post",
        data: {
          id: "",
          amount: "",
          description: "",
          remitter_account_id: "",
          beneficiary_account_id: "",
          remitter_account_number: "",
          remitter_name: "",
          beneficiary_account_number: "",
          beneficiary_name: "LHV",
          account_id: "",
        },
        auth: {
          username: "danabijak",
          password: "iVpZk1C0AFFwDfDV",
        },
        url: "https://front-end-test-assignment.fintech-market.com/api/v1/payments/search",
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.payments = response.data.data;
    },
    async showPaymentFormDialog(data = "", action) {
      this.showDialog = true;
      this.payment = data == "" ? this.payment : data;
      this.dialogAction = action;
    },
    async showResponse(e) {
      console.log( e )
      this.resetPayment();
      this.list();
      this.showDialog = false;
      this.dialogAction = "";

      await this.resetSnackBar();
      if( e !== '' ){
        this.snackBar.message = e.data.message;
        this.snackBar.color = "success";
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
