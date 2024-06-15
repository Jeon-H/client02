import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebaseinit";
import moment from "moment";

const InsertPage = () => {
  const [form, setForm] = useState({
    title: "",
    contents: "",
  });
  const { title, contents } = form;
  const db = getFirestore(app);
  const uid = sessionStorage.getItem("uid");
  const email = sessionStorage.getItem("email");

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onInsert = async () => {
    if (title === "" || contents === "") {
      alert("제목과 내용 입력하세요!");
      return;
    }
    if (!window.confirm("등록하시겠습니까?")) return;
    //게시글등록
    const data = {
      email: email,
      title,
      contents,
      date: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
    };
    // console.log(data);
    await addDoc(collection(db, "posts"), data);
    // alert("게시글 등록완료");
    window.location.href = "/bbs";
  };
  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1>글쓰기</h1>
        <div className="mt-5">
          <Form.Control
            name="title"
            value={title}
            onChange={onChangeForm}
            className="mb-2"
            placeholder="제목을 입력하세요"
          />
          <Form.Control
            onChange={onChangeForm}
            placeholder="내용을 입력하세요"
            name="contents"
            value={contents}
            as="textarea"
            rows={10}
          />
          <div className="text-center">
            <Button onClick={onInsert} className="px-5 me-2">
              등록
            </Button>
            <Button className="px-5" variant="secondary">
              취소
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default InsertPage;
