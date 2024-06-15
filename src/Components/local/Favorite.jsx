import React, { useEffect, useState } from "react";
import { app } from "../../firebaseinit";
import { get, getDatabase, onValue, ref, set, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, InputGroup, Row, Table } from "react-bootstrap";

const Favorite = () => {
  const db = getDatabase(app);
  const navi = useNavigate();
  const uid = sessionStorage.getItem("uid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locals, setLocals] = useState([]);

  const callAPI = () => {
    setLoading(true);
    onValue(ref(db, `favorite/${uid}`), (snapshot) => {
      let rows = [];
      snapshot.forEach((row) => {
        rows.push({ ...row.val() });
      });
      console.log(rows);
      setLocals(rows);
      setLoading(false);
    });
  };
  const onClickDelete = async (local) => {
    if (window.confirm(`${local.id}즐겨찾기에서 삭제하시겠습니까?`)) {
      setLoading(true);
      await remove(ref(db, `favorite/${uid}/${local.id}`));
      setLoading(false);
    }
  };
  useEffect(() => {
    callAPI();
  }, [page]);
  if (loading) return <h1 className="my-5">로딩중입니다......</h1>;
  const onClickFavorite = async (local) => {
    if (!uid) {
      sessionStorage.setItem("target", "/locals");
      navi("/login");
      return;
    }
    if (window.confirm("즐겨찾기에 추가하시겠습니까??")) {
      console.log(local);
      setLoading(true);
      get(ref(db, `favorite/${uid}/${local.id}`)).then(async (snapshot) => {
        if (snapshot.exists()) {
          alert("이미 즐겨찾기 등록되어있습니다.");
        } else {
          set(ref(db, `favorite/${uid}/${local.id}`), local);
          alert("즐겨찾기 등록 완료");
        }
      });
      setLoading(false);
    }
  };
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <td>ID</td>
            <td>장소명</td>
            <td>주소</td>
            <td>전화</td>
            <td>취소</td>
          </tr>
        </thead>
        <tbody>
          {locals.map((local) => (
            <tr key={local.id}>
              <td>{local.id}</td>
              <td>{local.place_name}</td>
              <td>{local.address_name}</td>
              <td>{local.phone}</td>
              <td>
                <Button onClick={() => onClickDelete(local)}>취소</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Favorite;
