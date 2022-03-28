<template>
    <div>
        <PaymentsPage ref = "PaymentsPage"/>
    </div>
</template>

<script>
import PaymentsPage from '../components/pages/PaymentsPage'

export default{
    name: 'Payments',
    components: {
        PaymentsPage
    },
    mounted() {
        this.$root.PaymentsPage = this.$refs.PaymentsPage
    }
}
</script>
