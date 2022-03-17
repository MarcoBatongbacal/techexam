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
          <v-card-title> Account Form </v-card-title>
          <v-card-subtitle> </v-card-subtitle>
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-col class="col-md-12">
                  <v-text-field
                    v-model="account.name"
                    label="Account Name"
                    :disabled="formDisabled"
                  ></v-text-field>
                </v-col>
                <!-- <v-col class="col-md-12">
                  <v-text-field
                    v-model="account.number"
                    label="Account Number"
                    :disabled="formDisabled"
                  ></v-text-field>
                </v-col> -->
                <v-col class="col-md-12">
                  <v-text-field
                    v-model="account.balance"
                    label="Account Balance"
                    type="number"
                    :disabled="formDisabled"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="action == 'Add' || action == 'Edit'">
                <v-col class="col-md-4 offset-md-8 text-right mt-2">
                  <v-btn depressed color="primary" @click="saveAccount()">
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
  name: "AccountFormDialog",
  props: {
    value: Boolean,
    accountData: Object,
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
    account: {
      get() {
        let accountDataCache = this.accountData;

        return accountDataCache;
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
    async saveAccount() {
      if (this.account.name == "") {
        await this.resetSnackBar();

        this.snackBar.display = true;
        this.snackBar.message = "Fill up Account Name";
        this.snackBar.color = "error";
        return false;
      }

      if (this.account.balance < 0) {
        await this.resetSnackBar();

        this.snackBar.display = true;
        this.snackBar.message = "You cant fill up balance less than zero";
        this.snackBar.color = "error";
        return false;
      }

      if (this.action === "Add") {
        const response = await axios({
          method: "post",
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
          url: "https://front-end-test-assignment.fintech-market.com/api/v1/accounts",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201) {
          this.$emit("response", {
            data: {
              display: true,
              message: "Account added successfully",
              color: "success",
            },
          });
          this.show = false;
        }
      }
      if (this.action === "Edit") {
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
          url: "https://front-end-test-assignment.fintech-market.com/api/v1/accounts/"+this.account.id,
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.status === 200) {
          this.$emit("response", {
            data: {
              display: true,
              message: "Account updated successfully",
              color: "success",
            },
          });
          this.show = false;
        }
      }
    },
  },
  mounted() {},
};
</script>
