<script>
import { Bar } from 'vue-chartjs'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'

export default {
  extends: Bar,
  props: ['height'],
  mounted () {
    const datasets4 = [
      {
        label: 'Plates Printed',
        backgroundColor: 'rgba(255,255,255,.3)',
        borderColor: 'transparent',
        data: [341, 686, 977, 1344, 1979, 2115, 2897]
      }
    ]
    this.renderChart(
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: datasets4
      },
      {
        tooltips: {
          enabled: false,
          custom: CustomTooltips
        },
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false,
            categoryPercentage: 1,
            barPercentage: 0.5
          }],
          yAxes: [{
            display: false
          }]
        }
      }
    )
  }
}
</script>
