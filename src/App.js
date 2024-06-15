import "./App.css";
import Bottom from "./Components/Bottom";
import Top from "./Components/Top";
import { Container } from "react-bootstrap";
import Menu from "./Components/Menu";

function App() {
  return (
    <Container>
      <Top />
      <Menu />
      <Bottom />
    </Container>
  );
}

export default App;
