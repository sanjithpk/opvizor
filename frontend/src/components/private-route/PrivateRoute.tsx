import { Redirect, Route, RouteProps } from "react-router"

interface Props extends RouteProps {
  component: React.ComponentType<any>
  authed: boolean
}

const PrivateRoute: React.FC<Props> = ({
  component: Component,
  authed,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
