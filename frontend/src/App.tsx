import { useCallback, useEffect, useState } from "react"
import { Route, Switch } from "react-router-dom"
import Layout from "./components/layout/Layout"
import OperationForm from "./components/operation-form/OperationForm"
import OperationStepper from "./components/operation-stepper/OperationStepper"
import OperationView from "./components/operation-view/OperationView"
import PrivateRoute from "./components/private-route/PrivateRoute"
import NotFoundPage from "./pages/404/NotFoundPage"
import EmployeeCrudPage from "./pages/employee-crud/EmployeeCrudPage"
import EmployeeDashboardPage from "./pages/employee-dashboard/EmployeeDashboardPage"
import HomePage from "./pages/home/HomePage"
import LoginPage from "./pages/login/LoginPage"
import ManagerDashboardPage from "./pages/manager-dashboard/ManagerDashboardPage"
import NotificationsPage from "./pages/notifications/NotificationsPage"
import OperationCrudPage from "./pages/operation-crud/OperationCrudPage"
import RegisterPage from "./pages/register/RegisterPage"
import ManagerReportPage from "./pages/manager-report/ManagerReportPage"
import EmployeeReportPage from "./pages/employee-report/EmployeeReportPage"
import firebaseNotifications from "./services/firebase"
import AuthContext, { User } from "./store/auth-context"

const App = () => {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    email: "",
    role: "",
    token: ""
  })

  useEffect(() => {
    const user = window.localStorage.getItem("user")
    if (user) {
      let parsedUser = JSON.parse(user) as User
      setUser(parsedUser)
    }
  }, [])

  const setNotificationToken = useCallback(async () => {
    const token = await firebaseNotifications()
    if (typeof token !== "undefined")
      setUser(user => ({
        ...user,
        token
      }))
  }, [])

  useEffect(() => {
    setNotificationToken()
  }, [setNotificationToken])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <PrivateRoute
            authed={user.isLoggedIn}
            exact
            path="/manager"
            component={ManagerDashboardPage}
          />
          <Route exact path="/manager/employees" component={EmployeeCrudPage} />
          <Route
            exact
            path="/manager/operations"
            component={OperationCrudPage}
          />
          <Route
            exact
            path="/manager/operations/create"
            component={OperationForm}
          />
          <Route
            path="/manager/operations/edit/:operationId"
            component={OperationForm}
          />
          <Route
            path="/:role/operation/detail/:operationId"
            component={OperationView}
          />
          <Route exact path="/manager/report" component={ManagerReportPage} />
          <Route exact path="/employee/report" component={EmployeeReportPage} />
          <Route exact path="/employee" component={EmployeeDashboardPage} />
          <Route
            path="/:role/operation/:operationId"
            component={OperationStepper}
          />
          <Route
            exact
            path="/:role/notifications"
            component={NotificationsPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    </AuthContext.Provider>
  )
}

export default App
