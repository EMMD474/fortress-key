import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      firstName: string
      lastName: string
      userName: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    firstName: string
    lastName: string
    userName: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    firstName: string
    lastName: string
    userName: string
  }
}
