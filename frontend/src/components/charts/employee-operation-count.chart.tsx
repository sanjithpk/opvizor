import { Bar } from "react-chartjs-2"
import { PaletteType } from "@material-ui/core"
import { colors } from "../../utils/theme"

interface Props {
  data: any
  theme: PaletteType
}

const EmployeeOperationCountChart: React.FC<Props> = ({ data, theme }) => {

  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "EMPLOYEE NAME",
          color: colors.textPrimary[theme]
        },
        ticks:{
          color: colors.textPrimary[theme],
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90
        },
        grid: {
          color: colors.gridColor,
        }
      },
      y: {
        display: true,
        color: colors.red,
        title: {
          display: true,
          text: "OPERATION COUNT",
          color: colors.textPrimary[theme]
        },
        ticks: {
          stepSize: 1,
          color: colors.textPrimary[theme]
        },
        grid: {
          color: colors.gridColor
        }
      }
    }
  }

  return <Bar type="line" data={data} options={options} />
}

export default EmployeeOperationCountChart