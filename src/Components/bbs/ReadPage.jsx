import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Card } from "react-bootstrap";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { app } from "../../firebaseinit";
import Comments from "./Comments";

const ReadPage = () => {
  const navi = useNavigate();
  const [post, setPost] = useState("");
  const { id } = useParams();
  //   console.log(id);
  const db = getFirestore(app);
  const loginEmail = sessionStorage.getItem("email");
  const { email, date, updateDate, title, contents } = post;
  const callAPI = async () => {
    const res = await getDoc(doc(db, `posts/${id}`));
    console.log(res.data);
    setPost(res.data());
  };
  useEffect(() => {
    callAPI();
  }, []);
  const onClickDelete = async () => {
    if (!window.confirm(`ID : ${id} 게시글을 삭제하실래요?`)) return;
    //게시글 삭제
    await deleteDoc(doc(db, `/posts/${id}`));
    navi("/bbs"); // 이건 위에 navi 지정해줘야함
  };
  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1>게시글 정보</h1>
        {loginEmail == email && (
          <div className="text-end mb-2">
            <Button
              onClick={() => navi(`/bbs/update/${id}`)}
              variant="success"
              size="sm"
              className="me-2"
            >
              {" "}
              수정
            </Button>
            <Button onClick={onClickDelete} variant="danger" size="sm">
              삭제
            </Button>
          </div>
        )}
        <Card>
          <Card.Body>
            <h5>{title}</h5>
            <div className="text-muted">
              <span>작성 : {date}</span>
              <span>{updateDate && ` / 수정일 : ${updateDate}`}</span>{" "}
              <span> {email}</span>
            </div>
            <hr />
            <div style={{ whiteSpace: "pre-wrap" }}>{contents}</div>
          </Card.Body>
        </Card>{" "}
        <Comments />{" "}
      </Col>
    </Row>
  );
};

export default ReadPage;
