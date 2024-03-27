import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "../authconfig";
import { connectToDB } from "../lib/utils";
import bcrypt from "bcrypt";
import { User } from "../lib/model";

const login = async (credentials) => {
  try {
    connectToDB();
    const user = await User.findOne({ username: credentials.username });

    if (!user) throw new Error("Wrong credentials!");

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Wrong credentials!");

    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to login!");
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  //  ADD ADDITIONAL INFORMATION TO SESSION because auth in next js when
  //   we log in by default storing email address in jwt
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // get data from user and pass it to token
        token.username = user.username;
        token.img = user.img;
      }
      return token;
    },
    // to reach this data inside our component should pass the token information to session
    async session({ session, token }) {
      if (token) {
        // get data from token and pass it to session
        session.user.username = token.username;
        session.user.img = token.img;
      }
      return session;
    },
  },
});
