import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const authOptions = {
  // debug: true,
  secret: "NEXTAUTH_SECRET",
  providers: [
    KeycloakProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      issuer: process.env.ISSUER,
      authorization: {
        params: {
          scope: "openid",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client
      return {
        ...session,
        token,
        user: {
          ...session.user,
          id: token.sub,
          firstName: token.given_name,
          lastName: token.family_name,
        },
      };
    },
    jwt: async ({ token, account, profile }) => {
      if (profile) {
        token.given_name = profile.given_name;
        token.family_name = profile.family_name;
      }
      if (account) {
        // copy the expiry from the original keycloak token
        // overrides the settings in NextAuth.session
        token.accessToken = account.access_token;
        token.exp = account.expires_at;
        token.id_token = account.id_token;
        token.provider = account.provider;
      }

      return token;
    },
  },
  events: {
    //this clears out keycloak session
    signOut: ({ token }) => doFinalSignoutHandshake(token),
  },
};

async function doFinalSignoutHandshake(jwt) {
  const { id_token } = jwt;

  try {
    // Add the id_token_hint to the query string
    const params = new URLSearchParams();
    params.append("id_token_hint", id_token);
    await fetch(`${process.env.ISSUER}/protocol/openid-connect/logout?${params.toString()}`);

    // The response body should contain a confirmation that the user has been logged out
  } catch (e) {
    // console.error("Unable to perform post-logout handshake", e);
  }
}

export default NextAuth(authOptions);
