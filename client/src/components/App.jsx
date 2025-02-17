import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/auth/authActions";
import Loader from "./Loader";

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const AppLayout = lazy(() => import("./AppLayout"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const Index = lazy(() => import("../pages/strains/Index"));
const NewStrain = lazy(() => import("../pages/strains/NewStrain"));
const StrainDetails = lazy(() => import("../pages/strains/StrainDetails"));
const EditStrain = lazy(() => import("../pages/strains/EditStrain"));
const NewMice = lazy(() => import("../pages/mice/NewMice"));
const NewBreedingRecord = lazy(() =>
  import("../pages/breedingRecords/NewBreedingRecord")
);
const EditBreedingRecord = lazy(() =>
  import("../pages/breedingRecords/EditBreedingRecord")
);
const EditMice = lazy(() => import("../pages/mice/EditMice"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const Dashboard = lazy(() => import("./Dashboard"));
const References = lazy(() => import("./References"));
const HomePage = lazy(() => import("../pages/HomePage"));
const NoPage = lazy(() => import("../pages/NoPage"));

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader content="載入中..." />}>
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/error" element={<ErrorPage />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="strains/index" element={<Index />} />
            <Route path="strains/new" element={<NewStrain />} />
            <Route path="strains/:id" element={<StrainDetails />} />
            <Route path="strains/:id/edit" element={<EditStrain />} />
            <Route path="strains/:id/mice/new" element={<NewMice />} />
            <Route
              path="strains/:strainId/breedingRecord/:breedingRecordId/edit"
              element={<EditBreedingRecord />}
            />
            <Route
              path="strains/:strainId/mice/:mouseId/edit"
              element={<EditMice />}
            />
            <Route
              path="strains/:id/breedingRecord/new"
              element={<NewBreedingRecord />}
            />
            <Route path="profile" element={<ProfilePage />}></Route>
            <Route path="references" element={<References />}></Route>
            <Route path="*" element={<NoPage />}></Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
