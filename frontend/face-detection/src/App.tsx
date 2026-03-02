import { Route, Routes } from "react-router-dom";
import FaceDetectorComponent from "./components/FaceDetectorComponent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FaceDetectorComponent />} />
      <Route path="/teste-camera" element={<FaceDetectorComponent />} />
    </Routes>
  );
}

export default App;