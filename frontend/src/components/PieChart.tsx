import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js'
import React from 'react'
import { Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Colors)

type PieChartProps = {
    labels: string[]
    values: number[]
}

const PieChart = ({ labels, values }: PieChartProps) => {
    // Calculate total for percentage
    const total = values.reduce((sum, value) => sum + value, 0)

    // Calculate percentages
    const percentages = values.map((value) => ((value / total) * 100).toFixed(1))

    return (
        <Pie
            data={{
                labels,
                datasets: [
                    {
                        data: values,
                        borderWidth: 1,
                    },
                ],
            }}
            options={{
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw as number
                                const percentage = percentages[context.dataIndex]
                                return `${context.label}: ${value} (${percentage}%)`
                            },
                        },
                    },
                    colors: {
                        forceOverride: true,
                    },
                },
                layout: {
                    padding: 20,
                },
            }}
        />
    )
}

export default PieChart
