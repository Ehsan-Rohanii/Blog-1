import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import PostDetails from "../Pages/Home/PostDetails";
import CreatePost from "../Pages/Home/CreatePost";
import UpdatePost from "../Pages/Home/UpdatePost";
import Categories from "../Pages/Home/Categories";
import Users from "../Pages/Users";


const router = createBrowserRouter([
    {
        path:"/register" ,
        element:<Register/>
    },
    {
        path:"/" ,
        element:<Login/>
    },
    {
        path:"/home" ,
        element : <Layout/>
    },
    {
        path:"/post/:id" ,
        element:<PostDetails/>
    },
    {
        path:"/create-post" ,
        element:<CreatePost/>
    },
    {
        path:"/update-post/:id" ,
        element:<UpdatePost/>
    },
    {
        path:"/categories" ,
        element:<Categories/>
    },
    {
        path:"users" ,
        element:<Users/>
    }
])
export default router ;