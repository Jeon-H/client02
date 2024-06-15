import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { Button, Col, Row, Table } from "react-bootstrap";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../../firebaseinit";
import { useNavigate } from "react-router-dom";
import "./Paging.css";

const Listpage = () => {
  const [post, setPost] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const navi = useNavigate();
  const db = getFirestore(app);
  const uid = sessionStorage.getItem("uid");
  const email = sessionStorage.getItem("email");
  const callAPI = () => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    setLoading(true);

    onSnapshot(q, collection(db, `posts`), (snapshot) => {
      let rows = [];
      let no = 0;
      snapshot.forEach((row) => {
        no++;
        rows.push({ no, id: row.id, ...row.data() });
      });
      const start = (page - 1) * size + 1;
      const end = page * size;
      let data = rows.map((row, index) => row && { seq: no - index, ...row });
      data = data.filter((row) => row.no >= start && row.no <= end);
      setCount(no);
      setPost(data);

      setLoading(false);
      console.log(data);
    });
  };

  useEffect(() => {
    callAPI();
  }, [page]);
  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1 className="mb-5">게시글목록</h1>
        {uid && (
          <div className="text-end">
            <a href="/bbs/insert">
              <Button className="px-5">글쓰기</Button>
            </a>
          </div>
        )}
        <Table>
          <thead>
            <tr>
              <td>No.</td>
              <td>Title</td>
              <td>Writer</td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody>
            {post.map((post) => (
              <tr key={post.key}>
                <td>{post.no}</td>
                <td>
                  <a href={`/bbs/read/${post.id}`}>{post.title}</a>
                </td>
                <td>{post.email}</td>
                <td>{post.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          className="pagination"
          activePage={page}
          itemsCountPerPage={size}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={(e) => setPage(e)}
        />
      </Col>
    </Row>
  );
};

export default Listpage;
