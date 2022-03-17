<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="show"
        transition="dialog-bottom-transition"
        max-width="600px"
      >
        <v-snackbar
          :timeout="snackBar.timeout"
          :value="snackBar.display"
          :color="snackBar.color"
          absolute
          right
          top
        >
          <v-icon left> mdi-alert-circle </v-icon>
          {{ snackBar.message }}
        </v-snackbar>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="closeDialog()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-title> Payment Form </v-card-title>
          <v-card-subtitle> </v-card-subtitle>
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-col class="col-md-12">
                  <v-text-field
                    v-model="payment.description"
                    label="Payment Description"
                    :disabled="formDisabled"
                  ></v-text-field>
                </v-col>
                <v-col class="col-md-12">
                  <v-select
                    v-model="payment.type_key"
                    :items="paymentTypes"
                    item-text="paymentName"
                    item-value="value"
                    label="Payment Type"
                    @change="changeForm(payment.type_key)"
                  ></v-select>
                </v-col>
                <v-col class="col-md-12">
                  <v-text-field
                    v-model="payment.amount"
                    label="Payment Amount"
                    type="number"
                    :disabled="formDisabled"
                  ></v-text-field>
                </v-col>
                <!-- <template v-if="payment.type_key === 'internal'"> -->
                <v-col class="col-md-12">Remitter</v-col>
                <v-row class="pl-3 pr4">
                  <v-col class="col-md-6">
                    <v-combobox
                      v-model="payment.remitter"
                      label="Name"
                      :items="accounts"
                      item-text="name"
                      item-value="id"
                      return-object
                      persistent-hint
                      @keyup="listAccountsType"
                      @change="resetAccounts"
                      @click="resetAccounts"
                    >
                    </v-combobox>
                  </v-col>
                  <v-col class="col-md-6">
                    <v-text-field
                      v-model="payment.remitter.number"
                      label="Account Number"
                      :disabled="true"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-col class="col-md-12">Beneficiary</v-col>
                <v-row class="pl-3 pr4">
                  <v-col class="col-md-6">
                    <v-combobox
                      v-model="payment.beneficiary"
                      label="Name"
                      :items="accounts"
                      item-text="name"
                      item-value="id"
                      return-object
                      persistent-hint
                      @keyup="listAccountsType"
                      @change="resetAccounts"
                      @click="resetAccounts"
                    >
                    </v-combobox>
                  </v-col>
                  <v-col class="col-md-6">
                    <v-text-field
                      v-model="payment.beneficiary.number"
                      label="Account Number"
                      :disabled="true"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- </template> -->
              </v-row>
              <v-row v-if="action == 'Add' || action == 'Edit'">
                <v-col class="col-md-4 offset-md-8 text-right mt-2">
                  <v-btn depressed color="primary" @click="savePayment()">
                    Save
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PaymentFormDialog",
  props: {
    value: Boolean,
    paymentData: Object,
    action: String,
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    payment: {
      get() {
        let paymentDataCache = this.paymentData;

        return paymentDataCache;
      },
    },
    formDisabled: {
      get() {
        let _action = false;
        if (this.action == "View") {
          _action = true;
        }
        if (this.action == "Edit" || this.action == "Add") {
          _action = false;
        }
        return _action;
      },
    },
  },
  data: () => ({
    menu: false,
    snackBar: {
      display: false,
      message: "",
      color: "",
      timeout: 2000,
    },
    paymentTypes: [
      {
        paymentName: "Internal",
        value: "internal",
      },
      {
        paymentName: "Incoming",
        value: "incoming",
      },
      {
        paymentName: "Outgoing",
        value: "outgoing",
      },
    ],
    accounts: [],
    searchAccount: "",
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
    async closeDialog() {
      this.$emit("response", "");
      this.show = false;
    },
    async changeForm(paymentType) {
      console.log(paymentType);
    },
    async resetAccounts() {
      this.searchAccount = "";
    },
    async listAccountsType(val) {
      if (val.key.length > 1) {
        if (val.key === "Backspace") {
          this.searchAccount = this.searchAccount.slice(0, -1);
        }
      } else {
        this.searchAccount += val.key;
        if (this.searchAccount.length >= 1) {
          const response = await axios({
            method: "post",
            data: {
              name: this.searchAccount,
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

          await response.data.data.forEach((e) => {
            this.accounts.push({
              id: e.id,
              name: e.name,
              number: e.number,
            });
          });
        }
      }
    },
    async savePayment() {
      if (this.payment.description == "") {
        await this.resetSnackBar();

        this.snackBar.display = true;
        this.snackBar.message = "Fill up payment description";
        this.snackBar.color = "error";
        return false;
      }

      if (this.payment.type_key == "") {
        await this.resetSnackBar();

        this.snackBar.display = true;
        this.snackBar.message = "Please select payment type";
        this.snackBar.color = "error";
        return false;
      }

      // if (this.payment.amount == 0) {
      //   await this.resetSnackBar();

      //   this.snackBar.display = true;
      //   this.snackBar.message =
      //     "You cant fill up amount equals or less than zero";
      //   this.snackBar.color = "error";
      //   return false;
      // }

      if (
        this.payment.remitter.id == "" ||
        this.payment.remitter.name == "" ||
        this.payment.remitter.number == ""
      ) {
        await this.resetSnackBar();

        this.snackBar.display = true;
        this.snackBar.message = "Please search for remitter";
        this.snackBar.color = "error";
        return false;
      }

      if (
        this.payment.beneficiary.id == "" ||
        this.payment.beneficiary.name == "" ||
        this.payment.beneficiary.number == ""
      ) {
        await this.resetSnackBar();

        this.snackBar.display = true;
        this.snackBar.message = "Please search for beneficiary";
        this.snackBar.color = "error";
        return false;
      }

      if (this.action === "Add") {
        console.log( this.payment )
        let data = {}
        if (this.payment.type_key === "internal") {
          data = {
            description: this.payment.description,
            amount: parseFloat( this.payment.amount ),
            type_key: this.payment.type_key,
            remitter_account_id: this.payment.remitter.id,
            beneficiary_account_id: this.payment.beneficiary.id,
          }
        }
        if (this.payment.type_key === "incoming") {
          data = {
            description: this.payment.description,
            amount: parseFloat( this.payment.amount ),
            type_key: this.payment.type_key,
            remitter_name: this.payment.remitter.name,
            remitter_account_number: this.payment.remitter.number,
            beneficiary_account_id:  this.payment.beneficiary.id,
          }
        }
        if (this.payment.type_key === "outgoing") {
          data = {
            description: this.payment.description,
            amount: parseFloat( this.payment.amount ),
            type_key: this.payment.type_key,
            remitter_account_id:  this.payment.remitter.id,
            beneficiary_name: this.payment.beneficiary.name,
            beneficiary_account_number: this.payment.beneficiary.number
          }
        }
        
        const response = await axios({
          method: "post",
          data: {
            data
          },
          auth: {
            username: "danabijak",
            password: "iVpZk1C0AFFwDfDV",
          },
          url: "https://front-end-test-assignment.fintech-market.com/api/v1/payments",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201) {
          this.$emit("response", {
            data: {
              display: true,
              message: "Payment added successfully",
              color: "success",
            },
          });
          this.show = false;
        }
      }
    },
  },
  mounted() {
    // this.listAccounts()
  },
};
</script>
<style lang="postcss" scoped></style>
