<template>
    <div>
        <AccountsPage ref = "AccountsPage"/>
    </div>
</template>

<script>
import AccountsPage from '../components/pages/AccountsPage'

export default{
    name: 'Account',
    components: {
        AccountsPage
    },
    mounted() {
        this.$root.AccountsPage = this.$refs.AccountsPage
    }
}
</script>
