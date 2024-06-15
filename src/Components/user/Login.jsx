import React, { useState } from "react";
import { app } from "../../firebaseinit";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";

const Login = () => {
  const navi = useNavigate();
  const auth = getAuth(app);
  const [form, setForm] = useState({
    email: "12345@naver.com",
    password: "12345678",
  });
  const [loading, setLoading] = useState(false);
  const { email, password } = form;
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      alert("이메일과 비밀번호를 입력하세요!");
    } else {
      setLoading(true);
      //로그인 체크
      signInWithEmailAndPassword(auth, email, password)
        .then((success) => {
          alert("로그인 성공!!");
          setLoading(false);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("uid", success.user.uid);
          if (sessionStorage.getItem("target")) {
            navi(sessionStorage.getItem("target"));
          } else {
            navi("/");
          }
        })
        .catch((error) => {
          alert("에러:" + error.message);
          setLoading(false);
        });
    }
  };
  if (loading) return <h1>로딩중입니다...</h1>;
  return (
    <Row className="my-5 justify-content-center">
      <Col md={6} lg={4}>
        <Card>
          <Card.Header>
            <h3 className="text-center">로그인</h3>
          </Card.Header>
          <Card.Body>
            <form onSubmit={onSubmit}>
              <InputGroup className="mb-2">
                <InputGroup.Text
                  style={{ width: 100 }}
                  className="justify-content-center"
                >
                  아이디
                </InputGroup.Text>
                <Form.Control
                  name="email"
                  value={email}
                  onChange={onChange}
                ></Form.Control>
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text
                  style={{ width: 100 }}
                  className="justify-content-center"
                >
                  비밀번호
                </InputGroup.Text>
                <Form.Control
                  name="password"
                  type="password"
                  value={password}
                  onChange={onChange}
                ></Form.Control>
              </InputGroup>
              <div>
                <Button type="submit" className="w-100 btn-dark">
                  로그인
                </Button>
              </div>
              <div>
                <a href="/join" className="text-end" type="submit">
                  회원가입
                </a>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
