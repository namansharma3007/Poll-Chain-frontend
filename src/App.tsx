import { Routes, Route, useLocation } from "react-router";
import Dashboard from "./pages/Dashboard";
import { PublicRoute } from "./routes/PublicRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sidebar from "./components/Sidebar";
import ExplorePolls from "./pages/Explore-polls";
import MyPolls from "./pages/My-polls";
import CreatePoll from "./pages/Create-poll";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import TopBar from "./components/TopBar";
import PollVote from "./pages/Poll-vote";
import SearchPolls from "./pages/Search-polls";

export default function App() {
  const location = useLocation();


  const isAuthenticatedPath = ["/login", "/signup", "/"].includes(
    location.pathname
  );

  const routes = [
    {
      path: "/",
      component: <Home />,
    },
    {
      path: "/login",
      component: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/signup",
      component: (
        <PublicRoute>
          <Signup />
        </PublicRoute>
      ),
    },
    {
      path: "/dashboard",
      component: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      path: "/explore-polls",
      component: (
        <PrivateRoute>
          <ExplorePolls />
        </PrivateRoute>
      ),
    },
    {
      path: "/my-polls",
      component: (
        <PrivateRoute>
          <MyPolls />
        </PrivateRoute>
      ),
    },
    {
      path: "/create-poll",
      component: (
        <PrivateRoute>
          <CreatePoll />
        </PrivateRoute>
      ),
    },
    {
      path: "/settings",
      component: (
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      ),
    },
    {
      path: "/poll-vote/:pollId",
      component: (
        <PrivateRoute>
          <PollVote />
        </PrivateRoute>
      ),
    },
    {
      path: "/search-polls",
      component: (
        <PrivateRoute>
          <SearchPolls />
        </PrivateRoute>
      ),
    },
  ];

  return (
    <section className="overflow-hidden flex h-screen">
      <Toaster />
      {!isAuthenticatedPath && (
        <Sidebar />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!isAuthenticatedPath && <TopBar />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            {routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={route.component}
                />
              );
            })}
          </Routes>
        </main>
      </div>
    </section>
  );
}
