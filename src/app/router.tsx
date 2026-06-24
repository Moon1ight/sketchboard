import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./app";
import { ROUTES } from "@/shared/model/routes";

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                path: ROUTES.BOARDS,
                lazy: () => import('@/pages/boards-list/boards-list.page')
            },
            {
                path: ROUTES.BOARD,
                lazy: () => import('@/pages/board/board.page')
            },
            {
                path: ROUTES.LOGIN,
                lazy: () => import('@/pages/auth/login.page')
            },
            {
                path: ROUTES.REGISTER,
                lazy: () => import('@/pages/auth/register.page')
            },
            {
                path: ROUTES.HOME,
                loader: () => redirect(ROUTES.BOARD)
            }
        ]
    }
])