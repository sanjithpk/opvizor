import { PolarArea } from "react-chartjs-2"
import { PaletteType } from "@material-ui/core"
import { colors } from "../../utils/theme"

interface Props {
  data: any
  theme: PaletteType
}

const TagWiseOperationCountChart: React.FC<Props> = ({ data, theme }) => {
  const options = {
    plugins: {
      legend: {
        labels: {
          color: colors.textPrimary[theme],
          font: {
            size: 14
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          backdropColor: colors.paper[theme],
          color: colors.textPrimary[theme]
        },
        angleLines: {
          color: colors.gridColor
        },
        pointLabels: {
          color: colors.textPrimary[theme]
        },
        grid: {
          color: colors.gridColor
        }
      }
    }
  }

  return <PolarArea type="radar" data={data} options={options} />
}

export default TagWiseOperationCountChart
