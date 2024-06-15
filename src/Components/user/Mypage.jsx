import React, { useEffect, useState } from "react";
import { Form, Button, Col, InputGroup, Row, Card } from "react-bootstrap";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../../firebaseinit";
import ModalAddress from "./ModalAddress";
import ModalPhoto from "./ModalPhoto";

const Mypage = () => {
  const db = getFirestore(app);
  const uid = sessionStorage.getItem("uid");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "익명",
    phone: "010-1234-1234",
    address1: "인천",
    address2: "인하대",
  });
  const { name, phone, address1, address2 } = form; //비구조할당
  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const callAPI = async () => {
    setLoading(true);
    const res = await getDoc(doc(db, `users/${uid}`));
    if (res.data()) {
      setForm(res.data());
    }
    setLoading(false);
  };
  useEffect(() => {
    callAPI();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (name === "") {
      alert("이름 입력하세요");
      return;
    }
    //정보 저장
    if (!window.confirm("변경 내용 저장하시겠습니까?")) return;
    console.log(form);
    setLoading(true);
    await setDoc(doc(db, `users/${uid}`), form);
    setLoading(false);
    alert("저장 성공!");
  };
  return (
    <Row className="justify-content-center my-5">
      <Col xs={12} md={10} lg={8}>
        <Card>
          <Card.Header>
            <h3 className="text-center">마이페이지</h3>
          </Card.Header>
          <Card.Body>
            <ModalPhoto
              className="mb-5"
              form={form}
              setForm={setForm}
              setLoading={setLoading}
            ></ModalPhoto>
            <form action="" onSubmit={onSubmit}>
              <InputGroup className="mb-2">
                <InputGroup.Text>이름</InputGroup.Text>
                <Form.Control
                  onChange={onChangeForm}
                  name="name"
                  value={name}
                />
              </InputGroup>
              <InputGroup className="mb-2">
                <InputGroup.Text>전화</InputGroup.Text>
                <Form.Control
                  onChange={onChangeForm}
                  name="phone"
                  value={phone}
                />
              </InputGroup>
              <InputGroup className="mb-1">
                <InputGroup.Text>주소</InputGroup.Text>
                <Form.Control
                  onChange={onChangeForm}
                  name="address1"
                  value={address1}
                />
                <ModalAddress
                  form={form}
                  setForm={setForm}
                  setLoading={setLoading}
                ></ModalAddress>{" "}
              </InputGroup>
              <Form.Control
                onChange={onChangeForm}
                placeholder="상세주소"
                name="address2"
                value={address2}
              ></Form.Control>
              <div className="text-center mt-3">
                <Button type="submit" className="ms-2 px-5">
                  저장
                </Button>
                <Button variant="secondary" className="ms-2 px-5">
                  취소
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Mypage;
