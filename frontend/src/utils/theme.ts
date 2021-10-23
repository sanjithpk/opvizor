import { PaletteType } from "@material-ui/core"
import { createMuiTheme } from "@material-ui/core/styles"

export const tagColors = {
  red: {
    light: {
      backgroundColor: "#fff2e8",
      color: "#d4380d",
      border: "1px solid #ffbb96"
    },
    dark: {
      backgroundColor: "#151a21",
      color: "#fff2e8",
      border: "1px solid #fff2e8"
    }
  },
  green: {
    light: {
      backgroundColor: "#f6ffed",
      color: "#389e0d",
      border: "1px solid #b7eb8f"
    },
    dark: {
      backgroundColor: "#151a21",
      color: "#f6ffed",
      border: "1px solid #f6ffed"
    }
  },
  blue: {
    light: {
      backgroundColor: "#f0f5ff",
      color: "#1d39c4",
      border: "1px solid #adc6ff"
    },
    dark: {
      backgroundColor: "#151a21",
      color: "#fff",
      border: "1px solid #fff"
    }
  },
  default: {
    light: {
      backgroundColor: "#fff",
      color: "#000",
      border: "1px solid #209cee"
    },
    dark: {
      backgroundColor: "#151a21",
      color: "#fff",
      border: "1px solid #266eda"
    }
  }
}

export const colors = {
  primary: {
    light: "#209cee",
    dark: "#266eda"
  },
  paper: {
    light: "#fff",
    dark: "#151a21"
  },
  textPrimary: {
    light: "#151a21",
    dark: "#fff"
  },
  red: "#e03b24",
  blue: "#3865a3",
  green: "#64a338",
  yellow: "#ffcc00",
  purple: "#6200ee",
  teal: "#03dac5",
  orange: "#FF6D00",
  gridColor: "#aaaaaa"
}

const theme = (type: PaletteType) =>
  createMuiTheme({
    palette: {
      type: type,
      primary: {
        main: colors.primary[type]
      },
      background: {
        paper: colors.paper[type]
      }
    }
  })

export default theme
