import React from "react";

import UsersList from "../components/UsersList";

const DUMMY_USERS = [
    {
        id: "u1", 
        name: "ttbb", 
        image: "https://static.dw.com/image/48396304_303.jpg", 
        places: 3
    }
];


const Users = () => {
    return <UsersList items={DUMMY_USERS}/>;
};

export default Users;