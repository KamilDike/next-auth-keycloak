import React from 'react';
import {signIn, signOut, useSession} from "next-auth/react";

const App = () => {
    const {data} = useSession();

    return (
        <div>
            <button onClick={() => signIn("keycloak")}>Sign in</button>
            <button onClick={signOut}>Sign out</button>
            {data?.user && <div>
                logged as: {data?.user?.email}
            </div>}
        </div>
    );
};

export default App;
