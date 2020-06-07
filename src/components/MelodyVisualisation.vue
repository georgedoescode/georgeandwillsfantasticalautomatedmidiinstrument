<script>
    import { Scatter } from "vue-chartjs";

    export default {
        extends: Scatter,
        props: ["melody"],
        watch: {
            melody: function() {
                this.render();
            }
        },
        data: function() {
            return {
                options: {
                    animation: false,
                    //responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: 0
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    display: false
                                },
                                display: false
                            }
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    min: Math.min(...this.melody) - 10,
                                    max: Math.max(...this.melody) + 10,
                                    display: false
                                },
                                display: false
                            }
                        ]
                    }
                }
            };
        },
        computed: {
            chartData: function() {
                return {
                    datasets: [
                        {
                            label: "melody",
                            fill: false,
                            borderColor: "#f87979",
                            backgroundColor: "#f87979",
                            data: this.melody.map((v, i) => {
                                if (v !== 0) return { x: i, y: v };
                            })
                        }
                    ]
                };
            }
        },
        mounted() {
            // console.log("this.melody", this.melody);
            // console.log(this.chartData);
            this.render();
        },
        methods: {
            render: function() {
                this.renderChart(this.chartData, this.options);
            }
        }
    };
</script>

<style></style>
