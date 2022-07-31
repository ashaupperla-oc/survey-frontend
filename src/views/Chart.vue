<template>
<canvas :id=nameOfId  style="border:5px solid red"></canvas>
</template>


<script>
  import Chart from 'chart.js/auto';

export default {

  name: 'Chart',
  data(){
    return {
      nameOfId: this.nameOfId
    }
  },
  
  props: ['nameOfId'],
  computed(){

  },
  mounted(){
    
    var ctx = document.getElementById(this.nameOfId).getContext("2d");
        ctx.canvas.width = 200;
        ctx.canvas.height = 200;
                const data = {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
                label: 'My First Dataset',
                data: [1,2,3],
                backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
            };

            const chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
                        responsive: false,
                        
                    }
        });
  },
  methods: {
    
  }
};
</script>
