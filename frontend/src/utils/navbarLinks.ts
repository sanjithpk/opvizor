export const NavbarLinks = {
  home: [
    {
      name: "Home",
      path: "/"
    }
  ],
  manager: [
    {
      name: "Home",
      path: "/"
    },
    {
      name: "Dashboard",
      path: "/manager"
    },
    {
      name: "Employee",
      path: "/manager/employees"
    },
    {
      name: "Operation",
      path: "/manager/operations"
    },
    {
      name: "Report",
      path: "/manager/report"
    }
  ],
  employee: [
    {
      name: "Home",
      path: "/"
    },
    {
      name: "Dashboard",
      path: "/employee"
    },
    {
      name: "Report",
      path: "/employee/report"
    }
  ]
}

export interface NavbarLink {
  name: string
  path: string
}
