import NextAuth from "next-auth"
import { User } from "./lib/models/User"
import { comparePassword } from "./lib/auth-utils"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await User.findOne({ email: credentials.email as string })

        if (!user) {
          return null
        }

        const isValid = await comparePassword(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  }
})