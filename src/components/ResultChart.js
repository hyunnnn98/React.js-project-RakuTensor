import React from 'react'
import { Line } from 'react-chartjs-2';

const options = {
    legend: {
        display: false, // label 숨기기
    },
    scales: {
        yAxes: [{
            ticks: {
                min: 0, // 스케일에 대한 최솟갓 설정, 0 부터 시작
                stepSize: 1, // 스케일에 대한 사용자 고정 정의 값
            }
        }]
    },
    maintainAspectRatio: false // false로 설정 시 사용자 정의 크기에 따라 그래프 크기가 결정됨.
}


const ResultChart = ({ resultArr }) => {

    const data = {
        labels: ['0차', '1차', '2차', '3차', '4차', '5차', '6차', '7차', '8차', '9차', '10차'],
        datasets: [
            {
                backgroundColor: '#b54dfa96',
                borderColor: '#d6d6d6',
                borderWidth: 2,
                data: resultArr
            }
        ]
    };

    return (
        <Line
            data={data}
            width={400}
            height={200}
            options={options}
        />
    );
};
export default ResultChart
