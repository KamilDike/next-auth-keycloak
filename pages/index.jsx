import React from 'react';
import App from "../app"
import {SessionProvider} from "next-auth/react";

const Index = ({pageProps}) => {
    return (
        <SessionProvider session={pageProps?.session}>
          <App/>
        </SessionProvider>
    );
};

export default Index;
