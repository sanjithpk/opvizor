import { Doughnut } from "react-chartjs-2"
import { colors } from "../../utils/theme"
import { PaletteType } from "@material-ui/core"

interface Props {
  data: any
  theme: PaletteType
}

const OperationStatusChart: React.FC<Props> = ({ data, theme }) => {

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
    }
  }

  return <Doughnut type="doughnut" data={data} options={options} />
}

export default OperationStatusChart
